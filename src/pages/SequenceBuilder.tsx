// v2 - sequence builder with info cards
import React, { useState, useEffect } from 'react';
import {
    Clock,
    Plus,
    Trash2,
    Play,
    Pause,
    ChevronRight,
    Phone,
    GripVertical,
    Save,
    X,
    Mail,
    Linkedin,
    Layers,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';

interface Step {
    step: number;
    channel: 'email' | 'linkedin' | 'phone';
    subject: string;
    body: string;
    delay_days: number;
}

interface Sequence {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'draft';
    steps: Step[];
    created_at: string;
    user_id: string;
}

interface SequenceBuilderProps {
    onPageChange?: (page: string) => void;
}

const SequenceBuilder: React.FC<SequenceBuilderProps> = ({ onPageChange }) => {
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [upgradeModal, setUpgradeModal] = useState({ show: false, message: '' });

    // Editor State
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [isPreview, setIsPreview] = useState(false);
    const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchSequences();
    }, []);

    const fetchSequences = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('sequences')
            .select('*, sequence_enrollments(count)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching sequences:', error);
        } else {
            setSequences(data || []);
        }
        setIsLoading(false);
    };

    const handleCreateNew = () => {
        const newSequence: Partial<Sequence> = {
            name: 'New Sequence',
            status: 'draft',
            steps: [
                { step: 1, channel: 'email', subject: 'Quick question', body: '', delay_days: 0 }
            ]
        };
        setEditingSequence(newSequence as Sequence);
        setActiveStepIndex(0);
    };

    const handleSave = async () => {
        if (!editingSequence || !editingSequence.name) {
            alert('Please add a name and at least one step');
            return;
        }
        setIsSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const sequenceData = {
            user_id: user.id,
            name: editingSequence.name,
            steps: editingSequence.steps.map((s, i) => ({
                index: i,
                channel: s.channel,
                subject: s.subject,
                body: s.body,
                waitDays: s.delay_days
            })),
            status: 'active',
            updated_at: new Date().toISOString()
        };

        if (editingSequence.id) {
            const { error } = await supabase
                .from('sequences')
                .update(sequenceData)
                .eq('id', editingSequence.id);
            if (!error) console.log('Sequence updated!');
        } else {
            const { error } = await supabase
                .from('sequences')
                .insert(sequenceData);
            if (!error) console.log('Sequence saved!');
        }

        fetchSequences();
        setEditingSequence(null);
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this sequence?')) return;
        const { error } = await supabase.from('sequences').delete().eq('id', id);
        if (!error) fetchSequences();
    };

    const handleToggleStatus = async (seq: Sequence) => {
        const newStatus = seq.status === 'active' ? 'paused' : 'active';
        const { error } = await supabase
            .from('sequences')
            .update({ status: newStatus })
            .eq('id', seq.id);
        if (!error) fetchSequences();
    };

    const checkSequenceStepLimit = async (): Promise<boolean> => {
        if (!editingSequence) return false;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

        const plan = profile?.plan || 'trial';
        if (plan === 'pro') return true;

        const limits: Record<string, number> = { trial: 2, starter: 4 };
        const limit = limits[plan] || 2;

        if (editingSequence.steps.length >= limit) {
            setUpgradeModal({
                show: true,
                message: `Your ${plan} plan includes up to ${limit} sequence steps. Upgrade to Pro for unlimited steps.`,
            });
            return false;
        }
        return true;
    };

    const addStep = async (channel: 'email' | 'linkedin' | 'phone') => {
        if (!editingSequence) return;

        const canAdd = await checkSequenceStepLimit();
        if (!canAdd) return;

        const newStep: Step = {
            step: editingSequence.steps.length + 1,
            channel: channel,
            subject: channel === 'email' ? 'Follow up' : '',
            body: '',
            delay_days: 2
        };
        setEditingSequence({
            ...editingSequence,
            steps: [...editingSequence.steps, newStep]
        });
        setActiveStepIndex(editingSequence.steps.length);
    };

    const removeStep = (index: number) => {
        if (!editingSequence || editingSequence.steps.length <= 1) return;
        const newSteps = editingSequence.steps.filter((_, i) => i !== index);
        setEditingSequence({ ...editingSequence, steps: newSteps });
        setActiveStepIndex(Math.max(0, index - 1));
    };

    const updateStep = (index: number, updates: Partial<Step>) => {
        if (!editingSequence) return;
        const newSteps = editingSequence.steps.map((s, i) => i === index ? { ...s, ...updates } : s);
        setEditingSequence({ ...editingSequence, steps: newSteps });
    };

    const handleDragStart = (index: number) => setDraggedStepIndex(index);
    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDrop = (index: number) => {
        if (draggedStepIndex === null || !editingSequence) return;
        const newSteps = [...editingSequence.steps];
        const [removed] = newSteps.splice(draggedStepIndex, 1);
        newSteps.splice(index, 0, removed);
        setEditingSequence({ ...editingSequence, steps: newSteps });
        setDraggedStepIndex(null);
        setActiveStepIndex(index);
    };

    const mergeTags = [
        { label: '{{business_name}}', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: '{{first_name}}', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: '{{city}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{rating}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{website}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
    ];

    const getPreviewText = (text: string) => {
        return text
            .replace(/{{business_name}}/g, 'Wellness Spa Berlin')
            .replace(/{{first_name}}/g, 'Hans')
            .replace(/{{city}}/g, 'Berlin')
            .replace(/{{rating}}/g, '4.8');
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto w-full h-full">
            {!editingSequence ? (
                /* Sequence List View */
                <div className="animate-in fade-in duration-700 bg-[#F8FAFC] min-h-full -m-6 p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-1">Outreach Sequences</h1>
                            <p className="text-sm text-slate-500">Manage your multi-channel automation flows</p>
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <Plus size={18} />
                            New Sequence
                        </button>
                    </div>

                    {sequences.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Layers size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">No sequences yet</h3>
                            <p className="text-sm text-slate-500 mb-6">Create your first outreach sequence to start automating</p>
                            <button
                                onClick={handleCreateNew}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center gap-2"
                            >
                                <Plus size={16} />
                                New Sequence
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {sequences.map(seq => (
                                <div key={seq.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${seq.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                            {seq.status === 'active' ? <Play size={20} /> : <Pause size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900 mb-1">{seq.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span>{seq.steps?.length || 0} steps</span>
                                                <span className="text-slate-300">·</span>
                                                <span>{(seq as any).sequence_enrollments?.[0]?.count || 0} enrolled</span>
                                                <span className="text-slate-300">·</span>
                                                <span>Created {new Date(seq.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${seq.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            {seq.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                                        </span>
                                        <button
                                            onClick={() => handleToggleStatus(seq)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${seq.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                        >
                                            {seq.status === 'active' ? 'Pause' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => setEditingSequence(seq)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(seq.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Detail/Editor View */
                <div className="flex flex-col lg:flex-row gap-8 animate-in slide-in-from-right duration-500 h-full w-full">
                    {/* Left Panel: Steps list */}
                    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 lg:h-[calc(100vh-140px)]">
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 flex flex-col h-full overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={() => setEditingSequence(null)} className="text-gray-400 hover:text-[#111827]">
                                    <X size={20} />
                                </button>
                                <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-black uppercase">
                                    Editing Sequence
                                </span>
                            </div>

                            <input
                                type="text"
                                className="w-full text-lg font-black text-[#111827] mb-6 focus:outline-none placeholder:text-gray-300"
                                value={editingSequence.name}
                                onChange={(e) => setEditingSequence({ ...editingSequence, name: e.target.value })}
                                placeholder="Sequence Name"
                            />

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 relative">
                                <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-100 z-0 border-l-2 border-dashed border-gray-100"></div>

                                {editingSequence.steps.map((step, index) => (
                                    <React.Fragment key={index}>
                                        {index > 0 && (
                                            <div className="flex justify-center py-1">
                                                <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-black text-gray-400 flex items-center gap-1 z-10">
                                                    <Clock size={10} />
                                                    WAIT {step.delay_days} DAYS
                                                </div>
                                            </div>
                                        )}
                                        <div
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(index)}
                                            className={`group relative flex items-center gap-3 p-4 rounded-xl border shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing z-10 ${activeStepIndex === index ? 'bg-white border-indigo-300 ring-1 ring-indigo-300 shadow-md' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}
                                            onClick={() => setActiveStepIndex(index)}
                                        >
                                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <GripVertical size={14} className="text-slate-300" />
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${activeStepIndex === index ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className={`text-[11px] font-black truncate uppercase ${activeStepIndex === index ? 'text-primary' : 'text-[#111827]'}`}>Step {index + 1}: {step.channel}</p>
                                                <p className="text-[10px] text-gray-400 font-bold truncate">{step.subject || step.body.slice(0, 20) || 'Empty step'}</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeStep(index); }}
                                                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* Merge Tags Tip Card */}
                            <div style={{
                                background: '#F8F9FF',
                                border: '1px solid #E0E7FF',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                marginTop: '16px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px'
                            }}>
                                <span style={{ fontSize: '16px' }}>💡</span>
                                <div>
                                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '600', color: '#4F46E5' }}>
                                        Merge Tags
                                    </p>
                                    <p style={{ margin: 0, fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>
                                        Click the merge tags above the message body to personalise each email automatically with the lead's details.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                                <button onClick={() => addStep('email')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-[#6B7280] rounded-xl text-xs font-black hover:bg-blue-50 hover:text-primary transition-all">
                                    <Mail size={14} /> + EMAIL STEP
                                </button>
                                <button onClick={() => addStep('linkedin')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-[#6B7280] rounded-xl text-xs font-black hover:bg-blue-50 hover:text-primary transition-all">
                                    <Linkedin size={14} /> + LINKEDIN STEP
                                </button>
                                <button onClick={() => addStep('phone')} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-[#6B7280] rounded-xl text-xs font-black hover:bg-blue-50 hover:text-primary transition-all">
                                    <Phone size={14} /> + PHONE STEP
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Panel: Editor Canvas */}
                    <main className="flex-1 flex flex-col gap-6">
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-[700px]">
                            {/* Editor Header */}
                            <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex bg-gray-100 p-1 rounded-xl">
                                    <button onClick={() => setIsPreview(false)} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${!isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>EDITOR</button>
                                    <button onClick={() => setIsPreview(true)} className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${isPreview ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>PREVIEW</button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Sequence
                                    </button>
                                </div>
                            </div>

                            {/* Editor Body */}
                            <div className="p-8 flex-1 flex flex-col animate-in fade-in duration-300">
                                {editingSequence.steps[activeStepIndex] && (
                                    <div className="space-y-8 max-w-3xl">
                                        {editingSequence.steps[activeStepIndex].channel === 'email' && (
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Subject Line</label>
                                                <input
                                                    type="text"
                                                    className="w-full text-2xl font-black text-[#111827] focus:outline-none placeholder:text-gray-200"
                                                    value={editingSequence.steps[activeStepIndex].subject}
                                                    onChange={(e) => updateStep(activeStepIndex, { subject: e.target.value })}
                                                    placeholder="Enter subject line..."
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Message Body</label>
                                                <div className="flex gap-2">
                                                    {mergeTags.map(tag => (
                                                        <button
                                                            key={tag.label}
                                                            onClick={() => updateStep(activeStepIndex, { body: (editingSequence.steps[activeStepIndex].body || '') + ' ' + tag.label })}
                                                            className={`px-2 py-1 rounded-md text-[9px] font-bold border transition-all ${tag.color}`}
                                                        >
                                                            {tag.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            {isPreview ? (
                                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 min-h-[300px] whitespace-pre-line text-sm font-medium text-[#4B5563] leading-relaxed">
                                                    {getPreviewText(editingSequence.steps[activeStepIndex].body) || 'No content to preview'}
                                                </div>
                                            ) : (
                                                <textarea
                                                    className="w-full min-h-[300px] p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium leading-relaxed transition-all"
                                                    value={editingSequence.steps[activeStepIndex].body}
                                                    onChange={(e) => updateStep(activeStepIndex, { body: e.target.value })}
                                                    placeholder={`Write your ${editingSequence.steps[activeStepIndex].channel} message here...`}
                                                />
                                            )}
                                        </div>

                                        <div className="flex items-center gap-8 pt-6 border-t border-gray-100">
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Wait Time (Days)</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        className="w-20 p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-black text-center focus:outline-none focus:ring-2 focus:ring-primary/10"
                                                        value={editingSequence.steps[activeStepIndex].delay_days}
                                                        onChange={(e) => updateStep(activeStepIndex, { delay_days: parseInt(e.target.value) || 0 })}
                                                    />
                                                    <span className="text-xs font-bold text-gray-400">days after previous step</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Channel</label>
                                                <select
                                                    className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black focus:outline-none focus:ring-2 focus:ring-primary/10"
                                                    value={editingSequence.steps[activeStepIndex].channel}
                                                    onChange={(e) => updateStep(activeStepIndex, { channel: e.target.value as Step['channel'] })}
                                                >
                                                    <option value="email">Email</option>
                                                    <option value="linkedin">LinkedIn</option>
                                                    <option value="phone">Phone Call</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            )}

            {upgradeModal.show && (
                <UpgradePrompt
                    message={upgradeModal.message}
                    onClose={() => setUpgradeModal({ ...upgradeModal, show: false })}
                    onUpgrade={() => {
                        setUpgradeModal({ ...upgradeModal, show: false });
                        if (onPageChange) onPageChange('Pricing');
                    }}
                />
            )}
        </div>
    );
};

export default SequenceBuilder;