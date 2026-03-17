import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info, type LucideIcon } from 'lucide-react';

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
    iconColor = 'text-[#4F46E5]'
}) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <Info size={14} className="text-gray-300" />
                </div>
                <div className={`p-2 rounded-lg ${
                    iconColor.includes('success') ? 'bg-green-50 text-emerald-600' :
                    iconColor.includes('accent') ? 'bg-cyan-50 text-cyan-500' :
                    'bg-indigo-50 text-[#4F46E5]'
                }`}>
                    <Icon size={18} className="currentColor" />
                </div>
            </div>

            <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{value}</h3>
                
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{change} <span className="text-gray-400 font-normal ml-1 whitespace-nowrap hidden sm:inline">{subtitle}</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
