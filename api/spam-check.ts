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

    // Rate limiting: 20 requests per minute per user
    if (!checkRateLimit(user.id, 20, 60000)) {
        return res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
    }

    const { subject, body } = req.body;

    // Input validation
    if (!subject && !body) {
        return res.status(400).json({ error: 'Validation failed', details: 'Subject or body is required' });
    }

    if (subject && typeof subject !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: 'Subject must be a string' });
    }

    if (subject && subject.length > 200) {
        return res.status(400).json({ error: 'Validation failed', details: 'Subject must be 200 characters or less' });
    }

    if (body && typeof body !== 'string') {
        return res.status(400).json({ error: 'Validation failed', details: 'Body must be a string' });
    }

    if (body && body.length > 10000) {
        return res.status(400).json({ error: 'Validation failed', details: 'Body must be 10000 characters or less' });
    }

    try {
        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: `You are an email deliverability expert. Analyse the provided email subject line and body for spam risk. Return ONLY a JSON object with this exact structure: { "score": number (0-100, where 100 is perfect deliverability), "issues": string[] (list of specific problems found), "suggestions": string[] (list of specific fixes), "flagged_words": string[] (exact words or phrases that are problematic) }. Common issues to check: spam trigger words (free, guarantee, urgent, act now, limited time etc), excessive capitals, exclamation marks, misleading subject lines, broken personalisation variables shown as raw {{ }} tags, overly salesy language, missing unsubscribe mention.`,
            messages: [
                {
                    role: 'user',
                    content: `Subject: ${subject || '(no subject)'}\n\nBody:\n${body || '(no body)'}`
                }
            ]
        });

        const textContent = message.content.find(c => c.type === 'text');
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude');
        }

        // Parse the JSON response
        const responseText = textContent.text.trim();
        // Extract JSON from potential markdown code blocks
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid response format from Claude');
        }

        const result = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            success: true,
            score: result.score,
            issues: result.issues || [],
            suggestions: result.suggestions || [],
            flagged_words: result.flagged_words || []
        });
    } catch (error: any) {
        console.error('Spam check error:', error);
        return res.status(500).json({
            error: 'Failed to analyze email',
            details: error.message
        });
    }
}
