import React from 'react';
import { AlertTriangle, Zap, Check } from 'lucide-react';

interface ExpiredOverlayProps {
    type: 'expired' | 'cancelled';
    onViewPlans: () => void;
}

const ExpiredOverlay: React.FC<ExpiredOverlayProps> = ({ type, onViewPlans }) => {
    return (
        <div className="fixed inset-0 z-[90] bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle size={40} className="text-red-500" />
                </div>

                <h1 className="text-2xl font-black text-[#111827] mb-3">
                    {type === 'expired' ? 'Your Free Trial Has Ended' : 'Subscription Cancelled'}
                </h1>

                <p className="text-sm text-[#6B7280] font-medium mb-8 leading-relaxed">
                    {type === 'expired'
                        ? "Your 7-day Pro trial has expired. Choose a plan to continue generating leads and closing deals with Leadomation."
                        : "Your subscription has been cancelled. Reactivate a plan to regain access to your campaigns, leads, and pipeline."
                    }
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {/* Starter Card */}
                    <div className="border border-[#E2E4ED] rounded-xl p-4 text-left">
                        <div className="text-xs font-black text-[#6B7280] uppercase tracking-widest mb-1">Starter</div>
                        <div className="text-xl font-black text-[#111827] mb-3">£49<span className="text-sm font-bold text-[#6B7280]">/mo</span></div>
                        <div className="space-y-1.5">
                            {['3 campaigns', '500 leads/mo', '50 emails/day', 'LinkedIn automation', 'CSV export'].map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check size={10} className="text-green-500" strokeWidth={3} />
                                    <span className="text-[10px] font-medium text-[#374151]">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Card */}
                    <div className="border-2 border-[#4F46E5] rounded-xl p-4 text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-[#4F46E5] text-white text-[7px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Popular</div>
                        <div className="text-xs font-black text-[#4F46E5] uppercase tracking-widest mb-1">Pro</div>
                        <div className="text-xl font-black text-[#111827] mb-3">£149<span className="text-sm font-bold text-[#6B7280]">/mo</span></div>
                        <div className="space-y-1.5">
                            {['Unlimited campaigns', '5,000+ leads/mo', 'AI Voice Agent', 'Deal Pipeline CRM', 'Unified Inbox'].map((f, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <Check size={10} className="text-[#4F46E5]" strokeWidth={3} />
                                    <span className="text-[10px] font-medium text-[#374151]">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onViewPlans}
                    className="w-full py-3.5 bg-[#4F46E5] text-white rounded-xl text-sm font-black hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <Zap size={16} />
                    View Plans & Pricing
                </button>
            </div>
        </div>
    );
};

export default ExpiredOverlay;
