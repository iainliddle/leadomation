import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    Loader2,
    X
} from 'lucide-react';
import { supabase } from '../lib/supabase';



const EmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const [templateName, setTemplateName] = useState('');
    const [templateSubject, setTemplateSubject] = useState('');
    const [templateBody, setTemplateBody] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setTemplates(data);
            }
        } catch (err) {
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const saveTemplate = async () => {
        if (!templateName.trim() || !templateSubject.trim() || !templateBody.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (editingTemplate) {
                const { error } = await supabase
                    .from('email_templates')
                    .update({
                        name: templateName,
                        subject: templateSubject,
                        body: templateBody,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingTemplate.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('email_templates')
                    .insert({
                        user_id: user.id,
                        name: templateName,
                        subject: templateSubject,
                        body: templateBody
                    });

                if (error) throw error;
            }

            setTemplateName('');
            setTemplateSubject('');
            setTemplateBody('');
            setEditingTemplate(null);
            setShowCreateModal(false);
            loadTemplates();
        } catch (err) {
            console.error('Error saving template:', err);
            alert('Failed to save template.');
        } finally {
            setSaving(false);
        }
    };

    const deleteTemplate = async (id: string) => {
        if (!confirm('Are you sure you want to delete this template?')) return;

        try {
            const { error } = await supabase
                .from('email_templates')
                .delete()
                .eq('id', id);

            if (error) throw error;
            loadTemplates();
        } catch (err) {
            console.error('Error deleting template:', err);
        }
    };

    const startEdit = (template: any) => {
        setEditingTemplate(template);
        setTemplateName(template.name);
        setTemplateSubject(template.subject);
        setTemplateBody(template.body);
        setShowCreateModal(true);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-[#111827] tracking-tight">Email Templates</h1>
                    <p className="text-sm text-[#6B7280] font-medium mt-1">Manage and deploy high-performing outreach sequences.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTemplate(null);
                        setTemplateName('');
                        setTemplateSubject('');
                        setTemplateBody('');
                        setShowCreateModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 group"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    Create Template
                </button>
            </div>

            {loading ? (
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
                        <div key={template.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer p-6 flex flex-col h-full group">
                            <div className="mb-3">
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    Template
                                </span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {template.name}
                            </h3>
                            <p className="text-xs text-slate-500 truncate mb-2">
                                {template.subject}
                            </p>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                {template.body?.substring(0, 100) || 'No preview available'}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 mt-auto">
                                <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => startEdit(template)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-300 transition-all"
                                >
                                    <Edit3 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteTemplate(template.id)}
                                    className="flex items-center justify-center p-2 bg-red-50 border border-red-100 rounded-lg text-red-600 hover:bg-red-100 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Template Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-black text-[#111827]">
                                {editingTemplate ? 'Edit Template' : 'Create Template'}
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Template Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={templateName}
                                    onChange={e => setTemplateName(e.target.value)}
                                    placeholder="e.g. Cold Outreach v1"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Subject Line</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    value={templateSubject}
                                    onChange={e => setTemplateSubject(e.target.value)}
                                    placeholder="e.g. Quick question about {{company}}"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Body</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all min-h-[200px]"
                                    value={templateBody}
                                    onChange={e => setTemplateBody(e.target.value)}
                                    placeholder="Hi {{first_name}},\n\nI noticed that {{company}}..."
                                />
                                <p className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                    Use {"{{first_name}}"}, {"{{last_name}}"}, {"{{company}}"}, {"{{title}}"} as merge tags.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 flex gap-4">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveTemplate}
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                {saving ? 'Saving...' : (editingTemplate ? 'Save Changes' : 'Create Template')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Info Banner */}
            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#4F46E5] shadow-sm shrink-0">
                    <Edit3 size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Personalisation & Merge Tags</h4>
                    <p className="text-xs text-blue-700/80 font-medium mt-1.5 leading-relaxed">
                        Email templates let you create reusable outreach messages with merge tags. Use {"{{first_name}}"}, {"{{last_name}}"}, {"{{company}}"}, and {"{{title}}"} to personalise each email automatically when sequences are sent.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EmailTemplates;
