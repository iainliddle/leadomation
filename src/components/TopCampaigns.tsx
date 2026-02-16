import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

interface Campaign {
    name: string;
    type: string;
    replyRate: string;
    progress: number;
    status: string;
}

const TopCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTopCampaigns = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('user_id', user.id)
                .order('progress', { ascending: false })
                .limit(4);

            if (error) {
                console.error('Error fetching top campaigns:', error);
            } else {
                setCampaigns(data || []);
            }
            setIsLoading(false);
        };

        fetchTopCampaigns();
    }, []);

    const getStyles = (type: string) => {
        const styles: Record<string, any> = {
            'Direct': { color: '#2563EB', bgColor: 'bg-blue-50', textColor: 'text-[#2563EB]' },
            'Specifier': { color: '#7C3AED', bgColor: 'bg-purple-50', textColor: 'text-[#7C3AED]' },
            'Warm': { color: '#D97706', bgColor: 'bg-amber-50', textColor: 'text-[#D97706]' },
            'default': { color: '#6B7280', bgColor: 'bg-gray-50', textColor: 'text-gray-600' }
        };
        return styles[type] || styles['default'];
    };

    return (
        <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl h-full flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-[#111827]">Top Performing Campaigns</h3>
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
                        const style = getStyles(campaign.type);
                        return (
                            <div key={index} className="group cursor-pointer">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="min-w-0 pr-4">
                                        <p className="text-sm font-bold text-[#111827] group-hover:text-primary transition-colors truncate">{campaign.name}</p>
                                        <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${style.bgColor} ${style.textColor}`}>
                                            {campaign.type}
                                        </span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-[#111827]">{campaign.replyRate || '0%'}</p>
                                        <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider">Reply Rate</p>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${campaign.progress || 0}%`,
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
