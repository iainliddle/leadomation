import React from 'react';
import { Mail, Linkedin, UserPlus, ExternalLink } from 'lucide-react';

const activities = [
    {
        icon: Mail,
        bgColor: 'bg-[#EFF6FF]',
        iconColor: 'text-[#2563EB]',
        text: 'Email opened by Wellness Spa Berlin',
        time: '2 minutes ago',
        status: 'OPENED',
        statusClass: 'bg-[#ECFDF5] text-[#059669]'
    },
    {
        icon: UserPlus,
        bgColor: 'bg-[#ECFDF5]',
        iconColor: 'text-[#059669]',
        text: 'New lead scraped: Luxury Hotel Dubai',
        time: '15 minutes ago',
        status: 'NEW',
        statusClass: 'bg-[#EFF6FF] text-[#2563EB]'
    },
    {
        icon: Linkedin,
        bgColor: 'bg-[#F3E8FF]',
        iconColor: 'text-[#7C3AED]',
        text: 'LinkedIn Connection accepted: Sarah J.',
        time: '45 minutes ago',
        status: 'SENT',
        statusClass: 'bg-[#F3F4F6] text-[#6B7280]'
    },
    {
        icon: Mail,
        bgColor: 'bg-[#EFF6FF]',
        iconColor: 'text-[#2563EB]',
        text: 'Reply received: TechFlow Solutions',
        time: '1 hour ago',
        status: 'REPLIED',
        statusClass: 'bg-[#ECFDF5] text-[#059669]'
    },
    {
        icon: Mail,
        bgColor: 'bg-[#EFF6FF]',
        iconColor: 'text-[#2563EB]',
        text: 'Campaign "UK Expansion" started',
        time: '3 hours ago',
        status: 'SENT',
        statusClass: 'bg-[#F3F4F6] text-[#6B7280]'
    }
];

const RecentActivity: React.FC = () => {
    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#111827]">Recent Activity</h3>
                <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
                    Live Feed <div className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse shadow-sm"></div>
                </button>
            </div>

            <div className="divide-y divide-[#F3F4F6]">
                {activities.map((activity, index) => (
                    <div key={index} className="py-5 flex items-center justify-between group cursor-pointer hover:bg-[#F9FAFB] -mx-6 px-6 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${activity.bgColor} ${activity.iconColor}`}>
                                <activity.icon size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#374151] group-hover:text-primary transition-colors">
                                    {activity.text}
                                </p>
                                <p className="text-xs font-medium text-[#9CA3AF] mt-0.5">{activity.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${activity.statusClass}`}>
                                {activity.status}
                            </span>
                            <ExternalLink size={14} className="text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="mt-8 w-full py-3 text-sm font-bold text-[#9CA3AF] hover:text-[#374151] border-t border-[#F3F4F6] pt-8 transition-colors">
                View All Activity
            </button>
        </div>
    );
};

export default RecentActivity;
