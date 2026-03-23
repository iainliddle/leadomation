import React, { useState, useEffect, useCallback } from 'react';
import { Users, Mail, MessageCircle, TrendingUp, Loader2, Phone, UserPlus, Star, Download, Calendar, ChevronDown, ArrowUpRight, Info } from 'lucide-react';
import { createPortal } from 'react-dom';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip } from 'recharts';
import CampaignPerformance from '../components/CampaignPerformance';
import TopCampaigns from '../components/TopCampaigns';
import RecentActivity from '../components/RecentActivity';
import OnboardingModal from '../components/OnboardingModal';
import { supabase } from '../lib/supabase';
import UsageLimitBar from '../components/UsageLimitBar';
import { usePlan } from '../hooks/usePlan';
import logoIcon from '../assets/logo-icon.png';

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
    return `${fmt(fromDate)} - ${fmt(toDate)}`;
}

const getDateRangeDays = (preset: DatePreset): string[] => {
    const days: string[] = [];
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    let numDays = 7;
    if (preset === '14d') numDays = 14;
    else if (preset === '30d') numDays = 30;
    else if (preset === '90d') numDays = 90;
    else if (preset === 'year') numDays = 365;
    else if (preset === 'all') numDays = 90; // Default to 90 days for all time sparklines

    for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
};

const bucketByDay = (rows: { day: string; count: number }[], days: string[]): { day: string; value: number }[] => {
    const map = Object.fromEntries(rows.map(r => [r.day, r.count]));
    return days.map(day => ({ day, value: map[day] || 0 }));
};

// Aggregate data into 7 buckets for sparkline display
const aggregateToSparkline = (data: { day: string; value: number }[]): { day: string; value: number }[] => {
    if (data.length <= 7) return data;

    const bucketSize = Math.ceil(data.length / 7);
    const result: { day: string; value: number }[] = [];

    for (let i = 0; i < 7; i++) {
        const start = i * bucketSize;
        const end = Math.min(start + bucketSize, data.length);
        const slice = data.slice(start, end);
        const total = slice.reduce((sum, d) => sum + d.value, 0);
        if (slice.length > 0) {
            result.push({ day: slice[Math.floor(slice.length / 2)].day, value: total });
        }
    }

    return result;
};

// Ensure sparkline data renders visibly even with sparse data
const ensureRenderableSparkline = (data: { day: string; value: number }[]): { day: string; value: number }[] => {
    if (data.length === 0) return data;

    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return data; // No data to show

    // Find non-zero buckets
    const nonZeroIndices = data.map((d, i) => d.value > 0 ? i : -1).filter(i => i >= 0);

    // If data is concentrated in 1-2 buckets, spread minimally to create visible shape
    if (nonZeroIndices.length <= 2 && data.length >= 3) {
        const result = [...data];
        nonZeroIndices.forEach(idx => {
            // Add small adjacent values to create visible area/bar shape
            if (idx > 0 && result[idx - 1].value === 0) {
                result[idx - 1] = { ...result[idx - 1], value: Math.max(1, Math.floor(result[idx].value * 0.1)) };
            }
            if (idx < result.length - 1 && result[idx + 1].value === 0) {
                result[idx + 1] = { ...result[idx + 1], value: Math.max(1, Math.floor(result[idx].value * 0.1)) };
            }
        });
        return result;
    }

    return data;
};

