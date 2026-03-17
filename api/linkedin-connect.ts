import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Authentication check
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Calculate expiration (24 hours from now)
        const expiresOn = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // Create Unipile hosted auth link
        const response = await fetch(`${process.env.UNIPILE_BASE_URL}/hosted/accounts/link`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.UNIPILE_API_KEY!
            },
            body: JSON.stringify({
                type: 'LINKEDIN',
                api_url: process.env.UNIPILE_BASE_URL,
                expiresOn: expiresOn,
                name: user.email,
                success_redirect_url: 'https://leadomation.co.uk/integrations?linkedin=connected',
                failure_redirect_url: 'https://leadomation.co.uk/integrations?linkedin=failed',
                notify_url: 'https://leadomation.co.uk/api/linkedin-webhook'
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Unipile error:', errorData);
            return res.status(500).json({
                error: 'Failed to create LinkedIn connection link',
                details: errorData
            });
        }

        const data = await response.json();

        return res.status(200).json({
            success: true,
            url: data.url
        });
    } catch (error: any) {
        console.error('LinkedIn connect error:', error);
        return res.status(500).json({
            error: 'Failed to create LinkedIn connection link',
            details: error.message
        });
    }
}
