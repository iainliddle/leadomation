import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);

// Auth client for user verification
const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service client for database operations
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    const { to, subject, body, from_email, from_name, inbound_email_id } = req.body;

    // Input validation
    if (!body || typeof body !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: 'Reply body is required and must be a string' });
    }

    if (body.trim().length < 1) {
        return res.status(400).json({ error: 'Validation failed', details: 'Reply body cannot be empty' });
    }

    if (body.length > 5000) {
        return res.status(400).json({ error: 'Validation failed', details: 'Reply body must be 5000 characters or less' });
    }

    if (inbound_email_id && !UUID_REGEX.test(inbound_email_id)) {
        return res.status(400).json({ error: 'Validation failed', details: 'Invalid inbound email ID format' });
    }

    if (!to || !subject || !from_email) {
        return res.status(400).json({ error: 'Missing required fields (to, subject, from_email)' });
    }

    try {
        // Build a simple HTML email
        const htmlBody = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="white-space: pre-wrap; line-height: 1.6; color: #374151;">
                    ${body.replace(/\n/g, '<br>')}
                </div>
                <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px;">
                    Sent via Leadomation
                </div>
            </div>
        `;

        // Send email via Resend
        const data = await resend.emails.send({
            from: `${from_name || 'Leadomation'} <${from_email}>`,
            to,
            replyTo: from_email,
            subject,
            html: htmlBody,
        });

        // Update the inbound_email record to mark as replied
        if (inbound_email_id) {
            await supabase
                .from('inbound_emails')
                .update({
                    replied: true,
                    reply_body: body
                })
                .eq('id', inbound_email_id);
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Reply send error:', error);
        return res.status(500).json({ error: 'Failed to send reply' });
    }
}
