import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const VALID_PRICE_IDS = [
    'price_1T1nCe2LCoJYV9n6l20Wnd9Y', // Starter Monthly
    'price_1T1nCe2LCoJYV9n6X6dU6Ybe', // Starter Annual
    'price_1T1nFP2LCoJYV9n6iKcaO1ZY', // Pro Monthly
    'price_1T1nFP2LCoJYV9n6CyKYDjKE', // Pro Annual
];

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceId, userId, userEmail } = req.body;

    if (!priceId || !userId || !userEmail) {
        return res.status(400).json({ error: 'Missing required fields: priceId, userId, userEmail' });
    }

    if (!VALID_PRICE_IDS.includes(priceId)) {
        return res.status(400).json({ error: 'Invalid priceId' });
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
            customer_email: userEmail,
            success_url: 'https://leadomation.co.uk/dashboard?checkout=success',
            cancel_url: 'https://leadomation.co.uk/pricing?checkout=cancelled',
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
