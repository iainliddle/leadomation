import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
        await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: email, firstName })
        });
    } catch (e) {
        console.error('Welcome email failed:', e);
    }
};

export default function AuthCallback() {
    useEffect(() => {
        const handleAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
                await sendWelcomeEmail(session.user.email!, firstName);
                window.location.href = '/dashboard';
                return;
            }
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                    subscription.unsubscribe();
                    const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
                    await sendWelcomeEmail(session.user.email!, firstName);
                    window.location.href = '/dashboard';
                }
            });
        };
        handleAuth();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FF' }}>
            <p style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Confirming your email...</p>
        </div>
    );
}
