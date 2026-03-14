import React, { useState } from 'react';
import { X, Save, Loader2, Building2, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SaveAsTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: string;
    body: string;
    onSaved?: () => void;
}

const INDUSTRIES = [
    'Restaurants',
    'Trades and Contractors',
    'Digital Agencies',
    'Retail',
    'Professional Services',
    'Health and Wellness',
    'Real Estate',
    'Automotive'
];

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
    isOpen,
    onClose,
    subject,
    body,
    onSaved
}) => {
    const [templateName, setTemplateName] = useState('');
    const [industry, setIndustry] = useState('');
    const [useCase, setUseCase] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!templateName.trim()) {
            setError('Please enter a template name');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error: insertError } = await supabase
                .from('email_templates')
                .insert({
                    user_id: user.id,
                    name: templateName.trim(),
                    industry: industry || null,
                    use_case: useCase.trim() || null,
                    subject: subject,
                    body_html: body,
                    is_system: false,
                    delay_days: null
                });

            if (insertError) throw insertError;

            // Reset form
            setTemplateName('');
            setIndustry('');
            setUseCase('');

            onSaved?.();
            onClose();
        } catch (err: any) {
            console.error('Error saving template:', err);
            setError(err.message || 'Failed to save template');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setTemplateName('');
        setIndustry('');
        setUseCase('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Save size={18} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Save as Template</h2>
                            <p className="text-xs text-gray-500">Save this email for reuse</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            Template Name *
                        </label>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="e.g. Restaurant Follow-up"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            <span className="flex items-center gap-1">
                                <Building2 size={12} />
                                Industry
                            </span>
                        </label>
                        <select
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                        >
                            <option value="">Select an industry (optional)</option>
                            {INDUSTRIES.map(ind => (
                                <option key={ind} value={ind}>{ind}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                            <span className="flex items-center gap-1">
                                <Briefcase size={12} />
                                Use Case
                            </span>
                        </label>
                        <input
                            type="text"
                            value={useCase}
                            onChange={(e) => setUseCase(e.target.value)}
                            placeholder="e.g. Cold Outreach, Follow-up, Breakup"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    {/* Preview */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Preview</p>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{subject || 'No subject'}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{body?.replace(/<[^>]*>/g, '').slice(0, 100) || 'No body'}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !templateName.trim()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save Template
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveAsTemplateModal;
