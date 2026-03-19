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

  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const expiresOn = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    const unipileBaseUrl = 'https://api4.unipile.com:13458/api/v1'
    const unipileApiKey = process.env.UNIPILE_API_KEY!

    const response = await fetch(`${unipileBaseUrl}/hosted/accounts/link`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': unipileApiKey
      },
      body: JSON.stringify({
        type: 'create',
        providers: ['LINKEDIN'],
        api_url: 'https://api4.unipile.com:13458',
        expiresOn: expiresOn,
        name: user.email,
        success_redirect_url: `https://leadomation.co.uk/api/unipile-auth-callback?user_id=${user.id}`,
        failure_redirect_url: 'https://leadomation.co.uk/integrations?linkedin=error',
        notify_url: 'https://leadomation.co.uk/api/linkedin-webhook'
      })
    })

    const text = await response.text()

    if (!text || text.trim() === '') {
      return res.status(502).json({ error: 'Empty response from Unipile' })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('Unipile non-JSON response:', text)
      return res.status(502).json({ error: 'Invalid response from Unipile', raw: text })
    }

    if (!response.ok) {
      console.error('Unipile error response:', data)
      return res.status(response.status).json({ error: 'Unipile API error', details: data })
    }

    return res.status(200).json({
      success: true,
      url: data.url || data.object?.url
    })

  } catch (error: any) {
    console.error('LinkedIn connect error:', error)
    return res.status(500).json({
      error: 'Failed to create LinkedIn connection link',
      details: error.message
    })
  }
}
