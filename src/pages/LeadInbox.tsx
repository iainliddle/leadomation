import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Inbox,
    Loader2,
    X,
    ExternalLink,
    Send,
    Check,
    AlertCircle,
    Filter,
    ChevronDown,
    Mail,
    User,
    Building,
    RefreshCw,
    TrendingUp,
    CheckCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface InboundEmail {
    id: string;
    user_id: string;
    lead_id: string | null;
    campaign_id: string | null;
    from_email: string;
    subject: string | null;
    body_text: string | null;
    body_html: string | null;
    received_at: string;
    ai_label: string | null;
    ai_confidence: number | null;
    is_read: boolean;
    replied: boolean;
    reply_body: string | null;
    lead?: {
        id: string;
        company: string | null;
        first_name: string | null;
        last_name: string | null;
    };
    campaign?: {
        id: string;
        name: string | null;
    };
}

interface Campaign {
    id: string;
    name: string;
}

interface LeadInboxProps {
    onPageChange?: (page: string) => void;
    onOpenLeadDrawer?: (leadId: string) => void;
}

const AI_LABELS = ['Interested', 'Not Interested', 'Out of Office', 'Unsubscribe', 'Question', 'Referral'] as const;
type AILabel = typeof AI_LABELS[number];

const LABEL_STYLES: Record<AILabel, { bg: string; text: string }> = {
    'Interested': { bg: 'bg-green-50', text: 'text-green-700' },
    'Not Interested': { bg: 'bg-gray-100', text: 'text-gray-600' },
    'Out of Office': { bg: 'bg-amber-50', text: 'text-amber-700' },
    'Unsubscribe': { bg: 'bg-red-50', text: 'text-red-600' },
    'Question': { bg: 'bg-blue-50', text: 'text-blue-700' },
    'Referral': { bg: 'bg-purple-50', text: 'text-purple-700' }
};

