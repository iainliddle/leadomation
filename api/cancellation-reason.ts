import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const config = {
    api: { bodyParser: true },
};

// Service client for database operations
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate cancellation token (use this when redirecting to cancellation page)
export function generateCancellationToken(userId: string): string {
    const secret = process.env.CANCELLATION_SECRET || process.env.INTERNAL_API_SECRET || 'fallback-secret';
    const timestamp = Date.now();
    const data = `${userId}:${timestamp}`;
    const signature = crypto.createHmac('sha256', secret).update(data).digest('hex');
    return Buffer.from(`${data}:${signature}`).toString('base64url');
}

// Verify cancellation token (expires after 1 hour)
function verifyCancellationToken(token: string, expectedUserId: string): boolean {
    try {
        const secret = process.env.CANCELLATION_SECRET || process.env.INTERNAL_API_SECRET || 'fallback-secret';
        const decoded = Buffer.from(token, 'base64url').toString();
        const [userId, timestampStr, signature] = decoded.split(':');

        // Verify user ID matches
        if (userId !== expectedUserId) return false;

        // Verify timestamp is within 1 hour
        const timestamp = parseInt(timestampStr, 10);
        if (Date.now() - timestamp > 60 * 60 * 1000) return false;

        // Verify signature
        const data = `${userId}:${timestampStr}`;
        const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
        return false;
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId, reason, token } = req.body;

    // Verify the signed token to authenticate the request
    if (!token || !verifyCancellationToken(token, userId)) {
        return res.status(401).json({ error: 'Invalid or expired cancellation token' });
    }

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
