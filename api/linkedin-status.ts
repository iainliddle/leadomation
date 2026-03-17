import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Service role client for profile access
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
    if (req.method !== 'GET') {
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
        // Get user's profile to check for Unipile account ID
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('unipile_account_id, linkedin_connected')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
            return res.status(500).json({ error: 'Failed to fetch profile' });
        }

        // If no Unipile account ID, user is not connected
        if (!profile?.unipile_account_id) {
            return res.status(200).json({
                connected: false,
                account_id: null,
                name: null
            });
        }

        // Verify account is still active with Unipile
        try {
            const response = await fetch(
                `${process.env.UNIPILE_BASE_URL}/accounts/${profile.unipile_account_id}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'X-API-KEY': process.env.UNIPILE_API_KEY!
                    }
                }
            );

            if (!response.ok) {
                // Account no longer valid, clear the connection
                if (response.status === 404 || response.status === 401) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            unipile_account_id: null,
                            linkedin_connected: false
                        })
                        .eq('id', user.id);

                    return res.status(200).json({
                        connected: false,
                        account_id: null,
                        name: null,
                        reason: 'Account disconnected or expired'
                    });
                }

                console.error('Unipile account check failed:', await response.text());
                // Return cached state if Unipile API is having issues
                return res.status(200).json({
                    connected: profile.linkedin_connected ?? false,
                    account_id: profile.unipile_account_id,
                    name: user.email
                });
            }

            const accountData = await response.json();

            return res.status(200).json({
                connected: true,
                account_id: profile.unipile_account_id,
                name: accountData.name || user.email,
                provider: accountData.provider || 'LINKEDIN'
            });
        } catch (unipileError: any) {
            console.error('Unipile API error:', unipileError);
            // Return cached state if Unipile is unreachable
            return res.status(200).json({
                connected: profile.linkedin_connected ?? false,
                account_id: profile.unipile_account_id,
                name: user.email
            });
        }
    } catch (error: any) {
        console.error('LinkedIn status error:', error);
        return res.status(500).json({
            error: 'Failed to check LinkedIn status',
            details: error.message
        });
    }
}
