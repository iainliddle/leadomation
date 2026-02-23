import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                window.location.href = '/dashboard';
            } else if (event === 'TOKEN_REFRESHED') {
                window.location.href = '/dashboard';
            }
        });
    }, []);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8F9FF' }}>
            <p style={{ color: '#4F46E5', fontFamily: 'Inter, sans-serif', fontSize: '16px' }}>Confirming your email...</p>
        </div>
    );
}
