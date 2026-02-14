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
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconColor === 'text-primary' ? 'bg-[#EFF6FF]' :
                        iconColor === 'text-success' ? 'bg-[#ECFDF5]' :
                            iconColor === 'text-accent' ? 'bg-[#F3E8FF]' : 'bg-gray-50'
                    }`}>
                    <Icon className={iconColor} size={20} />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#FEF2F2] text-[#DC2626]'
                    }`}>
                    {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {change}
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-[#9CA3AF] mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-[#111827]">{value}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1">{subtitle}</p>
            </div>
        </div>
    );
};

export default StatCard;
