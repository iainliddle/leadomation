import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface UpgradePromptProps {
    message: string;
    onClose: () => void;
    onUpgrade?: () => void;
}

const UpgradePrompt = ({ message, onClose }: UpgradePromptProps) => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ plan: 'pro', billingCycle: 'monthly' })
            });
            const data = await response.json();
            console.log('Checkout response:', data);
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No URL returned:', data);
                setLoading(false);
            }
        } catch (err) {
            console.error('Upgrade failed:', err);
            setLoading(false);
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
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-medium hover:bg-[#F9FAFB] transition-all disabled:opacity-50"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        {loading ? 'Loading...' : 'Upgrade to Pro — £149/month'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradePrompt;
