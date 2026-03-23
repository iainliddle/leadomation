import React from 'react';
import { Phone, Activity } from 'lucide-react';

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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-gray-500" />
                    <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1 bg-green-50 text-emerald-600 text-xs font-medium rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Feed
                </div>
            </div>

            <div className="space-y-1">
                {activities.length === 0 ? (
                    <div className="py-10 text-center">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 text-gray-300">
                            <Phone size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No activity yet</p>
                        <p className="text-xs text-gray-400 mt-1">Activity from calls, new leads, and status changes will appear here.</p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        // Extract initials from text if available (e.g. "New lead: Company Co." -> "CC")
                        let initials = 'U';
                        if (activity.text.includes(':')) {
                            const namePart = activity.text.split(':')[1].trim();
                            const words = namePart.split(' ');
                            initials = ((words[0]?.[0] || '') + (words[1]?.[0] || '')).toUpperCase() || 'U';
                        }
                        
                        return (
                            <div key={activity.id} className="py-2.5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors duration-150 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 flex items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5] font-semibold text-xs shrink-0`}>
                                        {initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-900 truncate pr-4">
                                            {activity.text}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center shrink-0">
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                                        activity.status === 'NEW'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : activity.statusClass
                                    }`}>
                                        {activity.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
