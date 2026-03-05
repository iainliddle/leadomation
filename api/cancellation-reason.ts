import { createClient } from '@supabase/supabase-js';

export const config = {
    api: { bodyParser: true },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, reason } = req.body;

    if (!userId || !reason) {
        return res.status(400).json({ error: 'userId and reason are required' });
    }

    const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );

    try {
        const { error } = await supabase
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
