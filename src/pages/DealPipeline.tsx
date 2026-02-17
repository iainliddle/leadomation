import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Star,
    Loader2,
    X,
    Trash2,
    Phone,
    Mail,
    Building2,
    Briefcase
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deal {
    id: string;
    stage: string;
    value: number;
    user_id: string;
    created_at: string;
    lead_id: string;
    leads: {
        id: string;
        company: string;
        first_name: string;
        last_name: string;
        industry: string;
        email?: string;
        phone?: string;
    } | null;
}

interface Lead {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    industry: string;
}

const DealCard: React.FC<{
    deal: Deal;
    onDelete: (id: string) => void;
    onClick: (deal: Deal) => void;
    onDragStart: (e: React.DragEvent, deal: Deal) => void;
}> = ({ deal, onDelete, onClick, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, deal)}
        onClick={() => onClick(deal)}
        className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group mb-3 relative"
    >
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-xs font-bold text-[#111827] truncate">{deal.leads?.company || 'N/A'}</h4>
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
            >
                <Trash2 size={12} />
            </button>
        </div>

        <p className="text-[10px] text-[#6B7280] font-medium mb-1">{deal.leads?.first_name} {deal.leads?.last_name}</p>
        <p className="text-[10px] text-[#4B5563] leading-relaxed mb-3 line-clamp-1">{deal.leads?.industry || 'No industry listed'}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
            <span className="text-xs font-black text-[#111827]">£{Number(deal.value || 0).toLocaleString()}</span>
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
    onDelete: (id: string) => void;
    onClick: (deal: Deal) => void;
    onDragStart: (e: React.DragEvent, deal: Deal) => void;
    onDrop: (e: React.DragEvent, stage: string) => void;
    onAddClick: (stage: string) => void;
}> = ({ title, deals, accentColor, totalValue, count, onDelete, onClick, onDragStart, onDrop, onAddClick }) => (
    <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => onDrop(e, title)}
        className="w-[300px] shrink-0 flex flex-col h-full bg-[#F3F4F6]/50 rounded-2xl border border-gray-100/50"
    >
        <div className={`p-4 border-t-2 ${accentColor} bg-white rounded-t-2xl border-b border-gray-100`}>
            <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-black text-[#111827] uppercase tracking-widest">{title}</h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{count}</span>
            </div>
            <p className="text-[10px] font-bold text-[#6B7280]">Total: <span className="text-[#111827]">{totalValue}</span></p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {deals.map(deal => (
                <DealCard
                    key={deal.id}
                    deal={deal}
                    onDelete={onDelete}
                    onClick={onClick}
                    onDragStart={onDragStart}
                />
            ))}
            <button
                onClick={() => onAddClick(title)}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:border-primary hover:text-primary transition-all mt-1"
            >
                + Add Deal
            </button>
        </div>
    </div>
);

interface DealPipelineProps {
    onPageChange?: (page: string) => void;
}

