import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for inserts
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { lead_id, linkedin_url } = req.body;

    // Validate required fields
    if (!lead_id) {
        return res.status(400).json({ error: 'lead_id is required' });
    }

    if (!linkedin_url || typeof linkedin_url !== 'string' || !linkedin_url.trim()) {
        return res.status(400).json({ error: 'linkedin_url is required' });
    }

    // Validate LinkedIn URL format
    const linkedinUrlPattern = /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?/i;
    if (!linkedinUrlPattern.test(linkedin_url)) {
        return res.status(400).json({ error: 'Invalid LinkedIn URL format' });
    }

    try {
        // Get user's profile to check plan and Unipile account
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('plan, unipile_account_id')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Check if user is on Pro plan
        if (profile.plan !== 'pro') {
            return res.status(403).json({
                error: 'Pro plan required',
                message: 'LinkedIn Sequencer is only available on the Pro plan'
            });
        }

        // Check if user has connected LinkedIn
        if (!profile.unipile_account_id) {
            return res.status(400).json({
                error: 'LinkedIn not connected',
                message: 'Please connect your LinkedIn account first'
            });
        }

        // Check if lead is already enrolled
        const { data: existingEnrollment, error: enrollmentCheckError } = await supabaseAdmin
            .from('linkedin_enrollments')
            .select('id, status')
            .eq('lead_id', lead_id)
            .eq('user_id', user.id)
            .in('status', ['active', 'paused'])
            .single();

        if (existingEnrollment) {
            return res.status(400).json({
                error: 'Lead already enrolled',
                message: 'This lead is already enrolled in a LinkedIn sequence'
            });
        }

        // Create the enrollment
        const { data: enrollment, error: insertError } = await supabaseAdmin
            .from('linkedin_enrollments')
            .insert({
                user_id: user.id,
                lead_id: lead_id,
                unipile_account_id: profile.unipile_account_id,
                linkedin_url: linkedin_url.trim(),
                current_phase: 1,
                current_day: 1,
                status: 'active',
                next_action_at: new Date().toISOString(),
                enrolled_at: new Date().toISOString()
            })
            .select()
            .single();

        if (insertError) {
            console.error('Error creating enrollment:', insertError);
            return res.status(500).json({
                error: 'Failed to create enrollment',
                details: insertError.message
            });
        }

        return res.status(200).json({
            success: true,
            enrollment: enrollment
        });
    } catch (error: any) {
        console.error('LinkedIn enroll error:', error);
        return res.status(500).json({
            error: 'Failed to enroll lead',
            details: error.message
        });
    }
}
