import React from 'react';
import { X, Zap, Check, Lock } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature?: string; // e.g. "Deal Pipeline", "AI Voice Agent"
    targetPlan?: 'starter' | 'pro'; // which plan unlocks this feature
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, feature, targetPlan = 'pro' }) => {
    if (!isOpen) return null;

    const proFeatures = [
        'AI Voice Call Agent',
        'Unlimited campaigns',
        '5,000+ leads per month',
        '200 emails per day',
        'Global Demand Intelligence',
        'Deal Pipeline / Kanban CRM',
        'Unified Inbox',
        'AI email generation',
        'Multi-channel sequences',
        'Advanced analytics',
        'Inbox warm-up & rotation',
        'Decision Maker enrichment',
        'Priority support',
    ];

    const starterFeatures = [
        '3 active campaigns',
        '500 leads per month',
        '50 emails per day',
        'Email sequences (4 steps)',
        'LinkedIn automation',
        'Lead database with filters',
        '6 email templates',
        'CSV export',
        'Email config & compliance',
    ];

    const features = targetPlan === 'pro' ? proFeatures : starterFeatures;
    const price = targetPlan === 'pro' ? '£149' : '£49';
    const planName = targetPlan === 'pro' ? 'Pro' : 'Starter';

    const handleUpgrade = () => {
        // Navigate to the in-app pricing page
        // The pricing page already has the Stripe checkout buttons
        window.location.hash = '#pricing';
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#4F46E5] to-[#6366F1] p-8 text-white text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Zap size={28} className="text-white" />
                    </div>
                    {feature ? (
                        <>
                            <h2 className="text-xl font-black mb-2">
                                <Lock size={16} className="inline mr-2 mb-1" />
                                {feature} is a {planName} Feature
                            </h2>
                            <p className="text-white/80 text-sm font-medium">
                                Upgrade to {planName} to unlock {feature} and more powerful tools
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-black mb-2">Upgrade to {planName}</h2>
                            <p className="text-white/80 text-sm font-medium">
                                Unlock the full power of Leadomation
                            </p>
                        </>
                    )}
                </div>

                {/* Features List */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-black text-[#111827]">{planName} Plan</span>
                        <div>
                            <span className="text-2xl font-black text-[#4F46E5]">{price}</span>
                            <span className="text-sm text-[#6B7280] font-bold">/month</span>
                        </div>
                    </div>

                    <div className="space-y-2.5 mb-6">
                        {features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                    <Check size={12} className="text-green-500" strokeWidth={3} />
                                </div>
                                <span className="text-sm font-medium text-[#374151]">{feat}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-3.5 bg-[#4F46E5] text-white rounded-xl text-sm font-black hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
                    >
                        Upgrade to {planName} — {price}/month
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-xs font-bold text-[#9CA3AF] hover:text-[#6B7280] transition-colors mt-2"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
