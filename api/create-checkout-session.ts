import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { plan, billingCycle } = req.body;

    // Input validation
    if (!plan || !billingCycle) {
        return res.status(400).json({ error: 'Missing required fields: plan, billingCycle' });
    }

    const validPlans = ['starter', 'pro'];
    const validCycles = ['monthly', 'annual'];

    if (!validPlans.includes(plan)) {
        return res.status(400).json({ error: 'Invalid plan. Must be starter or pro' });
    }

    if (!validCycles.includes(billingCycle)) {
        return res.status(400).json({ error: 'Invalid billing cycle. Must be monthly or annual' });
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
        // Use authenticated user's ID and email
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
                    userId: user.id,
                    plan: plan,
                },
            },
            payment_method_collection: 'always',
            customer_email: user.email,
            success_url: 'https://www.leadomation.co.uk?checkout=success',
            cancel_url: 'https://www.leadomation.co.uk/trial-setup',
            metadata: {
                userId: user.id,
                plan: plan,
            },
            allow_promotion_codes: true,
        });

        return res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: error.message });
    }
}