const DealPipeline: React.FC<DealPipelineProps> = ({ onPageChange }) => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);

    // Form state
    const [newDealLead, setNewDealLead] = useState('');
    const [newDealValue, setNewDealValue] = useState('');
    const [newDealStage, setNewDealStage] = useState('New Lead');
    const [isSaving, setIsSaving] = useState(false);

    const STAGES = ['New Lead', 'Contacted', 'Meeting Booked', 'Proposal Sent', 'Won', 'Lost'];

    const fetchDeals = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('deals')
            .select('*, leads(id, company, first_name, last_name, industry, email, phone)')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching deals:', error);
        } else {
            setDeals((data as any) || []);
        }
        setIsLoading(false);
    };

    const fetchLeads = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching leads:', error);
        } else {
            setLeads(data || []);
        }
    };

    useEffect(() => {
        fetchDeals();
        fetchLeads();
    }, []);

    const handleAddDeal = async () => {
        if (!newDealLead || !newDealValue) return;

        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('deals')
            .insert({
                user_id: user.id,
                lead_id: newDealLead,
                value: parseFloat(newDealValue),
                stage: newDealStage
            });

        if (!error) {
            fetchDeals();
            setIsAddModalOpen(false);
            setNewDealLead('');
            setNewDealValue('');
        }
        setIsSaving(false);
    };

    const handleDeleteDeal = async (id: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return;

        const { error } = await supabase
            .from('deals')
            .delete()
            .eq('id', id);

        if (!error) {
            setDeals(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleDragStart = (_e: React.DragEvent, deal: Deal) => {
        setDraggedDeal(deal);
    };

    const handleDrop = async (_e: React.DragEvent, stage: string) => {
        if (!draggedDeal || draggedDeal.stage === stage) return;

        // Optimistic update
        const originalDeals = [...deals];
        setDeals(prev => prev.map(d => d.id === draggedDeal.id ? { ...d, stage } : d));

        const { error } = await supabase
            .from('deals')
            .update({ stage })
            .eq('id', draggedDeal.id);

        if (error) {
            console.error('Error updating status:', error);
            setDeals(originalDeals);
        }
        setDraggedDeal(null);
    };

    const pipelineData = useMemo(() => {
        const grouped: Record<string, Deal[]> = {};
        STAGES.forEach(stage => grouped[stage] = []);
        deals.forEach(deal => {
            if (grouped[deal.stage]) {
                grouped[deal.stage].push(deal);
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
            const val = Number(deal.value || 0);
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
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95"
                    >
                        <Plus size={18} />
                        ADD DEAL
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : deals.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center shadow-sm max-w-lg w-full">
                        <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Star size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#111827] mb-2">No deals in pipeline</h3>
                        <p className="text-[#6B7280] font-medium mb-8 max-w-sm mx-auto">
                            Track and manage your revenue pipeline as soon as leads start replying to your campaigns.
                        </p>
                        <button
                            onClick={() => onPageChange?.('Lead Database')}
                            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                        >
                            View Lead Database
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar-horizontal">
                    <div className="flex gap-4 h-full min-w-max">
                        {STAGES.map(stage => (
                            <PipelineColumn
                                key={stage}
                                title={stage}
                                deals={pipelineData[stage]}
                                accentColor={
                                    stage === 'Won' ? 'border-t-green-600' :
                                        stage === 'Lost' ? 'border-t-red-300' :
                                            stage === 'Proposal Sent' ? 'border-t-purple-400' :
                                                stage === 'Meeting Booked' ? 'border-t-amber-400' :
                                                    stage === 'Contacted' ? 'border-t-blue-400' :
                                                        'border-t-gray-300'
                                }
                                totalValue={calculateTotal(pipelineData[stage])}
                                count={pipelineData[stage].length}
                                onDelete={handleDeleteDeal}
                                onClick={(deal) => { setSelectedDeal(deal); setIsDetailModalOpen(true); }}
                                onDragStart={handleDragStart}
                                onDrop={handleDrop}
                                onAddClick={(s) => { setNewDealStage(s); setIsAddModalOpen(true); }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Add Deal Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#111827]">Add New Deal</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-[#6B7280] uppercase tracking-widest mb-2">Select Lead</label>
                                <select
                                    className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={newDealLead}
                                    onChange={(e) => setNewDealLead(e.target.value)}
                                >
                                    <option value="">Choose a lead...</option>
                                    {leads.map(lead => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.company} ({lead.first_name} {lead.last_name})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#6B7280] uppercase tracking-widest mb-2">Deal Value (£)</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={newDealValue}
                                    onChange={(e) => setNewDealValue(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-[#6B7280] uppercase tracking-widest mb-2">Initial Stage</label>
                                <select
                                    className="w-full p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={newDealStage}
                                    onChange={(e) => setNewDealStage(e.target.value)}
                                >
                                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 px-6 py-3 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#6B7280] hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddDeal}
                                disabled={isSaving || !newDealLead || !newDealValue}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Add Deal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deal Detail Modal */}
            {isDetailModalOpen && selectedDeal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#111827]">Deal Details</h3>
                            <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-[#111827]">{selectedDeal.leads?.company}</p>
                                    <p className="text-xs font-bold text-[#6B7280]">{selectedDeal.leads?.first_name} {selectedDeal.leads?.last_name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100">
                                    <Mail size={16} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Email Address</p>
                                        <p className="text-sm font-bold text-[#111827]">{selectedDeal.leads?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100">
                                    <Phone size={16} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Phone Number</p>
                                        <p className="text-sm font-bold text-[#111827]">{selectedDeal.leads?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100">
                                    <Briefcase size={16} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Industry</p>
                                        <p className="text-sm font-bold text-[#111827]">{selectedDeal.leads?.industry || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-xl border border-gray-100">
                                    <Star size={16} className="text-primary" />
                                    <div>
                                        <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Deal Value</p>
                                        <p className="text-sm font-black text-[#111827]">£{Number(selectedDeal.value || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50">
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                className="w-full px-6 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm font-black text-[#111827] hover:bg-gray-100 transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;
