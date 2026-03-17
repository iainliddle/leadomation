import React, { useState, useEffect } from 'react';
import {
    Lightbulb,
    Calendar,
    Linkedin,
    Mail,
    CheckCircle2,
    Loader2,
    XCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LinkedInStatus {
    connected: boolean;
    account_id: string | null;
    name: string | null;
}

const Integrations: React.FC = () => {
    const [linkedinStatus, setLinkedinStatus] = useState<LinkedInStatus>({
        connected: false,
        account_id: null,
        name: null
    });
    const [linkedinLoading, setLinkedinLoading] = useState(true);
    const [linkedinConnecting, setLinkedinConnecting] = useState(false);
    const [meetingLink, setMeetingLink] = useState('');
    const [saving, setSaving] = useState('');
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Check for URL params on mount (linkedin=connected or linkedin=failed)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const linkedinParam = urlParams.get('linkedin');

        if (linkedinParam === 'connected') {
            setToast({ message: 'LinkedIn connected successfully!', type: 'success' });
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname);
            // Refresh status after connection
            checkLinkedInStatus();
        } else if (linkedinParam === 'failed') {
            setToast({ message: 'LinkedIn connection failed. Please try again.', type: 'error' });
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, []);

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Check LinkedIn status on mount
    const checkLinkedInStatus = async () => {
        setLinkedinLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                setLinkedinLoading(false);
                return;
            }

            const response = await fetch('/api/linkedin-status', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLinkedinStatus({
                    connected: data.connected,
                    account_id: data.account_id,
                    name: data.name
                });
            }
        } catch (err) {
            console.error('Error checking LinkedIn status:', err);
        } finally {
            setLinkedinLoading(false);
        }
    };

    useEffect(() => {
        checkLinkedInStatus();
    }, []);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('profiles')
                    .select('meeting_link')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setMeetingLink(data.meeting_link || '');
                }
            } catch (err) {
                console.error('Error loading settings:', err);
            } finally {
                setLoadingSettings(false);
            }
        };
        loadSettings();
    }, []);

    const saveField = async (field: string, value: any) => {
        setSaving(field);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({ [field]: value })
                .eq('id', user.id);

            if (error) {
                console.error('Error saving:', error);
                setToast({ message: 'Failed to save. Please try again.', type: 'error' });
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setTimeout(() => setSaving(''), 1000);
        }
    };

    const handleConnectLinkedIn = async () => {
        setLinkedinConnecting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                setToast({ message: 'Please log in to connect LinkedIn', type: 'error' });
                return;
            }

            const response = await fetch('/api/linkedin-connect', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create connection link');
            }

            const data = await response.json();

            if (data.url) {
                // Open Unipile auth in new tab
                window.open(data.url, '_blank');
                setToast({ message: 'Complete the connection in the new tab', type: 'success' });
            }
        } catch (err: any) {
            console.error('LinkedIn connect error:', err);
            setToast({ message: err.message || 'Failed to connect LinkedIn', type: 'error' });
        } finally {
            setLinkedinConnecting(false);
        }
    };

    const handleDisconnectLinkedIn = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Clear the Unipile account ID from the profile
            const { error } = await supabase
                .from('profiles')
                .update({
                    unipile_account_id: null,
                    linkedin_connected: false
                })
                .eq('id', user.id);

            if (error) {
                throw error;
            }

            setLinkedinStatus({
                connected: false,
                account_id: null,
                name: null
            });
            setToast({ message: 'LinkedIn disconnected', type: 'success' });
        } catch (err) {
            console.error('Disconnect error:', err);
            setToast({ message: 'Failed to disconnect LinkedIn', type: 'error' });
        }
    };

    const handleConnectEmail = () => {
        alert('Email integration coming soon. Contact support@leadomation.co.uk to get set up.');
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-[1200px] mx-auto pb-12">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                        <XCircle size={18} className="text-red-600" />
                    )}
                    <span className="text-sm font-bold">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle size={16} />
                    </button>
                </div>
            )}

            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">Integrations</h1>
                <p className="text-sm text-[#6B7280] font-medium mt-1">Connect your accounts to power your outreach automation.</p>
            </div>

            {/* Meeting Link Section */}
            <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-8 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors duration-500"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#111827]">Meeting Link</h3>
                            <p className="text-sm text-[#6B7280] font-medium mt-1">Paste your Calendly or Cal.com booking URL for email sequences.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="https://calendly.com/your-name"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] focus:bg-white transition-all"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                        />
                        <button
                            onClick={() => saveField('meeting_link', meetingLink)}
                            disabled={saving === 'meeting_link' || loadingSettings}
                            className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-black shadow-lg shadow-indigo-500/20 hover:bg-[#4338CA] transition-all active:scale-95 disabled:opacity-50 shrink-0"
                        >
                            {saving === 'meeting_link' ? 'Saving...' : 'SAVE'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {/* LinkedIn Card */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm transition-transform group-hover:scale-110 duration-300">
                                <Linkedin size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#111827]">LinkedIn Account</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {linkedinLoading ? (
                                        <>
                                            <Loader2 size={12} className="animate-spin text-gray-400" />
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Checking...</span>
                                        </>
                                    ) : linkedinStatus.connected ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Connected</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                            <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">Not Connected</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                        Connect your LinkedIn account to send connection requests and messages directly from Leadomation.
                    </p>

                    {linkedinStatus.connected && linkedinStatus.name && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4">
                            <p className="text-xs font-bold text-emerald-700">
                                Connected as: <span className="text-emerald-900">{linkedinStatus.name}</span>
                            </p>
                        </div>
                    )}

                    <div className="pt-4 border-t border-[#F3F4F6]">
                        {linkedinLoading ? (
                            <div className="flex items-center justify-center py-3">
                                <Loader2 size={20} className="animate-spin text-gray-400" />
                            </div>
                        ) : linkedinStatus.connected ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                                    <CheckCircle2 size={14} />
                                    Active Account
                                </div>
                                <button
                                    onClick={handleDisconnectLinkedIn}
                                    className="px-4 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnectLinkedIn}
                                disabled={linkedinConnecting}
                                className="w-full py-3 bg-[#4F46E5] text-white rounded-xl text-sm font-black shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {linkedinConnecting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    'Connect LinkedIn Account'
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Email Card */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4F46E5] shadow-sm transition-transform group-hover:scale-110 duration-300">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-[#111827]">Email Account</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Not Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-sm text-[#6B7280] leading-relaxed mb-8 h-12">
                        Connect your Microsoft 365 or Gmail account to send outreach emails from your own address.
                    </p>

                    <div className="pt-4 border-t border-[#F3F4F6]">
                        <button
                            onClick={handleConnectEmail}
                            className="w-full py-3 bg-white border border-[#E5E7EB] text-[#374151] rounded-xl text-sm font-black shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]"
                        >
                            Connect Email Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Lightbulb size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Infrastructure Included</h4>
                    <p className="text-xs text-blue-700/80 font-medium mt-1.5 leading-relaxed">
                        All lead scraping, email finding, and data enrichment tools are included in your plan. No additional API keys or subscriptions required. Leadomation handles the infrastructure so you can focus on outreach.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
