import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                subscription.unsubscribe();
                const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
                try {
                    await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/welcome-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: session.user.email, firstName })
                    });
                } catch (e) {
                    console.error('Welcome email failed:', e);
                }
                window.location.href = '/dashboard';
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FF' }}>
            <p style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Confirming your email...</p>
        </div>
    );
}