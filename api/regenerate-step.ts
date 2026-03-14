import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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

    // Rate limiting: 10 requests per minute per user
    if (!checkRateLimit(user.id, 10, 60000)) {
        return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
    }

    const {
        business_name,
        industry,
        value_proposition,
        target_audience,
        tone,
        campaign_keyword,
        campaign_location,
        step_number,
        total_steps,
        previous_steps
    } = req.body;

    // Input validation
    if (!step_number || typeof step_number !== 'number' || !Number.isInteger(step_number) || step_number < 1 || step_number > 7) {
        return res.status(400).json({ error: 'Validation failed', details: 'Step number is required and must be an integer between 1 and 7' });
    }

    if (!business_name || typeof business_name !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: 'Business name is required and must be a string' });
    }

    if (business_name.length > 100) {
        return res.status(400).json({ error: 'Validation failed', details: 'Business name must be 100 characters or less' });
    }

    if (!value_proposition || typeof value_proposition !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: 'Value proposition is required' });
    }

    try {
        const previousContext = previous_steps && previous_steps.length > 0
            ? `\n\nPrevious steps in sequence:\n${previous_steps.map((s: any) => `Step ${s.step}: Subject "${s.subject}"`).join('\n')}`
            : '';

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            system: `You are an expert B2B cold email copywriter specialising in local business outreach. Generate a single email step for a multi-step sequence. Return ONLY a JSON object with this exact structure: { "step": number, "subject": string, "body": string, "delay_days": number, "channel": "email" }. The body should use these personalisation variables where appropriate: {{business_name}}, {{first_name}}, {{city}}, {{rating}}, {{website}}. Write in a human, conversational tone. Never use em-dashes or hyphens as separators. Never use salesy language. Each email should feel like it was written by a real person.`,
            messages: [
                {
                    role: 'user',
                    content: `Business context:
Name: ${business_name}
Industry: ${industry || 'Not specified'}
What we do: ${value_proposition}
Target audience: ${target_audience || 'Local businesses'}
Tone: ${tone || 'professional'}

Campaign targeting: ${campaign_keyword || 'local'} businesses in ${campaign_location || 'various locations'}
${previousContext}

Generate step ${step_number} of ${total_steps || step_number} for this email sequence. ${step_number === 1 ? 'This is the first email so delay_days should be 0.' : `This is a follow-up email. Set an appropriate delay_days (typically 2-4 days).`}`
                }
            ]
        });

        const textContent = message.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude');
        }

        // Parse the JSON response
        const responseText = textContent.text.trim();
        // Extract JSON object from potential markdown code blocks
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from Claude');
        }

        const step = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            success: true,
            step: step
        });
    } catch (error: any) {
        console.error('Regenerate step error:', error);
        return res.status(500).json({
            error: 'Failed to regenerate step',
            details: error.message
        });
    }
}
