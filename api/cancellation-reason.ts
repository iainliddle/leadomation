import { createClient } from '@supabase/supabase-js';

export const config = {
    api: { bodyParser: true },
};

// Auth client for user verification
const supabaseAuth = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

// Service client for database operations
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { reason } = req.body;

    // Input validation
    if (!reason || typeof reason !== 'string') {
        return res.status(400).json({ error: 'reason is required and must be a string' });
    }

    if (reason.length > 1000) {
        return res.status(400).json({ error: 'reason must be 1000 characters or less' });
    }

    try {
        // Use authenticated user's ID, not from body
        const { error } = await supabaseAdmin
            .from('cancellation_reasons')
            .insert({
                user_id: user.id,
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
