import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Loader2,
    X,
    Trash2,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    DollarSign,
    CheckCircle,
    Trophy,
    Info,
    Mail,
    Phone,
    Calendar,
    FileText,
    MessageSquare,
    PhoneCall,
    Send,
    ArrowRight,
    Target,
    User,
    AlertTriangle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type DealSource = 'google_maps' | 'linkedin' | 'manual';
type LostReason = 'too_expensive' | 'competitor' | 'no_budget' | 'bad_timing' | 'no_response' | 'other';

interface Deal {
    id: string;
    title: string;
    value: number;
    currency: string;
    stage: string;
    notes: string;
    user_id: string;
    created_at: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    next_action?: string;
    next_action_date?: string;
    stage_entered_at?: string;
    probability?: number;
    source?: DealSource;
    lost_reason?: LostReason;
}

interface ActivityItem {
    id: string;
    deal_id: string;
    type: 'email_sent' | 'reply_received' | 'call_made' | 'stage_change' | 'note_added';
    text: string;
    created_at: string;
}

// Helper functions
const getDaysInStage = (stageEnteredAt?: string): number => {
    if (!stageEnteredAt) return 0;
    return Math.floor((new Date().getTime() - new Date(stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24));
};

const getDaysUntilAction = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getAgeBadge = (days: number) => {
    if (days <= 3) return { label: `${days}d`, className: 'text-[#9CA3AF] bg-gray-100' };
    if (days <= 7) return { label: `${days}d`, className: 'text-amber-600 bg-amber-50' };
    return { label: `${days}d`, className: 'text-red-500 bg-red-50' };
};

const getActionBadge = (daysUntil: number | null) => {
    if (daysUntil === null) return null;
    if (daysUntil < 0) return { label: 'Overdue', className: 'text-red-500 bg-red-50' };
    if (daysUntil === 0) return { label: 'Today', className: 'text-amber-600 bg-amber-50' };
    if (daysUntil === 1) return { label: 'Tomorrow', className: 'text-amber-500 bg-amber-50' };
    return { label: `In ${daysUntil}d`, className: 'text-[#6B7280] bg-gray-100' };
};

const sourceConfig: Record<DealSource, { label: string; className: string }> = {
    google_maps: { label: 'Google Maps', className: 'text-emerald-600 bg-emerald-50' },
    linkedin: { label: 'LinkedIn', className: 'text-blue-600 bg-blue-50' },
    manual: { label: 'Manual', className: 'text-[#6B7280] bg-gray-100' },
};

const lostReasons: { value: LostReason; label: string }[] = [
    { value: 'too_expensive', label: 'Too expensive' },
    { value: 'competitor', label: 'Went with competitor' },
    { value: 'no_budget', label: 'No budget' },
    { value: 'bad_timing', label: 'Bad timing' },
    { value: 'no_response', label: 'No response' },
    { value: 'other', label: 'Other' },
];

// StageDropdown component
interface StageDropdownProps {
    stages: { id: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
}

const StageDropdown: React.FC<StageDropdownProps> = ({ stages, value, onChange }) => {
    const [open, setOpen] = useState(false);
    const selected = stages.find(s => s.id === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            >
                <span>{selected?.label || 'Select stage'}</span>
                <ChevronRight size={16} className={`text-[#9CA3AF] transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
                    {stages.map(stage => (
                        <button
                            key={stage.id}
                            type="button"
                            onClick={() => { onChange(stage.id); setOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left ${stage.id === value ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold' : 'text-[#374151] hover:bg-gray-50 font-medium'}`}
                        >
                            {stage.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// SourceDropdown component
interface SourceDropdownProps {
    value: DealSource;
    onChange: (val: DealSource) => void;
}

const SourceDropdown: React.FC<SourceDropdownProps> = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const options: { id: DealSource; label: string }[] = [
        { id: 'google_maps', label: 'Google Maps' },
        { id: 'linkedin', label: 'LinkedIn' },
        { id: 'manual', label: 'Manual' },
    ];
    const selected = options.find(o => o.id === value);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            >
                <span>{selected?.label || 'Select source'}</span>
                <ChevronRight size={16} className={`text-[#9CA3AF] transition-transform ${open ? 'rotate-90' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden">
                    {options.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => { onChange(opt.id); setOpen(false); }}
                            className={`w-full px-3 py-2 text-sm text-left ${opt.id === value ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold' : 'text-[#374151] hover:bg-gray-50 font-medium'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// LostReasonModal component
interface LostReasonModalProps {
    onConfirm: (reason: LostReason) => void;
    onCancel: () => void;
}

const LostReasonModal: React.FC<LostReasonModalProps> = ({ onConfirm, onCancel }) => {
    const [selected, setSelected] = useState<LostReason | null>(null);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl">
                <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertTriangle size={16} className="text-red-500" />
                        </div>
                        <h3 className="text-base font-semibold text-[#111827]">Mark as lost</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 space-y-3">
                    <p className="text-xs text-[#6B7280]">Why was this deal lost? This helps you improve future outreach.</p>
                    <div className="space-y-2">
                        {lostReasons.map(reason => (
                            <button
                                key={reason.value}
                                type="button"
                                onClick={() => setSelected(reason.value)}
                                className={`w-full px-3 py-2 border rounded-lg text-sm text-left transition-all ${selected === reason.value ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}
                            >
                                {reason.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 flex gap-3 border-t border-[#E5E7EB]">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selected && onConfirm(selected)}
                        disabled={!selected}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm lost
                    </button>
                </div>
            </div>
        </div>
    );
};

// DealDrawer component
interface DealDrawerProps {
    deal: Deal;
    stages: { id: string; label: string; color: string }[];
    activity: ActivityItem[];
    onClose: () => void;
    onSave: (updates: Partial<Deal>) => Promise<void>;
    onDelete: (id: string) => void;
}

const DealDrawer: React.FC<DealDrawerProps> = ({ deal, stages, activity, onClose, onSave, onDelete }) => {
    const [notes, setNotes] = useState(deal.notes || '');
    const [nextAction, setNextAction] = useState(deal.next_action || '');
    const [nextActionDate, setNextActionDate] = useState(deal.next_action_date || '');
    const [probability, setProbability] = useState(deal.probability ?? 50);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState(deal.title || '');
    const [value, setValue] = useState(String(deal.value || ''));
    const [contactName, setContactName] = useState(deal.contact_name || '');
    const [contactEmail, setContactEmail] = useState(deal.contact_email || '');
    const [contactPhone, setContactPhone] = useState(deal.contact_phone || '');

    const handleSave = async () => {
        setSaving(true);
        await onSave({
            notes,
            next_action: nextAction,
            next_action_date: nextActionDate,
            probability,
            title,
            value: parseFloat(value) || 0,
            contact_name: contactName,
            contact_email: contactEmail,
            contact_phone: contactPhone,
        });
        setSaving(false);
    };

    const ageBadge = getAgeBadge(getDaysInStage(deal.stage_entered_at));
    const lostReasonLabel = deal.lost_reason ? lostReasons.find(r => r.value === deal.lost_reason)?.label : null;

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const getActivityIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'email_sent': return <Send size={11} className="text-blue-500" />;
            case 'reply_received': return <MessageSquare size={11} className="text-emerald-500" />;
            case 'call_made': return <PhoneCall size={11} className="text-amber-500" />;
            case 'stage_change': return <ArrowRight size={11} className="text-purple-500" />;
            case 'note_added': return <FileText size={11} className="text-gray-500" />;
        }
    };

    const getActivityLabel = (type: ActivityItem['type']) => {
        switch (type) {
            case 'email_sent': return 'Email sent';
            case 'reply_received': return 'Reply received';
            case 'call_made': return 'Call made';
            case 'stage_change': return 'Stage changed';
            case 'note_added': return 'Note added';
        }
    };

    const hasContact = deal.contact_name || deal.contact_email || deal.contact_phone;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-[440px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#E5E7EB] shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-semibold text-[#111827] truncate">{deal.title}</h2>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ageBadge.className}`}>
                                    {ageBadge.label}
                                </span>
                                {deal.source && (
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${sourceConfig[deal.source].className}`}>
                                        {sourceConfig[deal.source].label}
                                    </span>
                                )}
                                {lostReasonLabel && (
                                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-red-500 bg-red-50">
                                        {lostReasonLabel}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                                onClick={() => onDelete(deal.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {/* Deal Details */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Deal Details</p>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Deal title</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Value (£)</label>
                                    <input
                                        type="number"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Contact name</label>
                                <input
                                    type="text"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Email</label>
                                    <input
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Phone</label>
                                    <input
                                        type="tel"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Value + Probability */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-3">
                            <p className="text-xs font-medium text-[#6B7280]">Deal value</p>
                            <p className="text-xl font-bold text-[#111827]">£{Number(deal.value || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3">
                            <p className="text-xs font-medium text-[#6B7280]">Win probability</p>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={probability}
                                    onChange={(e) => setProbability(Number(e.target.value))}
                                    className="flex-1 accent-[#4F46E5]"
                                />
                                <span className="text-sm font-semibold text-[#4F46E5] w-10 text-right">{probability}%</span>
                            </div>
                            <p className="text-[10px] text-[#9CA3AF] mt-1">Weighted: £{Math.round((deal.value || 0) * probability / 100).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Contact */}
                    {hasContact && (
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Contact</p>
                            <div className="space-y-2">
                                {deal.contact_name && (
                                    <div className="flex items-center gap-2">
                                        <User size={13} className="text-[#9CA3AF]" />
                                        <span className="text-sm text-[#374151]">{deal.contact_name}</span>
                                    </div>
                                )}
                                {deal.contact_email && (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Mail size={13} className="text-[#9CA3AF] shrink-0" />
                                        <a href={`mailto:${deal.contact_email}`} className="text-sm text-[#4F46E5] hover:underline truncate">
                                            {deal.contact_email}
                                        </a>
                                    </div>
                                )}
                                {deal.contact_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={13} className="text-[#9CA3AF]" />
                                        <a href={`tel:${deal.contact_phone}`} className="text-sm text-[#374151] hover:text-[#4F46E5]">
                                            {deal.contact_phone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Next Action */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Next action</p>
                        <input
                            type="text"
                            placeholder="e.g. Follow up call"
                            value={nextAction}
                            onChange={(e) => setNextAction(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent mb-2"
                        />
                        <input
                            type="date"
                            value={nextActionDate}
                            onChange={(e) => setNextActionDate(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                        />
                    </div>

                    {/* Notes */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Notes</p>
                        <textarea
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add notes..."
                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Activity timeline</p>
                        {activity.length === 0 ? (
                            <p className="text-xs text-[#9CA3AF] text-center py-3">No activity yet</p>
                        ) : (
                            <div className="space-y-3">
                                {activity.map(item => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gray-50 border border-[#E5E7EB] flex items-center justify-center shrink-0 mt-0.5">
                                            {getActivityIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-[#374151]">{getActivityLabel(item.type)}</p>
                                            <p className="text-xs text-[#9CA3AF] truncate">{item.text}</p>
                                        </div>
                                        <span className="text-[10px] text-[#9CA3AF] shrink-0">{formatDate(item.created_at)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[#E5E7EB] shrink-0">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium py-2.5 hover:bg-[#4338CA] disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main DealPipeline component
interface DealPipelineProps { }

const DealPipeline: React.FC<DealPipelineProps> = () => {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [dealActivity, setDealActivity] = useState<ActivityItem[]>([]);
    const [lostReasonDeal, setLostReasonDeal] = useState<{ deal: Deal; targetStage: string } | null>(null);

    // Add modal form state
    const [newDealTitle, setNewDealTitle] = useState('');
    const [newDealValue, setNewDealValue] = useState('');
    const [newDealStage, setNewDealStage] = useState('new_reply');
    const [newDealNotes, setNewDealNotes] = useState('');
    const [newDealContact, setNewDealContact] = useState('');
    const [newDealEmail, setNewDealEmail] = useState('');
    const [newDealPhone, setNewDealPhone] = useState('');
    const [newDealSource, setNewDealSource] = useState<DealSource>('google_maps');
    const [newDealNextAction, setNewDealNextAction] = useState('');
    const [newDealNextActionDate, setNewDealNextActionDate] = useState('');
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

    const loadActivity = async (dealId: string) => {
        try {
            const { data, error } = await supabase
                .from('deal_activity')
                .select('*')
                .eq('deal_id', dealId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDealActivity(data || []);
        } catch (err) {
            console.error('Error loading activity:', err);
            setDealActivity([]);
        }
    };

    const openDeal = async (deal: Deal) => {
        setSelectedDeal(deal);
        await loadActivity(deal.id);
    };

    useEffect(() => {
        loadDeals();
    }, []);

    // Stats
    const totalPipelineValue = useMemo(() => {
        return deals
            .filter(d => d.stage !== 'lost')
            .reduce((sum, d) => sum + (d.value || 0), 0);
    }, [deals]);

    const wonDeals = useMemo(() => deals.filter(d => d.stage === 'won'), [deals]);
    const wonValue = useMemo(() => wonDeals.reduce((sum, d) => sum + (d.value || 0), 0), [wonDeals]);

    const weightedPipeline = useMemo(() => {
        return deals
            .filter(d => d.stage !== 'lost' && d.stage !== 'won')
            .reduce((sum, d) => sum + Math.round((d.value || 0) * ((d.probability ?? 50) / 100)), 0);
    }, [deals]);

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
                    notes: newDealNotes.trim(),
                    contact_name: newDealContact.trim() || null,
                    contact_email: newDealEmail.trim() || null,
                    contact_phone: newDealPhone.trim() || null,
                    source: newDealSource,
                    next_action: newDealNextAction.trim() || null,
                    next_action_date: newDealNextActionDate || null,
                    probability: 20,
                    stage_entered_at: new Date().toISOString()
                });

            if (error) throw error;

            setNewDealTitle('');
            setNewDealValue('');
            setNewDealStage('new_reply');
            setNewDealNotes('');
            setNewDealContact('');
            setNewDealEmail('');
            setNewDealPhone('');
            setNewDealSource('google_maps');
            setNewDealNextAction('');
            setNewDealNextActionDate('');
            setShowAddModal(false);
            loadDeals();
        } catch (err) {
            console.error('Error adding deal:', err);
            alert('Failed to add deal.');
        } finally {
            setSaving(false);
        }
    };

    const applyStageUpdate = async (dealId: string, newStage: string, lostReason?: LostReason) => {
        try {
            const { error } = await supabase
                .from('deals')
                .update({
                    stage: newStage,
                    stage_entered_at: new Date().toISOString(),
                    ...(lostReason && { lost_reason: lostReason })
                })
                .eq('id', dealId);

            if (error) throw error;

            setDeals(prev => prev.map(d =>
                d.id === dealId ? { ...d, stage: newStage, stage_entered_at: new Date().toISOString(), ...(lostReason && { lost_reason: lostReason }) } : d
            ));

            if (selectedDeal?.id === dealId) {
                setSelectedDeal(prev => prev ? { ...prev, stage: newStage, stage_entered_at: new Date().toISOString(), ...(lostReason && { lost_reason: lostReason }) } : null);
            }
        } catch (err) {
            console.error('Error updating deal stage:', err);
        }
    };

    const updateDealStage = async (dealId: string, newStage: string) => {
        const deal = deals.find(d => d.id === dealId);
        if (deal && newStage === 'lost' && deal.stage !== 'lost') {
            setLostReasonDeal({ deal, targetStage: newStage });
        } else {
            await applyStageUpdate(dealId, newStage);
        }
    };

    const handleLostConfirm = (reason: LostReason) => {
        if (lostReasonDeal) {
            applyStageUpdate(lostReasonDeal.deal.id, lostReasonDeal.targetStage, reason);
            setLostReasonDeal(null);
        }
    };

    const saveDealUpdates = async (updates: Partial<Deal>) => {
        if (!selectedDeal) return;

        try {
            const { error } = await supabase
                .from('deals')
                .update(updates)
                .eq('id', selectedDeal.id);

            if (error) throw error;

            setDeals(prev => prev.map(d =>
                d.id === selectedDeal.id ? { ...d, ...updates } : d
            ));

            setSelectedDeal(prev => prev ? { ...prev, ...updates } : null);
        } catch (err) {
            console.error('Error saving deal:', err);
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

            if (selectedDeal?.id === dealId) {
                setSelectedDeal(null);
            }
        } catch (err) {
            console.error('Error deleting deal:', err);
        }
    };

    const moveStage = (deal: Deal, direction: 'left' | 'right') => {
        const currentIndex = stages.findIndex(s => s.id === deal.stage);
        if (direction === 'left' && currentIndex > 0) {
            updateDealStage(deal.id, stages[currentIndex - 1].id);
        } else if (direction === 'right' && currentIndex < stages.length - 1) {
            updateDealStage(deal.id, stages[currentIndex + 1].id);
        }
    };

    const getStageTopBorder = (color: string) => {
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
            <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-[#9CA3AF]">Total deals</p>
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <TrendingUp size={16} className="text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">{deals.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-[#9CA3AF]">Total pipeline</p>
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                            <DollarSign size={16} className="text-rose-500" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">£{totalPipelineValue.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-[#9CA3AF]">Weighted pipeline</p>
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                            <Target size={16} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">£{weightedPipeline.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-[#9CA3AF]">Won deals</p>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CheckCircle size={16} className="text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">{wonDeals.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-[#9CA3AF]">Won value</p>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Trophy size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#111827]">£{wonValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Page Actions */}
            <div className="flex items-center justify-end mb-6">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg px-4 py-2 transition-all text-sm"
                >
                    <Plus size={18} />
                    Add deal
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
                                className={`flex-shrink-0 w-64 bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden border-t-4 ${getStageTopBorder(stage.color)}`}
                            >
                                {/* Column Header */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#111827]">
                                            {stage.label}
                                        </span>
                                        <span className="bg-gray-100 text-[#6B7280] text-xs font-medium px-2 py-0.5 rounded-full">
                                            {stageDeals.length}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#9CA3AF] mt-0.5">£{stageValue.toLocaleString()}</p>
                                </div>

                                {/* Column Body */}
                                <div className="min-h-96 p-3 space-y-2">
                                    {stageDeals.length === 0 ? (
                                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-6 text-center">
                                            <Plus className="w-5 h-5 text-gray-300 mx-auto" />
                                            <p className="text-xs text-[#9CA3AF] mt-2">No deals yet</p>
                                        </div>
                                    ) : (
                                        stageDeals.map(deal => {
                                            const ageBadge = getAgeBadge(getDaysInStage(deal.stage_entered_at));
                                            const actionBadge = getActionBadge(getDaysUntilAction(deal.next_action_date));

                                            return (
                                                <div
                                                    key={deal.id}
                                                    onClick={() => openDeal(deal)}
                                                    className="bg-white border border-[#E5E7EB] rounded-xl p-3 hover:shadow-md hover:border-[#4F46E5] transition-all duration-200 cursor-pointer group"
                                                >
                                                    {/* Title + Age Badge */}
                                                    <div className="flex items-start justify-between gap-1 mb-2">
                                                        <h4 className="text-sm font-medium text-[#111827] line-clamp-1 flex-1">{deal.title}</h4>
                                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${ageBadge.className}`}>
                                                            {ageBadge.label}
                                                        </span>
                                                    </div>

                                                    {/* Value */}
                                                    <p className="text-base font-bold text-[#111827] mb-2">
                                                        £{Number(deal.value || 0).toLocaleString()}
                                                    </p>

                                                    {/* Contact Name */}
                                                    {deal.contact_name && (
                                                        <div className="flex items-center gap-1.5 mb-1.5">
                                                            <User size={11} className="text-[#9CA3AF]" />
                                                            <span className="text-xs text-[#6B7280] truncate">{deal.contact_name}</span>
                                                        </div>
                                                    )}

                                                    {/* Next Action */}
                                                    {deal.next_action && (
                                                        <div className="flex items-start gap-1.5 mb-1.5">
                                                            <Calendar size={11} className="text-[#9CA3AF] shrink-0 mt-0.5" />
                                                            <span className="text-xs text-[#6B7280] line-clamp-1 flex-1">{deal.next_action}</span>
                                                            {actionBadge && (
                                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${actionBadge.className}`}>
                                                                    {actionBadge.label}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Source Tag */}
                                                    {deal.source && (
                                                        <div className="mb-2">
                                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${sourceConfig[deal.source].className}`}>
                                                                {sourceConfig[deal.source].label}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Move Controls */}
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); moveStage(deal, 'left'); }}
                                                            disabled={stages.findIndex(s => s.id === deal.stage) === 0}
                                                            className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#4F46E5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronLeft size={16} />
                                                        </button>
                                                        <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wide">Move</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); moveStage(deal, 'right'); }}
                                                            disabled={stages.findIndex(s => s.id === deal.stage) === stages.length - 1}
                                                            className="p-1 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-[#4F46E5] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Info Banner */}
            <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mt-6">
                <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-[#374151] leading-relaxed">Deals are automatically created when leads reply to your outreach sequences. Move deals through stages as you progress each conversation towards a close.</p>
            </div>

            {/* Add Deal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                                    <TrendingUp size={20} className="text-[#4F46E5]" />
                                </div>
                                <h3 className="text-base font-semibold text-[#111827]">Add new deal</h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Deal title / Company</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="e.g. Acme Corp Contract"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    value={newDealTitle}
                                    onChange={(e) => setNewDealTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Value (£)</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        value={newDealValue}
                                        onChange={(e) => setNewDealValue(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Stage</label>
                                    <StageDropdown
                                        stages={stages}
                                        value={newDealStage}
                                        onChange={setNewDealStage}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Contact name</label>
                                <input
                                    type="text"
                                    placeholder="John Smith"
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    value={newDealContact}
                                    onChange={(e) => setNewDealContact(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        value={newDealEmail}
                                        onChange={(e) => setNewDealEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+44 7700 900000"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        value={newDealPhone}
                                        onChange={(e) => setNewDealPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Deal source</label>
                                <SourceDropdown
                                    value={newDealSource}
                                    onChange={setNewDealSource}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Next action</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Follow up call"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        value={newDealNextAction}
                                        onChange={(e) => setNewDealNextAction(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Due date</label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        value={newDealNextActionDate}
                                        onChange={(e) => setNewDealNextActionDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-1.5">Notes (optional)</label>
                                <textarea
                                    placeholder="Add any extra details here..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                                    value={newDealNotes}
                                    onChange={(e) => setNewDealNotes(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3 border-t border-[#E5E7EB]">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2.5 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addDeal}
                                disabled={saving || !newDealTitle.trim()}
                                className="flex-1 px-4 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Create deal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deal Drawer */}
            {selectedDeal && (
                <DealDrawer
                    deal={selectedDeal}
                    stages={stages}
                    activity={dealActivity}
                    onClose={() => setSelectedDeal(null)}
                    onSave={saveDealUpdates}
                    onDelete={deleteDeal}
                />
            )}

            {/* Lost Reason Modal */}
            {lostReasonDeal && (
                <LostReasonModal
                    onConfirm={handleLostConfirm}
                    onCancel={() => setLostReasonDeal(null)}
                />
            )}
        </div>
    );
};

export default DealPipeline;
