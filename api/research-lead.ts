import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authenticate user via Bearer token
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const { lead_id } = req.body;
    if (!lead_id) {
        return res.status(400).json({ error: 'lead_id required' });
    }

    // Check plan limits
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan, daily_research_used, research_reset_date')
        .eq('id', user.id)
        .single();

    const today = new Date().toISOString().split('T')[0];
    const resetDate = profile?.research_reset_date;

    // Reset daily counter if new day
    if (resetDate !== today) {
        await supabase
            .from('profiles')
            .update({ daily_research_used: 0, research_reset_date: today })
            .eq('id', user.id);
        if (profile) profile.daily_research_used = 0;
    }

    const plan = profile?.plan || 'starter';
    const dailyLimit = plan === 'pro' || plan === 'trial' || plan === 'trialing' ? 50 : 10;
    const used = profile?.daily_research_used || 0;

    if (used >= dailyLimit) {
        return res.status(429).json({
            error: 'Daily research limit reached',
            limit: dailyLimit,
            used
        });
    }

    // Check cache - don't re-research same lead
    const { data: lead } = await supabase
        .from('leads')
        .select('lead_intelligence, intelligence_generated_at, company, first_name, last_name, email, phone, website, location, category, rating, reviews_count, intent_score, industry, job_title')
        .eq('id', lead_id)
        .eq('user_id', user.id)
        .single();

    if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    if (lead.lead_intelligence && lead.intelligence_generated_at) {
        return res.status(200).json({
            intelligence: lead.lead_intelligence,
            cached: true
        });
    }

    // Call N8N webhook
    try {
        const n8nResponse = await fetch(process.env.N8N_LEAD_INTELLIGENCE_WEBHOOK!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lead_id,
                user_id: user.id,
                lead_data: lead,
            }),
        });

        if (!n8nResponse.ok) {
            return res.status(500).json({ error: 'Research failed' });
        }

        const result = await n8nResponse.json();

        // Increment daily counter
        await supabase
            .from('profiles')
            .update({ daily_research_used: used + 1 })
            .eq('id', user.id);

        return res.status(200).json({
            intelligence: result.intelligence,
            cached: false
        });
    } catch (err) {
        console.error('N8N webhook error:', err);
        return res.status(500).json({ error: 'Research failed' });
    }
}
