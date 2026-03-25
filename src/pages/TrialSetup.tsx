import React, { useState } from 'react';
import { Loader2, Lock, Check } from 'lucide-react';
import logo from '../assets/logo-full.png';
import { supabase } from '../lib/supabase';
import './Register.css';

const TrialSetup: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro'>('pro');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

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

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    billingCycle,
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

    return (
        <div className="register-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
            <img src={logo} alt="Leadomation" className="register-logo" style={{ marginBottom: '2rem' }} />

            <div className="register-card" style={{ maxWidth: '440px', width: '100%', padding: '2.5rem 2rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your trial has ended. Choose a plan to continue.</h1>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Select a plan below to continue using Leadomation. Your data and campaigns are saved and ready when you upgrade.
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="bg-gray-100 p-1 rounded-xl inline-flex items-center gap-1">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('annual')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Annual
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase px-1.5 py-0.5 rounded-md font-black">Save 2 months free</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Starter */}
                    <button
                        onClick={() => setSelectedPlan('starter')}
                        className={`text-left p-4 rounded-xl border-2 transition-all gap-2 flex flex-col items-start ${selectedPlan === 'starter' ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Starter</div>
                        <div className="text-xl font-black text-gray-900 mb-3 block">
                            £{billingCycle === 'monthly' ? '59' : '566'}<span className="text-xs font-bold text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-2 mt-auto">
                            {['25 keyword searches/mo', 'Unlimited campaigns', '300 leads/mo', '30 emails/day', 'Email sequences'].map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </button>

                    {/* Pro */}
                    <button
                        onClick={() => setSelectedPlan('pro')}
                        className={`text-left p-4 rounded-xl border-2 transition-all gap-2 flex flex-col items-start relative overflow-hidden ${selectedPlan === 'pro' ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Popular</div>
                        <div className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Pro</div>
                        <div className="text-xl font-black text-gray-900 mb-3 block">
                            £{billingCycle === 'monthly' ? '159' : '1,526'}<span className="text-xs font-bold text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                        <ul className="space-y-2 mt-auto">
                            {['75 keyword searches/mo', 'Unlimited campaigns', '2,000 leads/mo', '50 AI voice calls/mo', 'LinkedIn Sequencer', 'Multi-channel sequences'].map((f, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <div className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                        <Check size={10} strokeWidth={3} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 leading-tight">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </button>
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
                </div>
            </div>
        </div>
    );
};

export default TrialSetup;
