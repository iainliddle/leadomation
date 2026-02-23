import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    useEffect(() => {
        const handleCallback = async () => {
            const { data } = await supabase.auth.exchangeCodeForSession(window.location.href);
            if (data.session) {
                window.location.href = '/dashboard';
            } else {
                // Try getting session from URL hash
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                if (accessToken && refreshToken) {
                    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                    window.location.href = '/dashboard';
                } else {
                    window.location.href = '/';
                }
            }
        };
        handleCallback();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FF' }}>
            <p style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Confirming your email...</p>
        </div>
    );
}
