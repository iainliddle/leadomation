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
    Phone,
    Info,
    Target,
    Trophy,
    XCircle,
    MessageSquare,
    Copy
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';
import type { FeatureAccess } from '../lib/planLimits';

interface LinkedInEnrollment {
    id: string;
    user_id: string;
    lead_id: string;
    unipile_account_id: string;
    linkedin_url: string;
    linkedin_profile_url?: string;
    current_phase: number;
    current_day: number;
    status: 'active' | 'paused' | 'completed' | 'failed' | 'connected';
    paused_reason?: 'reply_received' | 'manual' | null;
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
    reply_message?: string | null;
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

interface SequenceStats {
    openRate: number | null;
    replyRate: number | null;
}

interface Sequence {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'draft';
    steps: Step[];
    created_at: string;
    user_id: string;
    stats?: SequenceStats;
}

interface SequenceBuilderProps {
    onPageChange?: (page: string) => void;
    canAccess?: (feature: keyof FeatureAccess) => boolean;
    triggerUpgrade?: (feature: string, targetPlan?: 'starter' | 'pro') => void;
}

const SequenceBuilder: React.FC<SequenceBuilderProps> = ({ onPageChange, canAccess, triggerUpgrade }) => {
    useEffect(() => {
        document.title = 'Sequence Builder | Leadomation';
        return () => { document.title = 'Leadomation'; };
    }, []);

    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSequence, setEditingSequence] = useState<Sequence | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [upgradeModal, setUpgradeModal] = useState({ show: false, message: '' });
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Tab State
    const [activeTab, setActiveTab] = useState<'email' | 'linkedin'>('email');

    // LinkedIn Enrollments State
    const [linkedinEnrollments, setLinkedinEnrollments] = useState<LinkedInEnrollment[]>([]);
    const [linkedinLoading, setLinkedinLoading] = useState(false);

    // Editor State
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [isPreview, setIsPreview] = useState(false);
    const [draggedStepIndex, setDraggedStepIndex] = useState<number | null>(null);

    // LinkedIn phase dropdown state
    const [showPhaseDropdown, setShowPhaseDropdown] = useState<string | null>(null);

    // Template banner state (from URL params)
    const [templateBanner, setTemplateBanner] = useState<{
        subject: string;
        body: string;
        name: string;
    } | null>(null);

