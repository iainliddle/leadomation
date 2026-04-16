import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, email, company } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' })
  const { error } = await supabase.from('scale_waitlist').insert({ name, email, company })
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ success: true })
}
