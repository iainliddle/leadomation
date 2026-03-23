import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Auth client for user verification
const supabaseAuth = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

// Service client for database operations
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (!userLimit || now > userLimit.resetAt) {
        rateLimitMap.set(userId, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (userLimit.count >= maxRequests) {
        return false;
    }

    userLimit.count++;
    return true;
}

interface ClassificationResult {
    label: string;
    confidence: number;
    reason: string;
}

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

    // Rate limiting: 30 requests per minute per user
    if (!checkRateLimit(user.id, 30, 60000)) {
        return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
    }

    const { subject, body_text, inbound_email_id } = req.body;

    if (!body_text && !subject) {
        return res.status(400).json({ error: 'Missing required fields (subject or body_text)' });
    }

    try {
        const userContent = `Subject: ${subject || '(No subject)'}\n\nBody: ${body_text || '(No content)'}`;

        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 256,
            system: `You are an email reply classifier for B2B sales outreach. Classify the email reply into exactly one of these labels:
- Interested: The sender shows interest in learning more, scheduling a call, or continuing the conversation
- Not Interested: The sender explicitly declines or shows no interest
- Out of Office: Automatic out-of-office or vacation reply
- Unsubscribe: The sender wants to be removed from the mailing list or stop receiving emails
- Question: The sender has questions but hasn't indicated clear interest or disinterest
- Referral: The sender is referring to another person or department

Return ONLY a valid JSON object with no additional text: { "label": string, "confidence": number (0-1), "reason": string (one sentence) }`,
            messages: [
                {
                    role: 'user',
                    content: userContent
                }
            ]
        });

        // Extract text content from response
        const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

        // Parse JSON response
        let classification: ClassificationResult;
        try {
            classification = JSON.parse(responseText.trim());
        } catch {
            // Fallback if JSON parsing fails
            classification = {
                label: 'Question',
                confidence: 0.5,
                reason: 'Unable to classify automatically'
            };
        }

        // Validate the label
        const validLabels = ['Interested', 'Not Interested', 'Out of Office', 'Unsubscribe', 'Question', 'Referral'];
        if (!validLabels.includes(classification.label)) {
            classification.label = 'Question';
        }

        // Update the inbound_email record if ID provided
        // Security: Include user_id filter to prevent modifying other users' data
        if (inbound_email_id) {
            await supabase
                .from('inbound_emails')
                .update({
                    ai_label: classification.label,
                    ai_confidence: classification.confidence
                })
                .eq('id', inbound_email_id)
                .eq('user_id', user.id);

            // If Unsubscribe, update lead status and stop sequences
            if (classification.label === 'Unsubscribe') {
                const { data: email } = await supabase
                    .from('inbound_emails')
                    .select('lead_id')
                    .eq('id', inbound_email_id)
                    .eq('user_id', user.id)
                    .single();

                if (email?.lead_id) {
                    // Update lead status - filtered by user_id
                    await supabase
                        .from('leads')
                        .update({ status: 'unsubscribed' })
                        .eq('id', email.lead_id)
                        .eq('user_id', user.id);

                    // Stop all active sequence enrollments - filtered by user_id
                    await supabase
                        .from('sequence_enrollments')
                        .update({ status: 'completed' })
                        .eq('lead_id', email.lead_id)
                        .eq('user_id', user.id)
                        .eq('status', 'active');
                }
            }
        }

        return res.status(200).json({
            success: true,
            classification
        });
    } catch (error) {
        console.error('Classification error:', error);
        return res.status(500).json({ error: 'Failed to classify email' });
    }
}
