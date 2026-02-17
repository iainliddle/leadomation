import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2025-01-27' as any,
});

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

// Helper to get raw body from request
async function getRawBody(req: any): Promise<Buffer> {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        return res.status(400).send('Missing signature or webhook secret');
    }

    let event: Stripe.Event;

    try {
        const rawBody = await getRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const subscriptionId = session.subscription as string;
                const stripeCustomerId = session.customer as string;

                if (!userId) {
                    throw new Error('No userId found in session metadata');
                }

                // Retrieve subscription to get the price ID
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0].price.id;
                const plan = mapPriceIdToPlan(priceId);

                console.log(`Setting plan to ${plan} for user ${userId}`);

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan: plan,
                        stripe_customer_id: stripeCustomerId,
                        stripe_subscription_id: subscriptionId,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', userId);

                if (error) throw error;
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = subscription.customer as string;
                const status = subscription.status;
                const priceId = subscription.items.data[0].price.id;

                let plan = mapPriceIdToPlan(priceId);
                if (['canceled', 'unpaid', 'past_due'].includes(status)) {
                    plan = 'free';
                }

                console.log(`Updating plan to ${plan} (status: ${status}) for customer ${stripeCustomerId}`);

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan: plan,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_customer_id', stripeCustomerId);

                if (error) throw error;
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const stripeCustomerId = subscription.customer as string;

                console.log(`Subscription deleted for customer ${stripeCustomerId}, resetting to free plan`);

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        plan: 'free',
                        stripe_subscription_id: null,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('stripe_customer_id', stripeCustomerId);

                if (error) throw error;
                break;
            }
        }

        return res.status(200).json({ received: true });
    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: error.message });
    }
}

function mapPriceIdToPlan(priceId: string): string {
    const STARTER_PRICES = [
        'price_1T1nCe2LCoJYV9n6l20Wnd9Y', // Monthly
        'price_1T1nCe2LCoJYV9n6X6dU6Ybe'  // Annual
    ];
    const PRO_PRICES = [
        'price_1T1nFP2LCoJYV9n6iKcaO1ZY', // Monthly
        'price_1T1nFP2LCoJYV9n6CyKYDjKE'  // Annual
    ];

    if (STARTER_PRICES.includes(priceId)) return 'starter';
    if (PRO_PRICES.includes(priceId)) return 'pro';
    return 'free';
}
