import React, { useState, useEffect } from 'react';
import {
    Search,
    MessageSquare,
    Loader2,
    Plus,
    Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';
import { stopSequenceOnReply } from '../lib/sequenceUtils';

interface UnifiedInboxProps {
    onPageChange?: (page: string) => void;
}

const UnifiedInbox: React.FC<UnifiedInboxProps> = ({ onPageChange }) => {
    // STEP 2 — Add state variables
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmail, setSelectedEmail] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState('');

    // STEP 3 — Load emails from Supabase
    useEffect(() => {
        loadEmails();
    }, []);

    const loadEmails = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('emails')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) {
                setEmails(data);
                // Stop sequences for leads that have replied
                data.forEach(email => {
                    if (email.replied_at && email.lead_id) {
                        stopSequenceOnReply(email.lead_id);
                    }
                });
            }
        } catch (err) {
            console.error('Error loading emails:', err);
        } finally {
            setLoading(false);
        }
    };

    const checkEmailLimit = async (): Promise<boolean> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

        const plan = profile?.plan || 'trial';
        const limits: Record<string, number> = { trial: 20, starter: 50, pro: 200 };
        const limit = limits[plan] || 20;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from('emails')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('sent_at', startOfDay.toISOString());

        if ((count || 0) >= limit) {
            setUpgradeMessage(`Daily email limit reached. Your ${plan} plan includes ${limit} emails/day. Upgrade to Pro for 200 emails/day.`);
            setShowUpgradeModal(true);
            return false;
        }
        return true;
    };

    const handleComposeClick = async () => {
        const canSend = await checkEmailLimit();
        if (canSend) {
            alert('Email composing will be available once your email account is connected in Integrations.');
        }
    };

    // STEP 4 — Calculate tab counts from real data
    const emailCounts = {
        all: emails.length,
        sent: emails.filter(e => e.status === 'sent' || e.status === 'delivered').length,
        opened: emails.filter(e => e.opened_at !== null).length,
        replied: emails.filter(e => e.replied_at !== null).length,
        bounced: emails.filter(e => e.status === 'bounced').length
    };

    // STEP 5 — Filter emails based on active tab
    const filteredEmails = emails.filter(e => {
        const matchesSearch = e.subject.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        if (activeTab === 'all') return true;
        if (activeTab === 'sent') return e.status === 'sent' || e.status === 'delivered';
        if (activeTab === 'opened') return e.opened_at !== null;
        if (activeTab === 'replied') return e.replied_at !== null;
        if (activeTab === 'bounced') return e.status === 'bounced';
        return true;
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'sent':
            case 'delivered': return 'bg-[#EEF2FF] text-[#4F46E5] border-indigo-100';
            case 'opened': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'replied': return 'bg-green-50 text-green-600 border-green-100';
            case 'bounced': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex bg-white flex-1 rounded-2xl border border-[#E5E7EB] overflow-hidden animate-in fade-in duration-700">
                {/* Left Panel: Message List */}
                <aside className="w-[380px] shrink-0 border-r border-[#E5E7EB] flex flex-col bg-gray-50/10">
                    {/* Search & Tabs */}
                    <div className="p-4 border-b border-[#E5E7EB] bg-white">
                        <div className="flex items-center justify-between mb-4">
                            {/* STEP 9 — Wire the COMPOSE button */}
                            <button
                                onClick={handleComposeClick}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black hover:bg-[#4338CA] transition-all shadow-sm"
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
                        {/* STEP 6 — Wire the tab buttons */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'sent', label: 'Sent' },
                                { id: 'opened', label: 'Opened' },
                                { id: 'replied', label: 'Replied' },
                                { id: 'bounced', label: 'Bounced' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[11px] font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${activeTab === tab.id
                                        ? 'bg-[#EEF2FF] text-primary shadow-sm border border-indigo-100'
                                        : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#111827]'
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`text-[9px] ${activeTab === tab.id ? 'text-primary/70' : 'text-gray-400'}`}>
                                        ({(emailCounts as any)[tab.id]})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message List */}
                    {/* STEP 7 — Wire the email list */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredEmails.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No emails found</p>
                            </div>
                        ) : (
                            filteredEmails.map((email) => (
                                <div
                                    key={email.id}
                                    onClick={() => setSelectedEmail(email)}
                                    className={`p-4 border-b border-[#F3F4F6] cursor-pointer transition-all relative group hover:bg-white ${selectedEmail?.id === email.id ? 'bg-[#EEF2FF] border-l-4 border-l-primary' : 'bg-transparent'
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className={`text-xs truncate font-black text-[#111827]`}>
                                                {email.subject}
                                            </h4>
                                            <span className="text-[9px] font-bold text-[#9CA3AF] whitespace-nowrap">{formatDate(email.created_at)}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
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
                {/* STEP 8 — Wire the right panel */}
                <main className="flex-1 flex flex-col bg-white">
                    {selectedEmail ? (
                        <>
                            {/* Detail Header */}
                            <div className="px-8 py-6 border-b border-[#F3F4F6] sticky top-0 bg-white z-10">
                                <h2 className="text-2xl font-black text-[#111827] mb-2">{selectedEmail.subject}</h2>
                                <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyles(selectedEmail.status)}`}>
                                        Status: {selectedEmail.status}
                                    </span>
                                </div>
                            </div>

                            {/* Email Content */}
                            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                                <div className="max-w-4xl space-y-8">
                                    <div className="bg-gray-50/30 border border-gray-100 p-8 rounded-2xl">
                                        <p className="text-sm text-[#4B5563] leading-relaxed font-medium whitespace-pre-wrap">
                                            {selectedEmail.body}
                                        </p>
                                    </div>

                                    {/* Timestamps Card */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-wrap gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sent</p>
                                            <p className="text-xs font-bold text-[#111827]">{selectedEmail.created_at ? formatDate(selectedEmail.created_at) : 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opened</p>
                                            <p className="text-xs font-bold text-[#111827]">{selectedEmail.opened_at ? formatDate(selectedEmail.opened_at) : 'Not opened yet'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Replied</p>
                                            <p className="text-xs font-bold text-[#111827]">{selectedEmail.replied_at ? formatDate(selectedEmail.replied_at) : 'No reply yet'}</p>
                                        </div>
                                    </div>
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
            </div>

            {/* STEP 10 — Add an info banner at the bottom */}
            <div className="mt-4">
                <div className="bg-[#EEF2FF] border border-indigo-100 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <div className="bg-white p-2 rounded-xl text-primary shadow-sm">
                        <Info size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-[#111827] uppercase tracking-widest mb-1">Leadomation Inbox</h4>
                        <p className="text-sm font-bold text-[#3730A3] leading-relaxed">
                            Your inbox shows all outreach emails sent through Leadomation sequences. Connect your email account in Integrations to start sending. Emails will appear here automatically as your campaigns run.
                        </p>
                    </div>
                </div>
            </div>

            {showUpgradeModal && (
                <UpgradePrompt
                    message={upgradeMessage}
                    onClose={() => setShowUpgradeModal(false)}
                    onUpgrade={() => {
                        setShowUpgradeModal(false);
                        if (onPageChange) onPageChange('Pricing');
                    }}
                />
            )}
        </div>
    );
};

export default UnifiedInbox;
