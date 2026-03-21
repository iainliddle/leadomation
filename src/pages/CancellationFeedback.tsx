import React, { useEffect } from 'react';
import logo from '../assets/logo-full.png';

const CancellationFeedback: React.FC = () => {

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const reason = params.get('reason');
        const userId = params.get('userId');

        if (reason && userId && userId !== 'test') {
            fetch('/api/cancellation-reason', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, reason }),
            }).catch((err) => {
                console.error('Failed to save cancellation reason:', err);
            });
        }
    }, []);

    const reasonLabels: Record<string, string> = {
        too_expensive: 'Too expensive',
        missing_features: 'Missing features I needed',
        too_complicated: 'Too complicated to use',
        no_longer_needed: 'No longer needed',
    };

    const params = new URLSearchParams(window.location.search);
    const reason = params.get('reason') || '';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', padding: '2rem' }}>
            <img src={logo} alt="Leadomation" style={{ height: '46px', marginBottom: '2rem' }} />

            <div style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💙</div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', marginBottom: '0.75rem' }}>
                    Thanks for letting us know
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                    We're sorry to see you go. Your feedback helps us improve Leadomation for everyone.
                </p>
                {reason && reasonLabels[reason] && (
                    <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '1.5rem' }}>
                        Reason: <strong>{reasonLabels[reason]}</strong>
                    </p>
                )}

                <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '2rem' }}>
                    Your subscription has been cancelled. You can still access your account until the end of your billing period.
                </p>

                <a
                    href="/trial-setup"
                    style={{
                        display: 'inline-block',
                        padding: '0.875rem 2rem',
                        background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)',
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
                        transition: 'all 0.2s',
                    }}
                >
                    Reactivate Your Account →
                </a>
            </div>
        </div>
    );
};

export default CancellationFeedback;
