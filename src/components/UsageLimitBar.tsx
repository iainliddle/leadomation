import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UsageLimitBarProps {
    label: string;       // e.g. "Leads", "Emails", "Voice Calls"
    used: number;
    max: number;
    onUpgradeClick: () => void;
}

const UsageLimitBar: React.FC<UsageLimitBarProps> = ({ label, used, max, onUpgradeClick }) => {
    const percentage = Math.min((used / max) * 100, 100);
    const isNearLimit = percentage >= 80;
    const isAtLimit = used >= max;

    // Don't show if under 60% usage
    if (percentage < 60) return null;

    return (
        <div className={`rounded-xl p-3 mb-4 border ${isAtLimit
            ? 'bg-red-50 border-red-200'
            : isNearLimit
                ? 'bg-amber-50 border-amber-200'
                : 'bg-blue-50 border-blue-100'
            }`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <AlertCircle size={14} className={isAtLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : 'text-[#4F46E5]'} />
                    <span className={`text-xs font-bold ${isAtLimit ? 'text-red-700' : isNearLimit ? 'text-amber-700' : 'text-blue-700'}`}>
                        {isAtLimit
                            ? `${label} limit reached (${used}/${max})`
                            : `${label}: ${used}/${max} used`
                        }
                    </span>
                </div>
                {(isNearLimit || isAtLimit) && (
                    <button
                        onClick={onUpgradeClick}
                        className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all ${isAtLimit
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                    >
                        Upgrade
                    </button>
                )}
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-[#4F46E5]'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default UsageLimitBar;
