import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Service client for database operations
const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Rate limiting: max 100 requests per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

function checkRateLimit(key: string): boolean {
    const now = Date.now();
    const limit = rateLimitMap.get(key);

    if (!limit || now > limit.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    limit.count++;
    return true;
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

// Input validation
interface ResendInboundPayload {
    from: string;
    to: string;
    subject?: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>;
}

function validatePayload(body: any): { valid: boolean; error?: string; payload?: ResendInboundPayload } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Invalid request body' };
    }

    const { from, to, subject, text, html, headers } = body;

    // Required fields
    if (!from || typeof from !== 'string') {
        return { valid: false, error: 'Missing or invalid "from" field' };
    }

    if (!to || typeof to !== 'string') {
        return { valid: false, error: 'Missing or invalid "to" field' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Extract email from "Name <email>" format if needed
    const fromEmail = from.includes('<') ? from.match(/<([^>]+)>/)?.[1] : from;
    if (!fromEmail || !emailRegex.test(fromEmail)) {
        return { valid: false, error: 'Invalid "from" email format' };
    }

    const toEmail = to.includes('<') ? to.match(/<([^>]+)>/)?.[1] : to;
    if (!toEmail || !emailRegex.test(toEmail)) {
        return { valid: false, error: 'Invalid "to" email format' };
    }

    // Optional field validation
    if (subject !== undefined && typeof subject !== 'string') {
        return { valid: false, error: 'Invalid "subject" field type' };
    }

    if (text !== undefined && typeof text !== 'string') {
        return { valid: false, error: 'Invalid "text" field type' };
    }

    if (html !== undefined && typeof html !== 'string') {
        return { valid: false, error: 'Invalid "html" field type' };
    }

    if (headers !== undefined && (typeof headers !== 'object' || headers === null)) {
        return { valid: false, error: 'Invalid "headers" field type' };
    }

    // Length limits
    if (subject && subject.length > 1000) {
        return { valid: false, error: 'Subject exceeds maximum length of 1000 characters' };
    }

    if (text && text.length > 100000) {
        return { valid: false, error: 'Text body exceeds maximum length of 100000 characters' };
    }

    if (html && html.length > 500000) {
        return { valid: false, error: 'HTML body exceeds maximum length of 500000 characters' };
    }

    return {
        valid: true,
        payload: {
            from: fromEmail,
            to: toEmail,
            subject: subject?.substring(0, 1000),
            text: text?.substring(0, 100000),
            html: html?.substring(0, 500000),
            headers
        }
    };
}

interface ClassificationResult {
    label: string;
    confidence: number;
}

async function classifyEmail(subject: string | undefined, text: string | undefined): Promise<ClassificationResult> {
    try {
        const userContent = `Subject: ${subject || '(No subject)'}\n\nBody: ${text || '(No content)'}`;

        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 128,
            system: `Classify this email reply into exactly one label: Interested, Not Interested, Out of Office, Unsubscribe, Question, Referral. Return ONLY JSON: { "label": string, "confidence": number (0-1) }`,
            messages: [
                {
                    role: 'user',
                    content: userContent
                }
            ]
        });

        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

        const classification = JSON.parse(responseText.trim());

        // Validate the label
        const validLabels = ['Interested', 'Not Interested', 'Out of Office', 'Unsubscribe', 'Question', 'Referral'];
        if (!validLabels.includes(classification.label)) {
            return { label: 'Question', confidence: 0.5 };
        }

        return {
            label: classification.label,
            confidence: Math.min(1, Math.max(0, Number(classification.confidence) || 0.5))
        };
    } catch (error) {
        console.error('Classification error:', error);
        return { label: 'Question', confidence: 0.5 };
    }
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Rate limiting by IP
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ error: 'Too many requests. Maximum 100 requests per minute.' });
    }

    // Verify webhook signature if secret is configured
    const webhookSecret = process.env.RESEND_INBOUND_WEBHOOK_SECRET || process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret) {
        const signature = req.headers['resend-signature'] || req.headers['svix-signature'];
        const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

        if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
            console.error('Invalid webhook signature for inbound email');
            return res.status(401).json({ error: 'Invalid signature' });
        }
    }

    // Validate input
    const validation = validatePayload(req.body);
    if (!validation.valid || !validation.payload) {
        return res.status(400).json({ error: 'Validation failed', details: validation.error });
    }

    const { from, to, subject, text, html } = validation.payload;

    try {
        // Match sender to a lead by email address
        const { data: lead, error: leadError } = await supabase
            .from('leads')
            .select('id, user_id, status')
            .eq('email', from)
            .single();

        if (leadError && leadError.code !== 'PGRST116') {
            // PGRST116 = no rows returned, which is OK (lead not found)
            console.error('Error finding lead:', leadError);
        }

        // If no lead found, we still process the email but won't be able to link it
        // We need a user_id to store the email - try to find from the "to" address
        let userId: string | null = lead?.user_id || null;

        if (!userId) {
            // Try to find user by their configured sender email
            const toEmail = to.includes('<') ? to.match(/<([^>]+)>/)?.[1] : to;
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email_from_address', toEmail)
                .single();

            userId = profile?.id || null;
        }

        if (!userId) {
            // Cannot process without a user_id - return success but don't store
            console.log('Inbound email received but no matching user found:', { from, to });
            return res.status(200).json({ status: 'received', note: 'No matching user found' });
        }

        // Classify the email using Claude
        const classification = await classifyEmail(subject, text);

        // Insert into inbound_emails table
        const { data: insertedEmail, error: insertError } = await supabase
            .from('inbound_emails')
            .insert({
                user_id: userId,
                from_email: from,
                lead_id: lead?.id || null,
                subject: subject || null,
                body_text: text || null,
                body_html: html || null,
                ai_label: classification.label,
                ai_confidence: classification.confidence,
                is_read: false,
                replied: false,
                received_at: new Date().toISOString()
            })
            .select('id')
            .single();

        if (insertError) {
            console.error('Error inserting inbound email:', insertError);
            return res.status(500).json({ error: 'Failed to store email' });
        }

        // Handle Unsubscribe: update lead status and stop sequences
        if (classification.label === 'Unsubscribe' && lead?.id) {
            // Update lead status to unsubscribed
            const { error: leadUpdateError } = await supabase
                .from('leads')
                .update({ status: 'unsubscribed' })
                .eq('id', lead.id);

            if (leadUpdateError) {
                console.error('Error updating lead status:', leadUpdateError);
            }

            // Stop all active sequence enrollments for this lead
            const { error: enrollmentUpdateError } = await supabase
                .from('sequence_enrollments')
                .update({ status: 'completed' })
                .eq('lead_id', lead.id)
                .eq('status', 'active');

            if (enrollmentUpdateError) {
                console.error('Error updating sequence enrollments:', enrollmentUpdateError);
            }

            console.log(`Lead ${lead.id} unsubscribed and sequences stopped`);
        }

        return res.status(200).json({
            status: 'received',
            email_id: insertedEmail?.id,
            lead_matched: !!lead,
            classification: classification.label
        });

    } catch (error) {
        console.error('Inbound webhook processing error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
