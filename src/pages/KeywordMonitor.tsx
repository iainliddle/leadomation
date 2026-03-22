import React, { useState, useEffect } from 'react';
import {
    Target,
    Plus,
    Trash2,
    Info,
    ExternalLink,
    Loader2,
    X,
    ChevronDown
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { FeatureAccess } from '../lib/planLimits';

interface KeywordMonitor {
    id: string;
    user_id: string;
    campaign_id: string;
    keywords: string[];
    is_active: boolean;
    last_checked_at: string | null;
    created_at: string;
    updated_at: string;
    campaigns?: {
        name: string;
    };
    hits_count?: number;
}

interface KeywordHit {
    id: string;
    monitor_id: string;
    user_id: string;
    post_url: string;
    post_content: string;
    author_linkedin_id: string;
    author_name: string;
    author_headline: string;
    author_profile_url: string;
    lead_id: string | null;
    enrollment_id: string | null;
    status: string;
    found_at: string;
}

interface Campaign {
    id: string;
    name: string;
}

interface KeywordMonitorProps {
    onPageChange?: (page: string) => void;
    canAccess?: (feature: keyof FeatureAccess) => boolean;
    triggerUpgrade?: (feature: string, targetPlan?: 'starter' | 'pro') => void;
}

const KeywordMonitor: React.FC<KeywordMonitorProps> = ({ onPageChange, canAccess, triggerUpgrade }) => {
    const [monitors, setMonitors] = useState<KeywordMonitor[]>([]);
    const [hits, setHits] = useState<KeywordHit[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Modal state
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keywordInput, setKeywordInput] = useState('');
    const [autoEnrol, setAutoEnrol] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Dropdown state
    const [campaignDropdownOpen, setCampaignDropdownOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = () => setCampaignDropdownOpen(false);
        if (campaignDropdownOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [campaignDropdownOpen]);

    const fetchData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [monitorsResult, hitsResult, campaignsResult] = await Promise.all([
            supabase
                .from('linkedin_keyword_monitors')
                .select(`
                    *,
                    campaigns (name)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false }),
            supabase
                .from('linkedin_keyword_hits')
                .select('*')
                .eq('user_id', user.id)
                .order('found_at', { ascending: false })
                .limit(50),
            supabase
                .from('campaigns')
                .select('id, name')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
        ]);

        if (monitorsResult.data) {
            // Get hit counts for each monitor
            const monitorsWithCounts = await Promise.all(
                monitorsResult.data.map(async (monitor) => {
                    const { count } = await supabase
                        .from('linkedin_keyword_hits')
                        .select('*', { count: 'exact', head: true })
                        .eq('monitor_id', monitor.id);
                    return { ...monitor, hits_count: count || 0 };
                })
            );
            setMonitors(monitorsWithCounts);
        }

        if (hitsResult.data) setHits(hitsResult.data);
        if (campaignsResult.data) setCampaigns(campaignsResult.data);

        setIsLoading(false);
    };

    const handleToggleMonitor = async (monitor: KeywordMonitor) => {
        const newStatus = !monitor.is_active;
        const { error } = await supabase
            .from('linkedin_keyword_monitors')
            .update({ is_active: newStatus, updated_at: new Date().toISOString() })
            .eq('id', monitor.id);
        if (!error) fetchData();
    };

    const handleDeleteMonitor = async (id: string) => {
        if (!confirm('Are you sure you want to delete this monitor? All associated hits will also be deleted.')) return;

        // First delete associated hits
        await supabase
            .from('linkedin_keyword_hits')
            .delete()
            .eq('monitor_id', id);

        // Then delete the monitor
        const { error } = await supabase
            .from('linkedin_keyword_monitors')
            .delete()
            .eq('id', id);

        if (!error) fetchData();
    };

    const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && keywordInput.trim()) {
            e.preventDefault();
            if (!keywords.includes(keywordInput.trim())) {
                setKeywords([...keywords, keywordInput.trim()]);
            }
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const handleSaveMonitor = async () => {
        if (!selectedCampaignId || keywords.length === 0) {
            alert('Please select a campaign and add at least one keyword.');
            return;
        }

        setIsSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setIsSaving(false);
            return;
        }

        const { error } = await supabase
            .from('linkedin_keyword_monitors')
            .insert({
                user_id: user.id,
                campaign_id: selectedCampaignId,
                keywords: keywords,
                is_active: true
            });

        if (!error) {
            setShowModal(false);
            setSelectedCampaignId('');
            setKeywords([]);
            setKeywordInput('');
            setAutoEnrol(true);
            fetchData();
        }
        setIsSaving(false);
    };

    const handleEnrolNow = async (hit: KeywordHit) => {
        // This would trigger an enrollment - for now just update status
        const { error } = await supabase
            .from('linkedin_keyword_hits')
            .update({ status: 'enrolled' })
            .eq('id', hit.id);
        if (!error) fetchData();
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    if (isLoading) {
        return (
            <div className="p-6 bg-[#F8F9FA] min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Page Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-[#111827]">LinkedIn Keyword Monitor</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Find people actively looking for what your customers sell</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    Add monitor
                </button>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mb-6">
                <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-[#374151] leading-relaxed">
                    Leadomation searches LinkedIn every 2 hours for posts matching your keywords and automatically enrols matching authors into your LinkedIn Sequencer as hot leads.
                </p>
            </div>

            {/* Active Monitors Section */}
            <div className="mb-8">
                <h2 className="text-base font-semibold text-[#111827] mb-4">Active monitors</h2>
                {monitors.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                        <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Target className="w-7 h-7 text-[#4F46E5]" />
                        </div>
                        <h3 className="text-base font-semibold text-[#111827] mb-2">No monitors yet</h3>
                        <p className="text-sm text-[#6B7280] mb-4 max-w-sm mx-auto">
                            Create your first keyword monitor to start finding hot leads on LinkedIn
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add monitor
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {monitors.map(monitor => (
                            <div key={monitor.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:border-[#4F46E5] transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-medium text-[#6B7280]">Campaign:</span>
                                            <span className="text-sm font-semibold text-[#111827]">{monitor.campaigns?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {monitor.keywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] text-xs font-medium rounded-full"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                                            <span>
                                                Last checked: {monitor.last_checked_at ? formatTimeAgo(monitor.last_checked_at) : 'Never checked'}
                                            </span>
                                            <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] font-semibold rounded-full">
                                                {monitor.hits_count || 0} hits
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Toggle Switch */}
                                        <button
                                            onClick={() => handleToggleMonitor(monitor)}
                                            className={`relative w-11 h-6 rounded-full transition-colors ${
                                                monitor.is_active ? 'bg-[#4F46E5]' : 'bg-gray-200'
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                                                    monitor.is_active ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                        <span className="text-xs font-medium text-[#6B7280] w-12">
                                            {monitor.is_active ? 'Active' : 'Paused'}
                                        </span>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteMonitor(monitor.id)}
                                            className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-[#E5E7EB]"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recent Hits Section */}
            <div>
                <h2 className="text-base font-semibold text-[#111827] mb-4">Recent hits</h2>
                {hits.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                        <p className="text-sm text-[#6B7280]">No keyword hits yet. Add a monitor to start finding leads.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Author</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Headline</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Found</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-medium text-[#6B7280] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {hits.map(hit => (
                                    <tr key={hit.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-[#111827]">{hit.author_name}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-[#6B7280] truncate max-w-[200px] block">{hit.author_headline}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-[#6B7280]">{formatTimeAgo(hit.found_at)}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                hit.status === 'enrolled'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}>
                                                {hit.status === 'enrolled' ? 'Enrolled' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={hit.post_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-[#4F46E5] hover:underline flex items-center gap-1"
                                                >
                                                    View post <ExternalLink size={12} />
                                                </a>
                                                {hit.status !== 'enrolled' && (
                                                    <button
                                                        onClick={() => handleEnrolNow(hit)}
                                                        className="px-3 py-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium rounded-lg transition-colors"
                                                    >
                                                        Enrol now
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Monitor Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-semibold text-[#111827]">Add keyword monitor</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 text-[#6B7280] hover:text-[#111827] rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-4 space-y-4">
                            {/* Campaign Selector */}
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-2">Campaign</label>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCampaignDropdownOpen(!campaignDropdownOpen);
                                        }}
                                        className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white flex items-center justify-between hover:border-[#4F46E5] transition-colors"
                                    >
                                        <span className={selectedCampaignId ? 'text-[#111827] font-medium' : 'text-[#9CA3AF]'}>
                                            {selectedCampaignId
                                                ? campaigns.find(c => c.id === selectedCampaignId)?.name
                                                : 'Select a campaign'
                                            }
                                        </span>
                                        <ChevronDown size={16} className="text-[#6B7280]" />
                                    </button>
                                    {campaignDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden max-h-48 overflow-y-auto">
                                            {campaigns.length === 0 ? (
                                                <div className="px-3 py-2 text-sm text-[#6B7280]">No campaigns found</div>
                                            ) : (
                                                campaigns.map(campaign => (
                                                    <button
                                                        key={campaign.id}
                                                        onClick={() => {
                                                            setSelectedCampaignId(campaign.id);
                                                            setCampaignDropdownOpen(false);
                                                        }}
                                                        className={`w-full px-3 py-2.5 text-left text-sm transition-all ${
                                                            selectedCampaignId === campaign.id
                                                                ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                                : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                        }`}
                                                    >
                                                        {campaign.name}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Keywords Input */}
                            <div>
                                <label className="block text-xs font-medium text-[#6B7280] mb-2">Keywords</label>
                                <div className="border border-[#E5E7EB] rounded-lg p-2 focus-within:border-[#4F46E5] transition-colors">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EEF2FF] text-[#4F46E5] text-xs font-medium rounded-full"
                                            >
                                                {keyword}
                                                <button
                                                    onClick={() => handleRemoveKeyword(keyword)}
                                                    className="hover:text-[#4338CA] transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={handleAddKeyword}
                                        placeholder="Type a keyword and press Enter"
                                        className="w-full text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                                    />
                                </div>
                                <p className="text-xs text-[#9CA3AF] mt-1">Press Enter to add each keyword</p>
                            </div>

                            {/* Auto-enrol Toggle */}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm font-medium text-[#374151]">Auto-enrol in sequencer</span>
                                <button
                                    onClick={() => setAutoEnrol(!autoEnrol)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                        autoEnrol ? 'bg-[#4F46E5]' : 'bg-gray-200'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                                            autoEnrol ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMonitor}
                                disabled={isSaving || !selectedCampaignId || keywords.length === 0}
                                className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <Loader2 size={14} className="animate-spin" />}
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KeywordMonitor;
