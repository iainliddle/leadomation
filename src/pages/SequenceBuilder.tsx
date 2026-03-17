// v2 - sequence builder with info cards
import React, { useState, useEffect } from 'react';
import {
    Clock,
    Plus,
    Trash2,
    Play,
    ChevronRight,
    GripVertical,
    Save,
    X,
    Mail,
    Linkedin,
    Loader2,
    Users,
    Calendar,
    Phone
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';

interface LinkedInEnrollment {
    id: string;
    user_id: string;
    lead_id: string;
    unipile_account_id: string;
    linkedin_url: string;
    current_phase: number;
    current_day: number;
    status: 'active' | 'paused' | 'completed' | 'failed' | 'connected';
    connected_at: string | null;
    last_action_at: string | null;
    next_action_at: string | null;
    enrolled_at: string;
    notes: string | null;
    created_at: string;
    leads?: {
        company: string;
        first_name: string;
        last_name: string;
    };
}

const LINKEDIN_PHASES = [
    { phase: 1, name: 'Silent Awareness', days: '1-10', color: 'slate', bgColor: 'bg-slate-100', textColor: 'text-slate-700', borderColor: 'border-slate-200' },
    { phase: 2, name: 'Connection', days: '12-14', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
    { phase: 3, name: 'Warm Thanks', days: '15-16', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-200' },
    { phase: 4, name: 'Advice Ask', days: '20-22', color: 'amber', bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-200' },
    { phase: 5, name: 'Follow Up', days: '25-27', color: 'orange', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-200' },
    { phase: 6, name: 'Soft Offer', days: '30-35', color: 'indigo', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-200' },
];

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

    // Tab State
    const [activeTab, setActiveTab] = useState<'email' | 'linkedin'>('email');

    // LinkedIn Enrollments State
    const [linkedinEnrollments, setLinkedinEnrollments] = useState<LinkedInEnrollment[]>([]);
    const [linkedinLoading, setLinkedinLoading] = useState(false);

    // Editor State
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [isPreview, setIsPreview] = useState(false);
    const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchSequences();
        fetchLinkedinEnrollments();
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

    const fetchLinkedinEnrollments = async () => {
        setLinkedinLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLinkedinLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('linkedin_enrollments')
            .select(`
                *,
                leads (
                    company,
                    first_name,
                    last_name
                )
            `)
            .eq('user_id', user.id)
            .order('enrolled_at', { ascending: false });

        if (error) {
            console.error('Error fetching LinkedIn enrollments:', error);
        } else {
            setLinkedinEnrollments(data || []);
        }
        setLinkedinLoading(false);
    };

    const handleToggleLinkedInStatus = async (enrollment: LinkedInEnrollment) => {
        const newStatus = enrollment.status === 'active' ? 'paused' : 'active';
        const { error } = await supabase
            .from('linkedin_enrollments')
            .update({ status: newStatus })
            .eq('id', enrollment.id);
        if (!error) fetchLinkedinEnrollments();
    };

    const handleRemoveLinkedInEnrollment = async (id: string) => {
        if (!confirm('Are you sure you want to remove this lead from the LinkedIn sequence?')) return;
        const { error } = await supabase
            .from('linkedin_enrollments')
            .delete()
            .eq('id', id);
        if (!error) fetchLinkedinEnrollments();
    };

    const getPhaseInfo = (phase: number) => {
        return LINKEDIN_PHASES.find(p => p.phase === phase) || LINKEDIN_PHASES[0];
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
            const { error } = await supabase.from('sequences').update(sequenceData).eq('id', editingSequence.id);
            if (!error) console.log('Sequence updated!');
        } else {
            const { error } = await supabase.from('sequences').insert(sequenceData);
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
        const { error } = await supabase.from('sequences').update({ status: newStatus }).eq('id', seq.id);
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
            <div className="p-6 bg-[#F8F9FA] min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {!editingSequence ? (
                /* Sequence List View */
                <div>
                    {/* Page Header */}
                    <div className="flex items-center justify-end mb-6">
                        <button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
                        >
                            <Plus size={16} />
                            New Sequence
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('email')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                                activeTab === 'email'
                                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-px'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Mail size={16} />
                            Email Sequences
                        </button>
                        <button
                            onClick={() => setActiveTab('linkedin')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                                activeTab === 'linkedin'
                                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-px'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Linkedin size={16} />
                            LinkedIn Sequences
                            {linkedinEnrollments.filter(e => e.status === 'active').length > 0 && (
                                <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#C7D2FE]">
                                    {linkedinEnrollments.filter(e => e.status === 'active').length}
                                </span>
                            )}
                        </button>
                    </div>

                    {activeTab === 'email' ? (
                        /* Email Sequences Tab */
                        <>
                            {sequences.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-[#4F46E5]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No sequences yet</h3>
                                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                                        Create your first outreach sequence to start automating your campaigns
                                    </p>
                                    <button
                                        onClick={handleCreateNew}
                                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-150 inline-flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        New Sequence
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {sequences.map(seq => (
                                        <div
                                            key={seq.id}
                                            onClick={() => setEditingSequence(seq)}
                                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-[#4F46E5] hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                    seq.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <Play size={16} className={seq.status === 'active' ? '' : 'opacity-50'} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#4F46E5] transition-colors">
                                                        {seq.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                                                        <span>{seq.steps?.length || 0} Steps</span>
                                                        <span className="text-gray-300">·</span>
                                                        <span>{(seq as any).sequence_enrollments?.[0]?.count || 0} enrolled lead{(seq as any).sequence_enrollments?.[0]?.count !== 1 ? 's' : ''}</span>
                                                        <span className="text-gray-300">·</span>
                                                        <span>Created {new Date(seq.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                    seq.status === 'active'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {seq.status === 'active' ? 'ACTIVE' : 'PAUSED'}
                                                </span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(seq); }}
                                                    className="text-gray-400 hover:text-gray-700 transition-colors p-2 text-sm font-medium"
                                                >
                                                    {seq.status === 'active' ? 'Pause' : 'Activate'}
                                                </button>
                                                <ChevronRight className="text-gray-400 group-hover:text-[#4F46E5] transition-colors" size={20} />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(seq.id); }}
                                                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* LinkedIn Sequences Tab */
                        <>
                            {/* Phase Timeline */}
                            <div className="flex items-center mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
                                <div className="absolute left-10 right-10 h-0.5 bg-gray-100 top-8 -z-0" />
                                {LINKEDIN_PHASES.map((phase) => (
                                    <div key={phase.phase} className="flex-1 flex flex-col items-center relative z-10">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                            phase.phase === 1
                                                ? 'bg-[#4F46E5] text-white ring-4 ring-[#EEF2FF]'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-default'
                                        }`}>
                                            {phase.phase}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 mt-2">{phase.name}</span>
                                        <span className="text-[10px] text-gray-400">Day {phase.days}</span>
                                    </div>
                                ))}
                            </div>

                            {linkedinLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={24} className="animate-spin text-[#4F46E5]" />
                                </div>
                            ) : linkedinEnrollments.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-[#4F46E5]" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No LinkedIn sequences running</h3>
                                    <p className="text-sm text-gray-500 mb-6">Enrol leads from the Lead Database to get started</p>
                                    <button
                                        onClick={() => onPageChange?.('Lead Database')}
                                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-150 inline-flex items-center gap-2"
                                    >
                                        <Users size={16} /> Go to Lead Database
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {linkedinEnrollments.map(enrollment => {
                                        const phaseInfo = getPhaseInfo(enrollment.current_phase);
                                        return (
                                            <div key={enrollment.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-[#4F46E5] hover:shadow-md transition-all duration-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                            enrollment.status === 'active' ? 'bg-[#EEF2FF] text-[#4F46E5]' :
                                                            enrollment.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                            'bg-gray-100 text-gray-400'
                                                        }`}>
                                                            <Linkedin size={18} />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-semibold text-gray-900">
                                                                {enrollment.leads?.company || 'Unknown Company'}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                                                                <a
                                                                    href={enrollment.linkedin_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[#4F46E5] hover:underline"
                                                                >
                                                                    View Profile
                                                                </a>
                                                                <span className="text-gray-300">·</span>
                                                                <span>{enrollment.leads?.first_name} {enrollment.leads?.last_name}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${phaseInfo.bgColor} ${phaseInfo.textColor} ${phaseInfo.borderColor}`}>
                                                            Phase {enrollment.current_phase}: {phaseInfo.name}
                                                        </span>
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                                            enrollment.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                            enrollment.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            enrollment.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-amber-50 text-amber-700 border-amber-200'
                                                        }`}>
                                                            {enrollment.status.toUpperCase()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            {enrollment.status !== 'completed' && enrollment.status !== 'failed' && (
                                                                <button
                                                                    onClick={() => handleToggleLinkedInStatus(enrollment)}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
                                                                >
                                                                    {enrollment.status === 'active' ? 'Pause' : 'Resume'}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleRemoveLinkedInEnrollment(enrollment.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                                                    <div className="flex-1 flex items-center gap-3">
                                                        <span className="text-xs font-medium text-gray-500 min-w-[50px]">Day {enrollment.current_day} of 35</span>
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                                                                style={{ width: `${(enrollment.current_day / 35) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {enrollment.last_action_at && (
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Calendar size={12} /> Last: {new Date(enrollment.last_action_at).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                /* Detail/Editor View */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex h-[calc(100vh-6rem)] relative">
                    {/* Left Panel: Steps list */}
                    <div className="w-[320px] shrink-0 border-r border-gray-200 flex flex-col bg-gray-50 h-full overflow-hidden relative">
                        {/* Editor Header */}
                        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <button
                                onClick={() => setEditingSequence(null)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-3"
                            >
                                ← Back to sequences
                            </button>
                            <input
                                type="text"
                                className="w-full text-lg font-semibold text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-300"
                                value={editingSequence.name}
                                onChange={(e) => setEditingSequence({ ...editingSequence, name: e.target.value })}
                                placeholder="Sequence Name"
                            />
                        </div>

                        {/* Steps flow */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 relative custom-scrollbar">
                            <div className="absolute left-8 top-8 bottom-8 w-px bg-gray-200 z-0"></div>

                            {editingSequence.steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    {index > 0 && (
                                        <div className="flex justify-center py-2 relative z-10">
                                            <div className="px-2.5 py-1 bg-white border border-gray-200 rounded-full text-[10px] font-semibold text-gray-500 flex items-center gap-1.5 shadow-sm">
                                                <Clock size={10} /> Wait {step.delay_days} days
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={handleDragOver}
                                        onDrop={() => handleDrop(index)}
                                        className={`group relative flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing z-10 ${
                                            activeStepIndex === index
                                                ? 'bg-indigo-50 border-l-4 border-l-[#4F46E5] border-t border-r border-b border-gray-200 shadow-md'
                                                : 'bg-white border-gray-200 hover:border-[#818CF8]'
                                        }`}
                                        onClick={() => setActiveStepIndex(index)}
                                    >
                                        <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-400 p-0.5 rounded shadow-sm border border-gray-200">
                                            <GripVertical size={12} />
                                        </div>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                                            activeStepIndex === index ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className={`text-xs font-semibold uppercase tracking-wide ${activeStepIndex === index ? 'text-[#4F46E5]' : 'text-gray-900'}`}>
                                                    {step.channel}
                                                </p>
                                            </div>
                                            <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                                                {step.subject || step.body.slice(0, 20) || 'Empty step'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeStep(index); }}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 z-10 space-y-2">
                            <button onClick={() => addStep('email')} className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                                <Mail size={14} /> Add email step
                            </button>
                            <button onClick={() => addStep('linkedin')} className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                                <Linkedin size={14} /> Add LinkedIn step
                            </button>
                            <button onClick={() => addStep('phone')} className="w-full flex items-center justify-center gap-2 py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold transition-colors">
                                <Phone size={14} /> Add AI call step
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: Editor Canvas */}
                    <div className="flex-1 flex flex-col h-full bg-white relative">
                        <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button onClick={() => setIsPreview(false)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${!isPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Editor</button>
                                <button onClick={() => setIsPreview(true)} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${isPreview ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Preview</button>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-semibold hover:bg-[#4338CA] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Sequence
                            </button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto">
                            {editingSequence.steps[activeStepIndex] && (
                                <div className="max-w-3xl mx-auto space-y-6">
                                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Delay</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="w-20 p-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-center focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                                    value={editingSequence.steps[activeStepIndex].delay_days}
                                                    onChange={(e) => updateStep(activeStepIndex, { delay_days: parseInt(e.target.value) || 0 })}
                                                />
                                                <span className="text-sm font-medium text-gray-500">days</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Channel</label>
                                            <select
                                                className="w-full max-w-[200px] p-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                                value={editingSequence.steps[activeStepIndex].channel}
                                                onChange={(e) => updateStep(activeStepIndex, { channel: e.target.value as Step['channel'] })}
                                            >
                                                <option value="email">Email</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="phone">Phone Call</option>
                                            </select>
                                        </div>
                                    </div>

                                    {editingSequence.steps[activeStepIndex].channel === 'email' && (
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Subject Line</label>
                                            <input
                                                type="text"
                                                className="w-full text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-200 pb-2 focus:outline-none focus:border-[#4F46E5] placeholder:text-gray-300 transition-colors"
                                                value={editingSequence.steps[activeStepIndex].subject}
                                                onChange={(e) => updateStep(activeStepIndex, { subject: e.target.value })}
                                                placeholder="Enter subject line..."
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Message Body</label>
                                            <div className="flex flex-wrap gap-1.5 justify-end">
                                                {mergeTags.map(tag => (
                                                    <button
                                                        key={tag.label}
                                                        onClick={() => updateStep(activeStepIndex, { body: (editingSequence.steps[activeStepIndex].body || '') + ' ' + tag.label })}
                                                        className="px-2 py-1 rounded bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#E0E7FF] text-[10px] font-semibold transition-colors"
                                                    >
                                                        {tag.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {isPreview ? (
                                            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200 min-h-[400px] whitespace-pre-line text-sm text-gray-700 leading-relaxed shadow-inner">
                                                {getPreviewText(editingSequence.steps[activeStepIndex].body) || 'No content to preview'}
                                            </div>
                                        ) : (
                                            <textarea
                                                className="w-full min-h-[400px] p-6 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm text-gray-800 leading-relaxed transition-all shadow-sm resize-y"
                                                value={editingSequence.steps[activeStepIndex].body}
                                                onChange={(e) => updateStep(activeStepIndex, { body: e.target.value })}
                                                placeholder={`Write your ${editingSequence.steps[activeStepIndex].channel} message here...`}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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