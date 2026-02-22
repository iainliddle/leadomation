import React, { useState, useEffect } from 'react';
import { Users, Mail, MessageCircle, Linkedin, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import CampaignPerformance from '../components/CampaignPerformance';
import TopCampaigns from '../components/TopCampaigns';
import RecentActivity from '../components/RecentActivity';
import OnboardingModal from '../components/OnboardingModal';
import { supabase } from '../lib/supabase';
import UsageLimitBar from '../components/UsageLimitBar';
import { usePlan } from '../hooks/usePlan';

interface DashboardProps {
    onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
    const { plan, usage, limits, trialDaysRemaining } = usePlan();
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
            {/* Usage Summary (Conditional) */}
            {plan === 'trial' && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#111827]">Trial Usage</span>
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-[10px] font-black text-[#4F46E5] rounded uppercase tracking-tighter">Pro Features Active</span>
                        </div>
                        <span className="text-xs font-bold text-[#6B7280]">{trialDaysRemaining} days remaining</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                            <div className="text-lg font-black text-[#4F46E5]">{usage.leadsUsed}<span className="text-xs font-bold text-[#9CA3AF]">/{limits.trialMaxLeads}</span></div>
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Leads</div>
                        </div>
                        <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                            <div className="text-lg font-black text-[#4F46E5]">{usage.emailsUsed}<span className="text-xs font-bold text-[#9CA3AF]">/{limits.trialMaxEmails}</span></div>
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Emails</div>
                        </div>
                        <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                            <div className="text-lg font-black text-[#4F46E5]">{usage.voiceCallsUsed}<span className="text-xs font-bold text-[#9CA3AF]">/{limits.trialMaxVoiceCalls}</span></div>
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Voice Calls</div>
                        </div>
                        <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                            <div className="text-lg font-black text-[#4F46E5]">{usage.aiEmailsUsed}<span className="text-xs font-bold text-[#9CA3AF]">/{limits.trialMaxAiEmails}</span></div>
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">AI Emails</div>
                        </div>
                        <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-transparent hover:border-indigo-100 transition-all sm:col-span-2 lg:col-span-1">
                            <div className="text-lg font-black text-[#4F46E5]">{usage.keywordSearchesUsed}<span className="text-xs font-bold text-[#9CA3AF]">/{limits.trialMaxKeywordSearches}</span></div>
                            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">Searches</div>
                        </div>
                    </div>
                </div>
            )}

            {plan === 'starter' && (usage.monthlyLeadsUsed / limits.maxLeadsPerMonth > 0.4 || usage.monthlyKeywordSearchesUsed / limits.maxKeywordSearches > 0.4) && (
                <div className="mb-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <UsageLimitBar
                            label="Monthly Leads"
                            used={usage.monthlyLeadsUsed || 0}
                            max={limits.maxLeadsPerMonth}
                            onUpgradeClick={() => onPageChange('Pricing')}
                        />
                        <UsageLimitBar
                            label="Keyword Searches"
                            used={usage.monthlyKeywordSearchesUsed || 0}
                            max={limits.maxKeywordSearches}
                            onUpgradeClick={() => onPageChange('Pricing')}
                        />
                    </div>
                </div>
            )}

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
                    <div className="bg-gradient-to-br from-[#EEF2FF] to-white border border-[#C7D2FE] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-[#4F46E5]/5 rounded-full blur-xl"></div>
                        <div className="text-2xl mb-1 relative z-10">
                            {plan === 'pro' ? '⭐' : plan === 'trial' ? '⚡' : '🛡️'}
                        </div>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest relative z-10">Current Plan</div>
                        <div className="text-lg font-black text-[#4F46E5] relative z-10 leading-none mt-1">
                            {plan === 'trial' ? 'PRO TRIAL' : plan.toUpperCase()}
                        </div>
                        {plan === 'trial' && (
                            <div className="text-[10px] font-bold text-[#6B7280] mt-1 relative z-10">{trialDaysRemaining} days left</div>
                        )}
                        {(plan === 'expired' || plan === 'cancelled') && (
                            <button
                                onClick={() => onPageChange('Pricing')}
                                className="mt-2 text-[10px] font-black text-primary hover:underline uppercase tracking-widest relative z-10"
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
