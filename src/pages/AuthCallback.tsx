import { useEffect } from 'react';
import { supabase } from '../lib/supabase';



export default function AuthCallback() {
    useEffect(() => {
        const handleAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {

                window.location.href = '/dashboard';
                return;
            }
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                    subscription.unsubscribe();

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
