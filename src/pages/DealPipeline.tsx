import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Loader2,
    X,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Deal {
    id: string;
    title: string;
    value: number;
    currency: string;
    stage: string;
    notes: string;
    user_id: string;
    created_at: string;
}

interface DealPipelineProps { }

const DealPipeline: React.FC<DealPipelineProps> = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Deal Form State
    const [newDealTitle, setNewDealTitle] = useState('');
    const [newDealValue, setNewDealValue] = useState('');
    const [newDealStage, setNewDealStage] = useState('new_reply');
    const [newDealNotes, setNewDealNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const stages = [
        { id: 'new_reply', label: 'New Reply', color: 'blue' },
        { id: 'qualified', label: 'Qualified', color: 'purple' },
        { id: 'proposal_sent', label: 'Proposal Sent', color: 'yellow' },
        { id: 'negotiating', label: 'Negotiating', color: 'orange' },
        { id: 'won', label: 'Won', color: 'green' },
        { id: 'lost', label: 'Lost', color: 'red' }
    ];

    const loadDeals = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('deals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setDeals(data);
        } catch (err) {
            console.error('Error loading deals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDeals();
    }, []);

    const addDeal = async () => {
        if (!newDealTitle.trim()) {
            alert('Please enter a deal title.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('deals')
                .insert({
                    user_id: user.id,
                    title: newDealTitle.trim(),
                    value: parseFloat(newDealValue) || 0,
                    currency: '£',
                    stage: newDealStage,
                    notes: newDealNotes.trim()
                });

            if (error) throw error;

            setNewDealTitle('');
            setNewDealValue('');
            setNewDealStage('new_reply');
            setNewDealNotes('');
            setShowAddModal(false);
            loadDeals();
        } catch (err) {
            console.error('Error adding deal:', err);
            alert('Failed to add deal.');
        } finally {
            setSaving(false);
        }
    };

    const updateDealStage = async (dealId: string, newStage: string) => {
        try {
            const { error } = await supabase
                .from('deals')
                .update({ stage: newStage })
                .eq('id', dealId);

            if (error) throw error;

            setDeals(prev => prev.map(d =>
                d.id === dealId ? { ...d, stage: newStage } : d
            ));
        } catch (err) {
            console.error('Error updating deal:', err);
        }
    };

    const deleteDeal = async (dealId: string) => {
        if (!confirm('Delete this deal?')) return;

        try {
            const { error } = await supabase
                .from('deals')
                .delete()
                .eq('id', dealId);

            if (error) throw error;
            setDeals(prev => prev.filter(d => d.id !== dealId));
        } catch (err) {
            console.error('Error deleting deal:', err);
        }
    };

    const totalPipelineValue = useMemo(() => {
        return deals
            .filter(d => d.stage !== 'lost')
            .reduce((sum, d) => sum + (d.value || 0), 0);
    }, [deals]);

    const moveStage = (deal: Deal, direction: 'left' | 'right') => {
        const currentIndex = stages.findIndex(s => s.id === deal.stage);
        if (direction === 'left' && currentIndex > 0) {
            updateDealStage(deal.id, stages[currentIndex - 1].id);
        } else if (direction === 'right' && currentIndex < stages.length - 1) {
            updateDealStage(deal.id, stages[currentIndex + 1].id);
        }
    };

    const getStageColor = (color: string) => {
        switch (color) {
            case 'blue': return 'border-t-4 border-t-blue-400';
            case 'purple': return 'border-t-4 border-t-indigo-400';
            case 'yellow': return 'border-t-4 border-t-amber-400';
            case 'orange': return 'border-t-4 border-t-orange-400';
            case 'green': return 'border-t-4 border-t-emerald-400';
            case 'red': return 'border-t-4 border-t-red-400';
            default: return 'border-t-4 border-t-slate-400';
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-700 bg-[#F8FAFC] min-h-full -m-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">Deal Pipeline</h1>
                    <p className="text-sm text-slate-500">Manage your revenue pipeline from reply to won</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total Pipeline Value</p>
                        <p className="text-2xl font-bold text-indigo-600">£{totalPipelineValue.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        <Plus size={18} />
                        Add Deal
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar-horizontal">
                    <div className="flex gap-4 h-full min-w-max pb-4">
                        {stages.map(stage => {
                            const stageDeals = deals.filter(d => d.stage === stage.id);
                            const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

                            return (
                                <div key={stage.id} className={`w-[280px] flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${getStageColor(stage.color)}`}>
                                    <div className="bg-slate-50 rounded-t-2xl px-4 py-3 border-b border-slate-200">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{stage.label}</h3>
                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">{stageDeals.length}</span>
                                        </div>
                                        <p className="text-xs text-slate-500">£{stageValue.toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {stageDeals.map(deal => (
                                            <div key={deal.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-sm font-semibold text-slate-700 line-clamp-1">{deal.title}</h4>
                                                    <button onClick={() => deleteDeal(deal.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 mb-2">£{Number(deal.value || 0).toLocaleString()}</p>
                                                {deal.notes && (
                                                    <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mb-4 italic">"{deal.notes}"</p>
                                                )}
                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                                                    <button
                                                        onClick={() => moveStage(deal, 'left')}
                                                        disabled={stages.findIndex(s => s.id === deal.stage) === 0}
                                                        className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-0"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <span className="text-[9px] font-semibold text-slate-300 uppercase tracking-wide">Move</span>
                                                    <button
                                                        onClick={() => moveStage(deal, 'right')}
                                                        disabled={stages.findIndex(s => s.id === deal.stage) === stages.length - 1}
                                                        className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-0"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {stageDeals.length === 0 && (
                                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                                                <Plus size={20} className="mx-auto text-slate-300 mb-2" />
                                                <p className="text-sm text-slate-400">No deals yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}


            {/* Add Deal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary text-white rounded-lg shadow-sm">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-lg font-black text-[#111827]">New Pipeline Opportunity</h3>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Deal Title / Company</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Acme Corp Contract"
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-inter"
                                    value={newDealTitle}
                                    onChange={(e) => setNewDealTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Value (£)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        value={newDealValue}
                                        onChange={(e) => setNewDealValue(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Stage</label>
                                    <select
                                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                                        value={newDealStage}
                                        onChange={(e) => setNewDealStage(e.target.value)}
                                    >
                                        {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-2">Notes / Context</label>
                                <textarea
                                    placeholder="Add any extra details here..."
                                    rows={3}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    value={newDealNotes}
                                    onChange={(e) => setNewDealNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-4 border border-gray-200 rounded-xl text-sm font-bold text-[#6B7280] hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addDeal}
                                disabled={saving || !newDealTitle.trim()}
                                className="flex-2 px-8 py-4 bg-primary text-white rounded-xl text-sm font-black hover:bg-[#4338CA] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                            >
                                {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                CREATE DEAL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;
