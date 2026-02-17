import React, { useState, useEffect } from 'react';
import { Users, Mail, MessageCircle, Linkedin, Loader2, Zap } from 'lucide-react';
import StatCard from '../components/StatCard';
import CampaignPerformance from '../components/CampaignPerformance';
import TopCampaigns from '../components/TopCampaigns';
import RecentActivity from '../components/RecentActivity';
import OnboardingModal from '../components/OnboardingModal';
import { supabase } from '../lib/supabase';

interface DashboardProps {
    onPageChange: (page: string) => void;
    userPlan?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange, userPlan = 'free' }) => {
    const [stats, setStats] = useState({
        totalLeads: 0,
        leadsWithEmails: 0,
        leadsContacted: 0,
        dealsCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') === 'success') {
            alert('Welcome to Leadomation! Your 7-day free trial has started.');
            // Remove the query param without refreshing
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }

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

            // Trigger onboarding if 0 leads and not seen before
            const onboardingCompleted = localStorage.getItem('leadomation_onboarding_completed');
            if ((totalLeads || 0) === 0 && !onboardingCompleted) {
                setShowOnboarding(true);
            }
        };

        fetchDashboardData();
    }, []);

    const handleCloseOnboarding = () => {
        localStorage.setItem('leadomation_onboarding_completed', 'true');
        setShowOnboarding(false);
    };

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const created = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return created.toLocaleDateString();
    };

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
                <div className="flex flex-col gap-1">
                    <StatCard
                        label="Total Deals"
                        value={stats.dealsCount.toLocaleString()}
                        change="+0%"
                        isPositive={true}
                        subtitle="current pipeline"
                        icon={Linkedin}
                        iconColor="text-accent"
                    />
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userPlan === 'pro' ? 'bg-purple-50 text-purple-600' : userPlan === 'starter' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'}`}>
                                <Zap size={20} className={userPlan !== 'free' ? 'animate-pulse' : ''} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Current Plan</p>
                                <p className={`text-sm font-black uppercase tracking-tight ${userPlan === 'pro' ? 'text-purple-600' : userPlan === 'starter' ? 'text-blue-600' : 'text-[#111827]'}`}>
                                    {userPlan} Tier
                                </p>
                            </div>
                        </div>
                        {userPlan === 'free' && (
                            <button
                                onClick={() => onPageChange('Pricing')}
                                className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                            >
                                Upgrade
                            </button>
                        )}
                    </div>
                </div>
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
                            <button
                                onClick={() => onPageChange('Lead Database')}
                                className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentLeads.length === 0 ? (
                                <p className="text-sm font-medium text-gray-400 text-center py-10">No leads found.</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-black animate-in zoom-in duration-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                {lead.company ? lead.company.substring(0, 1).toUpperCase() : 'L'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#111827] group-hover:text-primary transition-colors">{lead.company || 'N/A'}</p>
                                                <p className="text-[11px] font-medium text-[#9CA3AF] tracking-tight">{lead.industry || 'Lead'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-[#6B7280]">
                                                {formatRelativeTime(lead.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-xs font-black text-[#6B7280] hover:bg-gray-50 hover:text-primary transition-all uppercase tracking-widest pt-5 border-t"
                        >
                            Refresh Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <OnboardingModal
                isOpen={showOnboarding}
                onClose={handleCloseOnboarding}
            />
        </div>
    );
};

export default Dashboard;
