import React, { useState, useEffect } from 'react';
import { Rocket, ChevronRight, Eye, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused' | 'draft' | 'completed' | 'Active' | 'Paused' | 'Draft' | 'Completed' | 'error';
    leadsCount: number;
    leads_found?: number;
    leads_requested?: number;
    scraping_status?: string;
    repliesCount: number;
    replyRate: string;
    progress: number;
    user_id: string;
    error_message?: string;
}

interface ActiveCampaignsProps {
    onPageChange?: (page: string) => void;
}

const ScrapingBadge = ({ status }: { status: string }) => {
    const config: Record<string, { label: string; className: string; animate?: boolean }> = {
        idle: { label: 'Queued', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
        scraping: { label: 'Scraping…', className: 'bg-blue-50 text-blue-700 border border-blue-200', animate: true },
        enriching: { label: 'Finding Emails…', className: 'bg-blue-50 text-blue-700 border border-blue-200', animate: true },
        complete: { label: 'Complete', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
        failed: { label: 'Failed', className: 'bg-red-50 text-red-700 border border-red-200' },
    };
    const c = config[status] || config.idle;
    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.className}`}>
            {c.animate && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
            {c.label}
        </span>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const s = String(status).toLowerCase();
    const classes =
        s === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
        s === 'active'    ? 'bg-blue-50 text-blue-700 border border-blue-200' :
        s === 'error'     ? 'bg-red-50 text-red-700 border border-red-200' :
        'bg-amber-50 text-amber-700 border border-amber-200';
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
            {status}
        </span>
    );
};

const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({ onPageChange }) => {
    useEffect(() => {
        document.title = 'Active Campaigns | Leadomation';
        return () => { document.title = 'Leadomation'; };
    }, []);

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const channelRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);
    const retryCountRef = React.useRef(0);
    const retryTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchCampaigns = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: campaignsData, error: campaignsError } = await supabase
            .from('campaigns')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (campaignsError) {
            console.error('Error fetching campaigns:', campaignsError);
            setIsLoading(false);
            return;
        }

        if (campaignsData) {
            const { data: leadsData, error: leadsError } = await supabase
                .from('leads')
                .select('campaign_id, id')
                .eq('user_id', user.id);

            if (leadsError) {
                console.error('Error fetching leads:', leadsError);
            }

            const leadsCountByCampaign = (leadsData || []).reduce((acc: Record<string, number>, lead) => {
                if (lead.campaign_id) {
                    acc[lead.campaign_id] = (acc[lead.campaign_id] || 0) + 1;
                }
                return acc;
            }, {});

            const enrichedCampaigns = campaignsData.map(campaign => ({
                ...campaign,
                leads_found: leadsCountByCampaign[campaign.id] || 0
            }));

            setCampaigns(enrichedCampaigns as Campaign[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
        let cancelled = false;
        const MAX_RETRIES = 3;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || cancelled) return;

            // Clean up existing channel before creating new one
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }

            const channel = supabase
                .channel(`campaigns-changes-${user.id}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'campaigns',
                    filter: `user_id=eq.${user.id}`
                }, () => {
                    fetchCampaigns();
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        // Reset retry count on successful subscription
                        retryCountRef.current = 0;
                    } else if (status === 'CHANNEL_ERROR') {
                        // Handle subscription error with exponential backoff
                        if (retryCountRef.current < MAX_RETRIES && !cancelled) {
                            const delay = Math.pow(2, retryCountRef.current) * 1000; // 2s, 4s, 8s
                            retryCountRef.current += 1;

                            retryTimeoutRef.current = setTimeout(() => {
                                if (!cancelled) {
                                    setupRealtime();
                                }
                            }, delay);
                        } else if (retryCountRef.current >= MAX_RETRIES) {
                            // Max retries reached, log once and stop
                            console.log('Campaigns realtime subscription failed after 3 attempts.');
                        }
                    }
                });

            if (!cancelled) {
                channelRef.current = channel;
            } else {
                supabase.removeChannel(channel);
            }
        };

        setupRealtime();

        return () => {
            cancelled = true;
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
            }
        };
    }, []);

    const deleteCampaign = async (id: string) => {
        if (!confirm('Are you sure you want to delete this campaign? This cannot be undone.')) return;
        try {
            const { error } = await supabase.from('campaigns').delete().eq('id', id);
            if (error) throw error;
            setCampaigns((prev: any[]) => prev.filter((c: any) => c.id !== id));
        } catch (err) {
            console.error('Error deleting campaign:', err);
            alert('Failed to delete campaign.');
        }
    };

    const toggleCampaignStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';
        try {
            const { error } = await supabase.from('campaigns').update({ status: newStatus }).eq('id', id);
            if (error) throw error;
            setCampaigns((prev: any[]) => prev.map((c: any) =>
                c.id === id ? { ...c, status: newStatus as any } : c
            ));
        } catch (err) {
            console.error('Error updating campaign:', err);
            alert('Failed to update campaign status.');
        }
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-white rounded-xl border border-gray-200 animate-pulse" />
                    ))}
                </div>
            ) : campaigns.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Rocket size={28} className="text-[#4F46E5]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                        Create your first campaign to start generating leads automatically.
                    </p>
                    <button
                        onClick={() => onPageChange?.('New Campaign')}
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-150"
                    >
                        Create Your First Campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 border-t-2 border-t-gray-200"
                        >

                            {/* Card body */}
                            <div className="p-5">
                                {/* Name + badges */}
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-base font-semibold text-gray-900 leading-tight pr-2">{campaign.name}</h3>
                                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                                        {campaign.scraping_status &&
                                            ['scraping', 'enriching', 'idle'].includes(String(campaign.scraping_status).trim().toLowerCase()) &&
                                            !['completed', 'paused'].includes(String(campaign.status).toLowerCase()) && (
                                                <ScrapingBadge status={String(campaign.scraping_status).trim().toLowerCase()} />
                                            )}
                                        <StatusBadge status={campaign.status} />
                                    </div>
                                </div>

                                {/* Text actions */}
                                <div className="flex items-center gap-3 mb-5">
                                    <button
                                        onClick={() => toggleCampaignStatus(campaign.id, campaign.status)}
                                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {campaign.status === 'active' ? 'Pause' : 'Resume'}
                                    </button>
                                    <span className="text-gray-200 text-xs">·</span>
                                    <button
                                        onClick={() => deleteCampaign(campaign.id)}
                                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    {campaign.scraping_status &&
                                        ['scraping', 'enriching', 'idle'].includes(String(campaign.scraping_status).trim().toLowerCase()) &&
                                        !['completed', 'paused'].includes(String(campaign.status).toLowerCase()) && (
                                        <>
                                            <span className="text-gray-200 text-xs">·</span>
                                            <button
                                                onClick={() => fetchCampaigns()}
                                                className="text-xs text-gray-400 hover:text-[#4F46E5] transition-colors"
                                            >
                                                Refresh
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs font-medium text-[#9CA3AF] mb-1">Leads found</p>
                                        <button
                                            onClick={() => {
                                                window.history.pushState({}, '', `/leads?campaign=${campaign.id}`);
                                                onPageChange?.('Lead Database');
                                            }}
                                            className="text-2xl font-bold text-gray-900 hover:text-[#4F46E5] transition-colors text-left block"
                                        >
                                            {campaign.leads_found || 0}
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9CA3AF] mb-1">Reply rate</p>
                                        <p className="text-2xl font-bold text-gray-900">{campaign.replyRate || '0.0%'}</p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="bg-gray-100 rounded-full h-1.5 mt-4">
                                    <div
                                        className="bg-[#4F46E5] h-1.5 rounded-full transition-all duration-700"
                                        style={{ width: `${campaign.progress || 0}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>Progress</span>
                                    <span>{campaign.progress || 0}%</span>
                                </div>

                                {campaign.scraping_status && ['complete', 'completed'].includes(campaign.scraping_status.toLowerCase()) &&
                                    campaign.leads_found !== undefined && campaign.leads_requested !== undefined &&
                                    campaign.leads_found < campaign.leads_requested && (
                                    <div className="flex items-center gap-1.5 mt-3">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                        <p className="text-[11px] font-medium text-amber-600">
                                            {campaign.leads_found} of {campaign.leads_requested} leads found. Limited results for this search area.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Card footer */}
                            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                                {campaign.status === 'error' ? (
                                    <button
                                        onClick={async () => {
                                            await supabase.from('campaigns').update({ status: 'active', scraping_status: 'idle', error_message: null }).eq('id', campaign.id);
                                            fetchCampaigns();
                                            alert('Campaign reset. Please re-launch from New Campaign to retry scraping.');
                                        }}
                                        className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        <AlertCircle size={14} />
                                        Dismiss Error
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            window.history.pushState({}, '', `/leads?campaign=${campaign.id}`);
                                            onPageChange?.('Lead Database');
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#ECFEFF] text-[#06B6D4] border border-[#22D3EE] rounded-lg text-sm font-medium hover:bg-[#CFFAFE] transition-all"
                                    >
                                        <Eye size={14} />
                                        View Leads
                                    </button>
                                )}
                                <button
                                    onClick={() => alert('Campaign analytics coming soon!')}
                                    className="flex items-center gap-1 text-xs text-[#4F46E5] hover:text-[#4338CA] transition-colors font-medium"
                                >
                                    View Full Analytics <ChevronRight size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveCampaigns;
