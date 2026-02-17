import React, { useState, useEffect } from 'react';
import {
    Plus,
    BarChart2,
    TrendingUp,
    Edit3,
    Copy,
    Trash2,
    Loader2,
    X,
    Eye,
    Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Template {
    id: string;
    name: string;
    subject: string;
    body: string;
    track: 'Direct' | 'Specifier' | 'Warm' | 'Custom';
    description: string;
    used_count: number;
    reply_rate: string;
    created_at?: string;
    user_id: string;
}

const trackStyles = {
    Direct: 'bg-blue-50 text-blue-600 border-blue-100',
    Specifier: 'bg-purple-50 text-purple-600 border-purple-100',
    Warm: 'bg-amber-50 text-amber-600 border-amber-100',
    Custom: 'bg-gray-50 text-gray-600 border-gray-100'
};

const EmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Partial<Template> | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('email_templates')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching templates:', error);
        } else {
            setTemplates(data || []);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!editingTemplate?.name || !editingTemplate?.subject || !editingTemplate?.body) return;
        setIsSaving(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const templateData = {
            ...editingTemplate,
            user_id: user.id,
            track: editingTemplate.track || 'Custom',
            description: editingTemplate.description || '',
            used_count: editingTemplate.used_count || 0,
            reply_rate: editingTemplate.reply_rate || '0.0%'
        };

        let error;
        if (editingTemplate.id) {
            const { error: updateError } = await supabase
                .from('email_templates')
                .update(templateData)
                .eq('id', editingTemplate.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from('email_templates')
                .insert([templateData]);
            error = insertError;
        }

        if (error) {
            console.error('Error saving template:', error);
        } else {
            fetchTemplates();
            setIsModalOpen(false);
            setEditingTemplate(null);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        const { error } = await supabase
            .from('email_templates')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting template:', error);
        } else {
            setTemplates(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleDuplicate = async (template: Template) => {
        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('email_templates')
            .insert([{
                ...template,
                id: undefined,
                name: `${template.name} (Copy)`,
                created_at: undefined,
                user_id: user.id
            }]);

        if (error) {
            console.error('Error duplicating template:', error);
        } else {
            fetchTemplates();
        }
        setIsSaving(false);
    };

    const highlightMergeTags = (text: string) => {
        const parts = text.split(/(\{\{[a-zA-Z_]+\}\})/g);
        return parts.map((part, i) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                return <span key={i} className="bg-blue-100 text-blue-700 font-bold px-1 rounded mx-0.5">{part}</span>;
            }
            return part;
        });
    };

    const openEditor = (template?: Template) => {
        setEditingTemplate(template ? { ...template } : {
            name: '',
            subject: '',
            body: '',
            track: 'Custom',
            description: ''
        });
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] tracking-tight">Email Templates</h1>
                    <p className="text-sm text-[#6B7280] font-medium mt-1">Manage and deploy high-performing outreach sequences.</p>
                </div>
                <button
                    onClick={() => openEditor()}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    CREATE TEMPLATE
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-bold">No templates found. Create your first one to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                    {templates.map(template => (
                        <div key={template.id} className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col h-full group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${trackStyles[template.track]}`}>
                                    {template.track}
                                </span>
                                <button
                                    onClick={() => { setPreviewTemplate(template); setIsPreviewOpen(true); }}
                                    className="p-1.5 text-gray-400 hover:text-primary transition-colors"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>

                            <h3 className="text-base font-bold text-[#111827] mb-2 group-hover:text-primary transition-colors">
                                {template.name}
                            </h3>

                            <p className="text-sm text-[#6B7280] leading-relaxed mb-6 line-clamp-2 flex-grow">
                                {template.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center gap-4 mb-6 pt-4 border-t border-[#F3F4F6]">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#9CA3AF]">
                                    <BarChart2 size={14} />
                                    <span>Used {template.used_count} times</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#10B981]">
                                    <TrendingUp size={14} />
                                    <span>{template.reply_rate} reply rate</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => openEditor(template)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all font-black"
                                    >
                                        <Edit3 size={14} /> EDIT
                                    </button>
                                    <button
                                        onClick={() => handleDuplicate(template)}
                                        className="flex items-center justify-center gap-2 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all font-black"
                                    >
                                        <Copy size={14} /> COPY
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleDelete(template.id)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-xs font-bold text-red-600 hover:bg-red-100 transition-all font-black"
                                >
                                    <Trash2 size={14} /> DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Template Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#111827]">
                                {editingTemplate?.id ? 'Edit Template' : 'Create New Template'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Template Name</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={editingTemplate?.name || ''}
                                        onChange={e => setEditingTemplate(prev => ({ ...prev!, name: e.target.value }))}
                                        placeholder="e.g. Gym Outreach"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Track / Category</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                        value={editingTemplate?.track || 'Custom'}
                                        onChange={e => setEditingTemplate(prev => ({ ...prev!, track: e.target.value as any }))}
                                    >
                                        <option value="Direct">Direct</option>
                                        <option value="Specifier">Specifier</option>
                                        <option value="Warm">Warm</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Subject Line</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={editingTemplate?.subject || ''}
                                    onChange={e => setEditingTemplate(prev => ({ ...prev!, subject: e.target.value }))}
                                    placeholder="Use {{first_name}} etc."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Description (Internal)</label>
                                <textarea
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[80px]"
                                    value={editingTemplate?.description || ''}
                                    onChange={e => setEditingTemplate(prev => ({ ...prev!, description: e.target.value }))}
                                    placeholder="Briefly describe who this is for..."
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Body</label>
                                    <div className="flex gap-2">
                                        {['company', 'first_name', 'industry'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setEditingTemplate(prev => ({ ...prev!, body: (prev?.body || '') + `{{${tag}}}` }))}
                                                className="text-[9px] font-black text-primary bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors"
                                            >
                                                + {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[200px]"
                                    value={editingTemplate?.body || ''}
                                    onChange={e => setEditingTemplate(prev => ({ ...prev!, body: e.target.value }))}
                                    placeholder="Write your email content..."
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || !editingTemplate?.name || !editingTemplate?.subject || !editingTemplate?.body}
                                className="flex-1 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                SAVE TEMPLATE
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {isPreviewOpen && previewTemplate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h3 className="text-lg font-black text-[#111827]">Template Preview</h3>
                            <button onClick={() => setIsPreviewOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Subject</label>
                                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-[#111827]">
                                    {highlightMergeTags(previewTemplate.subject)}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Body</label>
                                <div className="p-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-[#4B5563] leading-relaxed whitespace-pre-wrap min-h-[300px]">
                                    {highlightMergeTags(previewTemplate.body)}
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-[#111827] hover:bg-gray-100"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplates;
