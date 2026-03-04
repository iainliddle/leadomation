import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// We now construct price IDs dynamically using environment variables

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { plan, billingCycle, userId, userEmail } = req.body;

    if (!plan || !billingCycle || !userId || !userEmail) {
        return res.status(400).json({ error: 'Missing required fields: plan, billingCycle, userId, userEmail' });
    }

    let priceId = '';

    if (plan === 'starter') {
        priceId = (billingCycle === 'monthly' ? process.env.STRIPE_PRICE_STARTER_MONTHLY : process.env.STRIPE_PRICE_STARTER_ANNUAL) as string;
    } else if (plan === 'pro') {
        priceId = (billingCycle === 'monthly' ? process.env.STRIPE_PRICE_PRO_MONTHLY : process.env.STRIPE_PRICE_PRO_ANNUAL) as string;
    }

    if (!priceId) {
        return res.status(400).json({ error: 'Configuration error: Invalid plan or billing cycle, or missing environment variables.' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            subscription_data: {
                trial_period_days: 7,
                metadata: {
                    userId: userId,
                },
            },
            payment_method_collection: 'always',
            customer_email: userEmail,
            success_url: 'https://leadomation.co.uk?checkout=success',
            cancel_url: 'https://leadomation.co.uk/trial-setup',
            metadata: {
                userId: userId,
            },
            allow_promotion_codes: true,
        });

        return res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: error.message });
    }
}
