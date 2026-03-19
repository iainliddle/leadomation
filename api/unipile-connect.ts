import type { VercelRequest, VercelResponse } from '@vercel/node'

const UNIPILE_API_KEY = 'vLurcq/9.sCRBpfP5sOzvEW/RFqTk+63rALEGbcYaut2LabBa5zc='
const UNIPILE_DSN = 'https://api4.unipile.com:13458'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { user_id } = req.body

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' })
  }

  try {
    const response = await fetch(`${UNIPILE_DSN}/api/v1/hosted/accounts/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': UNIPILE_API_KEY
      },
      body: JSON.stringify({
        type: 'create',
        providers: ['LINKEDIN'],
        api_url: UNIPILE_DSN,
        expiresOn: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        success_redirect_url: `https://leadomation.co.uk/api/unipile-auth-callback?user_id=${user_id}`,
        failure_redirect_url: `https://leadomation.co.uk/integrations?linkedin=error`,
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
      return res.status(502).json({ error: 'Invalid JSON from Unipile', raw: text })
    }

    if (!response.ok) {
      console.error('Unipile error response:', data)
      return res.status(response.status).json({ error: 'Unipile API error', details: data })
    }

    return res.status(200).json(data)

  } catch (err) {
    console.error('Unipile connect error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
