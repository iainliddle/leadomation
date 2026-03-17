import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit3,
    Trash2,
    Loader2,
    X,
    Mail,
    Sparkles,
    Search
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
    const [activeTab, setActiveTab] = useState<'all' | 'mine'>('all');
    const [searchQuery, setSearchQuery] = useState('');

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
            if (data) setTemplates(data);
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
                    .insert({ user_id: user.id, name: templateName, subject: templateSubject, body: templateBody });
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
            const { error } = await supabase.from('email_templates').delete().eq('id', id);
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

    const openCreate = () => {
        setEditingTemplate(null);
        setTemplateName('');
        setTemplateSubject('');
        setTemplateBody('');
        setShowCreateModal(true);
    };

    const filtered = templates.filter(t =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Email Templates</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and deploy high-performing outreach sequences</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150 shadow-sm"
                >
                    <Plus size={16} />
                    Create Template
                </button>
            </div>

            {/* Merge Tags Tip Card */}
            <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-xl p-4 mb-6 flex items-start gap-3">
                <div className="w-8 h-8 bg-[#4F46E5] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-[#3730A3]">Personalisation &amp; Merge Tags</p>
                    <p className="text-xs text-[#4F46E5] mt-1">
                        Use {'{{first_name}}'}, {'{{company}}'}, {'{{city}}'} to personalise emails automatically
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 mb-5">
                {(['all', 'mine'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                            activeTab === tab
                                ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] -mb-px'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'all' ? 'All Templates' : 'My Templates'}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search templates…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#4F46E5]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No templates found</h3>
                    <p className="text-sm text-gray-500 mt-2 mb-6">
                        {searchQuery ? 'Try a different search term.' : 'Create your first email template to get started.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={openCreate}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all duration-150 inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Create Template
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                    {filtered.map(template => (
                        <div
                            key={template.id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-[#4F46E5] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
                        >
                            <span className="inline-flex self-start bg-[#EEF2FF] text-[#4F46E5] text-xs font-medium px-2.5 py-0.5 rounded-full mb-2">
                                Template
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 mt-1">{template.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 truncate">{template.subject}</p>
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2 flex-1">
                                {template.body?.substring(0, 100) || 'No preview available'}
                            </p>
                            <div className="border-t border-gray-100 mt-4 pt-4 flex gap-2">
                                <button
                                    onClick={() => startEdit(template)}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-all"
                                >
                                    <Edit3 size={13} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTemplate(template.id)}
                                    className="flex items-center justify-center p-2 border border-gray-200 bg-white rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingTemplate ? 'Edit Template' : 'Create Template'}
                            </h3>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Template Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                                    value={templateName}
                                    onChange={e => setTemplateName(e.target.value)}
                                    placeholder="e.g. Cold Outreach v1"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subject Line</label>
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all"
                                    value={templateSubject}
                                    onChange={e => setTemplateSubject(e.target.value)}
                                    placeholder="e.g. Quick question about {{company}}"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Body</label>
                                <textarea
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all min-h-[200px]"
                                    value={templateBody}
                                    onChange={e => setTemplateBody(e.target.value)}
                                    placeholder={"Hi {{first_name}},\n\nI noticed that {{company}}..."}
                                />
                                <p className="mt-1.5 text-xs text-gray-400">
                                    Use {'{{first_name}}'}, {'{{last_name}}'}, {'{{company}}'}, {'{{title}}'} as merge tags.
                                </p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveTemplate}
                                disabled={saving}
                                className="flex-1 px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg text-sm font-semibold hover:bg-[#4338CA] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                {saving ? 'Saving...' : (editingTemplate ? 'Save Changes' : 'Create Template')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailTemplates;