    useEffect(() => {
        fetchSequences();
        fetchLinkedinEnrollments();

        // Check for template from EmailTemplates page
        const savedTemplate = localStorage.getItem('selected_template');
        if (savedTemplate) {
            try {
                const template = JSON.parse(savedTemplate);
                localStorage.removeItem('selected_template');

                // Create a new sequence with the template pre-populated
                const newSequence: Partial<Sequence> = {
                    name: template.name || 'New Sequence',
                    status: 'draft',
                    steps: [
                        {
                            step: 1,
                            channel: 'email',
                            subject: template.subject || '',
                            body: template.body || '',
                            delay_days: 0
                        }
                    ]
                };
                setEditingSequence(newSequence as Sequence);
                setActiveStepIndex(0);
                showToast('Template loaded. Edit and save your step.', 'success');
            } catch (e) {
                console.error('Error parsing saved template:', e);
                localStorage.removeItem('selected_template');
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setShowPhaseDropdown(null);
        if (showPhaseDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showPhaseDropdown]);

    // Read URL params for template on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const subject = params.get('template_subject');
        const body = params.get('template_body');
        const name = params.get('template_name');
        if (subject) {
            setTemplateBanner({
                subject: decodeURIComponent(subject),
                body: decodeURIComponent(body || ''),
                name: decodeURIComponent(name || '')
            });
        }
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
            setIsLoading(false);
            return;
        }

        const sequencesList = data || [];
        const sequenceIds = sequencesList.map(s => s.id);

        if (sequenceIds.length > 0) {
            // Fetch open rate stats from sequence_step_logs
            const { data: stepLogs } = await supabase
                .from('sequence_step_logs')
                .select('sequence_id, opened')
                .in('sequence_id', sequenceIds);

            // Fetch reply rate stats from sequence_enrollments
            const { data: enrollments } = await supabase
                .from('sequence_enrollments')
                .select('sequence_id, status')
                .in('sequence_id', sequenceIds);

            // Calculate stats per sequence
            const statsMap: Record<string, SequenceStats> = {};

            sequenceIds.forEach(seqId => {
                const seqLogs = (stepLogs || []).filter(log => log.sequence_id === seqId);
                const seqEnrollments = (enrollments || []).filter(e => e.sequence_id === seqId);

                const totalLogs = seqLogs.length;
                const openedLogs = seqLogs.filter(log => log.opened === true).length;
                const openRate = totalLogs > 0 ? Math.round((openedLogs / totalLogs) * 100) : null;

                const totalEnrollments = seqEnrollments.length;
                const repliedEnrollments = seqEnrollments.filter(e => e.status === 'replied').length;
                const replyRate = totalEnrollments > 0 ? Math.round((repliedEnrollments / totalEnrollments) * 100) : null;

                statsMap[seqId] = { openRate, replyRate };
            });

            // Attach stats to sequences
            sequencesList.forEach(seq => {
                seq.stats = statsMap[seq.id] || { openRate: null, replyRate: null };
            });
        }

        setSequences(sequencesList);
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
            setLinkedinLoading(false);
            return;
        }

        // Fetch reply messages for paused enrollments
        const enrollments = data || [];
        const pausedIds = enrollments
            .filter(e => e.status === 'paused' && e.paused_reason === 'reply_received')
            .map(e => e.id);

        if (pausedIds.length > 0) {
            const { data: replies } = await supabase
                .from('inbound_emails')
                .select('linkedin_enrollment_id, body_text')
                .in('linkedin_enrollment_id', pausedIds)
                .eq('source', 'linkedin')
                .order('received_at', { ascending: false });

            if (replies) {
                const replyMap = new Map(replies.map(r => [r.linkedin_enrollment_id, r.body_text]));
                enrollments.forEach(e => {
                    if (replyMap.has(e.id)) {
                        e.reply_message = replyMap.get(e.id);
                    }
                });
            }
        }

        setLinkedinEnrollments(enrollments);
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

    const handleAdvancePhase = async (enrollment: LinkedInEnrollment) => {
        if (enrollment.current_phase >= 6) {
            alert('This enrollment is already in the final phase.');
            return;
        }
        const nextPhase = enrollment.current_phase + 1;
        const phaseStartDays: Record<number, number> = { 2: 12, 3: 15, 4: 20, 5: 25, 6: 30 };
        const { error } = await supabase
            .from('linkedin_enrollments')
            .update({
                current_phase: nextPhase,
                current_day: phaseStartDays[nextPhase] || enrollment.current_day + 1,
                next_action_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
        if (!error) fetchLinkedinEnrollments();
    };

    const handleJumpToPhase = async (enrollment: LinkedInEnrollment, phase: number) => {
        const phaseStartDays: Record<number, number> = { 1: 1, 2: 12, 3: 15, 4: 20, 5: 25, 6: 30 };
        const { error } = await supabase
            .from('linkedin_enrollments')
            .update({
                current_phase: phase,
                current_day: phaseStartDays[phase] || 1,
                next_action_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
        if (!error) fetchLinkedinEnrollments();
    };

    const handleRunNow = async (enrollment: LinkedInEnrollment) => {
        const { error } = await supabase
            .from('linkedin_enrollments')
            .update({
                next_action_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
        if (!error) {
            fetchLinkedinEnrollments();
            alert('✓ Running now. The next action for this lead will execute within 60 seconds.');
        }
    };

    const handleMarkAsWon = async (enrollment: LinkedInEnrollment) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Complete the enrollment
        await supabase
            .from('linkedin_enrollments')
            .update({
                status: 'completed',
                paused_reason: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);

        // Update lead status to qualified
        await supabase
            .from('leads')
            .update({ status: 'qualified' })
            .eq('id', enrollment.lead_id);

        // Check if deal exists, if not create one
        const { data: existingDeal } = await supabase
            .from('deals')
            .select('id')
            .eq('user_id', user.id)
            .eq('lead_id', enrollment.lead_id)
            .single();

        if (!existingDeal) {
            await supabase
                .from('deals')
                .insert({
                    user_id: user.id,
                    lead_id: enrollment.lead_id,
                    title: enrollment.leads?.company || `${enrollment.leads?.first_name || ''} ${enrollment.leads?.last_name || ''}`.trim(),
                    value: 0,
                    currency: '£',
                    stage: 'qualified',
                    stage_entered_at: new Date().toISOString(),
                    source: 'linkedin',
                    probability: 40,
                    notes: 'Deal created from LinkedIn sequence (marked as won)'
                });
        }

        fetchLinkedinEnrollments();
    };

    const handleMarkAsLost = async (enrollment: LinkedInEnrollment) => {
        // Complete the enrollment
        await supabase
            .from('linkedin_enrollments')
            .update({
                status: 'completed',
                paused_reason: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);

        // Update lead status to not_interested
        await supabase
            .from('leads')
            .update({ status: 'not_interested' })
            .eq('id', enrollment.lead_id);

        fetchLinkedinEnrollments();
    };

    const handleResumeSequence = async (enrollment: LinkedInEnrollment) => {
        const { error } = await supabase
            .from('linkedin_enrollments')
            .update({
                status: 'active',
                paused_reason: null,
                updated_at: new Date().toISOString()
            })
            .eq('id', enrollment.id);
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

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleDuplicate = async (e: React.MouseEvent, seq: Sequence) => {
        e.stopPropagation();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('sequences').insert({
            user_id: user.id,
            name: `${seq.name} (Copy)`,
            status: 'paused',
            steps: seq.steps,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });

        if (error) {
            showToast('Failed to duplicate sequence. Please try again.', 'error');
        } else {
            showToast('Sequence duplicated successfully', 'success');
            fetchSequences();
        }
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

                    {/* Template Banner */}
                    {templateBanner && (
                        <div className="bg-[#EEF2FF] border border-[#4F46E5]/20 rounded-xl p-4 mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#4F46E5]">
                                    Template ready: {templateBanner.name}
                                </p>
                                <p className="text-xs text-[#6B7280] mt-1">
                                    Create a new sequence and add a step to use this template.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => {
                                        // Create new sequence with template pre-filled
                                        const newSequence: Partial<Sequence> = {
                                            name: templateBanner.name || 'New Sequence',
                                            status: 'draft',
                                            steps: [
                                                {
                                                    step: 1,
                                                    channel: 'email',
                                                    subject: templateBanner.subject || '',
                                                    body: templateBanner.body || '',
                                                    delay_days: 0
                                                }
                                            ]
                                        };
                                        setEditingSequence(newSequence as Sequence);
                                        setActiveStepIndex(0);
                                        setTemplateBanner(null);
                                    }}
                                    className="bg-[#4F46E5] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#4338CA]"
                                >
                                    Create New Sequence
                                </button>
                                <button
                                    onClick={() => setTemplateBanner(null)}
                                    className="text-[#6B7280] hover:text-[#111827] text-sm"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}

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
                            onClick={() => {
                                if (canAccess && !canAccess('linkedinAutomation')) {
                                    triggerUpgrade?.('LinkedIn Relationship Sequencer', 'pro');
                                    return;
                                }
                                setActiveTab('linkedin');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                                activeTab === 'linkedin'
                                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-px'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Linkedin size={16} />
                            LinkedIn Sequences
                            {canAccess && !canAccess('linkedinAutomation') ? (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1 font-bold">PRO</span>
                            ) : linkedinEnrollments.filter(e => e.status === 'active').length > 0 && (
                                <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#C7D2FE]">
                                    {linkedinEnrollments.filter(e => e.status === 'active').length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                if (canAccess && !canAccess('keywordMonitor')) {
                                    triggerUpgrade?.('LinkedIn Keyword Monitor', 'pro');
                                    return;
                                }
                                onPageChange?.('Keyword Monitor');
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium cursor-pointer transition-colors text-gray-500 hover:text-gray-700"
                        >
                            <Target size={16} />
                            Keyword Monitor
                            {canAccess && !canAccess('keywordMonitor') && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1 font-bold">PRO</span>
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
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                                            Open rate: {seq.stats?.openRate != null ? `${seq.stats.openRate}%` : '-'}
                                                        </span>
                                                        <span className="bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                                                            Reply rate: {seq.stats?.replyRate != null ? `${seq.stats.replyRate}%` : '-'}
                                                        </span>
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
                                                <div className="relative group/dup">
                                                    <button
                                                        onClick={(e) => handleDuplicate(e, seq)}
                                                        className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                                        aria-label="Duplicate sequence"
                                                    >
                                                        <Copy size={15} />
                                                    </button>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover/dup:opacity-100 transition-opacity pointer-events-none z-10">
                                                        Duplicate sequence.
                                                    </div>
                                                </div>
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
                            {canAccess && !canAccess('linkedinAutomation') ? (
                                /* Locked State for Starter users */
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Linkedin className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn Relationship Sequencer is a Pro feature</h3>
                                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                                        Upgrade to Pro to unlock our 35-day LinkedIn nurturing sequence that builds genuine trust with prospects before making any ask.
                                    </p>
                                    <button
                                        onClick={() => triggerUpgrade?.('LinkedIn Relationship Sequencer', 'pro')}
                                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-150 inline-flex items-center gap-2"
                                    >
                                        Upgrade to Pro
                                    </button>
                                </div>
                            ) : (
                            <>
                            {/* Recommendation Banner */}
                            <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mb-4">
                                <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                                <p className="text-xs font-medium text-[#374151] leading-relaxed">
                                    <span className="text-[#4F46E5] font-semibold">Leadomation recommends following the full 35-day sequence.</span> Research shows prospects who receive gradual, value-led outreach over 4-6 weeks are significantly more likely to convert than those contacted immediately. The sequence builds genuine trust before making any ask. You can advance phases manually if needed, but we recommend letting it run naturally.
                                </p>
                            </div>

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
                                                                    href={enrollment.linkedin_profile_url || enrollment.linkedin_url}
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
                                                            enrollment.status === 'paused' && enrollment.paused_reason === 'reply_received' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            'bg-gray-100 text-gray-600 border-gray-200'
                                                        }`}>
                                                            {enrollment.status === 'paused' && enrollment.paused_reason === 'reply_received'
                                                                ? 'Paused - reply received'
                                                                : enrollment.status.toUpperCase()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            {/* Run Now button */}
                                                            <button
                                                                onClick={() => handleRunNow(enrollment)}
                                                                title="Force run on next N8N cycle"
                                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                                                            >
                                                                Run now
                                                            </button>

                                                            {/* Advance to next phase button */}
                                                            {enrollment.current_phase < 6 && (
                                                                <button
                                                                    onClick={() => handleAdvancePhase(enrollment)}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] border border-indigo-200 transition-colors"
                                                                >
                                                                    Next phase
                                                                </button>
                                                            )}

                                                            {/* Jump to phase dropdown */}
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowPhaseDropdown(showPhaseDropdown === enrollment.id ? null : enrollment.id);
                                                                    }}
                                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:bg-gray-50 border border-[#E5E7EB] transition-colors flex items-center gap-1"
                                                                >
                                                                    Jump to phase
                                                                    <ChevronRight size={12} className={`transition-transform ${showPhaseDropdown === enrollment.id ? 'rotate-90' : ''}`} />
                                                                </button>
                                                                {showPhaseDropdown === enrollment.id && (
                                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden">
                                                                        {LINKEDIN_PHASES.map(phase => (
                                                                            <button
                                                                                key={phase.phase}
                                                                                onClick={() => {
                                                                                    handleJumpToPhase(enrollment, phase.phase);
                                                                                    setShowPhaseDropdown(null);
                                                                                }}
                                                                                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                                                                                    enrollment.current_phase === phase.phase
                                                                                        ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                                                        : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                                                }`}
                                                                            >
                                                                                Phase {phase.phase}: {phase.name}
                                                                                <span className="text-[#9CA3AF] ml-1">Day {phase.days}</span>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Paused due to reply - show action buttons */}
                                                            {enrollment.status === 'paused' && enrollment.paused_reason === 'reply_received' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleResumeSequence(enrollment)}
                                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] border border-indigo-200 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Play size={12} />
                                                                        Resume sequence
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMarkAsWon(enrollment)}
                                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Trophy size={12} />
                                                                        Mark as won
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleMarkAsLost(enrollment)}
                                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-1"
                                                                    >
                                                                        <XCircle size={12} />
                                                                        Mark as lost
                                                                    </button>
                                                                </>
                                                            )}
                                                            {/* Normal pause/resume for non-reply paused */}
                                                            {enrollment.status !== 'completed' && enrollment.status !== 'failed' && !(enrollment.status === 'paused' && enrollment.paused_reason === 'reply_received') && (
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

                                                {/* Reply message preview for paused enrollments */}
                                                {enrollment.status === 'paused' && enrollment.paused_reason === 'reply_received' && (
                                                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg mt-3">
                                                        <MessageSquare size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs font-medium text-amber-700 mb-1">Reply received</p>
                                                            {enrollment.reply_message ? (
                                                                <p className="text-xs text-amber-800 line-clamp-2">{enrollment.reply_message}</p>
                                                            ) : (
                                                                <p className="text-xs text-amber-600 italic">View in Inbox for full message</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

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

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium animate-fade-in ${
                    toast.type === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                }`}>
                    <span>{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-1 opacity-80 hover:opacity-100 transition-opacity">
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SequenceBuilder;