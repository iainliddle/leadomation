import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import crypto from 'crypto'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Verify Unipile webhook signature
function verifyUnipileSignature(req: VercelRequest): boolean {
  const secret = process.env.UNIPILE_WEBHOOK_SECRET
  if (!secret) {
    // If no secret configured, log warning but allow (for backwards compatibility during setup)
    console.warn('UNIPILE_WEBHOOK_SECRET not configured - webhook signature verification skipped')
    return true
  }

  const signature = req.headers['x-unipile-signature'] || req.headers['x-webhook-signature']
  if (!signature) {
    console.error('No webhook signature header found')
    return false
  }

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex')
    return crypto.timingSafeEqual(
      Buffer.from(String(signature)),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

interface ClassificationResult {
  label: 'Interested' | 'Not Interested' | 'OOO'
  confidence: number
}

async function classifyLinkedInMessage(messageText: string): Promise<ClassificationResult> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 128,
      system: `Classify this LinkedIn message reply into exactly one label: Interested, Not Interested, OOO (Out of Office).
- "Interested" = positive response, wants to learn more, asks questions, agrees to call/meeting
- "Not Interested" = declines, says no, not relevant, asks to stop messaging
- "OOO" = away message, vacation, will reply later, automated response
Return ONLY JSON: { "label": string, "confidence": number (0-1) }`,
      messages: [{ role: 'user', content: messageText }]
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const classification = JSON.parse(responseText.trim())

    const validLabels = ['Interested', 'Not Interested', 'OOO']
    if (!validLabels.includes(classification.label)) {
      return { label: 'Interested', confidence: 0.5 }
    }

    return {
      label: classification.label,
      confidence: Math.min(1, Math.max(0, Number(classification.confidence) || 0.5))
    }
  } catch (error) {
    console.error('LinkedIn message classification error:', error)
    return { label: 'Interested', confidence: 0.5 }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verify webhook signature
  if (!verifyUnipileSignature(req)) {
    return res.status(401).json({ error: 'Invalid webhook signature' })
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

    // Handle message received event - detect replies and pause sequences
    if (event.type === 'message.received' || event.event === 'MESSAGE_RECEIVED') {
      console.log('LinkedIn message received:', JSON.stringify(event))

      const accountId = event.account_id || event.accountId
      const messageData = event.message || event.data || {}
      const senderProfile = messageData.sender || messageData.from || {}
      const senderProviderId = senderProfile.provider_id || senderProfile.id || ''
      const senderLinkedinUrl = senderProfile.url || senderProfile.linkedin_url || ''
      const messageText = messageData.text || messageData.body || messageData.content || ''

      if (!accountId || !messageText) {
        return res.status(200).json({ received: true, note: 'Missing account_id or message text' })
      }

      // Find the user who owns this Unipile account
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('unipile_account_id', accountId)
        .single()

      if (!profile) {
        return res.status(200).json({ received: true, note: 'No user found for account_id' })
      }

      // Find matching active linkedin_enrollment by sender's LinkedIn URL or provider_id
      let enrollment = null

      // Try matching by linkedin_profile_url containing the provider_id
      if (senderProviderId) {
        const { data } = await supabase
          .from('linkedin_enrollments')
          .select('id, lead_id, current_phase, current_day')
          .eq('user_id', profile.id)
          .eq('status', 'active')
          .ilike('linkedin_profile_url', `%${senderProviderId}%`)
          .single()
        enrollment = data
      }

      // Fallback: try matching by exact URL
      if (!enrollment && senderLinkedinUrl) {
        const { data } = await supabase
          .from('linkedin_enrollments')
          .select('id, lead_id, current_phase, current_day')
          .eq('user_id', profile.id)
          .eq('status', 'active')
          .eq('linkedin_profile_url', senderLinkedinUrl)
          .single()
        enrollment = data
      }

      if (!enrollment) {
        return res.status(200).json({ received: true, note: 'No active enrollment found for sender' })
      }

      // Classify the message using Claude
      const classification = await classifyLinkedInMessage(messageText)

      // Pause the sequence
      await supabase
        .from('linkedin_enrollments')
        .update({
          status: 'paused',
          paused_reason: 'reply_received',
          updated_at: new Date().toISOString()
        })
        .eq('id', enrollment.id)

      // Get lead details
      const { data: lead } = await supabase
        .from('leads')
        .select('company, first_name, last_name, email, linkedin_url')
        .eq('id', enrollment.lead_id)
        .single()

      // Save the incoming message to inbound_emails table
      await supabase
        .from('inbound_emails')
        .insert({
          user_id: profile.id,
          lead_id: enrollment.lead_id,
          from_email: senderLinkedinUrl || senderProviderId,
          subject: `LinkedIn reply from ${lead?.first_name || ''} ${lead?.last_name || ''}`.trim() || 'LinkedIn Reply',
          body_text: messageText,
          ai_label: classification.label,
          ai_confidence: classification.confidence,
          source: 'linkedin',
          linkedin_enrollment_id: enrollment.id,
          sender_linkedin_id: senderProviderId,
          received_at: new Date().toISOString(),
          is_read: false,
          replied: false
        })

      // Log the action
      await supabase
        .from('linkedin_action_log')
        .insert({
          enrollment_id: enrollment.id,
          user_id: profile.id,
          lead_id: enrollment.lead_id,
          phase: enrollment.current_phase,
          day: enrollment.current_day,
          action_type: 'reply_received',
          action_payload: {
            message_text: messageText,
            sender_provider_id: senderProviderId,
            classification: classification.label
          },
          status: 'completed',
          executed_at: new Date().toISOString()
        })

      // Handle classification outcomes
      if (classification.label === 'Not Interested') {
        // Update enrollment to completed
        await supabase
          .from('linkedin_enrollments')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', enrollment.id)

        // Update lead status to not_interested
        await supabase
          .from('leads')
          .update({ status: 'not_interested' })
          .eq('id', enrollment.lead_id)

      } else if (classification.label === 'Interested') {
        // Update lead status to qualified
        await supabase
          .from('leads')
          .update({ status: 'qualified' })
          .eq('id', enrollment.lead_id)

        // Check if deal already exists
        const { data: existingDeal } = await supabase
          .from('deals')
          .select('id')
          .eq('user_id', profile.id)
          .eq('lead_id', enrollment.lead_id)
          .single()

        if (!existingDeal) {
          // Create a new deal
          await supabase
            .from('deals')
            .insert({
              user_id: profile.id,
              lead_id: enrollment.lead_id,
              title: lead?.company || `${lead?.first_name || ''} ${lead?.last_name || ''}`.trim(),
              value: 0,
              currency: '£',
              stage: 'qualified',
              stage_entered_at: new Date().toISOString(),
              source: 'linkedin',
              probability: 30,
              notes: 'Deal created automatically from LinkedIn reply (classified as Interested)'
            })
        }
      }

      return res.status(200).json({
        received: true,
        enrollment_paused: true,
        classification: classification.label
      })
    }

    // Unknown event type - acknowledge receipt
    return res.status(200).json({ received: true })

  } catch (err) {
    console.error('LinkedIn webhook error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
