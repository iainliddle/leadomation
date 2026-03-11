import React, { useState, useEffect, useCallback } from 'react';
import { Users, Mail, MessageCircle, Linkedin, Loader2, Phone, UserPlus, Star, Download, Calendar, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
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

type DatePreset = '7d' | '14d' | '30d' | '90d' | 'year' | 'all';

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
    { key: '7d', label: 'Last 7 days' },
    { key: '14d', label: 'Last 14 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 90 days' },
    { key: 'year', label: 'This year' },
    { key: 'all', label: 'All time' },
];

function getDateRange(preset: DatePreset): { from: string | null; to: string } {
    const now = new Date();
    const to = now.toISOString();
    if (preset === 'all') return { from: null, to };
    if (preset === 'year') {
        return { from: new Date(now.getFullYear(), 0, 1).toISOString(), to };
    }
    const days = preset === '7d' ? 7 : preset === '14d' ? 14 : preset === '30d' ? 30 : 90;
    const from = new Date(now.getTime() - days * 86400000).toISOString();
    return { from, to };
}

function formatDateLabel(preset: DatePreset): string {
    const { from } = getDateRange(preset);
    if (!from) return 'All time';
    const fromDate = new Date(from);
    const toDate = new Date();
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${fmt(fromDate)} to ${fmt(toDate)}`;
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
    const [activities, setActivities] = useState<any[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [datePreset, setDatePreset] = useState<DatePreset>('30d');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(document.getElementById('topbar-actions'));
    }, []);

    const fetchDashboardData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { from: dateFrom } = getDateRange(datePreset);

        // Build queries with optional date filter
        const addDateFilter = (query: any) => {
            if (dateFrom) return query.gte('created_at', dateFrom);
            return query;
        };

        const [
            { count: totalLeads },
            { count: leadsWithEmails },
            { count: leadsContacted },
            { count: dealsCount },
            { data: recentLeadsData },
            { data: recentCallsData },
            { data: recentNewLeads },
            { data: qualifiedLeads }
        ] = await Promise.all([
            addDateFilter(supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id)),
            addDateFilter(supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).neq('email', '').not('email', 'is', null)),
            addDateFilter(supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['Contacted', 'Qualified'])),
            addDateFilter(supabase.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id)),
            supabase.from('leads').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
            supabase.from('call_logs').select('id, created_at, status, leads(company, first_name)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
            supabase.from('leads').select('id, company, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
            supabase.from('leads').select('id, company, created_at').eq('user_id', user.id).eq('status', 'Qualified').order('created_at', { ascending: false }).limit(3)
        ]);

        setStats({
            totalLeads: totalLeads || 0,
            leadsWithEmails: leadsWithEmails || 0,
            leadsContacted: leadsContacted || 0,
            dealsCount: dealsCount || 0
        });
        setRecentLeads(recentLeadsData || []);

        const activityItems: any[] = [];

        (recentCallsData || []).forEach((call: any) => {
            const leadInfo = call.leads as any;
            const companyName = leadInfo?.company || 'Unknown';
            const statusLabel = call.status === 'completed' ? 'COMPLETED' : call.status === 'initiated' ? 'INITIATED' : (call.status || 'CALL').toUpperCase();
            const statusClass = call.status === 'completed'
                ? 'bg-[#ECFDF5] text-[#059669]'
                : call.status === 'initiated'
                    ? 'bg-[#FEF3C7] text-[#D97706]'
                    : 'bg-[#F3F4F6] text-[#6B7280]';

            activityItems.push({
                id: `call-${call.id}`, icon: Phone, bgColor: 'bg-green-50', iconColor: 'text-green-600',
                text: `AI call to ${companyName}`, time: call.created_at,
                sortDate: new Date(call.created_at).getTime(), status: statusLabel, statusClass
            });
        });

        (recentNewLeads || []).forEach((lead: any) => {
            activityItems.push({
                id: `lead-${lead.id}`, icon: UserPlus, bgColor: 'bg-[#EFF6FF]', iconColor: 'text-[#2563EB]',
                text: `New lead: ${lead.company || 'Unknown'}`, time: lead.created_at,
                sortDate: new Date(lead.created_at).getTime(), status: 'NEW', statusClass: 'bg-[#EFF6FF] text-[#2563EB]'
            });
        });

        (qualifiedLeads || []).forEach((lead: any) => {
            activityItems.push({
                id: `qualified-${lead.id}`, icon: Star, bgColor: 'bg-purple-50', iconColor: 'text-purple-600',
                text: `Lead qualified: ${lead.company || 'Unknown'}`, time: lead.created_at,
                sortDate: new Date(lead.created_at).getTime(), status: 'QUALIFIED', statusClass: 'bg-purple-50 text-purple-600'
            });
        });

        activityItems.sort((a, b) => b.sortDate - a.sortDate);
        const formattedActivities = activityItems.slice(0, 8).map(item => ({
            ...item, time: formatRelativeTime(item.time)
        }));
        setActivities(formattedActivities);
        setIsLoading(false);

        const onboardingCompleted = localStorage.getItem('leadomation_onboarding_completed');
        if ((totalLeads || 0) === 0 && !onboardingCompleted) {
            setShowOnboarding(true);
        }
    }, [datePreset]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') === 'success') {
            alert('Welcome to Leadomation! Your 7-day free trial has started.');
            window.history.replaceState({}, '', window.location.pathname);
        }
        fetchDashboardData();
    }, [fetchDashboardData]);

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

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: leads, error } = await supabase
                .from('leads')
                .select('company, location, phone, email, website, source, industry, status, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error || !leads || leads.length === 0) {
                alert(error ? 'Error fetching leads.' : 'No leads to export.');
                return;
            }

            const headers = ['Business Name', 'Address', 'Phone', 'Email', 'Website', 'Rating', 'Reviews', 'Category', 'Status', 'Created At'];
            const rows = leads.map(l => [
                l.company || '', l.location || '', l.phone || '', l.email || '', l.website || '',
                '', '', l.industry || '', l.status || '',
                l.created_at ? new Date(l.created_at).toLocaleDateString() : ''
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row =>
                    row.map(cell => {
                        const str = String(cell).replace(/"/g, '""');
                        return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
                    }).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leadomation-leads-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err);
            alert('Error exporting leads.');
        } finally {
            setIsExporting(false);
        }
    };

    const { from: dateFrom } = getDateRange(datePreset);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {portalTarget && createPortal(
                <>
                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-sm font-semibold text-[#374151] hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all shadow-sm"
                        >
                            <Calendar size={14} />
                            <span>{formatDateLabel(datePreset)}</span>
                            <ChevronDown size={14} className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                        </button>
                        {showDatePicker && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    {DATE_PRESETS.map(p => (
                                        <button
                                            key={p.key}
                                            onClick={() => { setDatePreset(p.key); setShowDatePicker(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${datePreset === p.key ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold' : 'text-[#374151] hover:bg-[#F9FAFB]'}`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm disabled:opacity-60"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="text-[#9CA3AF]" />}
                        {isExporting ? 'Exporting...' : 'Export'}
                    </button>
                </>,
                portalTarget
            )}

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
                        <UsageLimitBar label="Monthly Leads" used={usage.monthlyLeadsUsed || 0} max={limits.maxLeadsPerMonth} onUpgradeClick={() => onPageChange('Pricing')} />
                        <UsageLimitBar label="Keyword Searches" used={usage.monthlyKeywordSearchesUsed || 0} max={limits.maxKeywordSearches} onUpgradeClick={() => onPageChange('Pricing')} />
                    </div>
                </div>
            )}

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Leads" value={stats.totalLeads.toLocaleString()} change="+0%" isPositive={true}
                    subtitle={datePreset === 'all' ? 'from total database' : `in ${DATE_PRESETS.find(p => p.key === datePreset)?.label?.toLowerCase()}`}
                    icon={Users} iconColor="text-primary" />
                <StatCard label="Leads with Emails" value={stats.leadsWithEmails.toLocaleString()} change="+0%" isPositive={true}
                    subtitle="verified emails found" icon={Mail} iconColor="text-primary" />
                <StatCard label="Leads Contacted" value={stats.leadsContacted.toLocaleString()} change="+0%" isPositive={true}
                    subtitle="outreach initiated" icon={MessageCircle} iconColor="text-success" />
                <div className="flex flex-col gap-1">
                    <StatCard label="Total Deals" value={stats.dealsCount.toLocaleString()} change="+0%" isPositive={true}
                        subtitle="current pipeline" icon={Linkedin} iconColor="text-accent" />
                    <div className="bg-gradient-to-br from-[#EEF2FF] to-white border border-[#C7D2FE] rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-[#4F46E5]/5 rounded-full blur-xl"></div>
                        <div className="text-2xl mb-1 relative z-10">{plan === 'pro' ? '⭐' : plan === 'trial' ? '⚡' : '🛡️'}</div>
                        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest relative z-10">Current Plan</div>
                        <div className="text-lg font-black text-[#4F46E5] relative z-10 leading-none mt-1">{plan === 'trial' ? 'PRO TRIAL' : plan.toUpperCase()}</div>
                        {plan === 'trial' && (<div className="text-[10px] font-bold text-[#6B7280] mt-1 relative z-10">{trialDaysRemaining} days left</div>)}
                        {(plan === 'expired' || plan === 'cancelled') && (
                            <button onClick={() => onPageChange('Pricing')} className="mt-2 text-[10px] font-black text-primary hover:underline uppercase tracking-widest relative z-10">Upgrade</button>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <CampaignPerformance dateFrom={dateFrom || undefined} />
                </div>
                <div className="lg:col-span-4">
                    <TopCampaigns dateFrom={dateFrom || undefined} />
                </div>
            </div>

            {/* Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <RecentActivity activities={activities} />
                </div>
                <div className="lg:col-span-4 transition-all duration-300">
                    <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm h-full hover:shadow-md transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-[#111827] tracking-tight">Recent Leads</h3>
                            <button onClick={() => onPageChange('Lead Database')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">View All</button>
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
                                            <p className="text-[11px] font-bold text-[#6B7280]">{formatRelativeTime(lead.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button onClick={() => window.location.reload()}
                            className="w-full mt-6 py-3 border border-gray-100 rounded-xl text-xs font-black text-[#6B7280] hover:bg-gray-50 hover:text-primary transition-all uppercase tracking-widest pt-5 border-t">
                            Refresh Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
        </div>
    );
};

export default Dashboard;
