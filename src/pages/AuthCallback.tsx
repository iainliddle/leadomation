import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
                subscription.unsubscribe();

                const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';

                try {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ to: session.user.email, type: 'welcome', firstName })
                    });
                    console.log('Welcome email response:', response.status);
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
```

Then run:
```
git add.
```
```
git commit - m "fix: rewrite AuthCallback welcome email"
    ```
```
git push