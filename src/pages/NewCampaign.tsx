import React, { useState, useEffect } from 'react';
import {
    Activity, ArrowLeft, Target, CheckCircle2, ChevronDown, Key, Database, Flame, Users, Building2, Briefcase, Hash, Rocket, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';

interface NewCampaignProps {
    onBack: () => void;
}

const NewCampaign: React.FC<NewCampaignProps> = ({ onBack }) => {
    const [campaignName, setCampaignName] = useState('');
    const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const [upgradeMessage] = useState('');

    // Advanced Targeting State
    const [targetingExpanded, setTargetingExpanded] = useState(true);
    const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
    const [customKeywords, setCustomKeywords] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [radius, setRadius] = useState('25');
    const [minRating, setMinRating] = useState('4.0');

    // Smart Intent State
    const [intentExpanded, setIntentExpanded] = useState(true);
    const [buyingSignals, setBuyingSignals] = useState(true);
    const [competitorMentions, setCompetitorMentions] = useState(false);
    const [recentGrowth, setRecentGrowth] = useState(true);

    // Automation State
    const [enrichmentExpanded, setEnrichmentExpanded] = useState(true);
    const [findEmails, setFindEmails] = useState(true);
    const [findLinkedin, setFindLinkedin] = useState(true);
    const [verifyData, setVerifyData] = useState(true);
    const [enrichCompany, setEnrichCompany] = useState(false);

    // Outreach Sequence State
    const [sequenceExpanded, setSequenceExpanded] = useState(true);
    const [selectedSequence, setSelectedSequence] = useState('');
    const [maxLeadsTarget, setMaxLeadsTarget] = useState(100);
    const [availableSequences, setAvailableSequences] = useState<{ id: string, name: string }[]>([]);

    const businessTypes = [
        "SaaS", "E-commerce", "Healthcare", "Real Estate", "Financial Services", "Legal", "Marketing Agency", "Manufacturing", "Logistics", "Software Development", "Construction", "Education"
    ];

    useEffect(() => {
        fetchUserProfile();
        fetchSequences();
    }, []);

    const fetchUserProfile = async () => {
        // Unused temporarily
    };

    const fetchSequences = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('sequences').select('id, name').eq('user_id', user.id).order('created_at', { ascending: false });
        if (data) setAvailableSequences(data);
    };

    const tracks = [
        {
            id: 1,
            title: 'Local Businesses',
            description: 'Find retail, restaurants, and local services in specific geographic areas.',
            icon: <Building2 className="w-5 h-5 text-blue-500" />,
            metrics: 'High Volume · Local',
            color: 'blue'
        },
        {
            id: 2,
            title: 'B2B Services',
            description: 'Target professional services, agencies, and consulting firms.',
            icon: <Briefcase className="w-5 h-5 text-indigo-500" />,
            metrics: 'High Value · B2B',
            color: 'indigo'
        },
        {
            id: 3,
            title: 'Custom Search',
            description: 'Define your exact ideal customer profile with advanced filtering parameters.',
            icon: <Target className="w-5 h-5 text-emerald-500" />,
            metrics: 'Highly Targeted · Specific',
            color: 'emerald'
        }
    ];

    const handleCreateCampaign = async (status: 'draft' | 'active') => {
        if (!campaignName || !selectedTrack) {
            alert('Please complete the basic configuration step first.');
            return;
        }

        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const targetingJSON = {
                business_types: selectedBusinessTypes,
                keywords: customKeywords,
                location: { region: selectedRegion, city: cityInput, radius: parseInt(radius) },
                filters: { min_rating: parseFloat(minRating) }
            };

            const enrichJSON = { emails: findEmails, linkedin: findLinkedin, verify: verifyData, company: enrichCompany };

            const { error } = await supabase
                .from('campaigns')
                .insert({
                    user_id: user.id,
                    name: campaignName,
                    type: tracks.find(t => t.id === selectedTrack)?.title || 'Custom',
                    status: status,
                    targeting: targetingJSON,
                    enrichment_settings: enrichJSON,
                    leads_requested: maxLeadsTarget,
                    scraping_status: status === 'active' ? 'queued' : 'idle',
                })
                .select()
                .single();

            if (error) throw error;
            onBack();
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-24 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-3xl mx-auto p-6">
                {/* Header */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">New Campaign</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure your lead generation and outreach campaign</p>
                </div>

                <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">Campaign Details</h2>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all text-sm"
                            placeholder="e.g. Q3 NYC B2B Outreach"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-6 mb-3">Select Campaign Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {tracks.map(track => (
                                <div
                                    key={track.id}
                                    onClick={() => setSelectedTrack(track.id)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all duration-150
                                        ${selectedTrack === track.id
                                            ? 'bg-[#EEF2FF] border-2 border-[#4F46E5]'
                                            : 'bg-white border border-gray-200 hover:border-[#4F46E5]'
                                        }
                                    `}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${selectedTrack === track.id ? 'bg-[#4F46E5]' : 'bg-[#EEF2FF]'}`}>
                                        {React.cloneElement(track.icon, { className: 'w-5 h-5 ' + (selectedTrack === track.id ? 'text-white' : 'text-[#4F46E5]') })}
                                    </div>
                                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{track.title}</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">{track.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Targeting */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setTargetingExpanded(!targetingExpanded)}
                        >
                            <h2 className="text-base font-semibold text-gray-900">Advanced Targeting</h2>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${targetingExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {targetingExpanded && (
                            <div className="space-y-6">
                                {/* Business Type Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {businessTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => {
                                                    if (selectedBusinessTypes.includes(type)) {
                                                        setSelectedBusinessTypes(prev => prev.filter(t => t !== type));
                                                    } else {
                                                        setSelectedBusinessTypes(prev => [...prev, type]);
                                                    }
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                    selectedBusinessTypes.includes(type)
                                                        ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]'
                                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#4F46E5]'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                        <button className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-gray-500 border border-dashed border-gray-300 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all">
                                            + Add Custom
                                        </button>
                                    </div>
                                </div>

                                {/* Custom Keywords */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Keywords</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm"
                                        placeholder="e.g. software, consultant, marketing, B2B, wholesale"
                                        value={customKeywords}
                                        onChange={(e) => setCustomKeywords(e.target.value)}
                                    />
                                </div>

                                {/* Geographic */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                            value={selectedRegion}
                                            onChange={e => setSelectedRegion(e.target.value)}
                                        >
                                            <option value="">Select Region</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="CA">Canada</option>
                                            <option value="AU">Australia</option>
                                            <option value="EU">Europe</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                            placeholder="e.g. London"
                                            value={cityInput}
                                            onChange={e => setCityInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Radius</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                            value={radius}
                                            onChange={e => setRadius(e.target.value)}
                                        >
                                            <option value="10">10 Miles</option>
                                            <option value="25">25 Miles</option>
                                            <option value="50">50 Miles</option>
                                            <option value="100">100 Miles</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Google Rating */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Google Rating</label>
                                    <select
                                        className="w-full max-w-xs px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                        value={minRating}
                                        onChange={e => setMinRating(e.target.value)}
                                    >
                                        <option value="any">Any Rating</option>
                                        <option value="3.0">3.0+ Stars</option>
                                        <option value="4.0">4.0+ Stars</option>
                                        <option value="4.5">4.5+ Stars</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Smart Intent Filters */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setIntentExpanded(!intentExpanded)}
                        >
                            <div className="flex items-center gap-3">
                                <Flame size={18} className="text-[#4F46E5]" />
                                <h2 className="text-base font-semibold text-gray-900">Smart Intent Filters</h2>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${intentExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {intentExpanded && (
                            <div className="space-y-4">
                                {[
                                    { state: buyingSignals, setState: setBuyingSignals, icon: Target, title: "Active Buying Signals", desc: "Detect recent job postings, technology stack changes, or executive hiring", intent: "high" },
                                    { state: competitorMentions, setState: setCompetitorMentions, icon: Users, title: "Competitor Mentions", desc: "Find businesses discussing alternative solutions on social platforms", intent: "high" },
                                    { state: recentGrowth, setState: setRecentGrowth, icon: Activity, title: "Recent Growth Indicators", desc: "Prioritize companies with recent funding or headcount expansion" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-2 rounded-lg ${item.state ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-gray-100 text-gray-400'}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                                                    {item.intent === 'high' && (
                                                        <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">HIGH INTENT</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => item.setState(!item.state)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Data Enrichment */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setEnrichmentExpanded(!enrichmentExpanded)}
                        >
                            <h2 className="text-base font-semibold text-gray-900">Data Enrichment</h2>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${enrichmentExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {enrichmentExpanded && (
                            <div className="space-y-4">
                                {[
                                    { state: findEmails, setState: setFindEmails, icon: Key, title: "Decision Maker Emails", desc: "Find personal & corporate email addresses for key contacts" },
                                    { state: findLinkedin, setState: setFindLinkedin, icon: Hash, title: "LinkedIn Profiles", desc: "Extract URLs for businesses and individual decision makers" },
                                    { state: verifyData, setState: setVerifyData, icon: CheckCircle2, title: "Real-time Verification", desc: "Verify emails via SMTP and validate social profiles automatically" },
                                    { state: enrichCompany, setState: setEnrichCompany, icon: Database, title: "Deep Company Data", desc: "Extract tech stack, structured descriptions, employee count, and revenue estimates" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-2 rounded-lg ${item.state ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-gray-100 text-gray-400'}`}>
                                                <item.icon size={16} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{item.title}</p>
                                                <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => item.setState(!item.state)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Outreach Config */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                        <div
                            className="flex items-center justify-between cursor-pointer mb-4"
                            onClick={() => setSequenceExpanded(!sequenceExpanded)}
                        >
                            <h2 className="text-base font-semibold text-gray-900">Outreach Configuration</h2>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${sequenceExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {sequenceExpanded && (
                            <div className="space-y-6">
                                {/* Number of leads slider */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-medium text-gray-700">Number of Leads</label>
                                        <span className="bg-[#EEF2FF] text-[#4F46E5] text-sm font-semibold px-3 py-1 rounded-full">{maxLeadsTarget}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        step="10"
                                        value={maxLeadsTarget}
                                        onChange={(e) => setMaxLeadsTarget(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>10</span>
                                        <span>1,000</span>
                                    </div>
                                </div>

                                {/* Sequence selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-enroll into Sequence</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]"
                                        value={selectedSequence}
                                        onChange={(e) => setSelectedSequence(e.target.value)}
                                    >
                                        <option value="">No Automatic Sequence</option>
                                        {availableSequences.map(seq => (
                                            <option key={seq.id} value={seq.id}>{seq.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    Scraping typically takes 2-5 minutes
                </span>
                <div className="flex gap-3">
                    <button
                        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => handleCreateCampaign('draft')}
                        disabled={isSubmitting || !campaignName || !selectedTrack}
                    >
                        Save as Draft
                    </button>
                    <button
                        className="flex items-center gap-2 px-5 py-2 bg-[#4F46E5] text-white text-sm font-semibold rounded-lg hover:bg-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleCreateCampaign('active')}
                        disabled={isSubmitting || !campaignName || !selectedTrack}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Rocket size={16} />
                                Launch Campaign
                            </>
                        )}
                    </button>
                </div>
            </div>

            {showUpgradePrompt && (
                <UpgradePrompt
                    message={upgradeMessage}
                    onClose={() => setShowUpgradePrompt(false)}
                    onUpgrade={() => {
                        setShowUpgradePrompt(false);
                        window.location.href = '/pricing';
                    }}
                />
            )}
        </div>
    );
};

export default NewCampaign;