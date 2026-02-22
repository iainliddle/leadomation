import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import UpgradeModal from './UpgradeModal';

interface FeatureGateProps {
    feature: string;          // Display name e.g. "Deal Pipeline"
    hasAccess: boolean;       // From usePlan().canAccess('dealPipeline')
    targetPlan?: 'starter' | 'pro';
    children: React.ReactNode;
    // Optional: render a teaser instead of nothing when locked
    lockedMessage?: string;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
    feature,
    hasAccess,
    targetPlan = 'pro',
    children,
    lockedMessage,
}) => {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-20 h-20 bg-[#F3F4F6] rounded-2xl flex items-center justify-center mb-6">
                    <Lock size={36} className="text-[#9CA3AF]" />
                </div>
                <h2 className="text-xl font-black text-[#111827] mb-2">{feature}</h2>
                <p className="text-sm text-[#6B7280] font-medium mb-6 max-w-md">
                    {lockedMessage || `${feature} is available on the ${targetPlan === 'pro' ? 'Pro' : 'Starter'} plan. Upgrade to unlock this feature and supercharge your outreach.`}
                </p>
                <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-8 py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-black hover:bg-[#4338CA] transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center gap-2"
                >
                    <Lock size={14} />
                    Upgrade to {targetPlan === 'pro' ? 'Pro' : 'Starter'}
                </button>
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature={feature}
                targetPlan={targetPlan}
            />
        </>
    );
};

export default FeatureGate;
