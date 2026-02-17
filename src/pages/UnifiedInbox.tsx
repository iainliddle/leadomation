import React, { useState, useEffect } from 'react';
import {
    Search,
    Star,
    Archive,
    ExternalLink,
    Bold,
    Italic,
    Link as LinkIcon,
    Sparkles,
    MapPin,
    Tag,
    MessageSquare,
    MoreHorizontal,
    Send,
    Check,
    Loader2,
    Plus,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Lead {
    id: string;
    company: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Email {
    id: string;
    lead_id: string;
    user_id: string;
    subject: string;
    body: string;
    status: 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'draft';
    sent_at: string;
    opened_at?: string;
    clicked_at?: string;
    replied_at?: string;
    leads: {
        company: string;
        first_name: string;
        last_name: string;
    } | null;
}

const UnifiedInbox: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [replyText, setReplyText] = useState('');
    const [addToPipeline, setAddToPipeline] = useState(false);

    // Supabase State
    const [emails, setEmails] = useState<Email[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

    // Compose Form State
    const [composeLeadId, setComposeLeadId] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');

    useEffect(() => {
        fetchEmails();
        fetchLeads();
    }, []);

    const fetchEmails = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('emails')
            .select('*, leads(company, first_name, last_name)')
            .eq('user_id', user.id)
            .order('sent_at', { ascending: false });

        if (error) {
            console.error('Error fetching emails:', error);
        } else {
            const fetchedEmails = data || [];
            setEmails(fetchedEmails);
            if (fetchedEmails.length > 0 && !selectedEmailId) {
                setSelectedEmailId(fetchedEmails[0].id);
            }
        }
        setIsLoading(false);
    };

    const fetchLeads = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('leads')
            .select('id, company, first_name, last_name, email')
            .eq('user_id', user.id)
            .not('email', 'is', null);

        if (error) {
            console.error('Error fetching leads:', error);
        } else {
            setLeads(data || []);
        }
    };

    const handleCompose = async () => {
        if (!composeLeadId || !composeSubject || !composeBody) return;
        setIsSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('emails')
            .insert({
                user_id: user.id,
                lead_id: composeLeadId,
                subject: composeSubject,
                body: composeBody,
                status: 'draft',
                sent_at: new Date().toISOString()
            });

        if (!error) {
            fetchEmails();
            setIsComposeModalOpen(false);
            setComposeLeadId('');
            setComposeSubject('');
            setComposeBody('');
        } else {
            console.error('Error saving draft:', error);
        }
        setIsSaving(false);
    };

    const filteredEmails = emails.filter(email => {
        const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.leads?.company.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === 'All') return matchesSearch;
        return email.status.toLowerCase() === activeTab.toLowerCase() && matchesSearch;
    });

    const activeEmail = emails.find(e => e.id === selectedEmailId) || null;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'opened': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'replied': return 'bg-green-50 text-green-600 border-green-100';
            case 'bounced': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getTabCount = (tab: string) => {
        if (tab === 'All') return emails.length;
        return emails.filter(e => e.status.toLowerCase() === tab.toLowerCase()).length;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex bg-white h-[calc(100vh-100px)] rounded-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in duration-700">
            {/* Left Panel: Message List */}
            <aside className="w-[380px] shrink-0 border-r border-[#E5E7EB] flex flex-col bg-gray-50/10">
                {/* Search & Tabs */}
                <div className="p-4 border-b border-[#E5E7EB] bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setIsComposeModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-sm"
                        >
                            <Plus size={14} />
                            COMPOSE
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search emails..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                        {[
                            { label: 'All' },
                            { label: 'Sent' },
                            { label: 'Opened' },
                            { label: 'Replied' },
                            { label: 'Bounced' }
                        ].map((tab) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTab(tab.label)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab.label
                                    ? 'bg-blue-50 text-primary shadow-sm border border-blue-100'
                                    : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                                    }`}
                            >
                                {tab.label}
                                <span className={`text-[9px] ${activeTab === tab.label ? 'text-primary/70' : 'text-gray-400'}`}>
                                    ({getTabCount(tab.label)})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredEmails.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No emails found</p>
                        </div>
                    ) : (
                        filteredEmails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => setSelectedEmailId(email.id)}
                                className={`p-4 border-b border-[#F3F4F6] cursor-pointer transition-all relative group hover:bg-white ${selectedEmailId === email.id ? 'bg-[#F0F7FF] border-l-4 border-l-primary' : 'bg-transparent'
                                    }`}
                            >
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center shrink-0 pt-0.5">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm bg-blue-100 text-blue-600`}>
                                            {getInitials(email.leads?.first_name || '', email.leads?.last_name || '')}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className={`text-xs truncate font-black text-[#111827]`}>
                                                {email.leads?.company || 'Unknown Subject'}
                                            </h4>
                                            <span className="text-[9px] font-bold text-[#9CA3AF] whitespace-nowrap">{formatDate(email.sent_at)}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-500 truncate mb-0.5">{email.subject}</p>
                                        <p className="text-[10px] text-[#6B7280] font-medium truncate leading-relaxed">
                                            {email.body.slice(0, 60)}...
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black border uppercase tracking-wider ${getStatusStyles(email.status)}`}>
                                            {email.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>

            {/* Right Panel: Message Detail View */}
            <main className="flex-1 flex flex-col bg-white">
                {activeEmail ? (
                    <>
                        {/* Detail Header */}
                        <div className="px-8 py-6 border-b border-[#F3F4F6] flex items-center justify-between sticky top-0 bg-white z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-black text-[#111827]">{activeEmail.leads?.company}</h2>
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#4B5563]">{activeEmail.leads?.first_name} {activeEmail.leads?.last_name}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${getStatusStyles(activeEmail.status)}`}>
                                            {activeEmail.status}
                                        </span>
                                    </div>
                                    <div className="w-px h-3 bg-gray-200" />
                                    <span className="text-[11px] font-bold text-[#9CA3AF]">
                                        Lead ID: <span className="text-[#6B7280]">{activeEmail.lead_id}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-black hover:bg-gray-50 transition-all shadow-sm">
                                    <Archive size={14} />
                                    ARCHIVE
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:scale-95">
                                    📊 MOVE TO PIPELINE
                                </button>
                            </div>
                        </div>

                        {/* Email Thread */}
                        <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                            <div className="max-w-4xl space-y-8">
                                <div className="relative pl-6 border-l-4 border-primary/20">
                                    <div className="absolute left-[-22px] top-0 w-3.5 h-3.5 rounded-full bg-primary ring-4 ring-blue-50" />
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shadow-sm bg-blue-100 text-blue-600`}>
                                                {getInitials(activeEmail.leads?.first_name || '', activeEmail.leads?.last_name || '')}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#111827]">{activeEmail.leads?.company}</h4>
                                                <span className="text-[11px] font-bold text-[#9CA3AF] tracking-wide uppercase">{formatDate(activeEmail.sent_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50/30 border border-blue-50 p-6 rounded-2xl">
                                        <div className="mb-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Subject</span>
                                            <h3 className="text-lg font-black text-[#111827]">{activeEmail.subject}</h3>
                                        </div>
                                        <div className="w-full h-px bg-blue-50 mb-4" />
                                        <p className="text-sm text-[#4B5563] leading-relaxed font-medium whitespace-pre-wrap">
                                            {activeEmail.body}
                                        </p>
                                    </div>
                                </div>

                                {/* Timestamps Card */}
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-wrap gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sent</p>
                                        <p className="text-xs font-bold text-[#111827]">{activeEmail.sent_at ? formatDate(activeEmail.sent_at) : 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opened</p>
                                        <p className="text-xs font-bold text-[#111827]">{activeEmail.opened_at ? formatDate(activeEmail.opened_at) : 'Not opened yet'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Clicked</p>
                                        <p className="text-xs font-bold text-[#111827]">{activeEmail.clicked_at ? formatDate(activeEmail.clicked_at) : 'No clicks'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Replied</p>
                                        <p className="text-xs font-bold text-[#111827]">{activeEmail.replied_at ? formatDate(activeEmail.replied_at) : 'No reply yet'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Reply Section */}
                        <div className="p-8 border-t border-[#F3F4F6] bg-white sticky bottom-0">
                            <div className="max-w-4xl">
                                <div className="bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 transition-all mb-4">
                                    <textarea
                                        placeholder="Write a reply..."
                                        className="w-full p-6 bg-transparent text-sm focus:outline-none min-h-[120px] font-medium leading-relaxed"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="px-6 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                                <Bold size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                                <Italic size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-lg transition-all">
                                                <LinkIcon size={18} />
                                            </button>
                                            <div className="w-px h-6 bg-gray-100 mx-2" />
                                            <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-xl text-[11px] font-black hover:bg-purple-100 transition-all border border-purple-100 shadow-sm animate-pulse-subtle">
                                                <Sparkles size={14} />
                                                ✨ AI SUGGEST REPLY
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.2)] group active:scale-95">
                                            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            SEND REPLY
                                        </button>
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group w-fit">
                                    <div
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${addToPipeline ? 'bg-primary border-primary shadow-sm' : 'bg-white border-gray-200 group-hover:border-primary'
                                            }`}
                                        onClick={() => setAddToPipeline(!addToPipeline)}
                                    >
                                        {addToPipeline && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className="text-xs font-bold text-[#4B5563] group-hover:text-[#111827] transition-colors">📊 Add to deal pipeline on send</span>
                                </label>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/30">
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                            <MessageSquare size={32} className="text-gray-200" />
                        </div>
                        <h3 className="text-lg font-black text-[#111827] mb-2">Select an email to read</h3>
                        <p className="text-sm text-gray-400 font-bold max-w-xs">Pick a conversation from the list on the left to view the full thread and metrics.</p>
                    </div>
                )}
            </main>

            {/* Compose Modal */}
            {isComposeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                                    <Send size={18} />
                                </div>
                                <h3 className="text-lg font-black text-[#111827]">Compose New Message</h3>
                            </div>
                            <button onClick={() => setIsComposeModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Recipient Lead</label>
                                <select
                                    className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                                    value={composeLeadId}
                                    onChange={(e) => setComposeLeadId(e.target.value)}
                                >
                                    <option value="">Select a lead with an email address...</option>
                                    {leads.map(lead => (
                                        <option key={lead.id} value={lead.id}>
                                            {lead.company} ({lead.first_name} {lead.last_name} - {lead.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Subject Line</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all"
                                    placeholder="e.g. Quick question about your 2024 wellness planning"
                                    value={composeSubject}
                                    onChange={(e) => setComposeSubject(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Message Body</label>
                                <textarea
                                    className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary transition-all min-h-[200px] leading-relaxed"
                                    placeholder="Write your personalised message here..."
                                    value={composeBody}
                                    onChange={(e) => setComposeBody(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => setIsComposeModalOpen(false)}
                                className="flex-1 px-6 py-4 border border-[#E5E7EB] rounded-2xl text-sm font-bold text-[#6B7280] hover:bg-white hover:text-[#111827] transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompose}
                                disabled={isSaving || !composeLeadId || !composeSubject || !composeBody}
                                className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                SAVE AS DRAFT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnifiedInbox;
