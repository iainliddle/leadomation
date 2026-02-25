import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    useEffect(() => {
        const handle = async () => {
            // Check if session already exists on page load
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
                try {
                    await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: session.user.email, type: 'welcome', firstName })
                    });
                } catch (e) {
                    console.error('Welcome email failed:', e);
                }
                window.location.href = '/dashboard';
                return;
            }

            // If no session yet, wait for the sign in event
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
                    try {
                        await fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ to: session.user.email, type: 'welcome', firstName })
                        });
                    } catch (e) {
                        console.error('Welcome email failed:', e);
                    }
                    window.location.href = '/dashboard';
                }
            });

            return () => subscription.unsubscribe();
        };

        handle();
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FF' }}>
            <p style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Confirming your email...</p>
        </div>
    );
}
