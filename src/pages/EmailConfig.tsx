import React, { useState, useEffect, useRef, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
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
    Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlan } from '../hooks/usePlan';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

// Error boundary for TipTap editor
interface EditorErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactNode;
}

interface EditorErrorBoundaryState {
    hasError: boolean;
}

class EditorErrorBoundary extends Component<EditorErrorBoundaryProps, EditorErrorBoundaryState> {
    constructor(props: EditorErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): EditorErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('TipTap Editor Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Separate component for the TipTap editor to isolate initialization
interface SignatureEditorProps {
    initialContent: string;
    onUpdate: (html: string) => void;
    onImageUploadError: () => void;
}

const SignatureEditor: React.FC<SignatureEditorProps> = ({
    initialContent,
    onUpdate,
    onImageUploadError,
}) => {
    const [uploadingImage, setUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'min-h-[120px] p-3 focus:outline-none text-sm',
                dir: 'ltr',
                style: 'direction: ltr; text-align: left;',
            },
        },
        onUpdate: ({ editor }) => {
            onUpdate(editor.getHTML());
        },
    });

    // Update editor content when signature loads from database
    useEffect(() => {
        if (editor && initialContent && !editor.isFocused) {
            const currentContent = editor.getHTML();
            if (currentContent === '<p></p>' && initialContent !== '<p></p>') {
                editor.commands.setContent(initialContent);
            }
        }
    }, [editor, initialContent]);

    const handleBold = () => {
        editor?.chain().focus().toggleBold().run();
    };

    const handleItalic = () => {
        editor?.chain().focus().toggleItalic().run();
    };

    const handleLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    };

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setUploadingImage(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const ext = file.name.split('.').pop() || 'png';
            const timestamp = Date.now();
            const filePath = `${user.id}/signature-${timestamp}.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from('signature-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('signature-images')
                .getPublicUrl(filePath);

            editor.chain().focus().setImage({ src: urlData.publicUrl }).run();
        } catch (err) {
            console.error('Image upload failed:', err);
            onImageUploadError();
        } finally {
            setUploadingImage(false);
            if (imageInputRef.current) {
                imageInputRef.current.value = '';
            }
        }
    };

    if (!editor) {
        return (
            <div className="border border-[#E5E7EB] rounded-xl p-5 mb-6 bg-gray-50 min-h-[120px] flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-6">
            <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-[#E5E7EB]">
                <button onClick={handleBold} className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-white rounded-lg transition-all"><Bold size={14} /></button>
                <button onClick={handleItalic} className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-white rounded-lg transition-all"><Italic size={14} /></button>
                <button onClick={handleLink} className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-white rounded-lg transition-all"><Link size={14} /></button>
                <button onClick={handleImageClick} disabled={uploadingImage} className="p-1.5 text-gray-400 hover:text-[#4F46E5] hover:bg-white rounded-lg transition-all disabled:opacity-50">
                    {uploadingImage ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
                </button>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
            <EditorContent
                editor={editor}
                className="w-full text-[#374151] bg-white leading-relaxed [&_img]:max-w-[200px] [&_img]:h-auto [&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:text-sm"
            />
        </div>
    );
};

// Default limits for Starter plan (used as fallback when plan data is loading)
const DEFAULT_LIMITS = {
    maxEmailsPerDay: 30,
};

const EmailConfig: React.FC = () => {
    useEffect(() => {
        document.title = 'Email Config | Leadomation';
        return () => { document.title = 'Leadomation'; };
    }, []);

    const { plan, limits } = usePlan();
    const planLimits = limits ?? DEFAULT_LIMITS;
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
    const [fullOutgoingSequence, setFullOutgoingSequence] = useState(true);
    const [inboxRepliesOnly, setInboxRepliesOnly] = useState(true);
    const [activeSection, setActiveSection] = useState('sending');
    const [imageUploadError, setImageUploadError] = useState(false);

    const handleImageUploadError = () => {
        setImageUploadError(true);
        setTimeout(() => setImageUploadError(false), 3000);
    };

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data } = await supabase
                    .from('profiles')
                    .select('daily_email_limit, email_send_delay, auto_detect_timezone, email_from_name, email_from_address, email_reply_to, email_signature, full_outgoing_sequence, inbox_replies_only')
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
                    setFullOutgoingSequence(data.full_outgoing_sequence ?? true);
                    setInboxRepliesOnly(data.inbox_replies_only ?? true);
                }
            } catch (err) {
                console.error('Error loading email config:', err);
            } finally {
                setLoading(false);
            }
        };
        loadSettings();
    }, []);

    // Clamp daily email limit to plan maximum if it exceeds
    useEffect(() => {
        if (limits?.maxEmailsPerDay && dailyEmailLimit > limits.maxEmailsPerDay) {
            setDailyEmailLimit(limits.maxEmailsPerDay);
            saveSettings({ daily_email_limit: limits.maxEmailsPerDay });
        }
    }, [limits?.maxEmailsPerDay]);

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
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="flex gap-6">

                {/* Left Nav Panel */}
                <div className="w-52 shrink-0">
                    <div className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {[
                            { id: 'sending', label: 'Sending Controls', icon: Clock },
                            { id: 'identity', label: 'Sender Identity', icon: ShieldCheck },
                            { id: 'signature', label: 'Email Signature', icon: Bold },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all border-l-2 ${
                                    activeSection === id
                                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5] font-medium'
                                        : 'text-[#6B7280] border-transparent hover:bg-gray-50 hover:text-[#111827] font-normal'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Panel */}
                <div className="flex-1">

                    {/* Sending Controls */}
                    {activeSection === 'sending' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <Clock size={18} className="text-amber-600" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">Sending Controls</h2>
                                    <p className="text-sm text-[#6B7280]">Configure your daily limits and send timing</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-3 block">Daily email limit</label>
                                    <div className="flex gap-2">
                                        {(plan === 'starter' || plan === 'trial' ? [10, 20, 30] : [25, 50, 100]).map(limit => (
                                            <button
                                                key={limit}
                                                onClick={() => { setDailyEmailLimit(limit); saveSettings({ daily_email_limit: limit }); }}
                                                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${
                                                    dailyEmailLimit === limit
                                                        ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                                                        : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:border-gray-300'
                                                }`}
                                            >
                                                {limit}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Daily limit helps protect your sender reputation. Your plan allows up to {planLimits.maxEmailsPerDay} emails per day.
                                    </p>
                                </div>

                                <div className="max-w-xs">
                                    <label className="text-xs font-medium text-[#6B7280] mb-2 block">Send delay (seconds)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                        value={emailSendDelay}
                                        onChange={e => setEmailSendDelay(parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">Auto-detect recipient timezone</p>
                                        <p className="text-xs text-[#6B7280] mt-0.5">Emails will arrive during their local business hours</p>
                                    </div>
                                    <div
                                        className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${autoDetectTimezone ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        onClick={() => { const v = !autoDetectTimezone; setAutoDetectTimezone(v); saveSettings({ auto_detect_timezone: v }); }}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${autoDetectTimezone ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => saveSettings({ daily_email_limit: dailyEmailLimit, email_send_delay: emailSendDelay, auto_detect_timezone: autoDetectTimezone })}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sender Identity */}
                    {activeSection === 'identity' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                    <ShieldCheck size={18} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">Sender Identity</h2>
                                    <p className="text-sm text-[#6B7280]">Configure who your emails appear to come from</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-2 block">From name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                        value={fromName}
                                        onChange={e => setFromName(e.target.value)}
                                        placeholder="e.g. Iain Liddle"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-medium text-[#6B7280] mb-2 block">From email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                            value={fromEmail}
                                            onChange={e => setFromEmail(e.target.value)}
                                            placeholder="your@outreach-domain.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-[#6B7280] mb-2 block">Reply-to email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:border-[#4F46E5] transition-all"
                                            value={replyToEmail}
                                            onChange={e => setReplyToEmail(e.target.value)}
                                            placeholder="your@main-email.com"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        onClick={() => saveSettings({ email_from_name: fromName, email_from_address: fromEmail, email_reply_to: replyToEmail })}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Email Signature */}
                    {activeSection === 'signature' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-base font-semibold text-[#111827]">Email Signature</h2>
                                    <p className="text-sm text-[#6B7280] mt-0.5">Automatically appended to outgoing emails</p>
                                </div>
                                <button
                                    onClick={() => setShowSignaturePreview(!showSignaturePreview)}
                                    className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-all"
                                >
                                    <Eye size={14} />
                                    {showSignaturePreview ? 'Edit' : 'Preview'}
                                </button>
                            </div>

                            {showSignaturePreview ? (
                                <div className="border border-[#E5E7EB] rounded-xl p-5 mb-6 bg-gray-50 text-sm text-[#4B5563] leading-relaxed min-h-[120px]">
                                    {emailSignature ? (
                                        <div dangerouslySetInnerHTML={{ __html: emailSignature }} />
                                    ) : (
                                        <span className="text-gray-400 italic">No signature set</span>
                                    )}
                                </div>
                            ) : (
                                <EditorErrorBoundary
                                    fallback={
                                        <div className="border border-red-200 rounded-xl p-5 mb-6 bg-red-50 text-sm text-red-700 min-h-[120px]">
                                            <p className="font-medium mb-1">Editor failed to load</p>
                                            <p className="text-xs text-red-600">Please refresh the page. If the issue persists, contact support.</p>
                                        </div>
                                    }
                                >
                                    <SignatureEditor
                                        initialContent={emailSignature}
                                        onUpdate={setEmailSignature}
                                        onImageUploadError={handleImageUploadError}
                                    />
                                </EditorErrorBoundary>
                            )}

                            {imageUploadError && (
                                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    Image upload failed. Please try again.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">Full Outgoing Sequence</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Append your signature to all outbound sequence emails</p>
                                    </div>
                                    <div
                                        className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${fullOutgoingSequence ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        onClick={() => { const v = !fullOutgoingSequence; setFullOutgoingSequence(v); saveSettings({ full_outgoing_sequence: v }); }}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${fullOutgoingSequence ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-[#111827]">Inbox Replies Only</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Also append your signature when replying from your inbox</p>
                                    </div>
                                    <div
                                        className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer shrink-0 ${inboxRepliesOnly ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        onClick={() => { const v = !inboxRepliesOnly; setInboxRepliesOnly(v); saveSettings({ inbox_replies_only: v }); }}
                                    >
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${inboxRepliesOnly ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => saveSettings({ email_signature: emailSignature, full_outgoing_sequence: fullOutgoingSequence, inbox_replies_only: inboxRepliesOnly })}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mt-4">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs font-medium text-[#374151] leading-relaxed">
                            These settings control how your outreach emails are sent. Daily limits help protect your sender reputation. Your sending identity should match the email account connected in Integrations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailConfig;
