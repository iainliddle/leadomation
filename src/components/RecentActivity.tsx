import React from 'react';
import { Phone, ExternalLink } from 'lucide-react';

interface ActivityItem {
    id: string;
    icon: React.ElementType;
    bgColor: string;
    iconColor: string;
    text: string;
    time: string;
    status: string;
    statusClass: string;
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#111827]">Recent Activity</h3>
                <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
                    Live Feed <div className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse shadow-sm"></div>
                </button>
            </div>

            <div className="divide-y divide-[#F3F4F6]">
                {activities.length === 0 ? (
                    <div className="py-12 text-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <Phone size={24} />
                        </div>
                        <p className="text-sm font-bold text-[#6B7280]">No activity yet</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">Activity from calls, new leads, and status changes will appear here.</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="py-5 flex items-center justify-between group cursor-pointer hover:bg-[#F9FAFB] -mx-6 px-6 transition-colors duration-200">
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
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
