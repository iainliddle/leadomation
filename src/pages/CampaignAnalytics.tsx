import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    Mail,
    MousePointer,
    AlertTriangle,
    Calendar,
    ChevronDown,
    Loader2
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { supabase } from '../lib/supabase';

interface Campaign {
    id: string;
    name: string;
}

interface EmailEvent {
    id: string;
    event_type: string;
    occurred_at: string;
    campaign_id: string;
    lead_id: string;
    step_index: number;
}

interface Lead {
    id: string;
    business_name: string;
    email: string;
}

const CampaignAnalytics: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'campaign' | 'step'>('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [_emailEvents, setEmailEvents] = useState<EmailEvent[]>([]);
    const [leads, setLeads] = useState<Record<string, Lead>>({});

    // Date range state
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Stats
    const [stats, setStats] = useState({
        totalSent: 0,
        openRate: 0,
        replyRate: 0,
        bounceRate: 0
    });

    // Chart data
    const [dailySentData, setDailySentData] = useState<any[]>([]);
    const [campaignOpenRates, setCampaignOpenRates] = useState<any[]>([]);
    const [stepPerformance, setStepPerformance] = useState<any[]>([]);
    const [topSubjects, _setTopSubjects] = useState<any[]>([]);
    const [leadActivity, setLeadActivity] = useState<any[]>([]);

    const getDateRangeStart = () => {
        const now = new Date();
        switch (dateRange) {
            case '7d': return new Date(now.setDate(now.getDate() - 7));
            case '30d': return new Date(now.setDate(now.getDate() - 30));
            case '90d': return new Date(now.setDate(now.getDate() - 90));
            default: return new Date(now.setDate(now.getDate() - 30));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch campaigns
                const { data: campaignsData } = await supabase
                    .from('campaigns')
                    .select('id, name')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setCampaigns(campaignsData || []);

                // Fetch email events
                const startDate = getDateRangeStart().toISOString();
                const { data: eventsData } = await supabase
                    .from('email_events')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('occurred_at', startDate)
                    .order('occurred_at', { ascending: false });

                setEmailEvents(eventsData || []);

                // Fetch leads for activity table
                const { data: leadsData } = await supabase
                    .from('leads')
                    .select('id, business_name, email')
                    .eq('user_id', user.id);

                const leadsMap: Record<string, Lead> = {};
                (leadsData || []).forEach(lead => {
                    leadsMap[lead.id] = lead;
                });
                setLeads(leadsMap);

                // Calculate stats
                const events = eventsData || [];
                const sent = events.filter(e => e.event_type === 'sent').length;
                const opened = events.filter(e => e.event_type === 'opened').length;
                const replied = events.filter(e => e.event_type === 'replied').length;
                const bounced = events.filter(e => e.event_type === 'bounced').length;

                setStats({
                    totalSent: sent,
                    openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
                    replyRate: sent > 0 ? Math.round((replied / sent) * 100) : 0,
                    bounceRate: sent > 0 ? Math.round((bounced / sent) * 100) : 0
                });

                // Process daily sent data
                const dailyMap: Record<string, number> = {};
                const rangeStart = getDateRangeStart();
                for (let d = new Date(rangeStart); d <= new Date(); d.setDate(d.getDate() + 1)) {
                    dailyMap[d.toISOString().split('T')[0]] = 0;
                }
                events.filter(e => e.event_type === 'sent').forEach(e => {
                    const date = e.occurred_at.split('T')[0];
                    if (dailyMap[date] !== undefined) {
                        dailyMap[date]++;
                    }
                });
                setDailySentData(Object.entries(dailyMap).map(([date, count]) => ({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    emails: count
                })));

                // Process campaign open rates
                const campaignStats: Record<string, { sent: number; opened: number; name: string }> = {};
                events.forEach(e => {
                    if (!e.campaign_id) return;
                    if (!campaignStats[e.campaign_id]) {
                        const campaign = (campaignsData || []).find(c => c.id === e.campaign_id);
                        campaignStats[e.campaign_id] = { sent: 0, opened: 0, name: campaign?.name || 'Unknown' };
                    }
                    if (e.event_type === 'sent') campaignStats[e.campaign_id].sent++;
                    if (e.event_type === 'opened') campaignStats[e.campaign_id].opened++;
                });
                const campaignRates = Object.entries(campaignStats)
                    .map(([_id, data]) => ({
                        name: data.name.length > 20 ? data.name.substring(0, 20) + '...' : data.name,
                        openRate: data.sent > 0 ? Math.round((data.opened / data.sent) * 100) : 0
                    }))
                    .sort((a, b) => b.openRate - a.openRate)
                    .slice(0, 10);
                setCampaignOpenRates(campaignRates);

                // Process step performance
                const stepStats: Record<number, { sent: number; replied: number }> = {};
                events.forEach(e => {
                    const step = e.step_index ?? 0;
                    if (!stepStats[step]) stepStats[step] = { sent: 0, replied: 0 };
                    if (e.event_type === 'sent') stepStats[step].sent++;
                    if (e.event_type === 'replied') stepStats[step].replied++;
                });
                const stepData = Object.entries(stepStats)
                    .map(([step, data]) => ({
                        step: `Step ${parseInt(step) + 1}`,
                        replyRate: data.sent > 0 ? Math.round((data.replied / data.sent) * 100) : 0
                    }))
                    .sort((a, b) => parseInt(a.step.replace('Step ', '')) - parseInt(b.step.replace('Step ', '')));
                setStepPerformance(stepData);

            } catch (err) {
                console.error('Error fetching analytics data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    // Fetch campaign-specific data when campaign is selected
    useEffect(() => {
        if (!selectedCampaignId || activeTab !== 'campaign') return;

        const fetchCampaignData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const startDate = getDateRangeStart().toISOString();
            const { data: events } = await supabase
                .from('email_events')
                .select('*')
                .eq('user_id', user.id)
                .eq('campaign_id', selectedCampaignId)
                .gte('occurred_at', startDate)
                .order('occurred_at', { ascending: true });

            // Process daily open rate for selected campaign
            const dailyStats: Record<string, { sent: number; opened: number }> = {};
            (events || []).forEach(e => {
                const date = e.occurred_at.split('T')[0];
                if (!dailyStats[date]) dailyStats[date] = { sent: 0, opened: 0 };
                if (e.event_type === 'sent') dailyStats[date].sent++;
                if (e.event_type === 'opened') dailyStats[date].opened++;
            });

            // Process step performance for selected campaign
            const stepStats: Record<number, { sent: number; opened: number }> = {};
            (events || []).forEach(e => {
                const step = e.step_index ?? 0;
                if (!stepStats[step]) stepStats[step] = { sent: 0, opened: 0 };
                if (e.event_type === 'sent') stepStats[step].sent++;
                if (e.event_type === 'opened') stepStats[step].opened++;
            });

            // Process lead activity
            const leadActivityMap: Record<string, { lastOpened: string; stepReached: number; status: string }> = {};
            (events || []).forEach(e => {
                if (!e.lead_id) return;
                if (!leadActivityMap[e.lead_id]) {
                    leadActivityMap[e.lead_id] = { lastOpened: '', stepReached: 0, status: 'sent' };
                }
                if (e.step_index !== undefined && e.step_index > leadActivityMap[e.lead_id].stepReached) {
                    leadActivityMap[e.lead_id].stepReached = e.step_index;
                }
                if (e.event_type === 'opened') {
                    leadActivityMap[e.lead_id].lastOpened = e.occurred_at;
                    leadActivityMap[e.lead_id].status = 'opened';
                }
                if (e.event_type === 'replied') {
                    leadActivityMap[e.lead_id].status = 'replied';
                }
            });

            setLeadActivity(Object.entries(leadActivityMap).map(([leadId, data]) => ({
                leadId,
                lead: leads[leadId],
                ...data
            })));
        };

        fetchCampaignData();
    }, [selectedCampaignId, activeTab, leads]);

    const StatCard = ({ icon: Icon, label, value, subtext, color, borderColor }: any) => (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 border-l-4 ${borderColor || 'border-l-indigo-500'}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
    );

    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <BarChart3 size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No data yet</h3>
            <p className="text-sm text-slate-400 max-w-md">
                Send your first email sequence to see analytics here. Once emails are sent, you'll see open rates, reply rates, and more.
            </p>
        </div>
    );

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'campaign', label: 'Campaign Detail' },
        { key: 'step', label: 'Step Performance' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 mb-1">Analytics</h1>
                    <p className="text-sm font-medium text-gray-500">Track your email campaign performance</p>
                </div>

                {/* Date Range Picker */}
                <div className="relative">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 transition-all"
                    >
                        <Calendar size={16} />
                        {dateRange === '7d' ? 'Last 7 days' : dateRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
                        <ChevronDown size={16} />
                    </button>
                    {showDatePicker && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                            {[
                                { value: '7d', label: 'Last 7 days' },
                                { value: '30d', label: 'Last 30 days' },
                                { value: '90d', label: 'Last 90 days' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setDateRange(option.value as any);
                                        setShowDatePicker(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-all ${dateRange === option.value ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-slate-700'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-8 border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-1 py-3 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.key
                            ? 'border-indigo-600 text-indigo-600 font-semibold'
                            : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Mail}
                            label="Total Sent"
                            value={stats.totalSent.toLocaleString()}
                            color="bg-indigo-50 text-indigo-600"
                            borderColor="border-l-indigo-500"
                        />
                        <StatCard
                            icon={MousePointer}
                            label="Open Rate"
                            value={`${stats.openRate}%`}
                            color="bg-emerald-50 text-emerald-600"
                            borderColor="border-l-emerald-500"
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Reply Rate"
                            value={`${stats.replyRate}%`}
                            color="bg-blue-50 text-blue-600"
                            borderColor="border-l-blue-500"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            label="Bounce Rate"
                            value={`${stats.bounceRate}%`}
                            color="bg-amber-50 text-amber-600"
                            borderColor="border-l-amber-500"
                        />
                    </div>

                    {stats.totalSent === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Emails Sent Per Day */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-4">Emails Sent Per Day</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dailySentData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '12px'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="emails"
                                                stroke="#4F46E5"
                                                strokeWidth={2}
                                                dot={{ fill: '#4F46E5', r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Open Rate by Campaign */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-4">Open Rate by Campaign (Top 10)</h3>
                                {campaignOpenRates.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">No campaign data available</p>
                                ) : (
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={campaignOpenRates} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                                <XAxis
                                                    type="number"
                                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                                    tickLine={false}
                                                    domain={[0, 100]}
                                                    tickFormatter={(value) => `${value}%`}
                                                />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                                    tickLine={false}
                                                    width={150}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#fff',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        fontSize: '12px'
                                                    }}
                                                    formatter={(value: any) => [`${value}%`, 'Open Rate']}
                                                />
                                                <Bar
                                                    dataKey="openRate"
                                                    fill="#4F46E5"
                                                    radius={[0, 4, 4, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Campaign Detail Tab */}
            {activeTab === 'campaign' && (
                <div className="space-y-6">
                    {/* Campaign Selector */}
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                            Select Campaign
                        </label>
                        <select
                            value={selectedCampaignId || ''}
                            onChange={(e) => setSelectedCampaignId(e.target.value || null)}
                            className="w-full p-3 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                        >
                            <option value="">Choose a campaign...</option>
                            {campaigns.map(campaign => (
                                <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                            ))}
                        </select>
                    </div>

                    {!selectedCampaignId ? (
                        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                            <p className="text-sm text-gray-500">Select a campaign above to view detailed analytics</p>
                        </div>
                    ) : leadActivity.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Lead Activity Table */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-900">Lead Activity</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Lead</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Step Reached</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Last Opened</th>
                                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {leadActivity.slice(0, 20).map((activity, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {activity.lead?.business_name || 'Unknown'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {activity.lead?.email || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        Step {activity.stepReached + 1}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {activity.lastOpened
                                                            ? new Date(activity.lastOpened).toLocaleDateString()
                                                            : '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${activity.status === 'replied'
                                                            ? 'bg-green-100 text-green-700'
                                                            : activity.status === 'opened'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {activity.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Step Performance Tab */}
            {activeTab === 'step' && (
                <div className="space-y-6">
                    {stepPerformance.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <>
                            {/* Reply Rate by Step */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-4">Reply Rate by Step</h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stepPerformance}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="step"
                                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                                tickLine={false}
                                                axisLine={false}
                                                domain={[0, 100]}
                                                tickFormatter={(value) => `${value}%`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    fontSize: '12px'
                                                }}
                                                formatter={(value: any) => [`${value}%`, 'Reply Rate']}
                                            />
                                            <Bar
                                                dataKey="replyRate"
                                                fill="#4F46E5"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Best Performing Subject Lines */}
                            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-slate-100">
                                    <h3 className="text-base font-semibold text-slate-900">Best Performing Subject Lines</h3>
                                </div>
                                <div className="p-6">
                                    {topSubjects.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            Subject line performance data will appear here once you have sent emails.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {topSubjects.map((subject, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                                                    <span className="text-sm font-bold text-indigo-600">{subject.openRate}% open rate</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CampaignAnalytics;
