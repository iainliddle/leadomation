import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Service client for database operations
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Resend webhook event types
type ResendEventType =
    | 'email.sent'
    | 'email.delivered'
    | 'email.delivery_delayed'
    | 'email.complained'
    | 'email.bounced'
    | 'email.opened'
    | 'email.clicked';

interface ResendWebhookEvent {
    type: ResendEventType;
    created_at: string;
    data: {
        email_id: string;
        from: string;
        to: string[];
        subject: string;
        created_at: string;
        click?: {
            link: string;
            timestamp: string;
        };
    };
}

// Verify Resend webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!signature || !secret) return false;

    try {
        const parts = signature.split(',');
        const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
        const sig = parts.find(p => p.startsWith('v1='))?.slice(3);

        if (!timestamp || !sig) return false;

        const signedPayload = `${timestamp}.${payload}`;
        const expectedSig = crypto
            .createHmac('sha256', secret)
            .update(signedPayload)
            .digest('hex');

        return sig === expectedSig;
    } catch {
        return false;
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
        const signature = req.headers['resend-signature'] || req.headers['svix-signature'];
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }

    try {
        const event: ResendWebhookEvent = req.body;

        if (!event.type || !event.data?.email_id) {
            return res.status(400).json({ error: 'Invalid webhook payload' });
        }

        const resendEmailId = event.data.email_id;
        const eventType = event.type;

        // Idempotency check: Check if this exact event already exists
        const { data: existing } = await supabase
            .from('email_events')
            .select('id')
            .eq('resend_email_id', resendEmailId)
            .eq('event_type', eventType)
            .single();

        if (existing) {
            // Duplicate event, ignore it
            return res.status(200).json({ status: 'duplicate, ignored' });
        }

        // Find the associated sequence_enrollment or lead based on the email
        // We'll try to find the enrollment that sent this email
        const { data: enrollment } = await supabase
            .from('sequence_enrollments')
            .select('id, user_id, lead_id, sequence_id')
            .eq('last_resend_email_id', resendEmailId)
            .single();

        // Insert the event
        const insertData: any = {
            resend_email_id: resendEmailId,
            event_type: eventType,
            subject: event.data.subject,
            from_email: event.data.from,
            to_email: event.data.to?.[0] || '',
            occurred_at: event.created_at || new Date().toISOString(),
            raw_payload: event
        };

        // Add relationship data if we found the enrollment
        if (enrollment) {
            insertData.user_id = enrollment.user_id;
            insertData.lead_id = enrollment.lead_id;
            insertData.sequence_id = enrollment.sequence_id;
            insertData.enrollment_id = enrollment.id;
        }

        const { error: insertError } = await supabase
            .from('email_events')
            .insert(insertData);

        if (insertError) {
            console.error('Error inserting email event:', insertError);
            return res.status(500).json({ error: 'Failed to insert event' });
        }

        // Handle specific event types
        if (eventType === 'email.bounced' && enrollment?.lead_id) {
            // Mark lead as bounced
            await supabase
                .from('leads')
                .update({ status: 'bounced', email_valid: false })
                .eq('id', enrollment.lead_id);

            // Stop the sequence for this lead
            await supabase
                .from('sequence_enrollments')
                .update({ status: 'bounced' })
                .eq('id', enrollment.id);
        }

        if (eventType === 'email.complained' && enrollment?.lead_id) {
            // Mark lead as unsubscribed (spam complaint)
            await supabase
                .from('leads')
                .update({ status: 'unsubscribed' })
                .eq('id', enrollment.lead_id);

            // Stop all sequences for this lead
            await supabase
                .from('sequence_enrollments')
                .update({ status: 'completed' })
                .eq('lead_id', enrollment.lead_id)
                .eq('status', 'active');
        }

        // Update campaign stats for sent/delivered/opened
        if (enrollment && ['email.sent', 'email.delivered', 'email.opened', 'email.clicked'].includes(eventType)) {
            // Get the campaign ID from sequence
            const { data: sequence } = await supabase
                .from('sequences')
                .select('campaign_id')
                .eq('id', enrollment.sequence_id)
                .single();

            if (sequence?.campaign_id) {
                // Update campaign stats (this could also be done via triggers in Supabase)
                if (eventType === 'email.sent') {
                    await supabase.rpc('increment_campaign_emails_sent', {
                        campaign_id_param: sequence.campaign_id
                    });
                }
            }
        }

        return res.status(200).json({ status: 'processed', event_type: eventType });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
