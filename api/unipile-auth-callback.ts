import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate state token for OAuth flow (call this when initiating the connect)
export function generateOAuthState(userId: string): string {
  const secret = process.env.UNIPILE_STATE_SECRET || process.env.INTERNAL_API_SECRET || 'fallback-secret'
  const timestamp = Date.now()
  const data = `${userId}:${timestamp}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest('hex')
  return Buffer.from(`${data}:${signature}`).toString('base64url')
}

// Verify state token (expires after 10 minutes)
function verifyOAuthState(state: string, expectedUserId: string): boolean {
  try {
    const secret = process.env.UNIPILE_STATE_SECRET || process.env.INTERNAL_API_SECRET || 'fallback-secret'
    const decoded = Buffer.from(state, 'base64url').toString()
    const [userId, timestampStr, signature] = decoded.split(':')

    // Verify user ID matches
    if (userId !== expectedUserId) return false

    // Verify timestamp is within 10 minutes
    const timestamp = parseInt(timestampStr, 10)
    if (Date.now() - timestamp > 10 * 60 * 1000) return false

    // Verify signature
    const data = `${userId}:${timestampStr}`
    const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  } catch {
    return false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { account_id, user_id, state } = req.query

  if (!account_id || !user_id) {
    return res.redirect('/integrations?linkedin=error')
  }

  // Verify state parameter to prevent CSRF and ensure user_id matches the authenticated user
  if (!state || !verifyOAuthState(String(state), String(user_id))) {
    console.error('OAuth state verification failed for user:', user_id)
    return res.redirect('/integrations?linkedin=error&reason=invalid_state')
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        unipile_account_id: String(account_id),
        linkedin_connected: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', String(user_id))

    if (error) throw error

    return res.redirect('/integrations?linkedin=connected')
  } catch (err) {
    console.error('Unipile auth callback error:', err)
    return res.redirect('/integrations?linkedin=error')
  }
}
