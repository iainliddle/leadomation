import React, { useState, useEffect } from 'react';
import {
    Clock,
    Bold,
    Italic,
    Underline,
    Link as LinkIcon,
    List,
    Sparkles,
    Eye,
    Type,
    Mail,
    Linkedin,
    Info,
    RotateCcw,
    Zap,
    Layers,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SequenceStep {
    id: string;
    type: 'Email' | 'LinkedIn';
    title: string;
    subtitle: string;
    delay?: string;
    linkedinType?: 'Connection Request' | 'Direct Message';
}

const SequenceBuilder: React.FC = () => {
    const [activeStepId, setActiveStepId] = useState('1');
    const [isPreview, setIsPreview] = useState(false);
    const [stopOnReply, setStopOnReply] = useState(true);
    const [skipLinkedIn, setSkipLinkedIn] = useState(true);
    const [showSpintaxTooltip, setShowSpintaxTooltip] = useState(false);
    const [steps, setSteps] = useState<SequenceStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSequence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetching a single sequence (or multiple if we want a list first)
            // For now, let's assume we are editing one sequence.
            const { data, error } = await supabase
                .from('sequences')
                .select('*')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (error) {
                console.error('Error fetching sequence:', error);
                // Fallback to empty steps or dummy if none found
                setSteps([
                    { id: '1', type: 'Email', title: 'Initial Outreach', subtitle: 'Sent at local 9am' }
                ]);
            } else if (data && data.steps) {
                setSteps(data.steps as SequenceStep[]);
                if (data.steps.length > 0) setActiveStepId(data.steps[0].id);
            }
            setIsLoading(false);
        };

        fetchSequence();
    }, []);

    const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

    // Email State
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState(`Hi {{first_name}},

I came across {{business_name}} and was genuinely impressed by your {{rating}}-star reputation in {{city}}.

We handcraft bespoke cold plunge pools and ice baths here in Dubai, built to order for wellness-focused businesses like yours. Each unit is designed around your space, your brand, and your clients' experience.

Would you be open to a quick chat about how a premium cold therapy offering could enhance your facility?

Happy to share some examples of recent installations.

Best regards,
[Your name]`);

    // LinkedIn State
    const [linkedinNote, setLinkedinNote] = useState('');
    const [linkedinDM, setLinkedinDM] = useState('');

    const mergeTags = [
        { label: '{{business_name}}', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: '{{first_name}}', color: 'bg-blue-50 text-blue-600 border-blue-100' },
        { label: '{{city}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{country}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{rating}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{website}}', color: 'bg-gray-50 text-gray-600 border-gray-100' },
        { label: '{{meeting_link}}', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
    ];

    const insertTag = (tag: string) => {
        if (activeStep.type === 'Email') {
            setEmailBody(prev => prev + ' ' + tag);
        } else {
            if (activeStep.linkedinType === 'Connection Request') {
                setLinkedinNote(prev => prev + ' ' + tag);
            } else {
                setLinkedinDM(prev => prev + ' ' + tag);
            }
        }
    };

    const getPreviewText = (text: string) => {
        return text
            .replace(/{{business_name}}/g, 'Wellness Spa Berlin')
            .replace(/{{first_name}}/g, 'Hans')
            .replace(/{{city}}/g, 'Berlin')
            .replace(/{{country}}/g, 'Germany')
            .replace(/{{rating}}/g, '4.8')
            .replace(/{{website}}/g, 'wellness-spa.de')
            .replace(/{{meeting_link}}/g, 'calendly.com/leadomation-demo');
    };

    const updateLinkedInType = (type: 'Connection Request' | 'Direct Message') => {
        setSteps(prev => prev.map(s => s.id === activeStepId ? { ...s, linkedinType: type } : s));
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto h-full">
            {/* Left Panel: Sequence Timeline */}
            <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-2 custom-scrollbar pb-10 pt-4 mt-2">
                <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden p-5 shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-widest">Sequence Timeline</h3>
                        <span className="px-2 py-0.5 bg-blue-50 text-primary rounded-full text-[10px] font-black">{steps.length} STEPS</span>
                    </div>

                    <div className="flex flex-col relative">
                        {/* Timeline background line */}
                        <div className="absolute left-[22px] top-10 bottom-10 w-0.5 border-l-2 border-dashed border-gray-100 z-0"></div>

                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                {index > 0 && (
                                    <div className="flex flex-col items-center py-1 relative z-10">
                                        <div className="flex items-center gap-2 py-1 px-2.5 bg-gray-50 rounded-full border border-gray-100 my-1">
                                            <Clock size={10} className="text-[#9CA3AF]" />
                                            <span className="text-[9px] font-bold text-[#6B7280]">{step.delay}</span>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => setActiveStepId(step.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all relative z-10 ${activeStepId === step.id
                                        ? 'bg-[#F0F7FF] border-primary shadow-sm ring-1 ring-primary'
                                        : 'bg-white border-[#E5E7EB] hover:border-gray-300'
                                        }`}
                                >
                                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 ${activeStepId === step.id
                                        ? 'bg-primary text-white border-primary'
                                        : step.type === 'Email'
                                            ? 'bg-blue-50 text-primary border-blue-100'
                                            : 'bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20'
                                        }`}>
                                        {step.type === 'Email' ? <Mail size={18} /> : <Linkedin size={18} />}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className={`text-xs font-bold truncate ${activeStepId === step.id ? 'text-primary' : 'text-[#111827]'}`}>
                                            Step {index + 1}: {step.type}
                                        </span>
                                        <span className="text-[10px] text-[#4B5563] font-bold truncate">{step.title}</span>
                                        <span className="text-[9px] text-[#9CA3AF] font-medium truncate">{step.subtitle}</span>
                                    </div>
                                </button>
                            </React.Fragment>
                        ))}

                        <div className="mt-6 p-4 border-2 border-dashed border-[#E5E7EB] rounded-xl relative z-10">
                            <span className="text-[10px] font-bold text-gray-400 block mb-3 text-center uppercase tracking-wider">+ Add Step</span>
                            <div className="flex flex-col gap-2">
                                <button className="flex items-center justify-center gap-2 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 hover:border-primary hover:text-primary transition-all shadow-sm">
                                    <Mail size={12} /> Add Email Step
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 hover:border-[#0A66C2] hover:text-[#0A66C2] transition-all shadow-sm">
                                    <Linkedin size={12} /> Add LinkedIn Step
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6 shrink-0 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-100/50 transition-colors duration-500"></div>
                    <h3 className="text-sm font-semibold text-[#111827] mb-5 relative z-10">Sequence Settings</h3>

                    <div className="flex flex-col gap-5 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-primary shrink-0">
                                <Layers size={14} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-[#111827]">5 steps · 2 channels</span>
                                <span className="text-[10px] text-[#6B7280] font-bold">Estimated duration: ~12 days</span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-100"></div>

                        <div className="flex flex-col gap-4">
                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[11px] font-bold text-[#4B5563] group-hover:text-primary transition-colors">Stop sequence on any reply</span>
                                <div
                                    className={`relative w-8 h-4 rounded-full transition-all duration-300 shrink-0 ${stopOnReply ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-gray-200'}`}
                                    onClick={(e) => { e.preventDefault(); setStopOnReply(!stopOnReply); }}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${stopOnReply ? 'translate-x-4' : ''}`} />
                                </div>
                            </label>

                            <label className="flex items-center justify-between cursor-pointer group">
                                <span className="text-[11px] font-bold text-[#4B5563] group-hover:text-primary transition-colors">Skip LinkedIn if not connected</span>
                                <div
                                    className={`relative w-8 h-4 rounded-full transition-all duration-300 shrink-0 ${skipLinkedIn ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-gray-200'}`}
                                    onClick={(e) => { e.preventDefault(); setSkipLinkedIn(!skipLinkedIn); }}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${skipLinkedIn ? 'translate-x-4' : ''}`} />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-5 shrink-0 bg-gradient-to-br from-white to-purple-50/30">
                    <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
                        <Zap size={12} className="text-purple-500" /> AI ASSIST
                    </h3>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-purple-100 text-purple-600 rounded-xl text-[11px] font-black shadow-sm group hover:bg-purple-600 hover:text-white transition-all duration-300">
                        <Sparkles size={14} className="group-hover:animate-bounce" />
                        🤖 GENERATE WITH AI
                    </button>
                    <p className="text-[9px] text-[#9CA3AF] font-medium mt-3 leading-relaxed text-center italic">
                        Describe your product and target — AI creates the full multi-channel sequence
                    </p>
                </div>
            </aside>

            {/* Right Panel: Context-Aware Editor */}
            <main className="flex-1 min-w-0">
                <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm flex flex-col h-full min-h-[800px] overflow-hidden">
                    {/* Editor Header */}
                    <div className="px-8 py-4 border-b border-[#F3F4F6] flex items-center justify-between bg-white sticky top-0 z-20">
                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-1.5 rounded-full text-[11px] font-black flex items-center gap-2 ${activeStep.type === 'Email'
                                ? 'bg-blue-50 text-[#2563EB]'
                                : 'bg-[#0A66C2]/10 text-[#0A66C2]'
                                }`}>
                                {activeStep.type === 'Email' ? <Mail size={14} /> : <Linkedin size={14} />}
                                {activeStep.type} · Step {activeStepId}
                            </div>
                            {activeStep.type === 'LinkedIn' && (
                                <div className="flex bg-gray-50 border border-[#E5E7EB] rounded-lg p-1 shadow-sm">
                                    <button
                                        onClick={() => updateLinkedInType('Connection Request')}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${activeStep.linkedinType === 'Connection Request' ? 'bg-[#0A66C2] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Connection Request
                                    </button>
                                    <button
                                        onClick={() => updateLinkedInType('Direct Message')}
                                        className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${activeStep.linkedinType === 'Direct Message' ? 'bg-[#0A66C2] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Direct Message
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex bg-white border border-[#E5E7EB] rounded-lg p-1 shadow-sm">
                            <button
                                onClick={() => setIsPreview(false)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-black flex items-center gap-2 transition-all ${!isPreview ? 'bg-primary text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                                    }`}
                            >
                                <Type size={14} /> EDITOR
                            </button>
                            <button
                                onClick={() => setIsPreview(true)}
                                className={`px-4 py-1.5 rounded-md text-[10px] font-black flex items-center gap-2 transition-all ${isPreview ? 'bg-primary text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'
                                    }`}
                            >
                                <Eye size={14} /> PREVIEW
                            </button>
                        </div>
                    </div>

                    {/* Editor Content Area */}
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        {activeStep.type === 'Email' ? (
                            <div className="flex flex-col flex-1 animate-in slide-in-from-right-2 duration-300">
                                {/* Email Specific Header */}
                                <div className="p-8 border-b border-[#F3F4F6] bg-gray-50/30">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">SUBJECT LINE</label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="e.g., Bespoke cold plunge pools for {{business_name}}"
                                            className="w-full py-1.5 text-xl font-bold text-[#111827] focus:outline-none placeholder:text-[#D1D5DB] bg-transparent"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                        />
                                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                                            {mergeTags.slice(0, 3).map(tag => (
                                                <button
                                                    key={tag.label}
                                                    onClick={() => insertTag(tag.label)}
                                                    className="px-2 py-1 rounded bg-white border border-gray-100 text-[9px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all"
                                                >
                                                    {tag.label}
                                                </button>
                                            ))}
                                            <button className="px-2 py-1 text-[9px] font-bold text-primary hover:underline">All tags +</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Toolbar */}
                                <div className="px-8 py-3.5 bg-white border-b border-[#F3F4F6] flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        {[Bold, Italic, Underline, LinkIcon, List].map((Icon, i) => (
                                            <button key={i} className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 rounded-lg transition-all">
                                                <Icon size={18} />
                                            </button>
                                        ))}
                                        <div className="w-px h-6 bg-[#E5E7EB] mx-2"></div>
                                        <div className="relative">
                                            <button
                                                className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 text-amber-600 rounded-lg text-[11px] font-black group hover:bg-amber-100 transition-all"
                                                onMouseEnter={() => setShowSpintaxTooltip(true)}
                                                onMouseLeave={() => setShowSpintaxTooltip(false)}
                                            >
                                                <RotateCcw size={14} /> SPINTAX
                                            </button>
                                            {showSpintaxTooltip && (
                                                <div className="absolute top-full mt-2 left-0 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in duration-200">
                                                    <div className="flex items-start gap-2">
                                                        <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-900 mb-1">About Spintax</p>
                                                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                                                Spintax creates message variations to improve deliverability. <br />
                                                                <span className="text-gray-900 block mt-1">Example: <code className="bg-gray-50 px-1 rounded">{"{Hi|Hey|Hello}"}</code></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-lg text-[11px] font-black group hover:bg-purple-100 transition-all ml-1">
                                            <Sparkles size={14} /> ✨ AI GENERATE
                                        </button>
                                    </div>
                                </div>

                                {/* Editor Canvas */}
                                <div className="flex-1 p-8 relative min-h-[400px]">
                                    {isPreview ? (
                                        <div className="prose prose-sm max-w-none text-[#374151] font-medium leading-relaxed animate-in fade-in duration-300">
                                            <div className="mb-6 font-bold text-[#111827] pb-4 border-b border-gray-100">
                                                Subject: {getPreviewText(emailSubject || 'e.g., Bespoke cold plunge pools for {{business_name}}')}
                                            </div>
                                            <div className="whitespace-pre-line text-sm text-[#4B5563]">
                                                {getPreviewText(emailBody)}
                                            </div>
                                        </div>
                                    ) : (
                                        <textarea
                                            className="w-full h-full min-h-[400px] resize-none focus:outline-none text-[#374151] font-medium leading-relaxed placeholder:text-[#D1D5DB] bg-transparent"
                                            placeholder="Start writing your email..."
                                            value={emailBody}
                                            onChange={(e) => setEmailBody(e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col flex-1 animate-in slide-in-from-right-2 duration-300">
                                <div className="flex-1 flex flex-col p-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">{activeStep.linkedinType} CONTENT</label>
                                        {activeStep.linkedinType === 'Connection Request' && (
                                            <span className={`text-[10px] font-black ${linkedinNote.length > 300 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {linkedinNote.length} / 300
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-100 p-6 shadow-inner">
                                        {activeStep.linkedinType === 'Connection Request' ? (
                                            <textarea
                                                className="w-full h-full min-h-[250px] resize-none focus:outline-none text-[#374151] font-medium leading-relaxed placeholder:text-gray-300 bg-transparent"
                                                placeholder={`Hi {{first_name}}, I noticed {{business_name}} in {{city}} — impressive {{rating}} star reputation. I work with premium wellness venues on bespoke cold therapy solutions. Would love to connect.`}
                                                value={linkedinNote}
                                                onChange={(e) => setLinkedinNote(e.target.value)}
                                            />
                                        ) : (
                                            <textarea
                                                className="w-full h-full min-h-[400px] resize-none focus:outline-none text-[#374151] font-medium leading-relaxed placeholder:text-gray-300 bg-transparent"
                                                placeholder={`Hi {{first_name}}, thanks for connecting! I wanted to share a quick look at what we do — we design and handcraft bespoke cold plunge pools and ice baths here in Dubai, shipped globally. Several premium venues in {{country}} are now offering these as a signature experience. Would you be open to seeing some examples? Happy to send over our portfolio. Best, [Your Name]`}
                                                value={linkedinDM}
                                                onChange={(e) => setLinkedinDM(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    {activeStep.linkedinType === 'Connection Request' && (
                                        <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-3 items-start">
                                            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                                                Connection requests have a 300 character limit. Keep it short, personal, and don't sell — just open the door.
                                            </p>
                                        </div>
                                    )}

                                    {activeStep.linkedinType === 'Direct Message' && (
                                        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex gap-3 items-start">
                                            <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed">
                                                LinkedIn DMs support basic formatting. Keep messages conversational — this isn't email.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Merge Tags Bar (Bottom) */}
                    <div className="px-8 py-4 border-t border-[#F3F4F6] bg-white sticky bottom-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-2">MERGE TAGS:</span>
                            {mergeTags.map(tag => (
                                <button
                                    key={tag.label}
                                    onClick={() => insertTag(tag.label)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all hover:shadow-sm hover:scale-105 active:scale-95 ${tag.color}`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-[#F3F4F6] flex items-center justify-end gap-3 bg-gray-50/50">
                        <button className="px-6 py-2.5 bg-white border border-[#E5E7EB] text-[#374151] rounded-lg text-sm font-bold hover:bg-gray-50 transition-all shadow-sm">
                            Save Template
                        </button>
                        <button className="px-9 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95">
                            Save & Close
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SequenceBuilder;