const LeadInbox: React.FC<LeadInboxProps> = ({ onPageChange, onOpenLeadDrawer }) => {
    const [emails, setEmails] = useState<InboundEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState<InboundEmail | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [labelFilter, setLabelFilter] = useState<string>('all');
    const [campaignFilter, setCampaignFilter] = useState<string>('all');
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);
    const [replyStatus, setReplyStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [unreadCount, setUnreadCount] = useState(0);
    const [pushedToCrm, setPushedToCrm] = useState<Set<string>>(new Set());
    const [crmToast, setCrmToast] = useState<{ type: 'success' | 'exists' | 'error'; emailId: string } | null>(null);

    const loadEmails = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('inbound_emails')
                .select(`
                    *,
                    lead:leads(id, company, first_name, last_name),
                    campaign:campaigns(id, name)
                `)
                .eq('user_id', user.id)
                .order('received_at', { ascending: false });

            if (error) {
                console.error('Error loading inbound emails:', error);
                return;
            }

            if (data) {
                setEmails(data as InboundEmail[]);
                setUnreadCount(data.filter(e => !e.is_read).length);
            }
        } catch (err) {
            console.error('Error loading emails:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadCampaigns = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('campaigns')
            .select('id, name')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) {
            setCampaigns(data);
        }
    }, []);

    useEffect(() => {
        loadEmails();
        loadCampaigns();
    }, [loadEmails, loadCampaigns]);

    useEffect(() => {
        const setupRealtimeSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const channel = supabase
                .channel('inbound_emails_changes')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'inbound_emails',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        setEmails(prev => [payload.new as InboundEmail, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'inbound_emails',
                        filter: `user_id=eq.${user.id}`
                    },
                    (payload) => {
                        setEmails(prev => prev.map(e =>
                            e.id === payload.new.id ? { ...e, ...payload.new } : e
                        ));
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        setupRealtimeSubscription();
    }, []);

    const markAsRead = async (emailId: string) => {
        const email = emails.find(e => e.id === emailId);
        if (!email || email.is_read) return;

        const { error } = await supabase
            .from('inbound_emails')
            .update({ is_read: true })
            .eq('id', emailId);

        if (!error) {
            setEmails(prev => prev.map(e =>
                e.id === emailId ? { ...e, is_read: true } : e
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleSelectEmail = (email: InboundEmail) => {
        setSelectedEmail(email);
        setReplyText('');
        setReplyStatus('idle');
        markAsRead(email.id);
    };

    const handleSendReply = async () => {
        if (!selectedEmail || !replyText.trim()) return;

        setIsSendingReply(true);
        setReplyStatus('idle');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: profile } = await supabase
                .from('profiles')
                .select('email_from_address, email_from_name')
                .eq('id', user.id)
                .single();

            if (!profile?.email_from_address) {
                alert('Please configure your sender email address in Settings > Email Sender first.');
                setIsSendingReply(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Please log in to send replies');
            }

            const response = await fetch('/api/send-inbox-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    to: selectedEmail.from_email,
                    subject: `Re: ${selectedEmail.subject || 'Your email'}`,
                    body: replyText,
                    from_email: profile.email_from_address,
                    from_name: profile.email_from_name || 'Leadomation',
                    inbound_email_id: selectedEmail.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send reply');
            }

            setEmails(prev => prev.map(e =>
                e.id === selectedEmail.id
                    ? { ...e, replied: true, reply_body: replyText }
                    : e
            ));
            setSelectedEmail(prev => prev ? { ...prev, replied: true, reply_body: replyText } : null);
            setReplyStatus('success');
            setReplyText('');

            setTimeout(() => setReplyStatus('idle'), 3000);
        } catch (error) {
            console.error('Error sending reply:', error);
            setReplyStatus('error');
        } finally {
            setIsSendingReply(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const formatFullDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getLabelStyle = (label: string | null) => {
        if (!label || !LABEL_STYLES[label as AILabel]) {
            return { bg: 'bg-gray-100', text: 'text-gray-600' };
        }
        return LABEL_STYLES[label as AILabel];
    };

    const getSenderName = (email: InboundEmail) => {
        if (email.lead?.first_name || email.lead?.last_name) {
            return `${email.lead.first_name || ''} ${email.lead.last_name || ''}`.trim();
        }
        return email.from_email.split('@')[0];
    };

    const getSenderCompany = (email: InboundEmail) => {
        if (email.lead?.company) return email.lead.company;
        const domain = email.from_email.split('@')[1];
        if (domain) {
            const parts = domain.split('.');
            return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        }
        return null;
    };

    const pushToCrm = async (email: InboundEmail) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if deal already exists
            const { data: existingDeal, error: checkError } = await supabase
                .from('deals')
                .select('id')
                .eq('user_id', user.id)
                .eq('contact_email', email.from_email)
                .single();

            if (!checkError && existingDeal) {
                // Deal already exists
                setCrmToast({ type: 'exists', emailId: email.id });
                setTimeout(() => setCrmToast(null), 3000);
                return;
            }

            // Insert new deal
            const { error: insertError } = await supabase
                .from('deals')
                .insert({
                    user_id: user.id,
                    title: getSenderCompany(email) || getSenderName(email),
                    contact_name: getSenderName(email),
                    contact_email: email.from_email,
                    value: 0,
                    currency: '£',
                    stage: 'new_reply',
                    notes: 'Created from inbox reply: ' + (email.subject || ''),
                    source: 'google_maps',
                    probability: 20,
                    stage_entered_at: new Date().toISOString()
                });

            if (insertError) {
                throw insertError;
            }

            // Success
            setPushedToCrm(prev => new Set(prev).add(email.id));
            setCrmToast({ type: 'success', emailId: email.id });
            setTimeout(() => setCrmToast(null), 3000);
        } catch (error) {
            console.error('Error pushing to CRM:', error);
            setCrmToast({ type: 'error', emailId: email.id });
            setTimeout(() => setCrmToast(null), 3000);
        }
    };

    const filteredEmails = emails.filter(email => {
        const matchesSearch =
            email.from_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (email.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (email.lead?.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (email.lead?.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (email.lead?.last_name || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLabel = labelFilter === 'all' || email.ai_label === labelFilter;
        const matchesCampaign = campaignFilter === 'all' || email.campaign_id === campaignFilter;

        return matchesSearch && matchesLabel && matchesCampaign;
    });

    const labelCounts = emails.reduce((acc, email) => {
        const label = email.ai_label || 'Unknown';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <div className="flex h-screen bg-[#F8F9FA] items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#F8F9FA]">
            {/* Left Panel - Inbox List */}
            <div className="w-80 bg-white border-r border-[#E5E7EB] flex flex-col flex-shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h2 className="text-base font-semibold text-[#111827]">Inbox</h2>
                            <p className="text-xs text-gray-400 mt-0.5">AI-classified email replies</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                                    {unreadCount}
                                </span>
                            )}
                            <button
                                onClick={() => { setLoading(true); loadEmails(); }}
                                className="p-2 text-gray-400 hover:text-[#4F46E5] hover:bg-gray-50 rounded-lg transition-all"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5] transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium mt-2 transition-all ${showFilters || labelFilter !== 'all' || campaignFilter !== 'all'
                            ? 'bg-[#EEF2FF] text-[#4F46E5]'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Filter size={12} />
                        Filters
                        {(labelFilter !== 'all' || campaignFilter !== 'all') && (
                            <span className="bg-[#4F46E5] text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">
                                {(labelFilter !== 'all' ? 1 : 0) + (campaignFilter !== 'all' ? 1 : 0)}
                            </span>
                        )}
                        <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                                    AI Label
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    <button
                                        onClick={() => setLabelFilter('all')}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${labelFilter === 'all'
                                            ? 'bg-[#4F46E5] text-white'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-[#4F46E5]'
                                            }`}
                                    >
                                        All ({emails.length})
                                    </button>
                                    {AI_LABELS.map(label => {
                                        const style = LABEL_STYLES[label];
                                        const count = labelCounts[label] || 0;
                                        if (count === 0) return null;
                                        return (
                                            <button
                                                key={label}
                                                onClick={() => setLabelFilter(label)}
                                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all border ${labelFilter === label
                                                    ? `${style.bg} ${style.text} border-current`
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#4F46E5]'
                                                    }`}
                                            >
                                                {label} ({count})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {campaigns.length > 0 && (
                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
                                        Campaign
                                    </label>
                                    <select
                                        value={campaignFilter}
                                        onChange={(e) => setCampaignFilter(e.target.value)}
                                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#EEF2FF] focus:border-[#4F46E5]"
                                    >
                                        <option value="all">All Campaigns</option>
                                        {campaigns.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {(labelFilter !== 'all' || campaignFilter !== 'all') && (
                                <button
                                    onClick={() => { setLabelFilter('all'); setCampaignFilter('all'); }}
                                    className="text-xs font-medium text-[#4F46E5] hover:underline"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Email List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredEmails.length === 0 ? (
                        <div className="p-8 text-center">
                            <Inbox size={32} className="text-gray-300 mx-auto mb-3" />
                            <p className="text-sm font-medium text-gray-500 mb-1">No replies yet</p>
                            <p className="text-xs text-gray-400">
                                {searchQuery || labelFilter !== 'all' || campaignFilter !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Replies to your outreach will appear here'}
                            </p>
                        </div>
                    ) : (
                        filteredEmails.map((email) => {
                            const labelStyle = getLabelStyle(email.ai_label);
                            const isSelected = selectedEmail?.id === email.id;

                            return (
                                <div
                                    key={email.id}
                                    onClick={() => handleSelectEmail(email)}
                                    className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 ${isSelected
                                        ? 'bg-[#EEF2FF] border-l-4 border-l-[#4F46E5]'
                                        : email.is_read
                                            ? 'bg-white hover:bg-gray-50'
                                            : 'bg-[#EEF2FF] border-l-4 border-l-[#4F46E5]'
                                        }`}
                                >
                                    {/* Top row: Company + time */}
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-sm ${!email.is_read ? 'font-semibold text-[#111827]' : 'font-medium text-[#111827]'}`}>
                                            {getSenderCompany(email) || getSenderName(email)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(email.received_at)}
                                        </span>
                                    </div>

                                    {/* Subject */}
                                    <p className="text-sm text-[#6B7280] truncate mb-2">
                                        {email.subject || '(No subject)'}
                                    </p>

                                    {/* AI Label Badge */}
                                    <div className="flex items-center gap-2">
                                        {email.ai_label && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${labelStyle.bg} ${labelStyle.text}`}>
                                                {email.ai_label}
                                            </span>
                                        )}
                                        {email.replied && (
                                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-600">
                                                Replied
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Panel - Email Detail */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedEmail ? (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-[#E5E7EB]">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${getLabelStyle(selectedEmail.ai_label).bg} ${getLabelStyle(selectedEmail.ai_label).text}`}>
                                        {selectedEmail.ai_label || 'Unknown'}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatFullDate(selectedEmail.received_at)}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedEmail(null)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <h2 className="text-lg font-semibold text-[#111827]">
                                {selectedEmail.subject || '(No subject)'}
                            </h2>
                            <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
                                <div className="flex items-center gap-1.5">
                                    <User size={14} />
                                    <span>{getSenderName(selectedEmail)}</span>
                                </div>
                                {getSenderCompany(selectedEmail) && (
                                    <div className="flex items-center gap-1.5">
                                        <Building size={14} />
                                        <span>{getSenderCompany(selectedEmail)}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Mail size={14} />
                                    <span className="text-xs">{selectedEmail.from_email}</span>
                                </div>
                            </div>

                            {/* Action Links */}
                            <div className="flex items-center gap-3 mt-3">
                                {selectedEmail.lead_id && (
                                    <button
                                        onClick={() => {
                                            if (onOpenLeadDrawer) {
                                                onOpenLeadDrawer(selectedEmail.lead_id!);
                                            } else if (onPageChange) {
                                                onPageChange('Lead Database');
                                            }
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all"
                                    >
                                        <ExternalLink size={12} />
                                        View Lead
                                    </button>
                                )}
                                {selectedEmail.ai_label === 'Interested' && !pushedToCrm.has(selectedEmail.id) && (
                                    <button
                                        onClick={() => pushToCrm(selectedEmail)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-all"
                                    >
                                        <TrendingUp size={12} />
                                        Push to CRM
                                    </button>
                                )}
                                {selectedEmail.ai_label === 'Interested' && pushedToCrm.has(selectedEmail.id) && (
                                    <span className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg">
                                        <CheckCircle size={12} />
                                        In CRM pipeline
                                    </span>
                                )}
                                {selectedEmail.campaign?.name && (
                                    <span className="text-xs text-gray-400">
                                        Campaign: {selectedEmail.campaign.name}
                                    </span>
                                )}
                            </div>

                            {/* CRM Toast */}
                            {crmToast && crmToast.emailId === selectedEmail.id && crmToast.type === 'success' && (
                                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <CheckCircle size={13} className="text-emerald-600" />
                                    <span className="text-xs font-medium text-emerald-700">Added to Deal Pipeline as New Reply</span>
                                </div>
                            )}
                            {crmToast && crmToast.emailId === selectedEmail.id && crmToast.type === 'exists' && (
                                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                                    <AlertCircle size={13} className="text-amber-600" />
                                    <span className="text-xs font-medium text-amber-700">Already in CRM pipeline</span>
                                </div>
                            )}
                            {crmToast && crmToast.emailId === selectedEmail.id && crmToast.type === 'error' && (
                                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                                    <AlertCircle size={13} className="text-red-500" />
                                    <span className="text-xs font-medium text-red-600">Failed to push to CRM</span>
                                </div>
                            )}
                        </div>

                        {/* Email Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <div className="max-w-2xl">
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                                    {selectedEmail.body_html ? (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
                                            className="text-sm text-[#111827] leading-relaxed prose prose-sm max-w-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-[#111827] leading-relaxed whitespace-pre-wrap">
                                            {selectedEmail.body_text || 'No content'}
                                        </p>
                                    )}
                                </div>

                                {/* Previous Reply */}
                                {selectedEmail.replied && selectedEmail.reply_body && (
                                    <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Check size={14} className="text-green-600" />
                                            <span className="text-xs font-semibold text-green-700 uppercase">Your Reply</span>
                                        </div>
                                        <p className="text-sm text-green-800 whitespace-pre-wrap">
                                            {selectedEmail.reply_body}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reply Composer */}
                        {!selectedEmail.replied && (
                            <div className="px-6 py-4 border-t border-[#E5E7EB]">
                                <div className="border border-[#E5E7EB] rounded-xl focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#EEF2FF] transition-all">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write a reply..."
                                        className="w-full p-4 text-sm rounded-t-xl resize-none focus:outline-none"
                                        rows={3}
                                    />
                                    <div className="flex items-center justify-between px-4 pb-3">
                                        <p className="text-xs text-gray-400">
                                            Replying from your configured sender
                                        </p>
                                        <button
                                            onClick={handleSendReply}
                                            disabled={!replyText.trim() || isSendingReply}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${replyText.trim() && !isSendingReply
                                                ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {isSendingReply ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} />
                                                    Send Reply
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Reply Status */}
                                {replyStatus === 'success' && (
                                    <div className="mt-3 px-4 py-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2 text-green-700">
                                        <Check size={14} />
                                        <span className="text-sm font-medium">Reply sent successfully!</span>
                                    </div>
                                )}
                                {replyStatus === 'error' && (
                                    <div className="mt-3 px-4 py-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700">
                                        <AlertCircle size={14} />
                                        <span className="text-sm font-medium">Failed to send reply. Please try again.</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <Inbox className="w-12 h-12 text-gray-300 mx-auto" />
                            <p className="text-gray-400 mt-3">Select an email to read</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadInbox;
