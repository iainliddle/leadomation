import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    Inbox,
    Loader2,
    X,
    ExternalLink,
    Calendar,
    Send,
    Check,
    AlertCircle,
    Filter,
    ChevronDown,
    Mail,
    User,
    Building,
    Clock,
    RefreshCw
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

const LABEL_STYLES: Record<AILabel, { bg: string; text: string; border: string }> = {
    'Interested': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    'Not Interested': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
    'Out of Office': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'Unsubscribe': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    'Question': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Referral': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
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

    // Set up Supabase Realtime subscription for new inbound emails
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
                        // Add new email to the top of the list
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

            // Get user's email_from_address from profile
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

            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Please log in to send replies');
            }

            // Send reply via API
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

            // Update local state
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
            return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };
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

    // Count emails by label for filter badges
    const labelCounts = emails.reduce((acc, email) => {
        const label = email.ai_label || 'Unknown';
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex bg-white flex-1 rounded-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-200">
                {/* Left Panel: Email List */}
                <aside className="w-[400px] shrink-0 border-r border-slate-200 flex flex-col bg-white">
                    {/* Header & Search */}
                    <div className="p-4 border-b border-[#E5E7EB] bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-black text-[#111827]">Lead Inbox</h2>
                                {unreadCount > 0 && (
                                    <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => { setLoading(true); loadEmails(); }}
                                className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all"
                                title="Refresh"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>

                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by sender, subject, or company..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                showFilters || labelFilter !== 'all' || campaignFilter !== 'all'
                                    ? 'bg-[#EEF2FF] text-primary border border-indigo-100'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            <Filter size={12} />
                            Filters
                            {(labelFilter !== 'all' || campaignFilter !== 'all') && (
                                <span className="bg-primary text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center">
                                    {(labelFilter !== 'all' ? 1 : 0) + (campaignFilter !== 'all' ? 1 : 0)}
                                </span>
                            )}
                            <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Filter Panel */}
                        {showFilters && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                {/* Label Filter */}
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                        AI Label
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => setLabelFilter('all')}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                                labelFilter === 'all'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:border-primary'
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
                                                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                                        labelFilter === label
                                                            ? `${style.bg} ${style.text} ${style.border}`
                                                            : 'bg-white border-gray-200 text-gray-600 hover:border-primary'
                                                    }`}
                                                >
                                                    {label} ({count})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Campaign Filter */}
                                {campaigns.length > 0 && (
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                            Campaign
                                        </label>
                                        <select
                                            value={campaignFilter}
                                            onChange={(e) => setCampaignFilter(e.target.value)}
                                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="all">All Campaigns</option>
                                            {campaigns.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Clear Filters */}
                                {(labelFilter !== 'all' || campaignFilter !== 'all') && (
                                    <button
                                        onClick={() => { setLabelFilter('all'); setCampaignFilter('all'); }}
                                        className="text-[10px] font-bold text-primary hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Email List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredEmails.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Inbox size={24} className="text-gray-400" />
                                </div>
                                <p className="text-sm font-bold text-gray-500 mb-1">No replies yet</p>
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
                                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors duration-150 relative group ${
                                            isSelected
                                                ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                                                : email.is_read
                                                    ? 'bg-white hover:bg-slate-50'
                                                    : 'bg-indigo-50 border-l-4 border-l-indigo-500'
                                        }`}
                                    >
                                        {/* Unread indicator */}
                                        {!email.is_read && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                                        )}

                                        <div className="flex items-start gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-sm font-bold text-primary">
                                                    {getSenderName(email).charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Sender & Time */}
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <h4 className={`text-xs truncate ${!email.is_read ? 'font-black text-[#111827]' : 'font-bold text-[#374151]'}`}>
                                                        {getSenderName(email)}
                                                    </h4>
                                                    <span className="text-[9px] font-bold text-[#9CA3AF] whitespace-nowrap ml-2">
                                                        {formatDate(email.received_at)}
                                                    </span>
                                                </div>

                                                {/* Company */}
                                                {getSenderCompany(email) && (
                                                    <p className="text-[10px] text-gray-500 truncate mb-1">
                                                        {getSenderCompany(email)}
                                                    </p>
                                                )}

                                                {/* Subject */}
                                                <p className={`text-[11px] truncate mb-2 ${!email.is_read ? 'font-bold text-gray-700' : 'font-medium text-gray-500'}`}>
                                                    {email.subject || '(No subject)'}
                                                </p>

                                                {/* AI Label & Replied Badge */}
                                                <div className="flex items-center gap-2">
                                                    {email.ai_label && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${labelStyle.bg} ${labelStyle.text} ${labelStyle.border}`}>
                                                            {email.ai_label}
                                                        </span>
                                                    )}
                                                    {email.replied && (
                                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-600 border border-green-200">
                                                            Replied
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Right Panel: Email Detail */}
                <main className="flex-1 flex flex-col bg-white">
                    {selectedEmail ? (
                        <>
                            {/* Detail Header */}
                            <div className="px-8 py-6 border-b border-[#F3F4F6] sticky top-0 bg-white z-10">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-black text-[#111827] mb-1 truncate">
                                            {selectedEmail.subject || '(No subject)'}
                                        </h2>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} />
                                                <span className="font-medium">{getSenderName(selectedEmail)}</span>
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
                                    </div>
                                    <button
                                        onClick={() => setSelectedEmail(null)}
                                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Meta Row */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    {/* AI Label Badge */}
                                    {selectedEmail.ai_label && (
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getLabelStyle(selectedEmail.ai_label).bg} ${getLabelStyle(selectedEmail.ai_label).text} ${getLabelStyle(selectedEmail.ai_label).border}`}>
                                                {selectedEmail.ai_label}
                                            </span>
                                            {selectedEmail.ai_confidence && (
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {Math.round(selectedEmail.ai_confidence * 100)}% confidence
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Replied Badge */}
                                    {selectedEmail.replied && (
                                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-600 border border-green-200 flex items-center gap-1">
                                            <Check size={12} />
                                            Replied
                                        </span>
                                    )}

                                    {/* Timestamp */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Calendar size={12} />
                                        {formatFullDate(selectedEmail.received_at)}
                                    </div>

                                    {/* Link to Lead */}
                                    {selectedEmail.lead_id && (
                                        <button
                                            onClick={() => {
                                                if (onOpenLeadDrawer) {
                                                    onOpenLeadDrawer(selectedEmail.lead_id!);
                                                } else if (onPageChange) {
                                                    onPageChange('Lead Database');
                                                }
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-primary hover:bg-[#EEF2FF] rounded-lg transition-all"
                                        >
                                            <ExternalLink size={12} />
                                            View Lead
                                        </button>
                                    )}

                                    {/* Campaign Link */}
                                    {selectedEmail.campaign?.name && (
                                        <span className="text-[10px] text-gray-400 font-medium">
                                            Campaign: {selectedEmail.campaign.name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 custom-scrollbar">
                                <div className="max-w-3xl space-y-6">
                                    {/* Email Body */}
                                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                        <div className="prose prose-sm max-w-none">
                                            {selectedEmail.body_html ? (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: selectedEmail.body_html }}
                                                    className="text-sm text-[#374151] leading-relaxed"
                                                />
                                            ) : (
                                                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-wrap">
                                                    {selectedEmail.body_text || 'No content'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Previous Reply */}
                                    {selectedEmail.replied && selectedEmail.reply_body && (
                                        <div className="bg-green-50/50 border border-green-100 p-6 rounded-2xl">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Check size={14} className="text-green-600" />
                                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Your Reply</span>
                                            </div>
                                            <p className="text-sm text-green-800 whitespace-pre-wrap">
                                                {selectedEmail.reply_body}
                                            </p>
                                        </div>
                                    )}

                                    {/* Reply Composer */}
                                    {!selectedEmail.replied && (
                                        <div className="bg-white border border-slate-200 rounded-xl p-4 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400 transition-all">
                                            <div className="mb-3">
                                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reply to {getSenderName(selectedEmail)}</span>
                                            </div>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="w-full p-0 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none min-h-[150px] border-0"
                                            />
                                            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                                                <p className="text-xs text-slate-400">
                                                    Replying from your configured sender email
                                                </p>
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={!replyText.trim() || isSendingReply}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                                        replyText.trim() && !isSendingReply
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
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

                                            {/* Reply Status */}
                                            {replyStatus === 'success' && (
                                                <div className="px-4 py-3 bg-green-50 border-t border-green-100 flex items-center gap-2 text-green-700 animate-in slide-in-from-bottom-2">
                                                    <Check size={14} />
                                                    <span className="text-xs font-bold">Reply sent successfully!</span>
                                                </div>
                                            )}
                                            {replyStatus === 'error' && (
                                                <div className="px-4 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2 text-red-700 animate-in slide-in-from-bottom-2">
                                                    <AlertCircle size={14} />
                                                    <span className="text-xs font-bold">Failed to send reply. Please try again.</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Inbox size={32} className="text-gray-200" />
                            </div>
                            <h3 className="text-lg font-black text-[#111827] mb-2">Select a reply to read</h3>
                            <p className="text-sm text-gray-400 font-medium max-w-xs">
                                Choose a conversation from the list on the left to view the full message and respond.
                            </p>
                        </div>
                    )}
                </main>
            </div>

            {/* Info Banner */}
            <div className="mt-4">
                <div className="bg-[#EEF2FF] border border-indigo-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="bg-white p-2 rounded-xl text-primary shadow-sm">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-[#111827] uppercase tracking-widest mb-1">AI-Powered Inbox</h4>
                        <p className="text-sm font-bold text-[#3730A3] leading-relaxed">
                            Replies are automatically labelled by AI to help you prioritise. Interested leads appear in green, questions in blue, and unsubscribes are handled automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadInbox;
