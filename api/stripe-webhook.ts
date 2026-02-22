import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Disable Vercel's default body parsing — Stripe needs the raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Note: uses VITE_SUPABASE_URL (the actual env var name in this project)
// Uses SUPABASE_SERVICE_ROLE_KEY (not the anon key) to bypass RLS
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Stripe Price IDs → plan names
const PRICE_TO_PLAN: Record<string, 'starter' | 'pro'> = {
    [process.env.STRIPE_PRICE_STARTER_MONTHLY!]: 'starter',
    [process.env.STRIPE_PRICE_STARTER_ANNUAL!]: 'starter',
    [process.env.STRIPE_PRICE_PRO_MONTHLY!]: 'pro',
    [process.env.STRIPE_PRICE_PRO_ANNUAL!]: 'pro',
};

// Read raw body from request stream (required for Stripe signature verification)
async function getRawBody(req: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];

    let event: Stripe.Event;

    // Verify the webhook came from Stripe (not a spoofed request)
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Stripe signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    console.log('Stripe webhook received:', event.type);

    try {
        switch (event.type) {

            // ─────────────────────────────────────────────────────────────
            // New payment completed — activate the plan
            // ─────────────────────────────────────────────────────────────
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;

                // Only handle subscription checkouts (not one-time payments)
                if (session.mode !== 'subscription') break;

                const customerId = session.customer as string;
                const subscriptionId = session.subscription as string;

                // Get the price ID from the subscription
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price?.id;
                const plan = PRICE_TO_PLAN[priceId];

                if (!plan) {
                    console.error('Unrecognised price ID:', priceId);
                    break;
                }

                // Try to find the user by Stripe customer ID first
                let { data: profile } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('stripe_customer_id', customerId)
                    .single();

                // Fallback: find by email (handles first-time purchases before customer ID is stored)
                if (!profile) {
                    const email = session.customer_details?.email;
                    if (email) {
                        const result = await supabase
                            .from('profiles')
                            .select('id')
                            .eq('email', email)
                            .single();
                        profile = result.data;
                    }
                }

                if (!profile) {
                    console.error('No profile found for Stripe customer:', customerId);
                    break;
                }

                // Update the user's plan and store their Stripe customer ID for future lookups
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        plan: plan,
                        stripe_customer_id: customerId,
                    })
                    .eq('id', profile.id);

                if (error) {
                    console.error('Failed to activate plan:', error);
                } else {
                    console.log(`✅ Plan activated: user ${profile.id} → ${plan}`);
                }

                break;
            }

            // ─────────────────────────────────────────────────────────────
            // Subscription changed — handle upgrades and downgrades
            // ─────────────────────────────────────────────────────────────
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const priceId = subscription.items.data[0]?.price?.id;
                const plan = PRICE_TO_PLAN[priceId];

                if (!plan) {
                    console.error('Unrecognised price ID on update:', priceId);
                    break;
                }

                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: plan })
                    .eq('stripe_customer_id', customerId);

                if (error) {
                    console.error('Failed to update plan:', error);
                } else {
                    console.log(`✅ Plan updated → ${plan} for customer ${customerId}`);
                }

                break;
            }

            // ─────────────────────────────────────────────────────────────
            // Subscription cancelled — lock the account
            // ─────────────────────────────────────────────────────────────
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: 'cancelled' })
                    .eq('stripe_customer_id', customerId);

                if (error) {
                    console.error('Failed to cancel plan:', error);
                } else {
                    console.log(`✅ Plan cancelled for customer ${customerId}`);
                }

                break;
            }

            default:
                console.log('Unhandled Stripe event type:', event.type);
        }

        // Always return 200 to Stripe — prevents retry storms
        return res.status(200).json({ received: true });

    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
