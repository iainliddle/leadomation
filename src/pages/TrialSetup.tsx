import React, { useState } from 'react';
import { Loader2, Lock, Check } from 'lucide-react';
import logo from '../assets/logo-full.png';
import { supabase } from '../lib/supabase';
import './Register.css'; // Reuse register styles for layout

interface TrialSetupProps {
    onSkip: () => void;
}

const TrialSetup: React.FC<TrialSetupProps> = ({ onSkip }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleActivate = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be signed in to activate your trial.');
                setIsLoading(false);
                return;
            }

            // Using the Pro plan price ID for the trial setup
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: 'price_1T1nFP2LCoJYV9n6CyKYDjKE', // Pro Annual (gets trial via API config)
                    userId: session.user.id,
                    userEmail: session.user.email
                })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'An error occurred during checkout setup');
            setIsLoading(false);
        }
    };

    const features = [
        "Automated lead generation",
        "AI Voice Call Agent",
        "Multi-channel email sequences",
        "Deal Pipeline CRM"
    ];

    return (
        <div className="register-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
            <img src={logo} alt="Leadomation" className="register-logo" style={{ marginBottom: '2rem' }} />

            <div className="register-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black text-gray-900 mb-2">One last step — secure your free trial</h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Enter your card details to activate your 7-day Pro trial. You won't be charged until day 7. Cancel anytime before then.
                    </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">You're unlocking:</h3>
                    <ul className="space-y-3">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 text-center font-medium">{error}</div>}

                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleActivate}
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl text-sm font-black text-white hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)' }}
                    >
                        {isLoading ? (<><Loader2 size={18} className="animate-spin" /> ACTIVATING...</>) : ('Activate Free Trial →')}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
                        <Lock size={12} />
                        <span>Secured by Stripe · No charge for 7 days · Cancel anytime</span>
                    </div>

                    <button
                        onClick={onSkip}
                        className="mt-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer underline decoration-gray-300 underline-offset-4"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrialSetup;
