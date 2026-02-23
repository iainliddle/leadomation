import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') return res.status(405).end();

    // Get all active enrollments where next_step_at is due
    const { data: dueEnrollments } = await supabase
        .from('sequence_enrollments')
        .select(`
      *,
      sequences(*),
      leads(*)
    `)
        .eq('status', 'active')
        .lte('next_step_at', new Date().toISOString())
        .limit(50);

    if (!dueEnrollments || dueEnrollments.length === 0) {
        return res.status(200).json({ processed: 0 });
    }

    let processed = 0;

    for (const enrollment of dueEnrollments) {
        const sequence = enrollment.sequences;
        const lead = enrollment.leads;
        const steps = sequence.steps;
        const currentStepIndex = enrollment.current_step;

        // Check if sequence is complete
        if (currentStepIndex >= steps.length) {
            await supabase
                .from('sequence_enrollments')
                .update({ status: 'completed' })
                .eq('id', enrollment.id);
            continue;
        }

        const step = steps[currentStepIndex];

        // Replace merge tags
        const subject = (step.subject || '')
            .replace(/\{\{business_name\}\}/g, lead.company || '')
            .replace(/\{\{first_name\}\}/g, lead.first_name || '')
            .replace(/\{\{city\}\}/g, lead.location || '')
            .replace(/\{\{website\}\}/g, lead.website || '');

        const body = (step.body || '')
            .replace(/\{\{business_name\}\}/g, lead.company || '')
            .replace(/\{\{first_name\}\}/g, lead.first_name || '')
            .replace(/\{\{city\}\}/g, lead.location || '')
            .replace(/\{\{website\}\}/g, lead.website || '');

        try {
            if (step.channel === 'email' && lead.email) {
                // Get user's email config
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('email_from_name, email_from_address, email_reply_to, email_signature')
                    .eq('id', enrollment.user_id)
                    .single();

                const fromName = profile?.email_from_name || 'Leadomation';
                const fromEmail = profile?.email_from_address || 'iainliddle@leadomation.co.uk';
                const signature = profile?.email_signature || '';

                await resend.emails.send({
                    from: `${fromName} <${fromEmail}>`,
                    to: lead.email,
                    replyTo: profile?.email_reply_to || fromEmail,
                    subject,
                    html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;">${body.replace(/\n/g, '<br>')}${signature ? `<br><br>${signature}` : ''}</div>`
                });

                // Log the step
                await supabase.from('sequence_step_logs').insert({
                    enrollment_id: enrollment.id,
                    sequence_id: sequence.id,
                    lead_id: lead.id,
                    user_id: enrollment.user_id,
                    step_index: currentStepIndex,
                    channel: 'email',
                    subject,
                    body,
                    status: 'sent',
                    sent_at: new Date().toISOString()
                });
            }

            // Calculate next step timing
            const nextStepIndex = currentStepIndex + 1;
            let nextStepAt: string | null = null;

            if (nextStepIndex < steps.length) {
                const nextStep = steps[nextStepIndex];
                const waitDays = nextStep.waitDays || 1;
                const next = new Date();
                next.setDate(next.getDate() + waitDays);
                nextStepAt = next.toISOString();
            }

            // Update enrollment
            await supabase
                .from('sequence_enrollments')
                .update({
                    current_step: nextStepIndex,
                    next_step_at: nextStepAt,
                    status: nextStepIndex >= steps.length ? 'completed' : 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', enrollment.id);

            processed++;

        } catch (error) {
            console.error('Step execution error:', error);
            await supabase.from('sequence_step_logs').insert({
                enrollment_id: enrollment.id,
                sequence_id: sequence.id,
                lead_id: lead.id,
                user_id: enrollment.user_id,
                step_index: currentStepIndex,
                channel: step.channel,
                subject,
                body,
                status: 'failed'
            });
        }
    }

    return res.status(200).json({ processed });
}
