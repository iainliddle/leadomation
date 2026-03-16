import React, { useState, useEffect } from 'react';
import {
    Phone,
    Save,
    Loader2,
    ChevronDown,
    Plus,
    Trash2,
    X,
    Wand2,
    Mic,
    MessageSquare,
    Target,
    Shield,
    Calendar,
    Volume2,
    CheckCircle2,
    AlertCircle,
    Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CallScript {
    id?: string;
    name: string;
    company_name: string;
    objective: string;
    custom_objective: string;
    opening_line: string;
    qualifying_questions: string[];
    objection_responses: { objection: string; response: string }[];
    success_action: string;
    booking_url: string;
    tone: string;
    additional_context: string;
    status: string;
    system_prompt?: string;
    voicemail_script?: string;
}

const defaultScript: CallScript = {
    name: '',
    company_name: '',
    objective: 'book_discovery',
    custom_objective: '',
    opening_line: '',
    qualifying_questions: [''],
    objection_responses: [{ objection: '', response: '' }],
    success_action: 'send_booking_link',
    booking_url: '',
    tone: 'professional',
    additional_context: '',
    status: 'active',
    voicemail_script: "Hi [first_name], this is Sarah calling on behalf of [company_name]. I was hoping to have a quick chat about something that might be relevant to your business. I'll try you again shortly, but if you'd like to speak sooner, you can book a time directly at [booking_link]. Speak soon!"
};

const objectives = [
    { id: 'book_discovery', label: 'Book a Discovery Call', icon: '📅', desc: 'Schedule a meeting or demo with the prospect' },
    { id: 'qualify_lead', label: 'Qualify the Lead', icon: '🎯', desc: 'Determine if the prospect is a good fit' },
    { id: 'schedule_demo', label: 'Schedule a Demo', icon: '💻', desc: 'Book a product demonstration' },
    { id: 'invite_event', label: 'Invite to Event', icon: '🎟️', desc: 'Get them to attend a webinar or event' },
    { id: 'custom', label: 'Custom Objective', icon: '✏️', desc: 'Define your own call objective' }
];

const tones = [
    { id: 'professional', label: 'Professional', desc: 'Polished and business-like' },
    { id: 'friendly', label: 'Friendly & Warm', desc: 'Approachable and conversational' },
    { id: 'consultative', label: 'Consultative', desc: 'Advisory and solution-focused' },
    { id: 'direct', label: 'Direct & Confident', desc: 'Straight to the point, assertive' }
];

const successActions = [
    { id: 'send_booking_link', label: 'Send Booking Link via SMS', icon: '📱' },
    { id: 'confirm_time', label: 'Confirm a Time on the Call', icon: '⏰' },
    { id: 'take_email', label: 'Take Their Email for Follow-up', icon: '📧' },
    { id: 'transfer_call', label: 'Transfer to a Team Member', icon: '📞' }
];

const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode; step?: number }> = ({ title, icon: Icon, children, step }) => (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
            {step && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                    {step}
                </div>
            )}
            <Icon size={18} className="text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        {children}
    </div>
);

interface CallScriptBuilderProps {
}

