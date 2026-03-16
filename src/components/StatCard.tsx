import React from 'react';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    subtitle: string;
    icon: LucideIcon;
    iconColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    change,
    isPositive,
    subtitle,
    icon: Icon,
    iconColor = 'text-primary'
}) => {
    return (
        <div
            className="relative p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-[#4F46E5] border border-[#E2E8F0]"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%)' }}
        >
            <div className="flex justify-between items-start mb-6">
                <div className="bg-indigo-50 rounded-xl p-3">
                    <Icon className={iconColor} size={22} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                <h3 className="text-4xl font-bold text-[#0F172A]">{value}</h3>
                <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
            </div>
        </div>
    );
};

export default StatCard;
