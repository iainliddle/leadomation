import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface UpgradePromptProps {
    message: string;
    onClose: () => void;
    onUpgrade: () => void;
}

const UpgradePrompt = ({ message, onClose }: UpgradePromptProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError('You must be signed in to upgrade.');
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: 'pro',
                    billingCycle: 'monthly',
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
            setError(err.message || 'An error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-[#111827]">Upgrade to Pro</h3>
                </div>
                <p className="text-sm text-[#4B5563] mb-6 leading-relaxed">{message}</p>
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100 text-center font-medium">
                        {error}
                    </div>
                )}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-all disabled:opacity-50"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleCheckout}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Loading...</>
                        ) : (
                            'Upgrade to Pro — £149/month'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePrompt;