const CallScriptBuilder: React.FC<CallScriptBuilderProps> = () => {
    const [script, setScript] = useState<CallScript>(defaultScript);
    const [savedScripts, setSavedScripts] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [loadingScripts, setLoadingScripts] = useState(true);
    const [selectedScriptId, setSelectedScriptId] = useState<string>('');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [showPromptPreview, setShowPromptPreview] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState('');
    const [showEnhancedPreview, setShowEnhancedPreview] = useState(false);

    const insertVariable = (variable: string) => {
        const textarea = document.getElementById('voicemail_script') as HTMLTextAreaElement;

        const currentText = script.voicemail_script || '';
        if (!textarea) {
            setScript(prev => ({ ...prev, voicemail_script: currentText + variable }));
            return;
        }

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newText = currentText.substring(0, start) + variable + currentText.substring(end);
        setScript(prev => ({ ...prev, voicemail_script: newText }));

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
    };

    const getWordCountStats = (text: string) => {
        if (!text) return { words: 0, seconds: 0, colorClass: 'text-green-600' };
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const seconds = Math.round(words / 3);

        let colorClass = 'text-green-600';
        if (words >= 75 && words <= 100) colorClass = 'text-amber-500';
        if (words > 100) colorClass = 'text-red-500';

        return { words, seconds, colorClass };
    };

    const vmStats = getWordCountStats(script.voicemail_script || '');

    useEffect(() => {
        loadScripts();
    }, []);

    const loadScripts = async () => {
        setLoadingScripts(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('call_scripts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setSavedScripts(data);
        }
        setLoadingScripts(false);
    };

    const loadScript = (scriptId: string) => {
        const found = savedScripts.find(s => s.id === scriptId);
        if (found) {
            setScript({
                id: found.id,
                name: found.name || '',
                company_name: found.company_name || '',
                objective: found.objective || 'book_discovery',
                custom_objective: found.custom_objective || '',
                opening_line: found.opening_line || '',
                qualifying_questions: found.qualifying_questions || [''],
                objection_responses: found.objection_responses || [{ objection: '', response: '' }],
                success_action: found.success_action || 'send_booking_link',
                booking_url: found.booking_url || '',
                tone: found.tone || 'professional',
                additional_context: found.additional_context || '',
                status: found.status || 'active',
                system_prompt: found.system_prompt || '',
                voicemail_script: found.voicemail_script || ''
            });
            setSelectedScriptId(scriptId);
        }
    };

    const generateSystemPrompt = (): string => {
        const obj = objectives.find(o => o.id === script.objective);
        const objectiveText = script.objective === 'custom' ? script.custom_objective : obj?.label;
        const toneObj = tones.find(t => t.id === script.tone);
        const actionObj = successActions.find(a => a.id === script.success_action);

        const questions = script.qualifying_questions.filter(q => q.trim()).map((q, i) => `${i + 1}. ${q}`).join('\n');
        const objections = script.objection_responses.filter(o => o.objection.trim()).map(o => `- If they say "${o.objection}", respond with: "${o.response}"`).join('\n');

        let prompt = `You are a ${toneObj?.label?.toLowerCase() || 'professional'} AI sales assistant calling on behalf of ${script.company_name || '[Company Name]'}.

OBJECTIVE: ${objectiveText || 'Book a discovery call'}

OPENING: ${script.opening_line || `Hi, I'm calling from ${script.company_name || '[Company Name]'}. Is now a good time for a quick chat?`}

QUALIFYING QUESTIONS:
${questions || '1. Are you the person who handles this area?\n2. Is this something you\'re currently looking into?'}

OBJECTION HANDLING:
${objections || '- If they say "I\'m not interested", respond with: "I completely understand. I just wanted to share one quick thing that might be relevant..."'}
- If they say "Send me an email", respond with: "Absolutely, I'd be happy to. Before I do, can I ask one quick question so I send you the most relevant information?"
- If they say "I'm busy right now", respond with: "No problem at all. When would be a better time for me to call back? I'll keep it to just 2 minutes."
- If they ask a question you don't know the answer to, say: "That's a great question. Let me have someone from our team get back to you with the exact details on that."

WHEN THEY SAY YES:
${actionObj?.label || 'Send booking link via SMS'}${script.booking_url ? `\nBooking link: ${script.booking_url}` : ''}

TONE: Be ${toneObj?.desc?.toLowerCase() || 'polished and business-like'}. Never be pushy or aggressive. If someone clearly isn't interested after you've addressed their concern, thank them politely and end the call.

GATEKEEPER HANDLING:
- If a receptionist or gatekeeper answers, say: "Hi there, I'm looking to speak with the person who handles [relevant area]. Could you put me through?"
- If asked what it's regarding, say: "It's regarding ${script.additional_context ? script.additional_context.substring(0, 100) : 'a business opportunity that I think would be really relevant to your team'}."
- Be polite and patient if put on hold.

IMPORTANT RULES:
- Keep responses concise. One or two sentences at a time is best.
- Listen carefully and respond to what the person actually says
- Never interrupt the person
- If they ask you to stop calling, confirm you'll remove them from the list and end politely
- Always confirm the person's name at the start of the call
- Sound natural and conversational, not scripted`;

        if (script.additional_context) {
            prompt += `\n\nADDITIONAL CONTEXT:\n${script.additional_context}`;
        }

        return prompt;
    };

    const handleEnhanceWithAI = async () => {
        setIsEnhancing(true);
        try {
            const response = await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/ai-enhance-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: generatedPrompt })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('API error:', error);
                throw new Error('Failed to enhance script');
            }

            const data = await response.json();
            console.log('AI Enhance response:', data);

            let enhancedText = '';
            if (Array.isArray(data)) {
                enhancedText = data[0]?.enhanced || data[0]?.json?.enhanced || '';
            } else {
                enhancedText = data.enhanced || data.json?.enhanced || '';
            }
            setEnhancedPrompt(enhancedText);
            setShowEnhancedPreview(true);
        } catch (error) {
            console.error('Error enhancing script:', error);
            alert('Failed to enhance script. Please try again.');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleSave = async () => {
        if (!script.name?.trim()) {
            alert('Please enter a script name.');
            return;
        }

        setSaving(true);
        setSaveSuccess(false);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const systemPrompt = script.system_prompt || generateSystemPrompt();

            const saveData = {
                user_id: user.id,
                name: script.name.trim(),
                company_name: script.company_name,
                objective: script.objective,
                custom_objective: script.custom_objective,
                opening_line: script.opening_line,
                qualifying_questions: script.qualifying_questions,
                objection_responses: script.objection_responses,
                success_action: script.success_action,
                booking_url: script.booking_url,
                tone: script.tone,
                additional_context: script.additional_context,
                system_prompt: systemPrompt,
                status: 'active',
                voicemail_script: script.voicemail_script
            };

            if (script.id) {
                const { error } = await supabase
                    .from('call_scripts')
                    .update(saveData)
                    .eq('id', script.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('call_scripts')
                    .insert(saveData);
                if (error) throw error;
            }

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            await loadScripts();
        } catch (err) {
            console.error('Error saving script:', err);
            alert('Failed to save script. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const addQuestion = () => {
        setScript(prev => ({
            ...prev,
            qualifying_questions: [...prev.qualifying_questions, '']
        }));
    };

    const removeQuestion = (index: number) => {
        setScript(prev => ({
            ...prev,
            qualifying_questions: prev.qualifying_questions.filter((_, i) => i !== index)
        }));
    };

    const updateQuestion = (index: number, value: string) => {
        setScript(prev => ({
            ...prev,
            qualifying_questions: prev.qualifying_questions.map((q, i) => i === index ? value : q)
        }));
    };

    const addObjection = () => {
        setScript(prev => ({
            ...prev,
            objection_responses: [...prev.objection_responses, { objection: '', response: '' }]
        }));
    };

    const removeObjection = (index: number) => {
        setScript(prev => ({
            ...prev,
            objection_responses: prev.objection_responses.filter((_, i) => i !== index)
        }));
    };

    const updateObjection = (index: number, field: 'objection' | 'response', value: string) => {
        setScript(prev => ({
            ...prev,
            objection_responses: prev.objection_responses.map((o, i) => i === index ? { ...o, [field]: value } : o)
        }));
    };

    const handleNewScript = () => {
        setScript(defaultScript);
        setSelectedScriptId('');
    };

    return (
        <div className="max-w-[800px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Phone size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-[#111827]">AI Call Agent</h1>
                        <p className="text-sm text-[#6B7280] font-medium">Configure your AI voice agent to make outbound calls to leads</p>
                    </div>
                </div>
            </div>

            {/* Script Selector */}
            <div className="card p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-xs">
                        <select
                            value={selectedScriptId}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    handleNewScript();
                                } else {
                                    loadScript(e.target.value);
                                }
                            }}
                            className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]"
                        >
                            <option value="">+ New Call Script</option>
                            {savedScripts.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                    {loadingScripts && <Loader2 size={16} className="animate-spin text-[#9CA3AF]" />}
                </div>
                <button
                    onClick={() => {
                        setGeneratedPrompt(generateSystemPrompt());
                        setShowPromptPreview(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#6B7280] hover:bg-gray-50 transition-all"
                >
                    <Wand2 size={16} />
                    Preview AI Prompt
                </button>
            </div>

            {/* Step 1: Script Basics */}
            <Section title="Script Basics" icon={Mic} step={1}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Script Name</label>
                        <input
                            type="text"
                            value={script.name}
                            onChange={(e) => setScript(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Hotel Discovery Call Script"
                            className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Your Company Name</label>
                        <input
                            type="text"
                            value={script.company_name}
                            onChange={(e) => setScript(prev => ({ ...prev, company_name: e.target.value }))}
                            placeholder="e.g., Arctic Edge Cold Therapy"
                            className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                        <p className="text-[10px] text-[#9CA3AF] mt-1.5 italic">The AI agent will introduce itself as calling from this company</p>
                    </div>
                </div>
            </Section>

            {/* Step 2: Call Objective */}
            <Section title="Call Objective" icon={Target} step={2}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {objectives.map(obj => (
                            <button
                                key={obj.id}
                                onClick={() => setScript(prev => ({ ...prev, objective: obj.id }))}
                                className={`p-4 border text-left rounded-xl transition-all duration-200 relative group ${script.objective === obj.id
                                    ? 'border-[#4F46E5] bg-[#EEF2FF] shadow-sm'
                                    : 'border-[#E5E7EB] bg-white hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                {script.objective === obj.id && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                                <span className="text-xl mb-2 block">{obj.icon}</span>
                                <p className="text-sm font-bold text-[#374151]">{obj.label}</p>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">{obj.desc}</p>
                            </button>
                        ))}
                    </div>

                    {script.objective === 'custom' && (
                        <div className="animate-in fade-in duration-200">
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Custom Objective</label>
                            <input
                                type="text"
                                value={script.custom_objective}
                                onChange={(e) => setScript(prev => ({ ...prev, custom_objective: e.target.value }))}
                                placeholder="e.g., Get them to visit our showroom"
                                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                        </div>
                    )}
                </div>
            </Section>

            {/* Step 3: Opening Line */}
            <Section title="Opening Line" icon={MessageSquare} step={3}>
                <div>
                    <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">How Should the Agent Introduce the Call?</label>
                    <textarea
                        value={script.opening_line}
                        onChange={(e) => setScript(prev => ({ ...prev, opening_line: e.target.value }))}
                        placeholder={`e.g., Hi, I'm calling from ${script.company_name || '[Your Company]'}. We work with hotels and spas on cold water therapy installations. Do you have a moment for a quick chat?`}
                        rows={3}
                        className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                    />
                    <p className="text-[10px] text-[#9CA3AF] mt-1.5 italic">This is what the agent says first. Keep it short and natural; under 30 words works best.</p>
                </div>
            </Section>

            {/* Step 4: Qualifying Questions */}
            <Section title="Qualifying Questions" icon={Target} step={4}>
                <div className="space-y-3">
                    <p className="text-xs text-[#6B7280] mb-2">Questions the agent asks to determine if the prospect is a good fit. The agent will adapt these naturally during conversation.</p>
                    {script.qualifying_questions.map((q, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#9CA3AF] w-6 text-center shrink-0">Q{i + 1}</span>
                            <input
                                type="text"
                                value={q}
                                onChange={(e) => updateQuestion(i, e.target.value)}
                                placeholder={i === 0 ? 'e.g., Do you currently offer wellness experiences for your guests?' : 'e.g., Is this something you\'ve been looking into recently?'}
                                className="flex-1 px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                            {script.qualifying_questions.length > 1 && (
                                <button
                                    onClick={() => removeQuestion(i)}
                                    className="p-2 text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addQuestion}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all"
                    >
                        <Plus size={14} /> Add Question
                    </button>
                </div>
            </Section>

            {/* Step 5: Objection Handling */}
            <Section title="Objection Handling" icon={Shield} step={5}>
                <div className="space-y-4">
                    <p className="text-xs text-[#6B7280] mb-2">Define how the agent responds to common pushback. The agent also has built-in handling for "I'm busy", "Send me an email", and unknown questions.</p>
                    {script.objection_responses.map((obj, i) => (
                        <div key={i} className="p-4 bg-[#F9FAFB] rounded-xl border border-[#F3F4F6] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Objection {i + 1}</span>
                                {script.objection_responses.length > 1 && (
                                    <button
                                        onClick={() => removeObjection(i)}
                                        className="p-1 text-[#9CA3AF] hover:text-red-500 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={obj.objection}
                                onChange={(e) => updateObjection(i, 'objection', e.target.value)}
                                placeholder='e.g., "I am not interested"'
                                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                            <input
                                type="text"
                                value={obj.response}
                                onChange={(e) => updateObjection(i, 'response', e.target.value)}
                                placeholder={'e.g., "I completely understand. Just wanted to share one quick thing..."'}
                                className="w-full px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                        </div>
                    ))}
                    <button
                        onClick={addObjection}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all"
                    >
                        <Plus size={14} /> Add Objection Response
                    </button>
                </div>
            </Section>

            {/* Step 6: Success Action */}
            <Section title="When They Say Yes" icon={Calendar} step={6}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {successActions.map(action => (
                            <button
                                key={action.id}
                                onClick={() => setScript(prev => ({ ...prev, success_action: action.id }))}
                                className={`p-4 border text-left rounded-xl transition-all duration-200 ${script.success_action === action.id
                                    ? 'border-[#4F46E5] bg-[#EEF2FF] shadow-sm'
                                    : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-xl mb-2 block">{action.icon}</span>
                                <p className="text-sm font-bold text-[#374151]">{action.label}</p>
                            </button>
                        ))}
                    </div>

                    {(script.success_action === 'send_booking_link' || script.success_action === 'confirm_time') && (
                        <div className="animate-in fade-in duration-200">
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Meeting Booking Link</label>
                            <input
                                type="url"
                                value={script.booking_url}
                                onChange={(e) => setScript(prev => ({ ...prev, booking_url: e.target.value, system_prompt: undefined }))}
                                placeholder="https://calendly.com/your-name/meeting"
                                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                            <p className="text-[10px] text-[#9CA3AF] mt-1.5 italic">Your Calendly, Cal.com, or scheduling link. Sent to leads who book a meeting.</p>
                        </div>
                    )}
                </div>
            </Section>

            {/* Step 7: Voicemail Message */}
            <Section title="Voicemail Message" icon={Mic} step={7}>
                <div className="space-y-4">
                    <div className="p-4 bg-[#EEF2FF] border-l-4 border-[#4F46E5] rounded-r-xl rounded-l-sm mb-4">
                        <div className="flex items-start gap-3">
                            <span className="text-xl leading-none pt-0.5">📞</span>
                            <div>
                                <h4 className="text-sm font-bold text-[#111827] mb-1">How Voicemail Works</h4>
                                <p className="text-xs text-[#4F46E5] leading-relaxed">
                                    If your lead doesn't answer, Sarah will leave a voicemail automatically. Write a short, friendly message that mentions why you're calling and gives them a way to reach you. Keep it under 30 seconds. Around 60 to 75 words is ideal.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="mb-2">
                            <label className="block text-sm font-bold text-[#374151] uppercase tracking-tight">Voicemail Message</label>
                            <p className="text-[10px] text-[#6B7280] mt-0.5">Left automatically if the lead doesn't answer.</p>
                        </div>

                        <div className="mb-3">
                            <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">Insert variable:</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => insertVariable('[first_name]')} className="px-3 py-1 text-xs font-bold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-[#EEF2FF] transition-all">
                                    + First Name
                                </button>
                                <button onClick={() => insertVariable('[company_name]')} className="px-3 py-1 text-xs font-bold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-[#EEF2FF] transition-all">
                                    + Company Name
                                </button>
                                <button onClick={() => insertVariable('[booking_link]')} className="px-3 py-1 text-xs font-bold text-[#4F46E5] bg-white border border-[#4F46E5] rounded-full hover:bg-[#EEF2FF] transition-all">
                                    + Booking Link
                                </button>
                            </div>
                        </div>

                        <textarea
                            id="voicemail_script"
                            value={script.voicemail_script || ''}
                            onChange={(e) => setScript(prev => ({ ...prev, voicemail_script: e.target.value }))}
                            placeholder="Type your voicemail message here..."
                            rows={5}
                            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-y"
                        />

                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-[10px] text-[#9CA3AF] italic">Aim for 60–75 words for a natural 20–25 second voicemail.</p>
                            <div className={`text-xs font-bold ${vmStats.colorClass}`}>
                                {vmStats.words} words · ~{vmStats.seconds} seconds
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Step 8: Tone & Context */}
            <Section title="Tone & Additional Context" icon={Volume2} step={8}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-3 uppercase tracking-tight">Agent Personality</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {tones.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setScript(prev => ({ ...prev, tone: t.id }))}
                                    className={`p-3 border text-center rounded-xl transition-all duration-200 ${script.tone === t.id
                                        ? 'border-[#4F46E5] bg-[#EEF2FF] shadow-sm'
                                        : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <p className="text-xs font-bold text-[#374151]">{t.label}</p>
                                    <p className="text-[10px] text-[#6B7280] mt-0.5">{t.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Additional Context for the Agent</label>
                        <textarea
                            value={script.additional_context}
                            onChange={(e) => setScript(prev => ({ ...prev, additional_context: e.target.value }))}
                            placeholder="e.g., We specialise in luxury cold water therapy installations for 5-star hotels. Our units are handcrafted in Sweden. Average project value is £15,000-£50,000. We've worked with Hilton, Four Seasons, and Mandarin Oriental."
                            rows={4}
                            className="w-full px-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium resize-none"
                        />
                        <p className="text-[10px] text-[#9CA3AF] mt-1.5 italic">Give the agent background knowledge about your product, pricing, notable clients, or anything it might be asked about on a call.</p>
                    </div>
                </div>
            </Section>

            {/* Save Bar */}
            <div className="bg-white border-t border-[#E5E7EB] -mx-8 px-8 py-6 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex-1">
                    {saveSuccess ? (
                        <div className="flex items-center gap-2 text-green-600 animate-in fade-in duration-300">
                            <CheckCircle2 size={16} />
                            <p className="text-xs font-bold">Script saved successfully!</p>
                        </div>
                    ) : (
                        <p className="text-[11px] text-[#9CA3AF] font-medium max-w-[300px]">
                            Your call script generates an AI prompt that powers the voice agent. Save to use it with your leads.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            setGeneratedPrompt(script.system_prompt || generateSystemPrompt());
                            setShowPromptPreview(true);
                        }}
                        className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 transition-all"
                    >
                        Preview Prompt
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transform active:scale-95 transition-all ${saving
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-primary text-white hover:bg-[#4338CA]'
                            }`}
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                        {saving ? 'Saving...' : script.id ? 'Update Script' : 'Save Script'}
                    </button>
                </div>
            </div>

            {/* Prompt Preview Modal */}
            {showPromptPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Wand2 size={20} className="text-[#4F46E5]" />
                                <div>
                                    <h3 className="text-lg font-black text-[#111827]">Generated AI Prompt</h3>
                                    <p className="text-xs text-[#6B7280]">This is what your voice agent will follow during calls</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPromptPreview(false)}
                                className="p-2 hover:bg-gray-50 rounded-xl text-[#9CA3AF] transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {showEnhancedPreview ? (
                                <div className="grid grid-cols-2 gap-4 h-full">
                                    <div className="flex flex-col h-full">
                                        <h4 className="text-sm font-bold text-[#6B7280] mb-2 uppercase tracking-tight">Original</h4>
                                        <div className="flex-1 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-sm text-[#9CA3AF] font-mono leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 h-full">
                                                {generatedPrompt}
                                            </pre>
                                        </div>
                                    </div>
                                    <div className="flex flex-col h-full">
                                        <h4 className="text-sm font-bold text-primary mb-2 uppercase tracking-tight flex items-center gap-1.5">
                                            <Sparkles size={16} /> Enhanced
                                        </h4>
                                        <div className="flex-1 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap text-sm text-[#374151] font-mono leading-relaxed bg-[#EEF2FF] p-4 rounded-xl border border-primary/20 h-full shadow-inner ring-1 ring-white">
                                                {enhancedPrompt}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col h-full gap-2 relative group">
                                    <textarea
                                        value={generatedPrompt}
                                        onChange={(e) => {
                                            setGeneratedPrompt(e.target.value);
                                            setScript(prev => ({ ...prev, system_prompt: e.target.value }));
                                        }}
                                        className="w-full flex-1 min-h-[400px] whitespace-pre-wrap text-sm text-[#374151] font-mono leading-relaxed bg-[#F9FAFB] p-6 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                                        spellCheck={false}
                                    />
                                    <p className="text-[11px] text-[#6B7280] italic ml-1 flex items-center gap-1.5 mt-1">
                                        <AlertCircle size={12} className="text-[#9CA3AF]" />
                                        You can edit this prompt directly. Changes will be used when making calls.
                                    </p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                            <div>
                                {!showEnhancedPreview && (
                                    <button
                                        onClick={handleEnhanceWithAI}
                                        disabled={isEnhancing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-[#4F46E5] border border-indigo-100 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                                    >
                                        {isEnhancing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                        {isEnhancing ? 'Enhancing your script...' : 'Enhance with AI'}
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                {showEnhancedPreview ? (
                                    <>
                                        <button
                                            onClick={() => setShowEnhancedPreview(false)}
                                            className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 transition-all"
                                        >
                                            Keep Original
                                        </button>
                                        <button
                                            onClick={() => {
                                                setGeneratedPrompt(enhancedPrompt);
                                                setScript(prev => ({ ...prev, system_prompt: enhancedPrompt }));
                                                setShowEnhancedPreview(false);
                                            }}
                                            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#4338CA] transition-all"
                                        >
                                            <Sparkles size={16} />
                                            Accept Enhanced Version
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(generatedPrompt);
                                                alert('Prompt copied to clipboard!');
                                            }}
                                            className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 transition-all"
                                        >
                                            Copy to Clipboard
                                        </button>
                                        <button
                                            onClick={() => setShowPromptPreview(false)}
                                            className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-[#4338CA] transition-all"
                                        >
                                            Close
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallScriptBuilder;
