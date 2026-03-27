import { createClient } from '@supabase/supabase-js';

export const config = {
    api: { bodyParser: true },
};

// Service client for database operations
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Simple API secret authentication (users may not have active session after cancellation)
    const apiSecret = req.headers['x-api-secret'];
    if (apiSecret !== process.env.CANCELLATION_SECRET) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { userId, reason } = req.body;

    // Input validation
    if (!reason || typeof reason !== 'string') {
        return res.status(400).json({ error: 'reason is required and must be a string' });
    }

    if (reason.length > 1000) {
        return res.status(400).json({ error: 'reason must be 1000 characters or less' });
    }

    try {
        const { error } = await supabaseAdmin
            .from('cancellation_reasons')
            .insert({
                user_id: userId,
                reason: reason,
            });

        if (error) {
            console.error('Error saving cancellation reason:', error);
            return res.status(500).json({ error: 'Failed to save reason' });
        }

        return res.status(200).json({ success: true });
    } catch (err: any) {
        console.error('Cancellation reason error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
