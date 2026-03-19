import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const event = req.body

    // Handle connection accepted event
    if (event.type === 'connection.accepted' || event.event === 'CONNECTION_ACCEPTED') {
      const accountId = event.account_id || event.accountId
      const attendeeProfile = event.attendee || event.profile || {}
      const attendeeLinkedinUrl = attendeeProfile.url || attendeeProfile.linkedin_url || ''

      if (!accountId) {
        return res.status(400).json({ error: 'No account_id in event' })
      }

      // Find the user who owns this Unipile account
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('unipile_account_id', accountId)
        .single()

      if (!profile) {
        return res.status(404).json({ error: 'No user found for account_id' })
      }

      // Find the matching linkedin_enrollment by lead linkedin URL
      const { data: enrollment } = await supabase
        .from('linkedin_enrollments')
        .select('id, lead_id')
        .eq('user_id', profile.id)
        .eq('linkedin_profile_url', attendeeLinkedinUrl)
        .eq('status', 'active')
        .single()

      if (enrollment) {
        // Mark connection as accepted
        await supabase
          .from('linkedin_enrollments')
          .update({
            connection_accepted: true,
            connection_accepted_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', enrollment.id)

        // Log the action
        await supabase
          .from('linkedin_action_log')
          .insert({
            enrollment_id: enrollment.id,
            user_id: profile.id,
            lead_id: enrollment.lead_id,
            phase: 2,
            day: 14,
            action_type: 'connection_accepted',
            action_payload: { linkedin_url: attendeeLinkedinUrl },
            status: 'completed',
            executed_at: new Date().toISOString()
          })

        // Find or create a deal for this lead and move to discovery_call_booked
        const { data: existingDeal } = await supabase
          .from('deals')
          .select('id, stage')
          .eq('user_id', profile.id)
          .eq('lead_id', enrollment.lead_id)
          .single()

        if (existingDeal) {
          // Move existing deal forward if it's still in early stages
          const earlyStages = ['new_reply', 'qualified']
          if (earlyStages.includes(existingDeal.stage)) {
            await supabase
              .from('deals')
              .update({
                stage: 'discovery_call_booked',
                stage_entered_at: new Date().toISOString()
              })
              .eq('id', existingDeal.id)
          }
        } else {
          // Get lead details to create a deal
          const { data: lead } = await supabase
            .from('leads')
            .select('company, first_name, last_name')
            .eq('id', enrollment.lead_id)
            .single()

          if (lead) {
            await supabase
              .from('deals')
              .insert({
                user_id: profile.id,
                lead_id: enrollment.lead_id,
                title: lead.company || `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
                value: 0,
                currency: '£',
                stage: 'discovery_call_booked',
                stage_entered_at: new Date().toISOString(),
                source: 'linkedin',
                probability: 40,
                notes: 'Deal created automatically after LinkedIn connection accepted'
              })
          }
        }
      }

      return res.status(200).json({ received: true })
    }

    // Handle message received event - log it
    if (event.type === 'message.received' || event.event === 'MESSAGE_RECEIVED') {
      console.log('LinkedIn message received:', JSON.stringify(event))
      return res.status(200).json({ received: true })
    }

    // Unknown event type - acknowledge receipt
    return res.status(200).json({ received: true })

  } catch (err) {
    console.error('LinkedIn webhook error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