// Stat Card Component
interface StatCardProps {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
    subtitle: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    chartData?: { day: string; value: number }[];
    chartType?: 'bar' | 'area';
    chartColor?: string;
    chartGradientId?: string;
    tooltipLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    change,
    isPositive,
    subtitle,
    icon: Icon,
    iconBg,
    iconColor,
    chartData,
    chartType = 'bar',
    chartColor = '#22D3EE',
    chartGradientId,
    tooltipLabel = 'Count'
}) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-[#9CA3AF]">{label}</p>
                <Info size={14} className="text-gray-300 cursor-help" />
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon size={18} className={iconColor} />
            </div>
        </div>
        <div className="flex items-end justify-between">
            <div>
                <h3 className="text-2xl font-bold text-[#111827] mb-3">{value}</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className={`flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                        <ArrowUpRight size={14} className={isPositive ? '' : 'rotate-90'} />
                        {change}
                    </span>
                    <span className="text-gray-400">{subtitle}</span>
                </div>
            </div>
            {chartData && (
                <div className="w-20 h-10 opacity-80">
                    {chartType === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} barSize={4}>
                                <Bar dataKey="value" fill={chartColor} radius={[2, 2, 0, 0]} />
                                <Tooltip
                                    contentStyle={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                                    formatter={(v) => [v, tooltipLabel]}
                                    labelFormatter={(l) => String(l)}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                {chartGradientId && (
                                    <defs>
                                        <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                )}
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColor}
                                    strokeWidth={1.5}
                                    fill={chartGradientId ? `url(#${chartGradientId})` : chartColor}
                                    dot={false}
                                />
                                <Tooltip
                                    contentStyle={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', border: '1px solid #E5E7EB' }}
                                    formatter={(v) => [v, tooltipLabel]}
                                    labelFormatter={(l) => String(l)}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            )}
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
    const { plan, usage, limits, trialDaysRemaining } = usePlan();
    const [firstName, setFirstName] = useState<string>('');
    const [monthlyResetDate, setMonthlyResetDate] = useState<string | null>(null);
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
    const [leadsChartData, setLeadsChartData] = useState<{day: string; value: number}[]>([]);
    const [emailsChartData, setEmailsChartData] = useState<{day: string; value: number}[]>([]);
    const [contactedChartData, setContactedChartData] = useState<{day: string; value: number}[]>([]);
    const [dealsChartData, setDealsChartData] = useState<{day: string; value: number}[]>([]);

    useEffect(() => {
        setPortalTarget(document.getElementById('topbar-actions'));
    }, []);

    const fetchDashboardData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile - use first_name column directly if available
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, full_name, monthly_reset_date')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.error('Error fetching profile:', profileError);
        }

        // Helper to capitalize first letter
        const capitalize = (str: string): string => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };

        // Use first_name column directly if available, otherwise extract from full_name
        if (profile?.first_name?.trim()) {
            setFirstName(capitalize(profile.first_name.trim()));
        } else if (profile?.full_name?.trim()) {
            const firstWord = profile.full_name.trim().split(/\s+/)[0];
            setFirstName(capitalize(firstWord));
        } else if (user.email) {
            // Fallback: extract first word from email prefix
            const emailPrefix = user.email.split('@')[0];
            const firstWord = emailPrefix.split(/[._-]/)[0];
            setFirstName(capitalize(firstWord));
        } else {
            setFirstName('');
        }

        // Set monthly reset date
        if (profile?.monthly_reset_date) {
            setMonthlyResetDate(profile.monthly_reset_date);
        }

        const { from: dateFrom } = getDateRange(datePreset);

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

        // Fetch sparkline chart data based on date range
        const days = getDateRangeDays(datePreset);
        const sparklineStartDate = days[0] + 'T00:00:00.000Z';

        // Total leads per day
        const { data: leadsDaily } = await supabase
            .from('leads')
            .select('created_at')
            .eq('user_id', user.id)
            .gte('created_at', sparklineStartDate);

        const leadsBucketed = bucketByDay(
            Object.entries(
                (leadsDaily || []).reduce((acc: Record<string, number>, row) => {
                    const day = row.created_at.split('T')[0];
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {})
            ).map(([day, count]) => ({ day, count: count as number })),
            days
        );
        setLeadsChartData(ensureRenderableSparkline(aggregateToSparkline(leadsBucketed)));

        // Leads with emails per day
        const { data: emailsDaily } = await supabase
            .from('leads')
            .select('created_at')
            .eq('user_id', user.id)
            .not('email', 'is', null)
            .gte('created_at', sparklineStartDate);

        const emailsBucketed = bucketByDay(
            Object.entries(
                (emailsDaily || []).reduce((acc: Record<string, number>, row) => {
                    const day = row.created_at.split('T')[0];
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {})
            ).map(([day, count]) => ({ day, count: count as number })),
            days
        );
        setEmailsChartData(ensureRenderableSparkline(aggregateToSparkline(emailsBucketed)));

        // Leads contacted (sequence enrollments) per day
        const { data: contactedDaily } = await supabase
            .from('sequence_enrollments')
            .select('enrolled_at')
            .eq('user_id', user.id)
            .gte('enrolled_at', sparklineStartDate);

        const contactedBucketed = bucketByDay(
            Object.entries(
                (contactedDaily || []).reduce((acc: Record<string, number>, row) => {
                    const day = row.enrolled_at.split('T')[0];
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {})
            ).map(([day, count]) => ({ day, count: count as number })),
            days
        );
        setContactedChartData(ensureRenderableSparkline(aggregateToSparkline(contactedBucketed)));

        // Deals per day
        const { data: dealsDaily } = await supabase
            .from('deals')
            .select('created_at')
            .eq('user_id', user.id)
            .gte('created_at', sparklineStartDate);

        const dealsBucketed = bucketByDay(
            Object.entries(
                (dealsDaily || []).reduce((acc: Record<string, number>, row) => {
                    const day = row.created_at.split('T')[0];
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {})
            ).map(([day, count]) => ({ day, count: count as number })),
            days
        );
        setDealsChartData(ensureRenderableSparkline(aggregateToSparkline(dealsBucketed)));

        const activityItems: any[] = [];

        (recentCallsData || []).forEach((call: any) => {
            const leadInfo = call.leads as any;
            const companyName = leadInfo?.company || 'Unknown';
            const statusLabel = call.status === 'completed' ? 'COMPLETED' : call.status === 'initiated' ? 'INITIATED' : (call.status || 'CALL').toUpperCase();
            const statusClass = call.status === 'completed'
                ? 'bg-emerald-50 text-emerald-700'
                : call.status === 'initiated'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600';

            activityItems.push({
                id: `call-${call.id}`, icon: Phone, bgColor: 'bg-green-50', iconColor: 'text-green-600',
                text: `AI call to ${companyName}`, time: call.created_at,
                sortDate: new Date(call.created_at).getTime(), status: statusLabel, statusClass
            });
        });

        (recentNewLeads || []).forEach((lead: any) => {
            activityItems.push({
                id: `lead-${lead.id}`, icon: UserPlus, bgColor: 'bg-blue-50', iconColor: 'text-blue-600',
                text: `New lead: ${lead.company || 'Unknown'}`, time: lead.created_at,
                sortDate: new Date(lead.created_at).getTime(), status: 'NEW', statusClass: 'bg-blue-50 text-blue-700'
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
            <div className="flex items-center justify-center min-h-[400px] bg-[#F8F9FA]">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    // Greeting logic based on local time
    const hour = new Date().getHours();
    const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 17 ? 'Good afternoon' : 'Good evening';
    const formattedDate = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-6 space-y-6">
            {/* TopBar Actions Portal */}
            {portalTarget && createPortal(
                <>
                    <div className="relative">
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <Calendar size={14} className="text-gray-400" />
                            <span className="hidden md:inline">{formatDateLabel(datePreset)}</span>
                            <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
                        </button>
                        {showDatePicker && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)} />
                                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-150">
                                    {DATE_PRESETS.map(p => (
                                        <button
                                            key={p.key}
                                            onClick={() => { setDatePreset(p.key); setShowDatePicker(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${datePreset === p.key ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-gray-700 hover:bg-gray-50'}`}
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
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all shadow-sm disabled:opacity-60"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="text-gray-400" />}
                        <span className="hidden md:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
                    </button>
                </>,
                portalTarget
            )}

            {/* Welcome Message */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#111827]">
                    {greeting}{firstName ? `, ${firstName}` : ''} 👋
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                    {formattedDate} · Let's make today count.
                    {!firstName && (
                        <button
                            onClick={() => onPageChange('Settings')}
                            className="ml-2 text-[#4F46E5] hover:underline font-medium"
                        >
                            Add your name to personalise your dashboard →
                        </button>
                    )}
                </p>
            </div>

            {/* Trial Usage Summary */}
            {plan === 'trial' && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">Trial Usage</span>
                            <span className="px-2 py-0.5 bg-[#EEF2FF] text-[10px] font-semibold text-[#4F46E5] rounded-full uppercase tracking-wide">Pro Features Active</span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">{trialDaysRemaining} days remaining</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { label: 'Leads', used: usage.leadsUsed, max: limits.trialMaxLeads },
                            { label: 'Emails', used: usage.emailsUsed, max: limits.trialMaxEmails },
                            { label: 'Voice Calls', used: usage.voiceCallsUsed, max: limits.trialMaxVoiceCalls },
                            { label: 'AI Emails', used: usage.aiEmailsUsed, max: limits.trialMaxAiEmails },
                            { label: 'Searches', used: usage.keywordSearchesUsed, max: limits.trialMaxKeywordSearches },
                        ].map((item) => (
                            <div key={item.label} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-[#EEF2FF] transition-colors">
                                <div className="text-lg font-bold text-[#4F46E5]">
                                    {item.used}<span className="text-xs font-medium text-gray-400">/{item.max}</span>
                                </div>
                                <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Starter Plan Usage Warning */}
            {plan === 'starter' && (usage.monthlyLeadsUsed / limits.maxLeadsPerMonth > 0.4 || usage.monthlyKeywordSearchesUsed / limits.maxKeywordSearches > 0.4) && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <UsageLimitBar label="Monthly Leads" used={usage.monthlyLeadsUsed || 0} max={limits.maxLeadsPerMonth} onUpgradeClick={() => onPageChange('Pricing')} />
                        <UsageLimitBar label="Keyword Searches" used={usage.monthlyKeywordSearchesUsed || 0} max={limits.maxKeywordSearches} onUpgradeClick={() => onPageChange('Pricing')} />
                    </div>
                </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    label="Total Leads"
                    value={stats.totalLeads.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle={datePreset === 'all' ? 'total database' : `in ${DATE_PRESETS.find(p => p.key === datePreset)?.label?.toLowerCase()}`}
                    icon={Users}
                    iconBg="bg-cyan-50"
                    iconColor="text-cyan-600"
                    chartData={leadsChartData}
                    chartType="bar"
                    chartColor="#22D3EE"
                    tooltipLabel="Leads"
                />
                <StatCard
                    label="Leads with Emails"
                    value={stats.leadsWithEmails.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="verified emails"
                    icon={Mail}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    chartData={emailsChartData}
                    chartType="area"
                    chartColor="#10B981"
                    chartGradientId="emailGrad"
                    tooltipLabel="With email"
                />
                <StatCard
                    label="Leads Contacted"
                    value={stats.leadsContacted.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="outreach initiated"
                    icon={MessageCircle}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-600"
                    chartData={contactedChartData}
                    chartType="area"
                    chartColor="#8B5CF6"
                    chartGradientId="contactGrad"
                    tooltipLabel="Contacted"
                />
                <StatCard
                    label="Total Deals"
                    value={stats.dealsCount.toLocaleString()}
                    change="+0%"
                    isPositive={true}
                    subtitle="in pipeline"
                    icon={TrendingUp}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-500"
                    chartData={dealsChartData}
                    chartType="bar"
                    chartColor="#F43F5E"
                    tooltipLabel="Deals"
                />
                <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <img
                                src={logoIcon}
                                alt="Leadomation"
                                className="w-6 h-6 object-contain"
                            />
                            <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">
                                Current Plan
                            </span>
                        </div>
                        {/* Usage ring indicator with tooltip */}
                        <div className="relative group">
                            {(() => {
                                // For trial, use trial counters. For paid plans, use actual totalLeads from stats
                                const usedLeads = plan === 'trial' ? usage.leadsUsed : (stats.totalLeads || usage.monthlyLeadsUsed);
                                const maxLeads = plan === 'trial' ? limits.trialMaxLeads : limits.maxLeadsPerMonth;
                                const percentage = maxLeads > 0 ? Math.min(100, Math.round((usedLeads / maxLeads) * 100)) : 0;

                                // Calculate reset date
                                const getResetDateFormatted = () => {
                                    if (monthlyResetDate) {
                                        const resetDate = new Date(monthlyResetDate);
                                        return resetDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                                    }
                                    // Default to first day of next month
                                    const nextMonth = new Date();
                                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                    nextMonth.setDate(1);
                                    return nextMonth.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                                };

                                return (
                                    <>
                                        {/* Tooltip */}
                                        <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 w-48 z-50 bottom-full left-1/2 -translate-x-1/2 mb-2">
                                            <p className="font-semibold mb-1">{usedLeads.toLocaleString()} of {maxLeads.toLocaleString()} leads</p>
                                            <p className="text-gray-300">You've used {percentage}% of your {maxLeads.toLocaleString()} leads this month.</p>
                                            <p className="text-gray-400 mt-1">Resets on {getResetDateFormatted()}.</p>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                        {/* Ring container */}
                                        <div className="flex flex-col items-center">
                                            <div className="relative w-14 h-14">
                                                <svg className="w-14 h-14 transform -rotate-90">
                                                    <circle
                                                        cx="28"
                                                        cy="28"
                                                        r="22"
                                                        fill="none"
                                                        stroke="#EEF2FF"
                                                        strokeWidth="4"
                                                    />
                                                    <circle
                                                        cx="28"
                                                        cy="28"
                                                        r="22"
                                                        fill="none"
                                                        stroke="#4F46E5"
                                                        strokeWidth="4"
                                                        strokeLinecap="round"
                                                        strokeDasharray={`${percentage * 1.38} 138`}
                                                    />
                                                </svg>
                                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#4F46E5]">
                                                    {percentage}%
                                                </span>
                                            </div>
                                            <span className="text-[9px] text-gray-500 mt-0.5">Leads used</span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#111827] capitalize">{plan === 'trial' ? 'Pro Trial' : plan || 'Starter'}</p>
                        <p className="text-xs text-[#6B7280] mt-1">
                            {plan === 'trial'
                                ? `${trialDaysRemaining} days remaining`
                                : 'Upgrade to unlock all features'}
                        </p>
                    </div>
                    <button
                        onClick={() => onPageChange('Pricing')}
                        className="mt-3 w-full py-1.5 bg-[#4F46E5] text-white text-xs font-medium rounded-lg hover:bg-[#4338CA] transition-all"
                    >
                        {plan === 'trial' ? 'View plans' : 'Upgrade now'}
                    </button>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6 self-start">
                    <CampaignPerformance dateFrom={dateFrom || undefined} />
                </div>
                <div className="lg:col-span-4 self-start">
                    <TopCampaigns dateFrom={dateFrom || undefined} />
                </div>
            </div>

            {/* Activity Row */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                <div className="lg:col-span-6">
                    <RecentActivity activities={activities} />
                </div>
                <div className="lg:col-span-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-base font-semibold text-gray-900">Recent Leads</h3>
                            <button onClick={() => onPageChange('Lead Database')} className="text-xs font-semibold text-[#4F46E5] hover:underline uppercase tracking-wide">View All</button>
                        </div>
                        <div className="flex-1 space-y-1">
                            {recentLeads.length === 0 ? (
                                <p className="text-sm font-medium text-gray-400 text-center py-10">No leads found.</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-150 group cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4F46E5] font-semibold text-sm">
                                                {lead.company ? lead.company.substring(0, 1).toUpperCase() : 'L'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors">{lead.company || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{lead.industry || 'Lead'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-gray-400">{formatRelativeTime(lead.created_at)}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#4F46E5] transition-all"
                        >
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
