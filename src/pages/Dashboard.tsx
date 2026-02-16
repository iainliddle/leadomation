import React, { useState, useEffect } from 'react';
import { Users, Mail, MessageCircle, Linkedin, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import CampaignPerformance from '../components/CampaignPerformance';
import TopCampaigns from '../components/TopCampaigns';
import RecentActivity from '../components/RecentActivity';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        leadsWithEmails: 0,
        leadsContacted: 0,
        dealsCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const [recentLeads, setRecentLeads] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch counts and recent leads in parallel
            const [
                { count: totalLeads },
                { count: leadsWithEmails },
                { count: leadsContacted },
                { count: dealsCount },
                { data: recentLeadsData }
            ] = await Promise.all([
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).not('email', 'is', null),
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'Contacted'),
                supabase.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('leads')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5)
            ]);

            setStats({
                totalLeads: totalLeads || 0,
                leadsWithEmails: leadsWithEmails || 0,
                leadsContacted: leadsContacted || 0,
                dealsCount: dealsCount || 0
            });
            setRecentLeads(recentLeadsData || []);
            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Leads"
                    value={stats.totalLeads.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="from total database"
                    icon={Users}
                    iconColor="text-primary"
                />
                <StatCard
                    label="Leads with Emails"
                    value={stats.leadsWithEmails.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="verified emails found"
                    icon={Mail}
                    iconColor="text-primary"
                />
                <StatCard
                    label="Leads Contacted"
                    value={stats.leadsContacted.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="outreach initiated"
                    icon={MessageCircle}
                    iconColor="text-success"
                />
                <StatCard
                    label="Total Deals"
                    value={stats.dealsCount.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="current pipeline"
                    icon={Linkedin}
                    iconColor="text-accent"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <CampaignPerformance />
                </div>
                <div className="lg:col-span-4">
                    <TopCampaigns />
                </div>
            </div>

            {/* Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <RecentActivity />
                </div>
                <div className="lg:col-span-4 transition-all duration-300">
                    <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm h-full hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-[#111827] tracking-tight">Recent Leads</h3>
                            <span className="text-[10px] font-black text-primary bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">New</span>
                        </div>
                        <div className="space-y-4">
                            {recentLeads.length === 0 ? (
                                <p className="text-sm font-medium text-gray-400 text-center py-10">No leads found.</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black animate-in zoom-in duration-300">
                                                {lead.company ? lead.company.substring(0, 1).toUpperCase() : lead.first_name ? lead.first_name.substring(0, 1).toUpperCase() : 'L'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111827] group-hover:text-primary transition-colors">{lead.company || `${lead.first_name} ${lead.last_name}`}</p>
                                                <p className="text-[11px] font-medium text-[#9CA3AF] tracking-tight">{lead.industry || 'Unknown Industry'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${lead.status === 'Contacted' ? 'bg-blue-50 text-blue-600' :
                                                    lead.status === 'Replied' ? 'bg-green-50 text-green-600' :
                                                        'bg-gray-50 text-gray-500'
                                                }`}>
                                                {lead.status || 'New'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-xs font-black text-[#6B7280] hover:bg-gray-50 hover:text-primary transition-all uppercase tracking-widest pt-5 border-t mt-auto">
                            View All Leads
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
