import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Star,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deal {
    id: string;
    stage: string;
    value: string;
    user_id: string;
    created_at: string;
    leads: {
        company: string;
        first_name: string;
        last_name: string;
        industry: string;
    } | null;
}

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
    <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group mb-3">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-xs font-bold text-[#111827] truncate">{deal.leads?.company || 'N/A'}</h4>
            </div>
            <Star size={12} className="text-gray-300 group-hover:text-amber-400 transition-colors" />
        </div>

        <p className="text-[10px] text-[#6B7280] font-medium mb-1">{deal.leads?.first_name} {deal.leads?.last_name}</p>
        <p className="text-[10px] text-[#4B5563] leading-relaxed mb-3 line-clamp-1">{deal.leads?.industry || 'No industry listed'}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <span className="text-xs font-black text-[#111827]">£{parseFloat(deal.value?.toString().replace(/[^\d.]/g, '') || '0').toLocaleString()}</span>
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-[#9CA3AF] lowercase">
                    {new Date(deal.created_at).toLocaleDateString()}
                </span>
            </div>
        </div>
    </div>
);

const PipelineColumn: React.FC<{
    title: string;
    deals: Deal[];
    accentColor: string;
    totalValue: string;
    count: number;
}> = ({ title, deals, accentColor, totalValue, count }) => (
    <div className="w-[300px] shrink-0 flex flex-col h-full bg-[#F3F4F6]/50 rounded-2xl border border-gray-100/50">
        <div className={`p-4 border-t-2 ${accentColor} bg-white rounded-t-2xl border-b border-gray-100`}>
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-black text-[#111827] uppercase tracking-widest">{title}</h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <p className="text-[10px] font-bold text-[#6B7280]">Total: <span className="text-[#111827]">{totalValue}</span></p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {deals.map(deal => <DealCard key={deal.id} deal={deal} />)}
            <button className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:border-primary hover:text-primary transition-all mt-1">
                + Add Deal
            </button>
        </div>
    </div>
);

const DealPipeline: React.FC = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('deals')
                .select('*, leads(company, first_name, last_name, industry)')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching deals:', error);
            } else {
                setDeals((data as any) || []);
            }
            setIsLoading(false);
        };

        fetchDeals();
    }, []);

    const pipelineData = useMemo(() => {
        const stages = ['New Reply', 'Qualified', 'Proposal Sent', 'Negotiating', 'Won', 'Lost'];
        const grouped: Record<string, Deal[]> = {};
        stages.forEach(stage => grouped[stage] = []);
        deals.forEach(deal => {
            if (grouped[deal.stage]) {
                grouped[deal.stage].push(deal);
            } else {
                // If stage is unknown, maybe bucket it elsewhere or ignore
            }
        });
        return grouped;
    }, [deals]);

    const calculateTotal = (dealsGroup: Deal[]) => {
        const sum = dealsGroup.reduce((acc, deal) => {
            // Simple value parsing, assuming format like "£8,200" or just numbers
            const val = parseFloat(deal.value?.toString().replace(/[^\d.]/g, '') || '0');
            return acc + val;
        }, 0);
        return `£${sum.toLocaleString()}`;
    };

    const totalPipelineValue = useMemo(() => {
        const sum = deals.reduce((acc, deal) => {
            const val = parseFloat(deal.value?.toString().replace(/[^\d.]/g, '') || '0');
            return acc + (deal.stage !== 'Lost' ? val : 0);
        }, 0);
        return `£${sum.toLocaleString()}`;
    }, [deals]);


    return (
        <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] mb-1">Deal Pipeline</h1>
                    <p className="text-sm font-bold text-[#6B7280]">Track and manage deals from first reply to closed won</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Total Pipeline Value</p>
                        <p className="text-xl font-black text-primary">{totalPipelineValue}</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95">
                        <Plus size={18} />
                        ADD DEAL
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar-horizontal">
                    <div className="flex gap-4 h-full min-w-max">
                        <PipelineColumn
                            title="New Reply"
                            deals={pipelineData['New Reply']}
                            accentColor="border-t-blue-400"
                            totalValue={calculateTotal(pipelineData['New Reply'])}
                            count={pipelineData['New Reply'].length}
                        />
                        <PipelineColumn
                            title="Qualified"
                            deals={pipelineData['Qualified']}
                            accentColor="border-t-green-400"
                            totalValue={calculateTotal(pipelineData['Qualified'])}
                            count={pipelineData['Qualified'].length}
                        />
                        <PipelineColumn
                            title="Proposal Sent"
                            deals={pipelineData['Proposal Sent']}
                            accentColor="border-t-purple-400"
                            totalValue={calculateTotal(pipelineData['Proposal Sent'])}
                            count={pipelineData['Proposal Sent'].length}
                        />
                        <PipelineColumn
                            title="Negotiating"
                            deals={pipelineData['Negotiating']}
                            accentColor="border-t-amber-400"
                            totalValue={calculateTotal(pipelineData['Negotiating'])}
                            count={pipelineData['Negotiating'].length}
                        />
                        <PipelineColumn
                            title="Won"
                            deals={pipelineData['Won']}
                            accentColor="border-t-green-600"
                            totalValue={calculateTotal(pipelineData['Won'])}
                            count={pipelineData['Won'].length}
                        />
                        <PipelineColumn
                            title="Lost"
                            deals={pipelineData['Lost']}
                            accentColor="border-t-red-300"
                            totalValue={calculateTotal(pipelineData['Lost'])}
                            count={pipelineData['Lost'].length}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;
