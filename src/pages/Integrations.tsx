import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Calendar, CheckCircle, XCircle, Info, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LinkedInStatus {
    connected: boolean;
    account_id: string | null;
    name: string | null;
}

const Integrations: React.FC = () => {
    useEffect(() => {
        document.title = 'Integrations | Leadomation';
        return () => { document.title = 'Leadomation'; };
    }, []);

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
        const params = new URLSearchParams(window.location.search);
        const linkedinParam = params.get('linkedin');
        if (linkedinParam === 'connected') {
            setLinkedinStatus(prev => ({ ...prev, connected: true }));
            setToast({ message: 'LinkedIn connected successfully!', type: 'success' });
            window.history.replaceState({}, '', window.location.pathname);
        } else if (linkedinParam === 'error') {
            alert('LinkedIn connection failed. Please try again.');
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

    // Check LinkedIn status on mount via API (verifies with Unipile and returns account name)
    useEffect(() => {
        const checkLinkedIn = async () => {
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
                        connected: data.connected ?? false,
                        account_id: data.account_id ?? null,
                        name: data.name ?? null
                    });
                }
            } catch (err) {
                console.error('Error checking LinkedIn status:', err);
            } finally {
                setLinkedinLoading(false);
            }
        };
        checkLinkedIn();
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

    const saveField = async (field: string, value: string) => {
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
                window.location.href = data.url;
                setToast({ message: 'Complete the connection in the new tab', type: 'success' });
            }
        } catch (err: unknown) {
            console.error('LinkedIn connect error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to connect LinkedIn';
            setToast({ message: errorMessage, type: 'error' });
        } finally {
            setLinkedinConnecting(false);
        }
    };

    const handleConnectEmail = () => {
        alert('Email integration coming soon. Contact support@leadomation.co.uk to get set up.');
    };

    const infrastructureTools = [
        { name: 'Apify', desc: 'Google Maps lead scraping', bgColor: 'bg-amber-50', textColor: 'text-amber-600' },
        { name: 'Hunter.io', desc: 'Email finding and verification', bgColor: 'bg-cyan-50', textColor: 'text-cyan-600' },
        { name: 'Vapi.ai', desc: 'AI voice calling (Pro)', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
        { name: 'Resend', desc: 'Email delivery and tracking', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600' },
        { name: 'DataForSEO', desc: 'Keyword search volume', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
        { name: 'Claude AI', desc: 'Reply classification and sequences', bgColor: 'bg-[#EEF2FF]', textColor: 'text-[#4F46E5]' }
    ];

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
                    toast.type === 'success'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle size={18} className="text-emerald-600" />
                    ) : (
                        <XCircle size={18} className="text-red-600" />
                    )}
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => setToast(null)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        <XCircle size={16} />
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Meeting Link Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-[#111827]">Meeting link</h3>
                            <p className="text-xs text-[#6B7280] mb-3">Paste your Calendly or Cal.com booking URL for email sequences</p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="https://calendly.com/your-name"
                                    className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                />
                                <button
                                    onClick={() => saveField('meeting_link', meetingLink)}
                                    disabled={saving === 'meeting_link' || loadingSettings}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving === 'meeting_link' ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LinkedIn + Email Cards */}
                <div className="grid grid-cols-2 gap-4">
                    {/* LinkedIn Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Linkedin size={20} />
                                </div>
                                <h3 className="text-sm font-semibold text-[#111827]">LinkedIn account</h3>
                            </div>
                            {linkedinLoading ? (
                                <div className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF]">
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Checking...</span>
                                </div>
                            ) : linkedinStatus.connected ? (
                                <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                                    <CheckCircle size={14} />
                                    <span>Connected</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-xs font-medium text-red-500">
                                    <XCircle size={14} />
                                    <span>Not connected</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                            Connect your LinkedIn account to send connection requests and messages directly from Leadomation.
                        </p>

                        {linkedinStatus.connected && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
                                <p className="text-xs text-emerald-700">
                                    Connected as: <span className="font-medium">{linkedinStatus.name || linkedinStatus.account_id || 'LinkedIn account'}</span>
                                </p>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Requirements</p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    Pro plan required
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    LinkedIn personal account
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    Unipile OAuth flow
                                </li>
                            </ul>
                            {linkedinStatus.connected ? (
                                <button
                                    onClick={() => {}}
                                    className="flex items-center justify-center gap-2 w-full bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium px-4 py-2"
                                >
                                    <Linkedin size={16} />
                                    Disconnect account
                                </button>
                            ) : (
                                <button
                                    onClick={handleConnectLinkedIn}
                                    disabled={linkedinConnecting || linkedinLoading}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] disabled:opacity-50"
                                >
                                    <Linkedin size={16} />
                                    {linkedinConnecting ? 'Connecting...' : 'Connect LinkedIn account'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Mail size={20} />
                                </div>
                                <h3 className="text-sm font-semibold text-[#111827]">Email account</h3>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-[#9CA3AF]">
                                <span className="w-2 h-2 rounded-full bg-[#9CA3AF]"></span>
                                <span>Not connected</span>
                            </div>
                        </div>
                        <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
                            Connect your email account to send outreach emails from your own address.
                        </p>

                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Supported providers</p>
                            <ul className="space-y-2 mb-4">
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    Gmail / Google Workspace
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    Microsoft 365 / Outlook
                                </li>
                                <li className="flex items-center gap-2 text-xs text-[#6B7280]">
                                    <span className="w-1 h-1 rounded-full bg-[#9CA3AF]"></span>
                                    SMTP (custom)
                                </li>
                            </ul>
                            <button
                                onClick={handleConnectEmail}
                                className="flex items-center justify-center gap-2 w-full bg-[#ECFEFF] text-[#06B6D4] border border-[#22D3EE] rounded-lg text-sm font-medium px-4 py-2 hover:bg-[#CFFAFE]"
                            >
                                <Mail size={16} />
                                Connect email account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl">
                    <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                        All lead scraping, email finding, and data enrichment tools are included in your plan. No additional API keys or subscriptions required. Leadomation handles the infrastructure so you can focus on outreach.
                    </p>
                </div>

                {/* Included Infrastructure Card */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                    <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Included infrastructure</p>
                    <div className="grid grid-cols-3 gap-3">
                        {infrastructureTools.map((tool) => (
                            <div key={tool.name} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <div className={`w-8 h-8 rounded-lg ${tool.bgColor} flex items-center justify-center ${tool.textColor}`}>
                                    <CheckCircle size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-[#111827]">{tool.name}</p>
                                    <p className="text-xs text-[#9CA3AF]">{tool.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
