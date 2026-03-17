import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    Search,
    Mail,
    ChevronDown,
    MoreHorizontal,
    Loader2,
    Building,
    X,
    ExternalLink,
    Calendar,
    MapPin,
    Tag,
    Globe,
    Trash2,
    Plus,
    Wand2,
    Linkedin,
    Save,
    Phone,
    PhoneCall,
    PhoneOff,
    Info,
    CheckCircle,
    Clock,
    Star,
    UserPlus,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Mic,
    Pencil,
    TrendingUp,
    Flame
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface IntentSignal {
    signal: string;
    label: string;
    description: string;
    weight: number;
}

interface Lead {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    industry: string;
    status: string;
    website: string;
    job_title?: string;
    linkedin_url?: string;
    source?: string;
    rating?: number;
    photo_url?: string;
    review_count?: number;
    created_at: string;
    user_id: string;
    intent_score?: number | null;
    intent_signals?: IntentSignal[] | null;
}

import { Lock } from 'lucide-react';
import type { FeatureAccess } from '../lib/planLimits';

interface LeadDatabaseProps {
    canAccess?: (feature: keyof FeatureAccess) => boolean;
    triggerUpgrade?: (feature: string, targetPlan?: 'starter' | 'pro') => void;
}

const cityToTimezone: Record<string, string> = {
    'london': 'Europe/London', 'manchester': 'Europe/London', 'birmingham': 'Europe/London',
    'liverpool': 'Europe/London', 'leeds': 'Europe/London', 'bristol': 'Europe/London',
    'edinburgh': 'Europe/London', 'glasgow': 'Europe/London', 'cardiff': 'Europe/London',
    'belfast': 'Europe/London', 'newcastle': 'Europe/London', 'sheffield': 'Europe/London',
    'nottingham': 'Europe/London', 'england': 'Europe/London', 'scotland': 'Europe/London',
    'wales': 'Europe/London', 'uk': 'Europe/London', 'gb': 'Europe/London',
    'united kingdom': 'Europe/London',
    'dubai': 'Asia/Dubai', 'abu dhabi': 'Asia/Dubai', 'sharjah': 'Asia/Dubai',
    'uae': 'Asia/Dubai', 'united arab emirates': 'Asia/Dubai', 'ae': 'Asia/Dubai',
    'new york': 'America/New_York', 'boston': 'America/New_York', 'miami': 'America/New_York',
    'atlanta': 'America/New_York', 'philadelphia': 'America/New_York', 'washington': 'America/New_York',
    'chicago': 'America/Chicago', 'dallas': 'America/Chicago', 'houston': 'America/Chicago',
    'austin': 'America/Chicago', 'denver': 'America/Denver', 'phoenix': 'America/Phoenix',
    'los angeles': 'America/Los_Angeles', 'san francisco': 'America/Los_Angeles',
    'seattle': 'America/Los_Angeles', 'las vegas': 'America/Los_Angeles',
    'paris': 'Europe/Paris', 'berlin': 'Europe/Berlin', 'madrid': 'Europe/Madrid',
    'rome': 'Europe/Rome', 'amsterdam': 'Europe/Amsterdam', 'brussels': 'Europe/Brussels',
    'vienna': 'Europe/Vienna', 'zurich': 'Europe/Zurich', 'munich': 'Europe/Berlin',
    'barcelona': 'Europe/Madrid', 'milan': 'Europe/Rome', 'dublin': 'Europe/Dublin',
    'ireland': 'Europe/Dublin', 'france': 'Europe/Paris', 'germany': 'Europe/Berlin',
    'spain': 'Europe/Madrid', 'italy': 'Europe/Rome', 'netherlands': 'Europe/Amsterdam',
    'sydney': 'Australia/Sydney', 'melbourne': 'Australia/Melbourne',
    'brisbane': 'Australia/Brisbane', 'perth': 'Australia/Perth',
    'adelaide': 'Australia/Adelaide', 'australia': 'Australia/Sydney',
    'au': 'Australia/Sydney', 'nsw': 'Australia/Sydney', 'victoria': 'Australia/Melbourne',
    'new south wales': 'Australia/Sydney',
    'singapore': 'Asia/Singapore', 'sg': 'Asia/Singapore',
    'hong kong': 'Asia/Hong_Kong', 'tokyo': 'Asia/Tokyo', 'japan': 'Asia/Tokyo',
    'beijing': 'Asia/Shanghai', 'shanghai': 'Asia/Shanghai', 'china': 'Asia/Shanghai',
    'bangkok': 'Asia/Bangkok', 'thailand': 'Asia/Bangkok',
    'jakarta': 'Asia/Jakarta', 'india': 'Asia/Kolkata', 'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata', 'bangalore': 'Asia/Kolkata',
    'riyadh': 'Asia/Riyadh', 'jeddah': 'Asia/Riyadh', 'saudi': 'Asia/Riyadh',
    'doha': 'Asia/Qatar', 'qatar': 'Asia/Qatar', 'kuwait': 'Asia/Kuwait',
    'bahrain': 'Asia/Bahrain', 'muscat': 'Asia/Muscat', 'oman': 'Asia/Muscat',
    'toronto': 'America/Toronto', 'montreal': 'America/Toronto', 'ottawa': 'America/Toronto',
    'vancouver': 'America/Vancouver', 'calgary': 'America/Edmonton',
    'auckland': 'Pacific/Auckland', 'new zealand': 'Pacific/Auckland', 'nz': 'Pacific/Auckland',
    'johannesburg': 'Africa/Johannesburg', 'cape town': 'Africa/Johannesburg',
    'south africa': 'Africa/Johannesburg',
};

const getTimezone = (location: string): string => {
    if (!location) return 'UTC';
    const loc = location.toLowerCase().trim();
    for (const [key, tz] of Object.entries(cityToTimezone)) {
        if (loc.includes(key)) return tz;
    }
    return 'UTC';
};

const getLocalTime = (location: string): { time: string; hour: number; status: 'green' | 'amber' | 'red'; reason: string } => {
    const timezone = getTimezone(location);
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        weekday: 'short'
    });
    const parts = formatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const weekday = parts.find(p => p.type === 'weekday')?.value || '';
    const time = `${String(hour).padStart(2, '0')}:${minute}`;
    const isWeekend = weekday === 'Sat' || weekday === 'Sun';
    let status: 'green' | 'amber' | 'red';
    let reason: string;
    if (isWeekend) {
        status = 'red';
        reason = 'Weekend';
    } else if (hour >= 9 && hour < 17) {
        status = 'green';
        reason = 'Business hours';
    } else if ((hour >= 8 && hour < 9) || (hour >= 17 && hour < 18)) {
        status = 'amber';
        reason = hour < 9 ? 'Early morning' : 'End of day';
    } else {
        status = 'red';
        reason = 'Outside hours';
    }
    return { time, hour, status, reason };
};

const timeStatusColors = {
    green: '#10B981',
    amber: '#F59E0B',
    red: '#EF4444'
};

