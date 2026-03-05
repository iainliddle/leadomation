import { createClient } from '@supabase/supabase-js';

export const config = {
    api: { bodyParser: true },
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { keywords, location_code } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: 'Keywords array is required' });
    }

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_ANON_KEY || '',
        {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();

    if (profile?.plan === 'starter') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from('demand_data')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('searched_at', startOfMonth.toISOString());

        if ((count || 0) >= 50) {
            return res.status(403).json({ error: "You've reached your Starter plan limit. Upgrade to Pro for unlimited access." });
        }
    }

    // DataForSEO Basic Auth
    const credentials = Buffer.from(
        `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`
    ).toString('base64');

    try {
        const response = await fetch(
            'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    {
                        keywords: keywords.slice(0, 10), // max 10
                        location_code: location_code || 2826, // default UK
                        language_code: 'en',
                        date_from: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                        date_to: new Date().toISOString().split('T')[0],
                    },
                ]),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('DataForSEO error:', data);
            return res.status(500).json({ error: 'DataForSEO API error', details: data });
        }

        // Extract results
        const tasks = data?.tasks?.[0];
        if (tasks?.status_code !== 20000) {
            return res.status(500).json({ error: tasks?.status_message || 'API error' });
        }

        const results = tasks?.result?.map((item: any) => ({
            keyword: item.keyword,
            search_volume: item.search_volume || 0,
            competition: item.competition || 0,
            competition_level: item.competition_level || 'N/A',
            cpc: item.cpc || 0,
            monthly_searches: item.monthly_searches || [],
        })) || [];

        return res.status(200).json({ results });

    } catch (err: any) {
        console.error('Keyword search volume error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
