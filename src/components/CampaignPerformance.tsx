import React, { useState, useEffect } from 'react';
import { BarChart3, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';

interface ChartDay {
    date: string;
    label: string;
    'AI Calls': number;
    'Emails': number;
}

interface FunnelData {
    totalLeads: number;
    contacted: number;
    qualified: number;
    deals: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 px-4 py-3">
            <p className="text-xs font-bold text-[#111827] mb-2">{label}</p>
            {payload.map((entry: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color }} />
                    <span className="font-medium text-[#6B7280]">{entry.name}:</span>
                    <span className="font-bold text-[#111827]">{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

const CampaignPerformance: React.FC<{ dateFrom?: string }> = ({ dateFrom }) => {
    const [chartData, setChartData] = useState<ChartDay[]>([]);
    const [funnel, setFunnel] = useState<FunnelData>({ totalLeads: 0, contacted: 0, qualified: 0, deals: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { setIsLoading(false); return; }

            const now = new Date();
            const fourteenDaysAgo = new Date(now);
            fourteenDaysAgo.setDate(now.getDate() - 13);
            fourteenDaysAgo.setHours(0, 0, 0, 0);
            const sinceISO = dateFrom || fourteenDaysAgo.toISOString();

            // Build date labels
            const days: ChartDay[] = [];
            for (let i = 0; i < 14; i++) {
                const d = new Date(fourteenDaysAgo);
                d.setDate(fourteenDaysAgo.getDate() + i);
                const dateStr = d.toISOString().split('T')[0];
                const label = d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
                days.push({ date: dateStr, label, 'AI Calls': 0, 'Emails': 0 });
            }

            // Fetch call_logs + contacted leads (for chart) + funnel counts
            const [callRes, contactedLeadsRes, totalRes, contactedRes, qualifiedRes, dealsRes] = await Promise.all([
                supabase.from('call_logs').select('created_at').eq('user_id', user.id).gte('created_at', sinceISO),
                supabase.from('leads').select('created_at').eq('user_id', user.id).in('status', ['Contacted', 'Replied']).gte('created_at', sinceISO),
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['Contacted', 'Replied', 'Qualified']),
                supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'Qualified'),
                supabase.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            ]);

            // Group calls by day
            (callRes.data || []).forEach((row: any) => {
                const dayKey = new Date(row.created_at).toISOString().split('T')[0];
                const match = days.find(d => d.date === dayKey);
                if (match) match['AI Calls']++;
            });

            // Group contacted leads by day (for Emails chart line)
            (contactedLeadsRes.data || []).forEach((row: any) => {
                const dayKey = new Date(row.created_at).toISOString().split('T')[0];
                const match = days.find(d => d.date === dayKey);
                if (match) match['Emails']++;
            });

            const hasActivity = days.some(d => d['AI Calls'] > 0 || d['Emails'] > 0);
            setIsEmpty(!hasActivity);
            setChartData(days);
            setFunnel({
                totalLeads: totalRes.count || 0,
                contacted: contactedRes.count || 0,
                qualified: qualifiedRes.count || 0,
                deals: dealsRes.count || 0,
            });
            setIsLoading(false);
        };

        fetchData();
    }, [dateFrom]);

    if (isLoading) {
        return (
            <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-[#111827]">Campaign Performance</h3>
                        <p className="text-xs text-[#9CA3AF]">Last 14 days</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center min-h-[220px]">
                    <div className="w-6 h-6 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[#111827]">Campaign Performance</h3>
                    <p className="text-xs text-[#9CA3AF]">Last 14 days</p>
                </div>
            </div>

            {isEmpty ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[220px]">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                        <BarChart3 size={28} />
                    </div>
                    <p className="text-xs font-medium text-[#9CA3AF] text-center max-w-[260px] leading-relaxed">
                        Outreach activity will appear here once campaigns are running.
                    </p>
                </div>
            ) : (
                <div className="flex-1">
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="fillEmails" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                width={35}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '8px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="AI Calls"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#fillCalls)"
                            />
                            <Area
                                type="monotone"
                                dataKey="Emails"
                                stroke="#06b6d4"
                                strokeWidth={2}
                                fill="url(#fillEmails)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Conversion Funnel */}
            <div className="mt-6 pt-5 border-t border-[#F3F4F6]">
                <div className="flex items-center justify-between gap-2">
                    {[
                        { label: 'Total Leads', value: funnel.totalLeads },
                        { label: 'Contacted', value: funnel.contacted },
                        { label: 'Qualified', value: funnel.qualified },
                        { label: 'Deals', value: funnel.deals },
                    ].map((item, i, arr) => (
                        <React.Fragment key={item.label}>
                            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-center min-w-0">
                                <div className="text-base font-black text-[#111827]">{item.value}</div>
                                <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider truncate">{item.label}</div>
                            </div>
                            {i < arr.length - 1 && (
                                <ChevronRight size={14} className="text-[#D1D5DB] shrink-0" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CampaignPerformance;