const getIntentScoreDisplay = (score: number | null | undefined): { label: string; color: string; bgColor: string; borderColor: string } => {
    if (score === null || score === undefined) {
        return { label: 'Unscored', color: '#64748B', bgColor: '#F1F5F9', borderColor: '#E2E8F0' };
    }
    if (score >= 75) {
        return { label: 'Hot', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' };
    }
    if (score >= 50) {
        return { label: 'Warm', color: '#D97706', bgColor: '#FFFBEB', borderColor: '#FDE68A' };
    }
    if (score >= 25) {
        return { label: 'Cool', color: '#2563EB', bgColor: '#EFF6FF', borderColor: '#BFDBFE' };
    }
    return { label: 'Cold', color: '#6B7280', bgColor: '#F3F4F6', borderColor: '#E5E7EB' };
};

const IntentScoreBadge: React.FC<{ lead: Lead }> = ({ lead }) => {
    const display = getIntentScoreDisplay(lead.intent_score);
    const hasScore = lead.intent_score !== null && lead.intent_score !== undefined;
    const signals = lead.intent_signals || [];

    return (
        <div className="flex items-center gap-1.5">
            <span
                className="px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap"
                style={{ color: display.color, backgroundColor: display.bgColor, borderColor: display.borderColor }}
            >
                {hasScore ? `${display.label} · ${lead.intent_score}` : display.label}
            </span>
            {hasScore && (
                <div className="relative group">
                    <Info
                        size={14}
                        className="text-[#9CA3AF] cursor-help hover:text-[#6B7280] transition-colors"
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-[#1F2937] text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                        <div className="font-bold mb-2 text-[11px] uppercase tracking-wide text-gray-300">Why this lead?</div>
                        {signals.length > 0 ? (
                            <ul className="space-y-1.5">
                                {signals.map((sig, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                        <span className="text-[#10B981] mt-0.5">•</span>
                                        <span>
                                            <span className="font-semibold">{sig.label}</span>
                                            <span className="text-gray-400"> — {sig.description}</span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400">No signals available yet. Run enrichment to score this lead.</p>
                        )}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1F2937]" />
                    </div>
                </div>
            )}
        </div>
    );
};

const LeadDatabase: React.FC<LeadDatabaseProps> = ({ canAccess, triggerUpgrade }) => {
    const [campaignFilter, setCampaignFilter] = useState<string | null>(() => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get('campaign');
    });

    const clearCampaignFilter = () => {
        setCampaignFilter(null);
        window.history.pushState({}, '', window.location.pathname);
    };

    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeIntentFilters, setActiveIntentFilters] = useState<string[]>([]);
    const [intentScoreSort, setIntentScoreSort] = useState<'none' | 'desc' | 'asc'>('none');
    const [intentScoreFilters, setIntentScoreFilters] = useState<string[]>([]);
    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isEditingLead, setIsEditingLead] = useState(false);
    const [editLeadForm, setEditLeadForm] = useState<Partial<Lead>>({});
    const [isSavingLead, setIsSavingLead] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [enrichingLeads, setEnrichingLeads] = useState<string[]>([]);

    // Call Agent State
    const [callScripts, setCallScripts] = useState<any[]>([]);
    const [selectedScriptId, setSelectedScriptId] = useState<string>('');
    const [showCallModal, setShowCallModal] = useState(false);
    const [callInProgress, setCallInProgress] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended' | 'error'>('idle');
    const [callLeadTarget, setCallLeadTarget] = useState<Lead | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showInfoCard, setShowInfoCard] = useState(true);

    // Batch Email Modal State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [sequences, setSequences] = useState<any[]>([]);
    const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');
    const [isEnrolling, setIsEnrolling] = useState(false);

    // Batch Call Queue Modal State
    const [showBatchCallModal, setShowBatchCallModal] = useState(false);
    const [batchCallScriptId, setBatchCallScriptId] = useState<string>('');
    const [businessHoursOnly, setBusinessHoursOnly] = useState(true);
    const [isQueueing, setIsQueueing] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    // LinkedIn Enrollment State
    const [showLinkedInModal, setShowLinkedInModal] = useState(false);
    const [linkedInEnrollLead, setLinkedInEnrollLead] = useState<Lead | null>(null);
    const [linkedInUrl, setLinkedInUrl] = useState('');
    const [isEnrollingLinkedIn, setIsEnrollingLinkedIn] = useState(false);

    // Activity Timeline State
    const [activityItems, setActivityItems] = useState<any[]>([]);
    const [activityLoading, setActivityLoading] = useState(false);
    const [expandedTranscripts, setExpandedTranscripts] = useState<Set<string>>(new Set());

    // Audio Player State
    const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
    const progressBarRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [audioStates, setAudioStates] = useState<Record<string, { isPlaying: boolean; currentTime: number; duration: number; isMuted: boolean }>>({});

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 4000);
    };

    // LinkedIn Enrollment Handler
    const handleLinkedInEnroll = async (lead: Lead) => {
        setLinkedInEnrollLead(lead);
        setLinkedInUrl(lead.linkedin_url || '');
        setShowLinkedInModal(true);
    };

    const submitLinkedInEnroll = async () => {
        if (!linkedInEnrollLead || !linkedInUrl.trim()) {
            showToast('Please enter a LinkedIn URL');
            return;
        }

        setIsEnrollingLinkedIn(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                showToast('Please log in to enrol leads');
                return;
            }

            const response = await fetch('/api/linkedin-enroll', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lead_id: linkedInEnrollLead.id,
                    linkedin_url: linkedInUrl.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'Pro plan required') {
                    triggerUpgrade?.('LinkedIn Sequencer', 'pro');
                    setShowLinkedInModal(false);
                    return;
                }
                if (data.error === 'LinkedIn not connected') {
                    showToast('Connect your LinkedIn account first in Integrations');
                    setShowLinkedInModal(false);
                    return;
                }
                throw new Error(data.error || 'Failed to enrol lead');
            }

            showToast('Lead enrolled in LinkedIn sequence');
            setShowLinkedInModal(false);
            setLinkedInEnrollLead(null);
            setLinkedInUrl('');
        } catch (err: any) {
            console.error('LinkedIn enrol error:', err);
            showToast(err.message || 'Failed to enrol lead');
        } finally {
            setIsEnrollingLinkedIn(false);
        }
    };

    // Update time every minute for live local time indicators
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(interval);
    }, []);
    void currentTime; // Used to trigger re-renders for live time display

    // Add Lead Form State
    const [newLead, setNewLead] = useState({
        company: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        industry: '',
        website: '',
        job_title: '',
        linkedin_url: '',
        status: 'New'
    });

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            let query = supabase
                .from('leads')
                .select('*')
                .eq('user_id', user.id);

            if (campaignFilter) {
                query = query.eq('campaign_id', campaignFilter);
            }

            // Apply intent score filters at the query level
            if (intentScoreFilters.length > 0) {
                const conditions: string[] = [];
                if (intentScoreFilters.includes('hot')) {
                    conditions.push('intent_score.gte.75');
                }
                if (intentScoreFilters.includes('warm')) {
                    conditions.push('and(intent_score.gte.50,intent_score.lt.75)');
                }
                if (intentScoreFilters.includes('cool')) {
                    conditions.push('and(intent_score.gte.25,intent_score.lt.50)');
                }
                if (intentScoreFilters.includes('unscored')) {
                    conditions.push('intent_score.is.null');
                }

                // Build OR query for multiple selections
                if (conditions.length === 1) {
                    if (intentScoreFilters.includes('hot')) {
                        query = query.gte('intent_score', 75);
                    } else if (intentScoreFilters.includes('warm')) {
                        query = query.gte('intent_score', 50).lt('intent_score', 75);
                    } else if (intentScoreFilters.includes('cool')) {
                        query = query.gte('intent_score', 25).lt('intent_score', 50);
                    } else if (intentScoreFilters.includes('unscored')) {
                        query = query.is('intent_score', null);
                    }
                } else {
                    // For multiple filters, we need to use OR logic
                    // Supabase JS doesn't support complex OR directly, so we fetch all and filter client-side
                    // This is handled in the filteredLeads useMemo below
                }
            }

            // Apply intent score sorting
            if (intentScoreSort === 'desc') {
                query = query.order('intent_score', { ascending: false, nullsFirst: false });
            } else if (intentScoreSort === 'asc') {
                query = query.order('intent_score', { ascending: true, nullsFirst: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching leads:', error);
            } else {
                setLeads(data || []);
            }
        } catch (error) {
            console.error('Error in fetchLeads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCallScripts = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('call_scripts')
            .select('id, name, system_prompt')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            setCallScripts(data);
            setSelectedScriptId(data[0].id);
        }
    };

    const fetchSequences = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('sequences')
            .select('id, name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) {
            setSequences(data);
            if (data.length > 0) setSelectedSequenceId(data[0].id);
        }
    };

    const handleBatchEnroll = async () => {
        if (!selectedSequenceId || selectedLeads.length === 0) return;
        setIsEnrolling(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const rows = selectedLeads.map(leadId => ({
                lead_id: leadId,
                sequence_id: selectedSequenceId,
                user_id: user.id,
                status: 'active',
                current_step: 0,
                enrolled_at: new Date().toISOString(),
                next_action_at: new Date().toISOString()
            }));

            const { error } = await supabase.from('sequence_enrollments').insert(rows);
            if (error) throw error;

            const seqName = sequences.find(s => s.id === selectedSequenceId)?.name || 'sequence';
            showToast(`${selectedLeads.length} lead${selectedLeads.length > 1 ? 's' : ''} enrolled in ${seqName}`);
            setShowEmailModal(false);
            setSelectedLeads([]);
        } catch (error) {
            console.error('Error enrolling leads:', error);
            alert('Failed to enrol leads. Please try again.');
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleBatchQueueCalls = async () => {
        if (!batchCallScriptId || selectedLeads.length === 0) return;
        setIsQueueing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const selectedLeadObjects = leads.filter(l => selectedLeads.includes(l.id));
            const withPhones = selectedLeadObjects.filter(l => l.phone && l.phone.trim() !== '');
            const eligibleLeads = businessHoursOnly
                ? withPhones.filter(l => {
                    if (!l.location) return true; // unknown location still included
                    const { status } = getLocalTime(l.location);
                    return status === 'green' || status === 'amber';
                })
                : withPhones;

            const rows = eligibleLeads.map(lead => ({
                lead_id: lead.id,
                script_id: batchCallScriptId,
                user_id: user.id,
                status: 'queued',
                queued_at: new Date().toISOString()
            }));

            if (rows.length === 0) {
                alert('No eligible leads to queue (requires a phone number and optionally business hours matching).');
                setIsQueueing(false);
                return;
            }

            const { error } = await supabase.from('call_queue').insert(rows);
            if (error) throw error;

            showToast(`${rows.length} call${rows.length > 1 ? 's' : ''} queued`);
            setShowBatchCallModal(false);
            setSelectedLeads([]);
        } catch (error) {
            console.error('Error queueing calls:', error);
            alert('Failed to queue calls. Please try again.');
        } finally {
            setIsQueueing(false);
        }
    };

    // Relative time helper
    const getRelativeTime = (dateStr: string): string => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        return date.toLocaleDateString();
    };

    const formatAudioTime = (seconds: number): string => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const toggleAudioPlay = (id: string) => {
        const audio = audioRefs.current[id];
        if (!audio) return;
        if (audio.paused) {
            // Pause all other playing audios
            Object.entries(audioRefs.current).forEach(([key, el]) => {
                if (key !== id && el && !el.paused) {
                    el.pause();
                    setAudioStates(prev => ({ ...prev, [key]: { ...prev[key], isPlaying: false } }));
                }
            });
            audio.play();
            setAudioStates(prev => ({ ...prev, [id]: { ...prev[id], isPlaying: true } }));
        } else {
            audio.pause();
            setAudioStates(prev => ({ ...prev, [id]: { ...prev[id], isPlaying: false } }));
        }
    };

    const toggleAudioMute = (id: string) => {
        const audio = audioRefs.current[id];
        if (!audio) return;
        audio.muted = !audio.muted;
        setAudioStates(prev => ({ ...prev, [id]: { ...prev[id], isMuted: audio.muted } }));
    };

    const handleProgressClick = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRefs.current[id];
        const bar = progressBarRefs.current[id];
        if (!audio || !bar) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * (audio.duration || 0);
    };

    // Fetch activity timeline data when a lead is selected
    useEffect(() => {
        if (!selectedLead) {
            setActivityItems([]);
            setExpandedTranscripts(new Set());
            return;
        }

        const fetchActivity = async () => {
            setActivityLoading(true);
            setExpandedTranscripts(new Set());
            try {
                // Fetch activity data - sequence_enrollments without join to avoid 400 if FK not configured
                const [callRes, dealRes, enrollRes] = await Promise.all([
                    supabase.from('call_logs').select('id, created_at, duration_seconds, ended_reason, transcript, recording_url').eq('lead_id', selectedLead.id).order('created_at', { ascending: false }),
                    supabase.from('deals').select('id, created_at, title, stage').eq('lead_id', selectedLead.id).order('created_at', { ascending: false }),
                    supabase.from('sequence_enrollments').select('id, enrolled_at, sequence_id, status').eq('lead_id', selectedLead.id).order('enrolled_at', { ascending: false })
                ]);

                // Fetch sequence names separately if we have enrollments
                const sequenceIds = (enrollRes.data || []).map((e: any) => e.sequence_id).filter(Boolean);
                let sequenceMap: Record<string, string> = {};
                if (sequenceIds.length > 0) {
                    const { data: seqData } = await supabase
                        .from('sequences')
                        .select('id, name')
                        .in('id', sequenceIds);
                    if (seqData) {
                        sequenceMap = Object.fromEntries(seqData.map((s: any) => [s.id, s.name]));
                    }
                }

                const items: any[] = [];

                (callRes.data || []).forEach((c: any) => {
                    const mins = Math.floor((c.duration_seconds || 0) / 60);
                    const secs = (c.duration_seconds || 0) % 60;
                    const durationStr = c.duration_seconds ? `${mins}m ${secs}s` : '';
                    const sublabel = [durationStr, c.ended_reason].filter(Boolean).join(' · ');
                    items.push({ type: 'call', date: c.created_at, label: 'AI Call Made', sublabel: sublabel || 'No details', icon: 'phone', id: c.id, transcript: c.transcript, recording_url: c.recording_url });
                });

                (dealRes.data || []).forEach((d: any) => {
                    items.push({ type: 'deal', date: d.created_at, label: 'Deal Created', sublabel: d.title, icon: 'star', id: d.id });
                });

                (enrollRes.data || []).forEach((e: any) => {
                    const seqName = sequenceMap[e.sequence_id] || 'Email Sequence';
                    items.push({ type: 'email', date: e.enrolled_at, label: 'Enrolled in Sequence', sublabel: seqName, icon: 'mail', id: e.id });
                });

                // Synthetic lead-created event
                items.push({
                    type: 'created',
                    date: selectedLead.created_at,
                    label: 'Lead Added',
                    sublabel: selectedLead.source || 'Direct',
                    icon: 'userplus',
                    id: 'created'
                });

                items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setActivityItems(items);
            } catch (err) {
                console.error('Error fetching activity:', err);
                setActivityItems([{ type: 'created', date: selectedLead.created_at, label: 'Lead Added', sublabel: selectedLead.source || 'Direct', icon: 'userplus', id: 'created' }]);
            } finally {
                setActivityLoading(false);
            }
        };

        fetchActivity();
    }, [selectedLead?.id]);

    useEffect(() => {
        fetchLeads();
        fetchCallScripts();
        fetchSequences();
    }, [campaignFilter, intentScoreSort, intentScoreFilters]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All'
                ? true
                : statusFilter === 'Lost'
                    ? (lead.status === 'Lost' || lead.status === 'Not Interested')
                    : lead.status === statusFilter;

            let matchesIntent = true;
            if (activeIntentFilters.length > 0) {
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

                if (activeIntentFilters.includes('new_business')) {
                    const leadDate = new Date(lead.created_at);
                    if (leadDate < sixMonthsAgo) matchesIntent = false;
                }
                if (activeIntentFilters.includes('low_rating')) {
                    if (lead.rating !== undefined && lead.rating !== null && lead.rating >= 4.0) matchesIntent = false;
                }
                if (activeIntentFilters.includes('no_photos')) {
                    if (lead.photo_url && lead.photo_url.trim() !== '') matchesIntent = false;
                }
                if (activeIntentFilters.includes('no_reviews')) {
                    if (lead.review_count && lead.review_count > 0) matchesIntent = false;
                }
                if (activeIntentFilters.includes('incomplete')) {
                    const hasWebsite = lead.website && lead.website.trim() !== '';
                    const hasPhone = lead.phone && lead.phone.trim() !== '';
                    const hasEmail = lead.email && lead.email.trim() !== '';
                    if (hasWebsite && hasPhone && hasEmail) matchesIntent = false;
                }
            }

            // Intent score range filtering (client-side for multiple selections)
            let matchesIntentScore = true;
            if (intentScoreFilters.length > 0) {
                const score = lead.intent_score;
                const isHot = score !== null && score !== undefined && score >= 75;
                const isWarm = score !== null && score !== undefined && score >= 50 && score < 75;
                const isCool = score !== null && score !== undefined && score >= 25 && score < 50;
                const isUnscored = score === null || score === undefined;

                matchesIntentScore = (
                    (intentScoreFilters.includes('hot') && isHot) ||
                    (intentScoreFilters.includes('warm') && isWarm) ||
                    (intentScoreFilters.includes('cool') && isCool) ||
                    (intentScoreFilters.includes('unscored') && isUnscored)
                );
            }

            return matchesSearch && matchesStatus && matchesIntent && matchesIntentScore;
        });
    }, [leads, searchQuery, statusFilter, activeIntentFilters, intentScoreFilters]);

    // Derived counts for the smart filters to show in the badges
    const intentCounts = useMemo(() => {
        const counts = { new_business: 0, low_rating: 0, no_photos: 0, no_reviews: 0, incomplete: 0 };
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Count how many of the *currently search and status filtered* leads match each intent filter
        const baseFilteredLeads = leads.filter(lead => {
            const matchesSearch = lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' ? true : statusFilter === 'Lost' ? (lead.status === 'Lost' || lead.status === 'Not Interested') : lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        baseFilteredLeads.forEach(lead => {
            const leadDate = new Date(lead.created_at);
            if (leadDate >= sixMonthsAgo) counts.new_business++;
            if (lead.rating === undefined || lead.rating === null || lead.rating < 4.0) counts.low_rating++;
            if (!lead.photo_url || lead.photo_url.trim() === '') counts.no_photos++;
            if (!lead.review_count || lead.review_count === 0) counts.no_reviews++;

            const hasWebsite = lead.website && lead.website.trim() !== '';
            const hasPhone = lead.phone && lead.phone.trim() !== '';
            const hasEmail = lead.email && lead.email.trim() !== '';
            if (!hasWebsite || !hasPhone || !hasEmail) counts.incomplete++;
        });

        return counts;
    }, [leads, searchQuery, statusFilter]);

    // Intent score counts for filter badges
    const intentScoreCounts = useMemo(() => {
        const counts = { hot: 0, warm: 0, cool: 0, unscored: 0 };
        const baseFilteredLeads = leads.filter(lead => {
            const matchesSearch = lead.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.location?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' ? true : statusFilter === 'Lost' ? (lead.status === 'Lost' || lead.status === 'Not Interested') : lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        baseFilteredLeads.forEach(lead => {
            const score = lead.intent_score;
            if (score === null || score === undefined) counts.unscored++;
            else if (score >= 75) counts.hot++;
            else if (score >= 50) counts.warm++;
            else if (score >= 25) counts.cool++;
        });

        return counts;
    }, [leads, searchQuery, statusFilter]);

    const toggleIntentFilter = (filter: string) => {
        setActiveIntentFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const toggleIntentScoreFilter = (filter: string) => {
        setIntentScoreFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    const handleExport = async () => {
        if (canAccess && !canAccess('csvExport')) {
            triggerUpgrade?.('CSV Export', 'starter');
            return;
        }

        if (!filteredLeads || filteredLeads.length === 0) {
            alert('No leads to export.');
            return;
        }

        setIsExporting(true);
        try {
            const headers = [
                'Company',
                'First Name',
                'Last Name',
                'Email',
                'Phone',
                'Website',
                'Location',
                'Industry',
                'Source',
                'Status'
            ];

            const rows = filteredLeads.map(lead => [
                lead.company || '',
                lead.first_name || '',
                lead.last_name || '',
                lead.email || '',
                lead.phone || '',
                lead.website || '',
                lead.location || '',
                lead.industry || '',
                lead.source || 'Direct',
                lead.status || ''
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row =>
                    row.map(cell => {
                        const str = String(cell).replace(/"/g, '""');
                        return str.includes(',') || str.includes('"') || str.includes('\n')
                            ? `"${str}"`
                            : str;
                    }).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leadomation-leads-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting leads:', error);
            alert('Error exporting leads. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedLeads.length === filteredLeads.length) {
            setSelectedLeads([]);
        } else {
            setSelectedLeads(filteredLeads.map(l => l.id));
        }
    };

    const toggleSelectLead = (id: string) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const handleSaveLeadEdit = async () => {
        if (!selectedLead) return;
        setIsSavingLead(true);
        try {
            const { error } = await supabase.from('leads').update(editLeadForm).eq('id', selectedLead.id);
            if (error) throw error;

            const updatedLead = { ...selectedLead, ...editLeadForm } as Lead;
            setLeads(prev => prev.map(l => l.id === selectedLead.id ? updatedLead : l));
            setSelectedLead(updatedLead);
            setIsEditingLead(false);
            showToast('Lead updated successfully');
        } catch (error) {
            console.error('Error saving lead edit:', error);
            showToast('Failed to save changes. Please try again.');
        } finally {
            setIsSavingLead(false);
        }
    };

    const handleUpdateStatus = async (leadId: string, newStatus: string) => {
        setIsUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('leads')
                .update({ status: newStatus })
                .eq('id', leadId);

            if (error) throw error;

            const targetLead = leads.find(l => l.id === leadId);

            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            if (selectedLead && selectedLead.id === leadId) {
                setSelectedLead({ ...selectedLead, status: newStatus });
            }

            // Auto-create deal if status changes to Qualified
            if (newStatus === 'Qualified' && targetLead) {
                const { data: dealData, error: dealError } = await supabase
                    .from('deals')
                    .select('id')
                    .eq('lead_id', leadId)
                    .maybeSingle();

                if (!dealError && !dealData) {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { error: insertError } = await supabase.from('deals').insert({
                            user_id: user.id,
                            lead_id: leadId,
                            title: `${targetLead.company || 'Unknown Company'} - Discovery Call`,
                            stage: 'discovery',
                            value: 0,
                            notes: 'Auto-created from qualified lead'
                        });

                        if (!insertError) {
                            console.log(`Auto-created deal for qualified lead: ${targetLead.company}`);
                        } else {
                            console.error('Failed to auto-create deal:', insertError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleDeleteLead = async (leadId: string) => {
        if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadId);

            if (error) throw error;

            setLeads(prev => prev.filter(l => l.id !== leadId));
            setSelectedLead(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert('Failed to delete lead');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEnrichLead = async (leadId: string) => {
        const lead = leads.find(l => l.id === leadId);
        if (!lead) return;

        // Derive domain from website
        if (!lead.website) {
            showToast('Cannot enrich because no website or company domain is available.');
            return;
        }

        const domain = lead.website
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .split('/')[0]
            .trim();

        if (!domain) {
            showToast('Cannot enrich because no website or company domain is available.');
            return;
        }

        setEnrichingLeads(prev => [...prev, leadId]);

        try {
            const response = await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/lead-enrichment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lead_id: lead.id,
                    domain,
                    first_name: lead.first_name,
                    last_name: lead.last_name
                })
            });

            if (!response.ok) throw new Error('Enrichment request failed');

            const data = await response.json();

            if (!data.email) {
                showToast('No email found for this domain.');
                return;
            }

            // Update lead in Supabase
            const updates: any = {};
            if (data.email) updates.email = data.email;
            if (data.first_name) updates.first_name = data.first_name;
            if (data.last_name) updates.last_name = data.last_name;

            await supabase.from('leads').update(updates).eq('id', leadId);

            // Update local state so drawer refreshes immediately
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
            if (selectedLead && selectedLead.id === leadId) {
                setSelectedLead({ ...selectedLead, ...updates });
            }

            showToast('Lead enriched successfully. Email updated.');
        } catch (error) {
            console.error('Enrichment error:', error);
            showToast('No email found for this domain.');
        } finally {
            setEnrichingLeads(prev => prev.filter(id => id !== leadId));
        }
    };

    const handleInitiateCall = (lead: Lead) => {
        if (!lead.phone) {
            alert('This lead has no phone number. Add a phone number first.');
            return;
        }
        if (callScripts.length === 0) {
            alert('No call scripts found. Create a call script in the Call Agent page first.');
            return;
        }
        setCallLeadTarget(lead);
        setCallStatus('idle');
        setShowCallModal(true);
    };

    const handleMakeCall = async () => {
        if (!callLeadTarget || !selectedScriptId) return;

        const script = callScripts.find(s => s.id === selectedScriptId);
        if (!script) return;

        setCallInProgress(true);
        setCallStatus('calling');

        try {
            const apiKey = import.meta.env.VITE_VAPI_API_KEY;
            const phoneNumberId = import.meta.env.VITE_VAPI_PHONE_NUMBER_ID;

            if (!apiKey || !phoneNumberId) {
                throw new Error('Vapi API key or phone number not configured');
            }

            let phoneNumber = callLeadTarget.phone.replace(/\s/g, '');
            if (!phoneNumber.startsWith('+')) {
                phoneNumber = '+' + phoneNumber;
            }

            const { data: { user } } = await supabase.auth.getUser();

            const response = await fetch('https://api.vapi.ai/call/phone', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumberId: phoneNumberId,
                    metadata: {
                        user_id: user?.id || '',
                        lead_id: callLeadTarget.id,
                        call_script_id: selectedScriptId
                    },
                    customer: {
                        number: phoneNumber,
                        name: `${callLeadTarget.first_name || ''} ${callLeadTarget.last_name || ''}`.trim() || callLeadTarget.company
                    },
                    assistant: {
                        name: 'Sarah',
                        serverUrl: 'https://n8n.srv1377696.hstgr.cloud/webhook/2d5b4f99-77c8-48e7-a8b9-78b28c789ea2',
                        firstMessage: `Hi there, is ${callLeadTarget.first_name || 'the manager'} available at all?`,
                        firstMessageMode: 'assistant-waits-for-user',
                        model: {
                            provider: 'openai',
                            model: 'gpt-4o-mini',
                            temperature: 0.7,
                            messages: [
                                {
                                    role: 'system',
                                    content: script.system_prompt + `\n\nCALL CONTEXT:\n- You are calling: ${callLeadTarget.first_name || ''} ${callLeadTarget.last_name || ''}\n- Their company: ${callLeadTarget.company}\n- Their role: ${callLeadTarget.job_title || 'Unknown'}\n- Your name is Sarah. Always introduce yourself as Sarah calling on behalf of the company mentioned in your script\n- ALWAYS start by asking for ${callLeadTarget.first_name || 'the right person'} by name. Wait for confirmation before pitching anything.\n- After confirming you are speaking to the right person, say "Hey ${callLeadTarget.first_name || 'there'}, it is Sarah calling on behalf of" and then mention the company from your script. Then say "How are you doing today?" and WAIT for their response before continuing.\n\nCONVERSATION STYLE:\n- Sound like a real human being having a phone conversation, not a robot or AI\n- Use filler words occasionally like "um", "so", "right", "anyway" to sound natural\n- Keep responses SHORT. One sentence at a time. Real people do not give speeches on the phone\n- After saying something, STOP and wait for the other person to respond. Do not keep talking\n- React to what they say before moving on. Say things like "oh nice", "ah right okay", "yeah that makes sense"\n- Match the speed and tone of the person you are talking to\n- Laugh briefly if something is funny. Be personable\n- NEVER read out URLs, links, or email addresses. Say you will text or email them instead\n- NEVER say "as an AI" or "I am an artificial intelligence" unless directly asked\n- If asked if you are real, say "Ha, I get that a lot. I am actually an AI assistant calling on behalf of the team, but I can definitely help you out or get someone from the team to call you back"\n- Do not repeat yourself or circle back to things already discussed\n\nBOOKING A MEETING:\n- When the prospect agrees to a meeting, say: "Brilliant, let me get that booked in for you. What is the best email address to send the calendar invite to?"\n- Wait for them to give their email. Confirm it back by repeating it\n- Then say: "Perfect. And what is the best mobile number to ping the confirmation text to? Sometimes these get buried in email"\n- If they give the business number you called, say: "No problem. And is that a mobile? Just so the text comes through properly"\n- Once you have their mobile number, confirm it back to them\n- Then say: "Lovely, I will get that sent over to you now. You should have it in the next couple of minutes"\n- NEVER mention that you already have their email or any of their details. Let them provide everything naturally\n- NEVER read out a URL or booking link. Just say you will send the invite to their email and a text to their mobile\n- Store the email and mobile number they give you. These are critical for follow up\n- Keep the booking process feeling personal and human, like a real assistant would handle it`
                                }
                            ]
                        },
                        voice: {
                            provider: '11labs',
                            voiceId: 'cgSgspJ2msm6clMCkdW9',
                            model: 'eleven_turbo_v2_5'
                        },
                        silenceTimeoutSeconds: 30,
                        responseDelaySeconds: 0.5
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Vapi API error:', errorData);
                throw new Error(errorData.message || 'Failed to initiate call');
            }

            const callData = await response.json();
            console.log('Call initiated:', callData);
            setCallStatus('connected');

            await handleUpdateStatus(callLeadTarget.id, 'Contacted');

            if (user) {
                await supabase.from('call_logs').insert({
                    user_id: user.id,
                    lead_id: callLeadTarget.id,
                    call_script_id: selectedScriptId,
                    vapi_call_id: callData.id,
                    status: 'initiated',
                    phone_number: phoneNumber
                });
            }

        } catch (error: any) {
            console.error('Call error:', error);
            setCallStatus('error');
            alert(`Failed to initiate call: ${error.message}`);
        } finally {
            setCallInProgress(false);
        }
    };

    const handleSaveLead = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('leads')
                .insert({
                    ...newLead,
                    user_id: user.id
                });

            if (error) throw error;

            await fetchLeads();
            setIsAddModalOpen(false);
            setNewLead({
                company: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                location: '',
                industry: '',
                website: '',
                job_title: '',
                linkedin_url: '',
                status: 'New'
            });
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('Failed to save lead. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && leads.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
            {campaignFilter && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Tag className="text-[#4F46E5] w-4 h-4" />
                        <span className="text-sm font-medium text-[#4F46E5]">
                            Showing leads for campaign
                        </span>
                    </div>
                    <button
                        onClick={clearCampaignFilter}
                        className="text-[#4F46E5] hover:text-blue-800 transition-colors p-1"
                        title="Clear filter"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            {/* Info Card */}
            {showInfoCard && (
                <div className="relative bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
                        <Info size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black text-[#111827] mb-1">Your Lead Database</h3>
                        <p className="text-xs font-medium text-[#4B5563] leading-relaxed mb-3">
                            This is where all your scraped leads land after a campaign runs. Use the filters to find your best prospects, check the local time indicator before calling, and take action directly from here to send emails, make AI-powered calls, or export to CSV. Leads marked as Qualified will automatically appear in your Deal Pipeline.
                            <br /><br />
                            <strong className="text-[#111827]">Smart Intent Filters</strong> help you identify the warmest leads in your database. These are businesses that are most likely to need your help right now. A business with a low rating may be struggling with reputation management, and a new business may need services to get established quickly. No photos or an incomplete listing suggests they haven't invested in their online presence yet, making them ideal outreach targets. Use multiple filters together to find your highest-priority prospects.
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                                <span className="text-[10px] font-bold text-[#6B7280]">Business hours (Mon-Fri 9am-5pm)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1.5">
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                                <span className="text-[10px] font-bold text-[#6B7280]">Borderline (8-9am or 5-6pm)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1.5">
                                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                                <span className="text-[10px] font-bold text-[#6B7280]">Outside hours / Weekend</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInfoCard(false)}
                        className="p-1.5 hover:bg-indigo-100 rounded-lg text-[#9CA3AF] hover:text-[#6B7280] transition-all shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Filters and Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center w-[400px] bg-white border border-[#E5E7EB] rounded-full px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all group">
                        <Search className="text-[#9CA3AF] group-focus-within:text-primary transition-colors shrink-0" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads by name, email, city..."
                            className="w-full pl-3 pr-2 py-2.5 bg-transparent border-none focus:outline-none text-sm font-medium placeholder:text-[#9CA3AF]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-full px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all group h-[42px]">
                            <Tag className="text-[#9CA3AF] group-focus-within:text-primary transition-colors shrink-0" size={16} />
                            <select
                                className="pl-3 pr-8 py-2 bg-transparent border-none focus:outline-none text-sm font-bold text-[#374151] appearance-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Statuses</option>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Replied">Replied</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Lost">Lost / Not Interested</option>
                            </select>
                            <ChevronDown className="text-[#9CA3AF] -ml-6 pointer-events-none group-focus-within:text-primary transition-colors" size={14} />
                        </div>

                        {/* Intent Score Sort Dropdown */}
                        <div className="flex items-center bg-white border border-[#E5E7EB] rounded-full px-4 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all group h-[42px]">
                            <TrendingUp className="text-[#9CA3AF] group-focus-within:text-primary transition-colors shrink-0" size={16} />
                            <select
                                className="pl-3 pr-8 py-2 bg-transparent border-none focus:outline-none text-sm font-bold text-[#374151] appearance-none cursor-pointer"
                                value={intentScoreSort}
                                onChange={(e) => setIntentScoreSort(e.target.value as 'none' | 'desc' | 'asc')}
                            >
                                <option value="none">Sort: Recent</option>
                                <option value="desc">Highest Intent First</option>
                                <option value="asc">Lowest Intent First</option>
                            </select>
                            <ChevronDown className="text-[#9CA3AF] -ml-6 pointer-events-none group-focus-within:text-primary transition-colors" size={14} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${canAccess && !canAccess('csvExport')
                            ? 'border-[#E5E7EB] text-gray-400 bg-white'
                            : 'border-[#4F46E5] text-[#4F46E5] bg-white hover:bg-[#EEF2FF]'
                            }`}
                    >
                        {isExporting ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : canAccess && !canAccess('csvExport') ? (
                            <Lock size={15} className="text-gray-400" />
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 -2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        )}
                        <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
                        {canAccess && !canAccess('csvExport') && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1 font-black">PRO</span>
                        )}
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:transform active:scale-95"
                    >
                        <Plus size={16} />
                        Add Lead
                    </button>
                </div>
            </div>

            {/* Smart Intent Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#9CA3AF] mr-2 shrink-0">
                    Smart Filters
                </span>

                <button
                    onClick={() => toggleIntentFilter('new_business')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${activeIntentFilters.includes('new_business') ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span role="img" aria-label="new">🆕</span>
                    New Business
                    <span className="ml-1 opacity-70">({intentCounts.new_business})</span>
                </button>

                <button
                    onClick={() => toggleIntentFilter('low_rating')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${activeIntentFilters.includes('low_rating') ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span role="img" aria-label="star">⭐</span>
                    Low Rating
                    <span className="ml-1 opacity-70">({intentCounts.low_rating})</span>
                </button>

                <button
                    onClick={() => toggleIntentFilter('no_photos')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${activeIntentFilters.includes('no_photos') ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span role="img" aria-label="camera">📸</span>
                    No Photos
                    <span className="ml-1 opacity-70">({intentCounts.no_photos})</span>
                </button>

                <button
                    onClick={() => toggleIntentFilter('no_reviews')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${activeIntentFilters.includes('no_reviews') ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span role="img" aria-label="speech balloon">💬</span>
                    No Recent Reviews
                    <span className="ml-1 opacity-70">({intentCounts.no_reviews})</span>
                </button>

                <button
                    onClick={() => toggleIntentFilter('incomplete')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${activeIntentFilters.includes('incomplete') ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <span role="img" aria-label="pin">📍</span>
                    Incomplete Listing
                    <span className="ml-1 opacity-70">({intentCounts.incomplete})</span>
                </button>

                {activeIntentFilters.length > 0 && (
                    <button
                        onClick={() => setActiveIntentFilters([])}
                        className="text-xs font-bold text-[#6B7280] hover:text-[#4F46E5] transition-colors ml-2 shrink-0 underline decoration-dotted underline-offset-2"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Intent Score Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#9CA3AF] mr-2 shrink-0">
                    Intent Score
                </span>

                <button
                    onClick={() => toggleIntentScoreFilter('hot')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${intentScoreFilters.includes('hot') ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}
                >
                    <Flame size={12} />
                    Hot (75+)
                    <span className="ml-1 opacity-70">({intentScoreCounts.hot})</span>
                </button>

                <button
                    onClick={() => toggleIntentScoreFilter('warm')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${intentScoreFilters.includes('warm') ? 'bg-amber-50 border-amber-300 text-amber-600' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}
                >
                    <span role="img" aria-label="warm">🌡️</span>
                    Warm (50-74)
                    <span className="ml-1 opacity-70">({intentScoreCounts.warm})</span>
                </button>

                <button
                    onClick={() => toggleIntentScoreFilter('cool')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${intentScoreFilters.includes('cool') ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}
                >
                    <span role="img" aria-label="cool">❄️</span>
                    Cool (25-49)
                    <span className="ml-1 opacity-70">({intentScoreCounts.cool})</span>
                </button>

                <button
                    onClick={() => toggleIntentScoreFilter('unscored')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all shrink-0 ${intentScoreFilters.includes('unscored') ? 'bg-gray-100 border-gray-400 text-gray-600' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'}`}
                >
                    <span role="img" aria-label="unscored">❓</span>
                    Unscored
                    <span className="ml-1 opacity-70">({intentScoreCounts.unscored})</span>
                </button>

                {intentScoreFilters.length > 0 && (
                    <button
                        onClick={() => setIntentScoreFilters([])}
                        className="text-xs font-bold text-[#6B7280] hover:text-[#4F46E5] transition-colors ml-2 shrink-0 underline decoration-dotted underline-offset-2"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Main Content: Data Table */}
            <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden flex flex-col">
                {filteredLeads.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Building size={32} />
                        </div>
                        <h3 className="text-lg font-black text-[#111827] mb-1">No leads found</h3>
                        <p className="text-sm font-medium text-[#6B7280]">Try adjusting your search or filters, or launch a campaign to generate more.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="w-10 px-6 py-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary/20"
                                            checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer group">
                                        <div className="flex items-center gap-1.5">
                                            Company
                                            <ChevronDown size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Local Time</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Industry</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Intent</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</th>
                                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">LinkedIn</th>
                                    <th className="w-10 pr-6 pl-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        className={`group cursor-pointer transition-colors duration-100 border-b border-slate-100 ${selectedLeads.includes(lead.id) ? 'bg-indigo-50' : 'hover:bg-slate-50'
                                            }`}
                                        onClick={() => setSelectedLead(lead)}
                                    >
                                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[#D1D5DB] text-primary focus:ring-primary/20"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={() => toggleSelectLead(lead.id)}
                                            />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-[#111827]">{lead.company || 'N/A'}</span>
                                                    {lead.job_title && (
                                                        <span className="px-1.5 py-0.5 bg-blue-50 text-[9px] font-black text-primary border border-blue-100 rounded uppercase tracking-tighter">
                                                            Enriched
                                                        </span>
                                                    )}
                                                </div>
                                                {lead.job_title && (
                                                    <span className="text-[11px] text-primary font-bold leading-none">{lead.job_title}</span>
                                                )}
                                                <span className="text-[11px] text-[#9CA3AF] font-medium leading-none">
                                                    {(lead.first_name || lead.last_name) ? `${lead.first_name} ${lead.last_name}` : 'Unknown Contact'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.email || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.phone || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.location || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4">
                                            {(() => {
                                                if (!lead.location) return <span className="text-xs text-[#9CA3AF]">—</span>;
                                                const lt = getLocalTime(lead.location);
                                                return (
                                                    <div className="flex items-center gap-1.5" title={lt.reason}>
                                                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: timeStatusColors[lt.status] }} />
                                                        <span className="text-xs font-bold" style={{ color: timeStatusColors[lt.status] }}>{lt.time}</span>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-[#4B5563]">
                                            {lead.industry || 'N/A'}
                                        </td>
                                        <td className="px-4 py-4">
                                            {(() => {
                                                const status = lead.status?.toLowerCase() || 'new';
                                                let classes = 'bg-slate-100 text-slate-700';

                                                if (status === 'new') classes = 'bg-slate-100 text-slate-700';
                                                else if (status === 'contacted') classes = 'bg-amber-50 text-amber-700';
                                                else if (status === 'replied') classes = 'bg-emerald-50 text-emerald-700';
                                                else if (status === 'interested') classes = 'bg-emerald-50 text-emerald-700';
                                                else if (status === 'qualified') classes = 'bg-purple-50 text-purple-700';
                                                else if (status === 'lost' || status === 'not interested') classes = 'bg-rose-50 text-rose-700';

                                                return (
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
                                                        {status.toUpperCase()}
                                                    </span>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <IntentScoreBadge lead={lead} />
                                        </td>
                                        <td className="px-4 py-4">
                                            {lead.website ? (
                                                <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-bold" onClick={(e) => e.stopPropagation()}>
                                                    Link
                                                </a>
                                            ) : (
                                                <span className="text-[#9CA3AF] text-xs">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {lead.linkedin_url ? (
                                                <a
                                                    href={lead.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center text-primary hover:text-blue-700 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Linkedin size={16} />
                                                </a>
                                            ) : (
                                                <span className="text-[#9CA3AF] text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="pr-6 pl-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleInitiateCall(lead)}
                                                    className="p-2 rounded-lg transition-all hover:bg-green-50 text-[#9CA3AF] hover:text-green-600"
                                                    title="Call Lead"
                                                >
                                                    <Phone size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleLinkedInEnroll(lead)}
                                                    className="p-2 rounded-lg transition-all hover:bg-blue-50 text-[#9CA3AF] hover:text-blue-600"
                                                    title="Enrol in LinkedIn Sequence"
                                                >
                                                    <UserPlus size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEnrichLead(lead.id)}
                                                    disabled={enrichingLeads.includes(lead.id)}
                                                    className={`p-2 rounded-lg transition-all ${enrichingLeads.includes(lead.id) ? 'bg-blue-50 text-primary' : 'hover:bg-gray-100 text-[#9CA3AF] hover:text-primary'}`}
                                                    title="Enrich Lead"
                                                >
                                                    {enrichingLeads.includes(lead.id) ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                                                </button>
                                                <button className="p-1 hover:bg-gray-100 rounded text-[#9CA3AF] transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Bottom Section: Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    <span className="text-xs font-bold text-[#9CA3AF]">
                        Showing {filteredLeads.length} of {leads.length} leads
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            Previous
                        </button>
                        <div className="flex items-center gap-1">
                            {[1].map(page => (
                                <button
                                    key={page}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1 ? 'bg-primary text-white' : 'hover:bg-gray-200 text-[#6B7280]'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button className="px-3 py-1.5 border border-[#E5E7EB] bg-white rounded-lg text-xs font-bold text-[#374151] hover:bg-gray-50 transition-all">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Lead Details Drawer */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => { setSelectedLead(null); setIsEditingLead(false); }}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
                        {/* Drawer Header */}
                        <div className="p-8 border-b border-[#F3F4F6]">
                            {isEditingLead ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                                                <Building size={24} />
                                            </div>
                                            <h2 className="text-xl font-black text-[#111827]">{selectedLead.company}</h2>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={handleSaveLeadEdit} disabled={isSavingLead} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                                                {isSavingLead ? <Loader2 size={12} className="animate-spin" /> : 'Save'}
                                            </button>
                                            <button onClick={() => setIsEditingLead(false)} className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#6B7280] text-xs font-bold rounded-lg transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">First Name</label>
                                            <input className="border border-gray-200 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" value={editLeadForm.first_name || ''} onChange={e => setEditLeadForm({ ...editLeadForm, first_name: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Last Name</label>
                                            <input className="border border-gray-200 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" value={editLeadForm.last_name || ''} onChange={e => setEditLeadForm({ ...editLeadForm, last_name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">Job Title</label>
                                        <input className="border border-gray-200 rounded-md px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" value={editLeadForm.job_title || ''} onChange={e => setEditLeadForm({ ...editLeadForm, job_title: e.target.value })} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                                            <Building size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-xl font-black text-[#111827]">{selectedLead.company}</h2>
                                                {selectedLead.job_title && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-[10px] font-black text-primary border border-blue-100 rounded-lg uppercase tracking-wider">
                                                        Enriched
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-primary font-bold">{selectedLead.job_title || 'No Job Title'}</p>
                                                <span className="text-gray-300">•</span>
                                                <p className="text-sm text-[#6B7280] font-medium">{selectedLead.first_name} {selectedLead.last_name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditLeadForm({
                                                    first_name: selectedLead.first_name,
                                                    last_name: selectedLead.last_name,
                                                    job_title: selectedLead.job_title,
                                                    email: selectedLead.email,
                                                    phone: selectedLead.phone,
                                                    website: selectedLead.website,
                                                    location: selectedLead.location,
                                                    industry: selectedLead.industry,
                                                    linkedin_url: selectedLead.linkedin_url
                                                });
                                                setIsEditingLead(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
                                            title="Edit Lead"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedLead(null); setIsEditingLead(false); }}
                                            className="p-2 hover:bg-gray-50 rounded-xl text-[#9CA3AF] transition-all"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Status Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block pl-1">Lead Status</label>
                                <div className="flex items-center gap-3">
                                    <select
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer"
                                        value={selectedLead.status}
                                        onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                                        disabled={isUpdatingStatus}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Not Interested">Not Interested</option>
                                    </select>
                                    {isUpdatingStatus && <Loader2 size={18} className="animate-spin text-primary" />}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Mail size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.email || ''} onChange={e => setEditLeadForm({ ...editLeadForm, email: e.target.value })} />
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827] break-all">{selectedLead.email || 'N/A'}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Phone size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Phone</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.phone || ''} onChange={e => setEditLeadForm({ ...editLeadForm, phone: e.target.value })} />
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827]">{selectedLead.phone || 'N/A'}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Linkedin size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">LinkedIn</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.linkedin_url || ''} onChange={e => setEditLeadForm({ ...editLeadForm, linkedin_url: e.target.value })} />
                                    ) : (
                                        selectedLead.linkedin_url ? (
                                            <a href={selectedLead.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                                                View Profile <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-bold text-[#111827]">N/A</p>
                                        )
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Globe size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Website</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.website || ''} onChange={e => setEditLeadForm({ ...editLeadForm, website: e.target.value })} />
                                    ) : (
                                        selectedLead.website ? (
                                            <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary hover:underline flex items-center gap-1.5">
                                                Visit Site <ExternalLink size={12} />
                                            </a>
                                        ) : (
                                            <p className="text-sm font-bold text-[#111827]">N/A</p>
                                        )
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <MapPin size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.location || ''} onChange={e => setEditLeadForm({ ...editLeadForm, location: e.target.value })} />
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827]">{selectedLead.location || 'N/A'}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Tag size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Industry</span>
                                    </div>
                                    {isEditingLead ? (
                                        <input className="border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" value={editLeadForm.industry || ''} onChange={e => setEditLeadForm({ ...editLeadForm, industry: e.target.value })} />
                                    ) : (
                                        <p className="text-sm font-bold text-[#111827]">{selectedLead.industry || 'N/A'}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Created</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-[#9CA3AF]">
                                        <Search size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Source</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#111827]">{selectedLead.source || 'Direct'}</p>
                                </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 pl-1">
                                    <Clock size={14} className="text-[#9CA3AF]" />
                                    <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Activity</span>
                                </div>

                                {activityLoading ? (
                                    <div className="space-y-4 pl-1">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-start gap-3 animate-pulse">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0" />
                                                <div className="flex-1 space-y-2 pt-1">
                                                    <div className="h-3 bg-gray-100 rounded w-32" />
                                                    <div className="h-2.5 bg-gray-50 rounded w-48" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Vertical timeline line */}
                                        {activityItems.length > 1 && (
                                            <div
                                                className="absolute left-[15px] top-4 bottom-4 w-px bg-[#E5E7EB]"
                                                style={{ zIndex: 0 }}
                                            />
                                        )}

                                        <div className="space-y-0">
                                            {activityItems.map((item, idx) => {
                                                const iconConfig: Record<string, { bg: string; color: string; Icon: any }> = {
                                                    phone: { bg: 'bg-indigo-50', color: 'text-[#4F46E5]', Icon: Phone },
                                                    star: { bg: 'bg-amber-50', color: 'text-amber-500', Icon: Star },
                                                    mail: { bg: 'bg-purple-50', color: 'text-purple-500', Icon: Mail },
                                                    userplus: { bg: 'bg-gray-50', color: 'text-[#9CA3AF]', Icon: UserPlus }
                                                };
                                                const cfg = iconConfig[item.icon] || iconConfig.userplus;
                                                const IconComponent = cfg.Icon;
                                                const isExpanded = expandedTranscripts.has(item.id);

                                                return (
                                                    <div key={item.id + '-' + idx} className="flex items-start gap-3 relative py-2.5">
                                                        <div className={`w-8 h-8 ${cfg.bg} rounded-full flex items-center justify-center shrink-0 relative z-10`}>
                                                            <IconComponent size={14} className={cfg.color} />
                                                        </div>
                                                        <div className="flex-1 min-w-0 pt-0.5">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-xs font-black text-[#111827]">{item.label}</span>
                                                                <span className="text-[10px] font-medium text-[#9CA3AF] shrink-0">{getRelativeTime(item.date)}</span>
                                                            </div>
                                                            <p className="text-[11px] font-medium text-[#6B7280] mt-0.5 truncate">{item.sublabel}</p>
                                                            {item.type === 'call' && item.transcript && (
                                                                <div className="mt-1.5">
                                                                    <button
                                                                        onClick={() => {
                                                                            setExpandedTranscripts(prev => {
                                                                                const next = new Set(prev);
                                                                                if (next.has(item.id)) next.delete(item.id);
                                                                                else next.add(item.id);
                                                                                return next;
                                                                            });
                                                                        }}
                                                                        className="text-[10px] font-bold text-[#4F46E5] hover:underline"
                                                                    >
                                                                        {isExpanded ? 'Hide transcript' : 'View transcript'}
                                                                    </button>
                                                                    {isExpanded && (
                                                                        <div className="mt-2 p-3 bg-gray-50 border border-[#E5E7EB] rounded-lg">
                                                                            <p className="text-[11px] font-mono text-[#6B7280] leading-relaxed whitespace-pre-wrap">
                                                                                {item.transcript.length > 300 ? item.transcript.slice(0, 300) + '...' : item.transcript}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {/* Custom Audio Player */}
                                                            {item.type === 'call' && item.recording_url && (
                                                                <div className="mt-2">
                                                                    <div className="flex items-center gap-1 mb-1">
                                                                        <Mic size={10} className="text-white/40" />
                                                                        <span className="text-[10px] font-bold text-white/40">Call Recording</span>
                                                                    </div>
                                                                    <div className="w-full bg-[#1e1b4b] rounded-full px-4 py-2.5 ring-1 ring-white/10">
                                                                        <audio
                                                                            ref={el => { audioRefs.current[item.id] = el; }}
                                                                            src={item.recording_url}
                                                                            preload="metadata"
                                                                            onLoadedMetadata={(e) => {
                                                                                const audio = e.currentTarget;
                                                                                setAudioStates(prev => ({ ...prev, [item.id]: { isPlaying: false, currentTime: 0, duration: audio.duration, isMuted: false } }));
                                                                            }}
                                                                            onTimeUpdate={(e) => {
                                                                                const audio = e.currentTarget;
                                                                                setAudioStates(prev => ({ ...prev, [item.id]: { ...prev[item.id], currentTime: audio.currentTime } }));
                                                                            }}
                                                                            onEnded={() => {
                                                                                const audio = audioRefs.current[item.id];
                                                                                if (audio) audio.currentTime = 0;
                                                                                setAudioStates(prev => ({ ...prev, [item.id]: { ...prev[item.id], isPlaying: false, currentTime: 0 } }));
                                                                            }}
                                                                            className="hidden"
                                                                        />
                                                                        <div className="flex items-center gap-3">
                                                                            {/* Play/Pause Button */}
                                                                            <button
                                                                                onClick={() => toggleAudioPlay(item.id)}
                                                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0 transition-transform active:scale-95 hover:shadow-lg hover:shadow-indigo-500/30"
                                                                            >
                                                                                {audioStates[item.id]?.isPlaying ? <Pause size={14} className="text-white" /> : <Play size={14} className="text-white ml-0.5" />}
                                                                            </button>

                                                                            {/* Time + Progress */}
                                                                            <span className="text-xs font-bold text-cyan-400 w-8 text-right shrink-0 tabular-nums">
                                                                                {formatAudioTime(audioStates[item.id]?.currentTime || 0)}
                                                                            </span>
                                                                            <div
                                                                                ref={el => { progressBarRefs.current[item.id] = el; }}
                                                                                className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer relative group"
                                                                                onClick={(e) => handleProgressClick(item.id, e)}
                                                                            >
                                                                                <div
                                                                                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                                                                                    style={{ width: `${audioStates[item.id]?.duration ? (audioStates[item.id].currentTime / audioStates[item.id].duration) * 100 : 0}%` }}
                                                                                />
                                                                            </div>
                                                                            <span className="text-xs font-medium text-white/40 w-8 shrink-0 tabular-nums">
                                                                                {formatAudioTime(audioStates[item.id]?.duration || 0)}
                                                                            </span>

                                                                            {/* Volume Toggle */}
                                                                            <button
                                                                                onClick={() => toggleAudioMute(item.id)}
                                                                                className="text-white/60 hover:text-white transition-colors shrink-0"
                                                                            >
                                                                                {audioStates[item.id]?.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Empty state when only the synthetic 'Lead Added' event exists */}
                                        {activityItems.length === 1 && activityItems[0].type === 'created' && (
                                            <p className="text-xs font-medium text-[#9CA3AF] pl-11 -mt-1">No outreach activity yet</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-8 border-t border-[#F3F4F6] bg-gray-50/50 flex flex-col gap-4">
                            {/* AI Call Button */}
                            <button
                                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                onClick={() => handleInitiateCall(selectedLead)}
                                disabled={!selectedLead.phone}
                            >
                                <PhoneCall size={18} />
                                {selectedLead.phone ? 'AI CALL AGENT' : 'NO PHONE NUMBER'}
                            </button>

                            <button
                                className={`w-full py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${enrichingLeads.includes(selectedLead.id) ? 'bg-indigo-50 text-primary shadow-indigo-500/5' : 'bg-white border border-[#E5E7EB] text-primary hover:bg-indigo-50 shadow-indigo-500/10'}`}
                                onClick={() => handleEnrichLead(selectedLead.id)}
                                disabled={enrichingLeads.includes(selectedLead.id)}
                            >
                                {enrichingLeads.includes(selectedLead.id) ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                                {enrichingLeads.includes(selectedLead.id) ? 'ENRICHING LEAD...' : 'ENRICH LEAD DATA'}
                            </button>

                            <button
                                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/10 hover:bg-[#4338CA] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                onClick={() => {
                                    alert(`Starting email sequence for ${selectedLead.company}`);
                                }}
                            >
                                <Mail size={18} />
                                START OUTREACH
                            </button>

                            <button
                                className="w-full py-4 border border-rose-100 bg-white text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                onClick={() => handleDeleteLead(selectedLead.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                DELETE LEAD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Call Modal */}
            {showCallModal && callLeadTarget && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-[#111827]">AI Call Agent</h3>
                                        <p className="text-xs text-[#6B7280]">Call {callLeadTarget.company}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowCallModal(false); setCallStatus('idle'); }}
                                    className="p-2 hover:bg-gray-50 rounded-xl text-[#9CA3AF] transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Lead Info */}
                            <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6]">
                                <p className="text-sm font-bold text-[#111827]">{callLeadTarget.company}</p>
                                <p className="text-xs text-[#6B7280] mt-1">{callLeadTarget.first_name} {callLeadTarget.last_name}</p>
                                <p className="text-xs font-bold text-[#4F46E5] mt-1">{callLeadTarget.phone}</p>
                            </div>

                            {/* Local Time Banner */}
                            {(() => {
                                if (!callLeadTarget.location) {
                                    return (
                                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
                                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                                            <p className="text-sm font-medium text-[#6B7280]">Unknown location. Local time cannot be determined.</p>
                                        </div>
                                    );
                                }
                                const lt = getLocalTime(callLeadTarget.location);
                                const bgColors = { green: 'bg-green-50 border-green-200', amber: 'bg-amber-50 border-amber-200', red: 'bg-red-50 border-red-200' };
                                const messages = {
                                    green: `Good time to call. Local time is ${lt.time} (${lt.reason})`,
                                    amber: `Borderline. Local time is ${lt.time} (${lt.reason})`,
                                    red: `Not recommended. Local time is ${lt.time} (${lt.reason})`
                                };
                                return (
                                    <div className={`p-3 ${bgColors[lt.status]} border rounded-xl flex items-center gap-2`}>
                                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: timeStatusColors[lt.status], flexShrink: 0 }} />
                                        <p className="text-sm font-bold" style={{ color: timeStatusColors[lt.status] }}>{messages[lt.status]}</p>
                                    </div>
                                );
                            })()}

                            {/* Script Selector */}
                            <div>
                                <label className="block text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Call Script</label>
                                <div className="relative">
                                    <select
                                        value={selectedScriptId}
                                        onChange={(e) => setSelectedScriptId(e.target.value)}
                                        className="w-full appearance-none px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#374151] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {callScripts.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                                </div>
                            </div>

                            {/* Call Status */}
                            {callStatus === 'calling' && (
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
                                    <Loader2 size={18} className="animate-spin text-amber-600" />
                                    <p className="text-sm font-bold text-amber-700">Initiating call...</p>
                                </div>
                            )}
                            {callStatus === 'connected' && (
                                <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
                                    <PhoneCall size={18} className="text-green-600" />
                                    <p className="text-sm font-bold text-green-700">Call initiated successfully! The AI agent is now calling {callLeadTarget.company}.</p>
                                </div>
                            )}
                            {callStatus === 'error' && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
                                    <PhoneOff size={18} className="text-red-600" />
                                    <p className="text-sm font-bold text-red-700">Call failed. Check the console for details.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => { setShowCallModal(false); setCallStatus('idle'); }}
                                className="flex-1 py-3 border border-[#E5E7EB] bg-white text-[#374151] rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
                            >
                                {callStatus === 'connected' ? 'Close' : 'Cancel'}
                            </button>
                            {callStatus !== 'connected' && (
                                <button
                                    onClick={handleMakeCall}
                                    disabled={callInProgress}
                                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {callInProgress ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Phone size={16} />
                                    )}
                                    {callInProgress ? 'Calling...' : 'Start Call'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Lead Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-[#111827]">Add New Lead</h3>
                                <p className="text-sm font-medium text-gray-400">Enter lead details manually into your database</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveLead} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Company Name *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Acme Corp"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.company}
                                        onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Lead Status</label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                                        value={newLead.status}
                                        onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                                    >
                                        <option value="New">New</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Qualified">Qualified</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Job Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. CEO"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.job_title}
                                        onChange={(e) => setNewLead({ ...newLead, job_title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.linkedin_url}
                                        onChange={(e) => setNewLead({ ...newLead, linkedin_url: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.first_name}
                                        onChange={(e) => setNewLead({ ...newLead, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Doe"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.last_name}
                                        onChange={(e) => setNewLead({ ...newLead, last_name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.email}
                                        onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={newLead.phone}
                                        onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. London, UK"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.location}
                                            onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Industry</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. Software"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.industry}
                                            onChange={(e) => setNewLead({ ...newLead, industry: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Website URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="url"
                                            placeholder="https://example.com"
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                            value={newLead.website}
                                            onChange={(e) => setNewLead({ ...newLead, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-[#EEF2FF]/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                                <Search size={20} className="text-[#4F46E5] mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs font-black text-[#4F46E5] uppercase tracking-widest mb-1">PRO TIP</p>
                                    <p className="text-xs text-[#3730A3] font-medium leading-relaxed">
                                        You can also import leads in bulk via CSV or use our Search filters and click "Save to CRM" from the Global Demand Intel view to automatically sync decision makers.
                                    </p>
                                </div>
                            </div>
                        </form>
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="flex-1 py-4 border border-[#E5E7EB] bg-white text-[#111827] rounded-2xl font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                            >
                                CANCEL
                            </button>
                            <button
                                onClick={handleSaveLead}
                                disabled={isSaving || !newLead.company}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:bg-[#4338CA] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                SAVE LEAD
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Selected Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-[#111827]">Enrol {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} in email sequence</h3>
                                <p className="text-xs font-medium text-gray-400 mt-1">Choose a sequence to start sending automated emails</p>
                            </div>
                            <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {sequences.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 bg-indigo-50 text-[#4F46E5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Mail size={24} />
                                    </div>
                                    <p className="text-sm font-black text-[#111827] mb-1">No sequences yet</p>
                                    <p className="text-xs text-gray-400 font-medium mb-4">Create your first email sequence to start enrolling leads.</p>
                                    <button
                                        onClick={() => { setShowEmailModal(false); window.location.hash = '#sequences'; }}
                                        className="text-sm font-bold text-[#4F46E5] hover:underline"
                                    >
                                        Go to Sequence Builder →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Select Sequence</label>
                                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                            {sequences.map(seq => (
                                                <div
                                                    key={seq.id}
                                                    onClick={() => setSelectedSequenceId(seq.id)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedSequenceId === seq.id ? 'border-[#4F46E5] bg-indigo-50/50' : 'border-[#E5E7EB] hover:border-indigo-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedSequenceId === seq.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            <Mail size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-[#111827]">{seq.name}</p>
                                                            <p className="text-xs font-medium text-gray-500">Email Sequence</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-3">
                                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                                        <p className="text-xs font-medium text-[#3730A3] leading-relaxed">
                                            {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} will be enrolled and start receiving emails from step 1 of this sequence.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                        {sequences.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button
                                    onClick={() => setShowEmailModal(false)}
                                    className="flex-1 py-3 border border-[#E5E7EB] bg-white text-[#374151] rounded-xl font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBatchEnroll}
                                    disabled={isEnrolling || !selectedSequenceId}
                                    className="flex-1 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:bg-[#4338CA] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isEnrolling ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                    {isEnrolling ? 'Enrolling...' : 'Start Sequence'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Call Selected Modal */}
            {showBatchCallModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-[#111827]">Queue AI calls for {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''}</h3>
                                <p className="text-xs font-medium text-gray-400 mt-1">Select a call script and review availability</p>
                            </div>
                            <button onClick={() => setShowBatchCallModal(false)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {callScripts.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Phone size={24} />
                                    </div>
                                    <p className="text-sm font-black text-[#111827] mb-1">No call scripts yet</p>
                                    <p className="text-xs text-gray-400 font-medium mb-4">Create a call script in the Call Agent page first.</p>
                                    <button
                                        onClick={() => { setShowBatchCallModal(false); window.location.hash = '#call-agent'; }}
                                        className="text-sm font-bold text-emerald-600 hover:underline"
                                    >
                                        Go to Call Agent →
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2 mb-4">
                                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Select Call Script</label>
                                        <div className="grid grid-cols-1 gap-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                            {callScripts.map(s => (
                                                <div
                                                    key={s.id}
                                                    onClick={() => setBatchCallScriptId(s.id)}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${batchCallScriptId === s.id ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#E5E7EB] hover:border-emerald-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${batchCallScriptId === s.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            <Phone size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-[#111827]">{s.name}</p>
                                                            <p className="text-xs font-medium text-gray-500">AI Call Agent</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phone Warning Check */}
                                    {(() => {
                                        const selectedLeadObjects = leads.filter(l => selectedLeads.includes(l.id));
                                        const noPhoneCount = selectedLeadObjects.filter(l => !l.phone || l.phone.trim() === '').length;
                                        if (noPhoneCount > 0) {
                                            return (
                                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 mb-4">
                                                    <Info size={16} className="text-red-600 mt-0.5 shrink-0" />
                                                    <p className="text-xs font-bold text-red-800">
                                                        {noPhoneCount} selected lead{noPhoneCount > 1 ? 's do' : ' does'} not have a phone number and will be skipped.
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    {/* Business Hours Summary */}
                                    {(() => {
                                        const selectedLeadObjects = leads.filter(l => selectedLeads.includes(l.id)).filter(l => l.phone && l.phone.trim() !== '');
                                        const greenLeads = selectedLeadObjects.filter(l => l.location && getLocalTime(l.location).status === 'green');
                                        const amberLeads = selectedLeadObjects.filter(l => l.location && getLocalTime(l.location).status === 'amber');
                                        const redLeads = selectedLeadObjects.filter(l => l.location && getLocalTime(l.location).status === 'red');
                                        const unknownLeads = selectedLeadObjects.filter(l => !l.location);
                                        return (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest pl-1">Lead Availability</label>
                                                <div className="bg-gray-50 border border-[#E5E7EB] rounded-xl p-4 space-y-2.5">
                                                    {greenLeads.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
                                                            <span className="text-xs font-bold text-[#059669]">{greenLeads.length} lead{greenLeads.length > 1 ? 's' : ''} ready to call (business hours)</span>
                                                        </div>
                                                    )}
                                                    {amberLeads.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                                                            <span className="text-xs font-bold text-[#D97706]">{amberLeads.length} lead{amberLeads.length > 1 ? 's' : ''} borderline</span>
                                                        </div>
                                                    )}
                                                    {redLeads.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                                                            <span className="text-xs font-bold text-[#DC2626]">{redLeads.length} lead{redLeads.length > 1 ? 's' : ''} outside business hours</span>
                                                        </div>
                                                    )}
                                                    {unknownLeads.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                                                            <span className="text-xs font-bold text-[#6B7280]">{unknownLeads.length} lead{unknownLeads.length > 1 ? 's' : ''} with unknown location</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Business Hours Checkbox */}
                                    <label className="flex items-center gap-3 cursor-pointer select-none group">
                                        <div
                                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${businessHoursOnly ? 'bg-[#4F46E5] border-[#4F46E5]' : 'border-[#D1D5DB] group-hover:border-[#4F46E5]/40'}`}
                                            onClick={() => setBusinessHoursOnly(!businessHoursOnly)}
                                        >
                                            {businessHoursOnly && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                        <span className="text-sm font-bold text-[#374151]">Only call leads during business hours</span>
                                    </label>
                                </>
                            )}
                        </div>
                        {callScripts.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button
                                    onClick={() => setShowBatchCallModal(false)}
                                    className="flex-1 py-3 border border-[#E5E7EB] bg-white text-[#374151] rounded-xl font-black text-sm hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBatchQueueCalls}
                                    disabled={isQueueing || !batchCallScriptId}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isQueueing ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                                    {isQueueing ? 'Queueing...' : 'Queue Calls'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating Batch Action Bar */}
            {selectedLeads.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-bottom-8 duration-500 ease-out">
                    <div className="bg-gray-900 rounded-2xl shadow-2xl p-2.5 flex items-center gap-6 border border-white/10">
                        <div className="flex items-center gap-3 pl-3">
                            <span className="text-sm font-bold text-white tracking-wide">{selectedLeads.length} leads selected</span>
                            <button
                                onClick={() => setSelectedLeads([])}
                                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2 pr-1">
                            <button
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-lg shadow-indigo-500/20 active:scale-95"
                                onClick={() => { fetchSequences(); setShowEmailModal(true); }}
                            >
                                <span role="img" aria-label="email">📧</span> Start Email Sequence
                            </button>
                            <button
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-transparent border border-white/20 text-white hover:bg-white/10 active:scale-95"
                                onClick={() => { fetchCallScripts(); setShowBatchCallModal(true); setBatchCallScriptId(callScripts[0]?.id || ''); }}
                            >
                                <span role="img" aria-label="phone">📞</span> Start AI Calling
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* LinkedIn Enrollment Modal */}
            {showLinkedInModal && linkedInEnrollLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLinkedInModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                    <Linkedin size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#111827]">Enrol in LinkedIn Sequence</h3>
                                    <p className="text-xs text-[#6B7280] font-medium">{linkedInEnrollLead.company}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLinkedInModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-2">
                                    LinkedIn Profile URL
                                </label>
                                <input
                                    type="url"
                                    value={linkedInUrl}
                                    onChange={(e) => setLinkedInUrl(e.target.value)}
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-4 py-3 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] focus:bg-white transition-all"
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                                    <strong>35-day relationship funnel:</strong> This sequence builds genuine connections through profile views, engagement, and warm outreach before making any business ask.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowLinkedInModal(false)}
                                    className="flex-1 py-3 border border-[#E5E7EB] bg-white text-[#374151] rounded-xl font-black text-sm hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitLinkedInEnroll}
                                    disabled={isEnrollingLinkedIn || !linkedInUrl.trim()}
                                    className="flex-1 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-500/20 hover:bg-[#4338CA] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isEnrollingLinkedIn ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Enrolling...
                                        </>
                                    ) : (
                                        'Start Sequence'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.visible && (
                <div className="fixed bottom-32 right-6 z-[70] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="flex items-center gap-3 px-5 py-3.5 bg-[#111827] text-white rounded-xl shadow-2xl">
                        <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                        <span className="text-sm font-bold">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDatabase;
