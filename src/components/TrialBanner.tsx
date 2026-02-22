import React from 'react';
import { Clock, Zap, AlertTriangle } from 'lucide-react';

interface TrialBannerProps {
    daysRemaining: number;
    plan: string;
    onUpgradeClick: () => void;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ daysRemaining, plan, onUpgradeClick }) => {
    // Don't show for paid plans
    if (plan === 'starter' || plan === 'pro') return null;

    // Expired trial or cancelled
    if (plan === 'expired' || plan === 'cancelled') {
        return (
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 flex items-center justify-between gap-4 rounded-xl mt-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <AlertTriangle size={18} />
                    <span className="text-sm font-bold">
                        {plan === 'expired' ? 'Your free trial has expired.' : 'Your subscription has been cancelled.'} Upgrade now to continue using Leadomation.
                    </span>
                </div>
                <button
                    onClick={onUpgradeClick}
                    className="px-5 py-1.5 bg-white text-red-600 rounded-lg text-xs font-black hover:bg-red-50 transition-all whitespace-nowrap shadow-sm"
                >
                    View Plans
                </button>
            </div>
        );
    }

    // Active trial
    if (plan === 'trial') {
        const isUrgent = daysRemaining <= 2;
        const bgClass = isUrgent
            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
            : 'bg-[#4F46E5]';

        return (
            <div className={`${bgClass} text-white px-6 py-2.5 flex items-center justify-between gap-4 rounded-xl mt-3 shadow-sm`}>
                <div className="flex items-center gap-3">
                    {isUrgent ? <AlertTriangle size={16} /> : <Clock size={16} />}
                    <span className="text-sm font-bold">
                        {isUrgent
                            ? `⚠️ Only ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left on your trial!`
                            : `You're on a 7-day Pro trial — ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} remaining`
                        }
                    </span>
                </div>
                <button
                    onClick={onUpgradeClick}
                    className="px-5 py-1.5 bg-white text-[#4F46E5] rounded-lg text-xs font-black hover:bg-indigo-50 transition-all whitespace-nowrap shadow-sm"
                >
                    <Zap size={12} className="inline mr-1 mb-0.5" />
                    Upgrade Now
                </button>
            </div>
        );
    }

    return null;
};

export default TrialBanner;
