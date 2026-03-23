import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Trophy } from 'lucide-react';

interface Campaign {
    name: string;
    track: string;
    reply_rate: number;
    leads_found: number;
    emails_sent: number;
    status: string;
}

const TopCampaigns: React.FC<{ dateFrom?: string }> = ({ dateFrom }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopCampaigns = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let query = supabase
                .from('campaigns')
                .select('name, track, reply_rate, leads_found, emails_sent, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(4);

            if (dateFrom) {
                query = query.gte('created_at', dateFrom);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching top campaigns:', error);
            } else {
                setCampaigns(data || []);
            }
            setIsLoading(false);
        };

        fetchTopCampaigns();
    }, [dateFrom]);

    const getStyles = (track: string) => {
        const styles: Record<string, any> = {
            'direct': { color: '#2563EB', bgColor: 'bg-blue-50', textColor: 'text-[#2563EB]' },
            'specifier': { color: '#7C3AED', bgColor: 'bg-purple-50', textColor: 'text-[#7C3AED]' },
            'warm': { color: '#D97706', bgColor: 'bg-amber-50', textColor: 'text-[#D97706]' },
            'default': { color: '#6B7280', bgColor: 'bg-gray-50', textColor: 'text-gray-600' }
        };
        return styles[track] || styles['default'];
    };

    const getTrackLabel = (track: string) => {
        const labels: Record<string, string> = {
            'direct': 'Direct',
            'specifier': 'Specifier',
            'warm': 'Warm'
        };
        return labels[track] || track || 'General';
    };

    const getProgress = (campaign: Campaign) => {
        if (!campaign.leads_found || campaign.leads_found === 0) return 0;
        if (!campaign.emails_sent) return 10;
        return Math.min(100, Math.round((campaign.emails_sent / campaign.leads_found) * 100));
    };

    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-gray-500" />
                    <h3 className="text-lg font-bold text-[#111827]">Top Performing Campaigns</h3>
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                ) : campaigns.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8 font-medium italic">No active campaigns yet.</p>
                ) : (
                    campaigns.map((campaign, index) => {
                        const style = getStyles(campaign.track);
                        const progress = getProgress(campaign);
                        return (
                            <div key={index} className="group cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0 pr-4">
                                        <p className="text-sm font-bold text-[#111827] group-hover:text-primary transition-colors truncate">{campaign.name}</p>
                                        <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${style.bgColor} ${style.textColor}`}>
                                            {getTrackLabel(campaign.track)}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-[#111827]">{campaign.reply_rate || 0}%</p>
                                        <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Reply Rate</p>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${progress}%`,
                                            backgroundColor: style.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <button className="mt-10 py-2 text-sm font-bold text-primary hover:text-blue-700 transition-colors flex items-center justify-center gap-1 border-t border-[#F3F4F6] pt-6 uppercase tracking-wider text-[11px] font-black">
                View All Campaigns
            </button>
        </div>
    );
};

export default TopCampaigns;