import React, { useState, useEffect } from 'react';
import {
    Clock,
    ShieldCheck,
    Save,
    Bold,
    Italic,
    Link,
    Image as ImageIcon,
    Loader2,
    Eye,
    Lightbulb
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const EmailConfig: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [dailyEmailLimit, setDailyEmailLimit] = useState(50);
    const [emailSendDelay, setEmailSendDelay] = useState(30);
    const [autoDetectTimezone, setAutoDetectTimezone] = useState(true);
    const [fromName, setFromName] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [replyToEmail, setReplyToEmail] = useState('');
    const [emailSignature, setEmailSignature] = useState('');
    const [showSignaturePreview, setShowSignaturePreview] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('profiles')
                    .select('daily_email_limit, email_send_delay, auto_detect_timezone, email_from_name, email_from_address, email_reply_to, email_signature')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setDailyEmailLimit(data.daily_email_limit || 50);
                    setEmailSendDelay(data.email_send_delay || 30);
                    setAutoDetectTimezone(data.auto_detect_timezone ?? true);
                    setFromName(data.email_from_name || '');
                    setFromEmail(data.email_from_address || '');
                    setReplyToEmail(data.email_reply_to || '');
                    setEmailSignature(data.email_signature || '');
                }
            } catch (err) {
                console.error('Error loading email config:', err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    const saveSettings = async (fields: Record<string, any>) => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update(fields)
                .eq('id', user.id);

            if (error) {
                console.error('Error saving:', error);
                alert('Failed to save. Please try again.');
            }
        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setTimeout(() => setSaving(false), 1000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 max-w-[1000px] mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">Email Config</h1>
                <p className="text-sm text-[#6B7280] font-medium mt-1">Manage your sending infrastructure and delivery rules.</p>
            </div>

            <div className="space-y-8">
                {/* Section 1: Sending Limits */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                                <Clock size={20} />
                            </div>
                            <h3 className="text-base font-bold text-[#111827]">Sending Controls</h3>
                        </div>
                        <button
                            onClick={() => saveSettings({ daily_email_limit: dailyEmailLimit, email_send_delay: emailSendDelay, auto_detect_timezone: autoDetectTimezone })}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            SAVE
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">DAILY EMAIL LIMIT</label>
                            <div className="flex gap-2">
                                {[25, 50, 100, 200].map(limit => (
                                    <button
                                        key={limit}
                                        onClick={() => {
                                            setDailyEmailLimit(limit);
                                            saveSettings({ daily_email_limit: limit });
                                        }}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold transition-all border ${dailyEmailLimit === limit
                                            ? 'bg-primary text-white border-primary shadow-sm'
                                            : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-gray-300'
                                            }`}
                                    >
                                        {limit}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">SEND DELAY (SECONDS)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                value={emailSendDelay}
                                onChange={e => setEmailSendDelay(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4">
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#111827]">Auto-detect recipient timezone</span>
                                <span className="text-[11px] text-[#6B7280] font-medium mt-1">Emails will arrive during their local business hours</span>
                            </div>
                            <div
                                className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${autoDetectTimezone ? 'bg-primary' : 'bg-gray-200'}`}
                                onClick={() => {
                                    const newValue = !autoDetectTimezone;
                                    setAutoDetectTimezone(newValue);
                                    saveSettings({ auto_detect_timezone: newValue });
                                }}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoDetectTimezone ? 'translate-x-5' : ''}`} />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Section 2: Sender Identity */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="text-base font-bold text-[#111827]">Sender Identity</h3>
                        </div>
                        <button
                            onClick={() => saveSettings({ email_from_name: fromName, email_from_address: fromEmail, email_reply_to: replyToEmail })}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            SAVE
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">FROM NAME</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={fromName}
                                onChange={e => setFromName(e.target.value)}
                                placeholder="e.g. Iain Liddle"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">FROM EMAIL</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={fromEmail}
                                    onChange={e => setFromEmail(e.target.value)}
                                    placeholder="your@outreach-domain.com"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">REPLY-TO EMAIL</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    value={replyToEmail}
                                    onChange={e => setReplyToEmail(e.target.value)}
                                    placeholder="your@main-email.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Email Signature */}
                <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold text-[#111827]">Email Signature</h3>
                            <p className="text-sm text-[#6B7280] font-medium">Automatically appended to outgoing emails</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSignaturePreview(!showSignaturePreview)}
                                className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-black text-[#4B5563] hover:bg-gray-50 transition-all"
                            >
                                <Eye size={14} />
                                PREVIEW
                            </button>
                            <button
                                onClick={() => saveSettings({ email_signature: emailSignature })}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black shadow-md shadow-indigo-500/10 hover:bg-[#4338CA] transition-all active:scale-95 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                SAVE
                            </button>
                        </div>
                    </div>

                    {showSignaturePreview ? (
                        <div className="border border-[#E5E7EB] rounded-xl p-6 mb-8 bg-gray-50 text-sm font-medium text-[#4B5563] whitespace-pre-wrap leading-relaxed">
                            {emailSignature}
                        </div>
                    ) : (
                        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-8 group focus-within:border-primary transition-all">
                            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-[#E5E7EB]">
                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg"><Bold size={16} /></button>
                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg"><Italic size={16} /></button>
                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg"><Link size={16} /></button>
                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg"><ImageIcon size={16} /></button>
                            </div>
                            <textarea
                                className="w-full p-6 text-sm font-semibold text-[#4B5563] focus:outline-none min-h-[160px] bg-white leading-relaxed"
                                value={emailSignature}
                                onChange={e => setEmailSignature(e.target.value)}
                                placeholder="Kind regards,\nIain Liddle"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed hover:border-primary transition-all">
                            <span className="text-xs font-bold text-[#111827]">Full Outgoing Sequence</span>
                            <div className="relative w-11 h-6 rounded-full transition-all duration-300 bg-primary">
                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 translate-x-5" />
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed hover:border-primary transition-all">
                            <span className="text-xs font-bold text-[#111827]">Inbox Replies Only</span>
                            <div className="relative w-11 h-6 rounded-full transition-all duration-300 bg-primary">
                                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 translate-x-5" />
                            </div>
                        </label>
                    </div>
                </div>

                {/* Bottom Info Banner */}
                <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4F46E5] shadow-sm shrink-0">
                        <Lightbulb size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-blue-900">Outreach Deliverability</h4>
                        <p className="text-xs text-blue-700/80 font-medium mt-1.5 leading-relaxed">
                            These settings control how your outreach emails are sent. Daily limits help protect your sender reputation and ensure high deliverability. Your sending identity should match the email account connected in Integrations to avoid spam filters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfig;
