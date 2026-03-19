import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { account_id, user_id } = req.query

  if (!account_id || !user_id) {
    return res.redirect('/integrations?linkedin=error')
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
