import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
    BASE_LAYOUT,
    NUDGE_EMAIL_BODY,
    URGENCY_EMAIL_BODY,
    TRIAL_ENDING_EMAIL_BODY,
    WIN_BACK_EMAIL_BODY
} from '../../src/lib/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
    // Optional: Verify a cron secret to prevent unauthorized triggers
    // if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const now = new Date();

        // 1. Fetch all profiles
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('id, email, first_name, last_name, plan, created_at, trial_end, updated_at');

        if (error) throw error;

        const results = [];

        for (const profile of profiles) {
            const signupDate = new Date(profile.created_at);
            const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

            const firstName = profile.first_name || 'there';
            let subject = '';
            let body = '';

            // nurture sequence (Trial)
            if (profile.plan === 'trial') {
                if (daysSinceSignup === 2) {
                    subject = 'Have you launched your first campaign yet? 👀';
                    body = NUDGE_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                } else if (daysSinceSignup === 5) {
                    subject = '⏰ 2 days left on your Leadomation trial';
                    body = URGENCY_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                } else if (daysSinceSignup === 7) {
                    subject = 'Your Leadomation trial ends today';
                    body = TRIAL_ENDING_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                }
            }

            // Re-engagement (Expired or Cancelled)
            // Note: Re-engagement logic might depend on when the trial ended.
            if (profile.plan === 'expired' || profile.plan === 'cancelled') {
                const trialEndDate = profile.trial_end ? new Date(profile.trial_end) : signupDate;
                const daysSinceTrialEnd = Math.floor((now.getTime() - trialEndDate.getTime()) / (1000 * 60 * 60 * 24));

                if ([10, 21, 30].includes(daysSinceTrialEnd)) {
                    subject = 'A lot has changed at Leadomation...';
                    body = WIN_BACK_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                }
            }

            // Win-back (Cancelled specifically)
            if (profile.plan === 'cancelled') {
                const cancellationDate = new Date(profile.updated_at);
                const daysSinceCancellation = Math.floor((now.getTime() - cancellationDate.getTime()) / (1000 * 60 * 60 * 24));

                if (daysSinceCancellation === 14) {
                    subject = 'A lot has changed at Leadomation...';
                    body = WIN_BACK_EMAIL_BODY.replace(/{{first_name}}/g, firstName);
                }
            }

            if (subject && body) {
                const html = BASE_LAYOUT(subject, body);
                const sendResult = await resend.emails.send({
                    from: 'Iain from Leadomation <iainliddle@leadomation.co.uk>',
                    to: profile.email,
                    replyTo: 'iainliddle@leadomation.co.uk',
                    subject: subject,
                    html: html,
                });
                results.push({ email: profile.email, subject, status: 'sent', id: sendResult.data?.id });
            }
        }

        return res.status(200).json({ success: true, processed: profiles.length, sent: results });
    } catch (error: any) {
        console.error('Cron error:', error);
        return res.status(500).json({ error: error.message });
    }
}
