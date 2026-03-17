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

    const [newDealTitle, setNewDealTitle] = useState('');
    const [newDealValue, setNewDealValue] = useState('');
    const [newDealStage, setNewDealStage] = useState('new_reply');
    const [newDealNotes, setNewDealNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const stages = [
        { id: 'new_reply', label: '💬 New Reply', color: 'cyan' },
        { id: 'qualified', label: '⭐ Qualified', color: 'purple' },
        { id: 'proposal_sent', label: '📄 Proposal Sent', color: 'amber' },
        { id: 'negotiating', label: '🤝 Negotiating', color: 'orange' },
        { id: 'won', label: '🎉 Won', color: 'emerald' },
        { id: 'lost', label: '❌ Lost', color: 'rose' }
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

    const wonDeals = useMemo(() => deals.filter(d => d.stage === 'won'), [deals]);
    const wonValue = useMemo(() => wonDeals.reduce((sum, d) => sum + (d.value || 0), 0), [wonDeals]);

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
            case 'cyan': return 'border-t-cyan-400';
            case 'purple': return 'border-t-purple-400';
            case 'amber': return 'border-t-amber-400';
            case 'orange': return 'border-t-orange-400';
            case 'emerald': return 'border-t-emerald-400';
            case 'rose': return 'border-t-rose-400';
            default: return 'border-t-gray-400';
        }
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-xs font-medium text-[#9CA3AF] mb-1">Total deals</p>
                    <p className="text-2xl font-bold text-[#111827]">{deals.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-xs font-medium text-[#9CA3AF] mb-1">Total pipeline</p>
                    <p className="text-2xl font-bold text-[#4F46E5]">£{totalPipelineValue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-xs font-medium text-[#9CA3AF] mb-1">Won deals</p>
                    <p className="text-2xl font-bold text-emerald-600">{wonDeals.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <p className="text-xs font-medium text-[#9CA3AF] mb-1">Won value</p>
                    <p className="text-2xl font-bold text-emerald-600">£{wonValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Page Actions */}
            <div className="flex items-center justify-end mb-6">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg px-4 py-2 transition-all"
                >
                    <Plus size={18} />
                    Add Deal
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {stages.map(stage => {
                        const stageDeals = deals.filter(d => d.stage === stage.id);
                        const stageValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

                        return (
                            <div
                                key={stage.id}
                                className={`flex-shrink-0 w-64 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden border-t-4 ${getStageColor(stage.color)}`}
                            >
                                {/* Column Header */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#111827]">
                                            {stage.label}
                                        </span>
                                        <span className="bg-gray-100 text-[#6B7280] text-xs font-bold px-2 py-0.5 rounded-full">
                                            {stageDeals.length}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">£{stageValue.toLocaleString()}</p>
                                </div>

                                {/* Column Body */}
                                <div className="min-h-96 p-3 space-y-2">
                                    {stageDeals.length === 0 ? (
                                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center">
                                            <Plus className="w-5 h-5 text-gray-300 mx-auto" />
                                            <p className="text-xs text-gray-400 mt-2">No deals yet</p>
                                        </div>
                                    ) : (
                                        stageDeals.map(deal => (
                                            <div
                                                key={deal.id}
                                                className="bg-white border border-[#E5E7EB] rounded-xl p-3 hover:shadow-md hover:border-[#4F46E5] transition-all duration-200 cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="text-sm font-medium text-[#111827] line-clamp-1">{deal.title}</h4>
                                                    <button
                                                        onClick={() => deleteDeal(deal.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-bold text-[#111827] mb-2">
                                                    £{Number(deal.value || 0).toLocaleString()}
                                                </p>
                                                {deal.notes && (
                                                    <p className="text-xs text-[#6B7280] line-clamp-2 mb-3">
                                                        {deal.notes}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                    <button
                                                        onClick={() => moveStage(deal, 'left')}
                                                        disabled={stages.findIndex(s => s.id === deal.stage) === 0}
                                                        className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#4F46E5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronLeft size={16} />
                                                    </button>
                                                    <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wide">Move</span>
                                                    <button
                                                        onClick={() => moveStage(deal, 'right')}
                                                        disabled={stages.findIndex(s => s.id === deal.stage) === stages.length - 1}
                                                        className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#4F46E5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Deal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                                    <TrendingUp size={20} className="text-[#4F46E5]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[#111827]">Add New Deal</h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#111827] mb-1.5">Deal Title / Company</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Acme Corp Contract"
                                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                                    value={newDealTitle}
                                    onChange={(e) => setNewDealTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Value (£)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                                        value={newDealValue}
                                        onChange={(e) => setNewDealValue(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#111827] mb-1.5">Stage</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all appearance-none"
                                        value={newDealStage}
                                        onChange={(e) => setNewDealStage(e.target.value)}
                                    >
                                        {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#111827] mb-1.5">Notes (Optional)</label>
                                <textarea
                                    placeholder="Add any extra details here..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all resize-none"
                                    value={newDealNotes}
                                    onChange={(e) => setNewDealNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3 border-t border-[#E5E7EB]">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6B7280] hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addDeal}
                                disabled={saving || !newDealTitle.trim()}
                                className="flex-1 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Create Deal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DealPipeline;
