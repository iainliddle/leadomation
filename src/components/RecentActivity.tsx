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
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
                    Live Feed
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                </button>
            </div>

            <div className="space-y-1">
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
                        <div key={activity.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-lg -mx-3 px-3 transition-colors duration-150">
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
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                    activity.status === 'NEW'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : activity.statusClass
                                }`}>
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
