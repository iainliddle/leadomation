import React, { useState, useEffect } from 'react';
import {
    X,
    Search,
    Loader2,
    FileText,
    Check,
    Trash2,
    Building2,
    Briefcase
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmailTemplate {
    id: string;
    name: string;
    industry: string | null;
    use_case: string | null;
    subject: string;
    body_html: string;
    delay_days: number | null;
    is_system: boolean;
    user_id: string | null;
    created_at: string;
}

interface TemplateLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate?: (template: EmailTemplate) => void;
    isStandalone?: boolean;
    onNavigateToSequenceBuilder?: (template: EmailTemplate) => void;
}

// Convert slug to readable label (e.g., "auto_service_outreach" → "Auto Service Outreach")
const formatUseCase = (slug: string): string => {
    return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

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

const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
    isOpen,
    onClose,
    onSelectTemplate,
    isStandalone = false,
    onNavigateToSequenceBuilder
}) => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('');
    const [selectedUseCase, setSelectedUseCase] = useState<string>('');
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
    const [useCases, setUseCases] = useState<string[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen || isStandalone) {
            loadTemplates();
        }
    }, [isOpen, isStandalone]);

    useEffect(() => {
        filterTemplates();
    }, [templates, activeTab, searchQuery, selectedIndustry, selectedUseCase, currentUserId]);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUserId(user.id);
            }

            // Fetch all templates (system + user's own)
            const { data, error } = await supabase
                .from('email_templates')
                .select('*')
                .or(`is_system.eq.true,user_id.eq.${user?.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setTemplates(data);

                // Extract unique use cases
                const cases = [...new Set(data.map(t => t.use_case).filter(Boolean))] as string[];
                setUseCases(cases);
            }
        } catch (err) {
            console.error('Error loading templates:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterTemplates = () => {
        let filtered = [...templates];

        // Filter by tab
        if (activeTab === 'my') {
            filtered = filtered.filter(t => !t.is_system && t.user_id === currentUserId);
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(query) ||
                t.subject.toLowerCase().includes(query)
            );
        }

        // Filter by industry
        if (selectedIndustry) {
            filtered = filtered.filter(t => t.industry === selectedIndustry);
        }

        // Filter by use case
        if (selectedUseCase) {
            filtered = filtered.filter(t => t.use_case === selectedUseCase);
        }

        setFilteredTemplates(filtered);
    };

    const handleUseTemplate = (template: EmailTemplate) => {
        if (onSelectTemplate) {
            onSelectTemplate(template);
            onClose();
        } else if (isStandalone && onNavigateToSequenceBuilder) {
            onNavigateToSequenceBuilder(template);
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        try {
            const { error } = await supabase
                .from('email_templates')
                .delete()
                .eq('id', templateId)
                .eq('is_system', false);

            if (error) throw error;

            setDeleteConfirm(null);
            setPreviewTemplate(null);
            loadTemplates();
        } catch (err) {
            console.error('Error deleting template:', err);
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        // Strip HTML tags for preview
        const plainText = text.replace(/<[^>]*>/g, '');
        return plainText.length > maxLength ? plainText.slice(0, maxLength) + '...' : plainText;
    };

    const renderContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Template Library</h2>
                        <p className="text-xs text-gray-500">Browse and use pre-built email templates</p>
                    </div>
                </div>
                {!isStandalone && (
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-4 pb-2">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'all'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    All Templates
                </button>
                <button
                    onClick={() => setActiveTab('my')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activeTab === 'my'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                    My Templates
                </button>
            </div>

            {/* Filter Bar */}
            <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                </div>

                {/* Industry Filter */}
                <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                        <option value="">All Industries</option>
                        {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>

                {/* Use Case Filter */}
                <div className="relative">
                    <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        value={selectedUseCase}
                        onChange={(e) => setSelectedUseCase(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                    >
                        <option value="">All Use Cases</option>
                        {useCases.map(useCase => (
                            <option key={useCase} value={useCase}>{useCase}</option>
                        ))}
                    </select>
                </div>

                {(selectedIndustry || selectedUseCase || searchQuery) && (
                    <button
                        onClick={() => {
                            setSelectedIndustry('');
                            setSelectedUseCase('');
                            setSearchQuery('');
                        }}
                        className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1"
                    >
                        <X size={14} />
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Template Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <p className="text-sm text-gray-500">Loading templates...</p>
                        </div>
                    ) : filteredTemplates.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText size={32} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-bold">
                                {activeTab === 'my'
                                    ? 'No templates saved yet. Save a template from the Sequence Builder to see it here.'
                                    : 'No templates found matching your filters.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setPreviewTemplate(template)}
                                    className={`bg-white border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                        previewTemplate?.id === template.id
                                            ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                                            : 'border-gray-200 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{template.name}</h3>
                                        {template.is_system && (
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full shrink-0 ml-2">
                                                System
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {template.industry && (
                                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full">
                                                {template.industry}
                                            </span>
                                        )}
                                        {template.use_case && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                                                {formatUseCase(template.use_case)}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-xs font-semibold text-gray-700 mb-2 line-clamp-1">
                                        {template.subject}
                                    </p>

                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {truncateText(template.body_html, 100)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                {previewTemplate && (
                    <div className="w-[400px] border-l border-gray-100 bg-gray-50 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-black text-gray-900">{previewTemplate.name}</h3>
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {previewTemplate.industry && (
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-full">
                                        {previewTemplate.industry}
                                    </span>
                                )}
                                {previewTemplate.use_case && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                                        {formatUseCase(previewTemplate.use_case)}
                                    </span>
                                )}
                                {previewTemplate.is_system && (
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">
                                        System
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="mb-4">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                    Subject Line
                                </label>
                                <p className="text-sm font-semibold text-gray-900 p-3 bg-white rounded-lg border border-gray-200">
                                    {previewTemplate.subject}
                                </p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                    Email Body
                                </label>
                                <div
                                    className="text-sm text-gray-700 p-4 bg-white rounded-lg border border-gray-200 leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{ __html: previewTemplate.body_html }}
                                />
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white space-y-2">
                            <button
                                onClick={() => handleUseTemplate(previewTemplate)}
                                className="flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-all w-full justify-center"
                            >
                                <Check size={16} />
                                Use This Template
                            </button>

                            {!previewTemplate.is_system && previewTemplate.user_id === currentUserId && (
                                <>
                                    {deleteConfirm === previewTemplate.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDeleteTemplate(previewTemplate.id)}
                                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
                                            >
                                                Confirm Delete
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(previewTemplate.id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
                                        >
                                            <Trash2 size={14} />
                                            Delete Template
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    // Standalone version (full page)
    if (isStandalone) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-[calc(100vh-180px)] overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        );
    }

    // Modal version
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {renderContent()}
            </div>
        </div>
    );
};

export default TemplateLibrary;
