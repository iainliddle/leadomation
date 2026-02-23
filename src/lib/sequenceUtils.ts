import { supabase } from './supabase';

/**
 * Stops all active sequence enrollments for a given lead.
 * This should be called when a lead replies to an outreach email.
 */
export const stopSequenceOnReply = async (leadId: string) => {
    if (!leadId) return;

    const { error } = await supabase
        .from('sequence_enrollments')
        .update({
            status: 'replied',
            updated_at: new Date().toISOString()
        })
        .eq('lead_id', leadId)
        .eq('status', 'active');

    if (error) {
        console.error('Error stopping sequence on reply:', error);
    } else {
        console.log(`Stopped active sequences for lead ${leadId} due to reply.`);
    }
};

/**
 * Enrols all leads from a campaign into its assigned sequence.
 * Should be called when a campaign finishes scraping.
 */
export const enrolLeadsIntoSequence = async (campaignId: string, userId: string) => {
    // Get the sequence assigned to this campaign
    const { data: campaign } = await supabase
        .from('campaigns')
        .select('sequence_id')
        .eq('id', campaignId)
        .single();

    if (!campaign || !campaign.sequence_id) return;

    // Get all leads from this campaign
    const { data: leads } = await supabase
        .from('leads')
        .select('id')
        .eq('campaign_id', campaignId);

    if (!leads || leads.length === 0) return;

    // Enrol each lead
    const enrollments = leads.map(lead => ({
        sequence_id: campaign.sequence_id,
        lead_id: lead.id,
        user_id: userId,
        current_step: 0,
        status: 'active',
        next_step_at: new Date().toISOString() // start immediately
    }));

    const { error } = await supabase.from('sequence_enrollments').insert(enrollments);
    if (error) console.error('Error enrolling leads:', error);
};
