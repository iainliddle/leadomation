import React, { useState, useEffect } from 'react';
import { PlayCircle, Rocket, Plus, ChevronRight, BarChart3, Users, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Campaign {
    id: string;
    name: string;
    type: string;
    status: 'Active' | 'Paused' | 'Draft';
    leadsCount: number;
    repliesCount: number;
    replyRate: string;
    progress: number;
    user_id: string;
}

const ActiveCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('campaigns')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching campaigns:', error);
            } else {
                // Mapping Supabase data to our interface
                // Adjusting field names if they differ in DB
                setCampaigns(data || []);
            }
            setIsLoading(false);
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] mb-1">Active Campaigns</h1>
                    <p className="text-sm font-bold text-[#6B7280]">Monitor and manage your outreach campaigns in real-time</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95">
                    <Plus size={18} />
                    NEW CAMPAIGN
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : campaigns.length === 0 ? (
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Rocket size={32} />
                    </div>
                    <h3 className="text-xl font-black text-[#111827] mb-2">No campaigns yet</h3>
                    <p className="text-[#6B7280] font-medium mb-8 max-w-sm mx-auto">
                        Create your first campaign to start generating leads and closing deals automatically.
                    </p>
                    <button className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                        Create Your First Campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className="card bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        <PlayCircle size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {campaign.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-[#111827] mb-1 group-hover:text-primary transition-colors">{campaign.name}</h3>
                                <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-tight mb-6">{campaign.type}</p>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1">
                                            <Users size={12} />
                                            <span className="text-[9px] font-black uppercase tracking-tight">Leads</span>
                                        </div>
                                        <p className="text-lg font-black text-[#111827]">{campaign.leadsCount || 0}</p>
                                    </div>
                                    <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-1.5 text-primary mb-1">
                                            <Mail size={12} />
                                            <span className="text-[9px] font-black uppercase tracking-tight">Reply Rate</span>
                                        </div>
                                        <p className="text-lg font-black text-primary">{campaign.replyRate || '0.0%'}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                                        <span className="text-[#9CA3AF]">Progress</span>
                                        <span className="text-[#111827]">{campaign.progress || 0}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${campaign.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gray-50 border-t border-[#E5E7EB] text-xs font-black text-[#6B7280] hover:bg-blue-50 hover:text-primary transition-all flex items-center justify-center gap-2 group/btn uppercase tracking-widest">
                                <BarChart3 size={14} />
                                View Full Analytics
                                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveCampaigns;
