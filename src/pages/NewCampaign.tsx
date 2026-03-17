import React, { useState, useEffect } from 'react';
import {
    Activity, ArrowLeft, Target, Bot, CheckCircle2, ChevronDown, Key, Clock, Settings, Database, Flame, ListFilter, Users, Building2, Globe2, Briefcase, Hash, Rocket, Loader2
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
            <div className="max-w-4xl mx-auto p-6 pt-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Configure New Campaign</h1>
                    <p className="text-sm text-gray-500 mt-1">Define your targeting, enrichment, and outreach parameters</p>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#EEF2FF] text-[#4F46E5] font-bold text-sm">1</span>
                                <h2 className="text-lg font-semibold text-gray-900">Campaign Details</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="w-full text-lg px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all shadow-sm"
                                placeholder="e.g. Q3 NYC B2B Outreach"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                            />

                            <label className="block text-sm font-semibold text-gray-700 mt-6 mb-3">Select Campaign Type <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {tracks.map(track => (
                                    <div
                                        key={track.id}
                                        onClick={() => setSelectedTrack(track.id)}
                                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                                            ${selectedTrack === track.id
                                                ? 'border-[#4F46E5] bg-[#EEF2FF]/50 shadow-md ring-1 ring-[#4F46E5]'
                                                : 'border-gray-200 bg-white hover:border-[#818CF8] hover:shadow-sm'
                                            }
                                        `}
                                    >
                                        {selectedTrack === track.id && (
                                            <div className="absolute top-4 right-4 text-[#4F46E5]">
                                                <CheckCircle2 size={20} className="fill-current text-white" />
                                            </div>
                                        )}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${selectedTrack === track.id ? 'bg-[#4F46E5] text-white' : 'bg-gray-100'}`}>
                                            {React.cloneElement(track.icon, { className: 'w-5 h-5 ' + (selectedTrack === track.id ? 'text-white' : 'text-gray-600') })}
                                        </div>
                                        <h3 className={`font-semibold text-base mb-1 ${selectedTrack === track.id ? 'text-[#3730A3]' : 'text-gray-900'}`}>{track.title}</h3>
                                        <p className="text-xs leading-relaxed text-gray-500 mb-4 h-12">{track.description}</p>
                                        <div className="inline-flex items-center px-2 py-1 rounded bg-white/60 border border-gray-200 text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                            {track.metrics}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advanced Targeting */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between cursor-pointer group"
                            onClick={() => setTargetingExpanded(!targetingExpanded)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${selectedTrack ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-gray-100 text-gray-400'}`}>2</span>
                                <div>
                                    <h2 className={`text-lg font-semibold transition-colors ${selectedTrack ? 'text-gray-900' : 'text-gray-400'}`}>Advanced Targeting</h2>
                                    <p className="text-xs text-gray-500 font-medium">Define your ideal customer profile</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${targetingExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {targetingExpanded && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200">
                                <div className="space-y-6">
                                    {/* Business Profile */}
                                    <div>
                                        <h3 className="text-sm font-bold tracking-wide text-gray-800 uppercase flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                            <Building2 size={16} className="text-[#4F46E5]" /> Business Profile
                                        </h3>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Industry Categories</label>
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
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                            selectedBusinessTypes.includes(type)
                                                                ? 'bg-[#EEF2FF] text-[#4F46E5] border border-[#C7D2FE] ring-1 ring-[#EEF2FF]'
                                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Keywords <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span></label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] text-sm shadow-sm"
                                                placeholder="e.g. software, consultant, marketing, B2B, wholesale"
                                                value={customKeywords}
                                                onChange={(e) => setCustomKeywords(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Geographic */}
                                    <div className="pt-2">
                                        <h3 className="text-sm font-bold tracking-wide text-gray-800 uppercase flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                            <Globe2 size={16} className="text-[#4F46E5]" /> Geographic Targeting
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                                                <select
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm appearance-none"
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
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">City / Location</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm"
                                                    placeholder="e.g. London, M1 1AA"
                                                    value={cityInput}
                                                    onChange={e => setCityInput(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
                                                <select
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm appearance-none"
                                                    value={radius}
                                                    onChange={e => setRadius(e.target.value)}
                                                >
                                                    <option value="10">10 Miles</option>
                                                    <option value="25">25 Miles</option>
                                                    <option value="50">50 Miles</option>
                                                    <option value="100">100 Miles</option>
                                                    <option value="national">National</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Criteria */}
                                    <div className="pt-2">
                                        <h3 className="text-sm font-bold tracking-wide text-gray-800 uppercase flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                            <ListFilter size={16} className="text-[#4F46E5]" /> Quality Criteria
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Google Rating</label>
                                                <select
                                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm appearance-none"
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
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Smart Intent Filters */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden border-t-4 border-t-[#EEF2FF]">
                        <div
                            className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between cursor-pointer group"
                            onClick={() => setIntentExpanded(!intentExpanded)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Flame size={18} className="text-[#4F46E5]" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold text-gray-900">Smart Intent Filters</h2>
                                        <span className="bg-gradient-to-r from-[#4F46E5] to-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm">AI Powered</span>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium">Prioritize leads showing active buying signals</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${intentExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {intentExpanded && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200 divide-y divide-gray-100">
                                {[
                                    { state: buyingSignals, setState: setBuyingSignals, icon: Target, title: "Active Buying Signals", desc: "Detect recent job postings, technology stack changes, or executive hiring", intent: "high" },
                                    { state: competitorMentions, setState: setCompetitorMentions, icon: Users, title: "Competitor Mentions", desc: "Find businesses discussing alternative solutions on social platforms", intent: "high" },
                                    { state: recentGrowth, setState: setRecentGrowth, icon: Activity, title: "Recent Growth Indicators", desc: "Prioritize companies with recent funding or headcount expansion" },
                                ].map((item, idx) => (
                                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 bg-gray-50 p-2 rounded-lg border ${item.state ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-gray-200 text-gray-400'}`}>
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-semibold text-sm ${item.state ? 'text-gray-900' : 'text-gray-600'}`}>{item.title}</p>
                                                    {item.intent === 'high' && (
                                                        <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wide">High Intent</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-lg">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => item.setState(!item.state)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Data Enrichment */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div
                            className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between cursor-pointer group"
                            onClick={() => setEnrichmentExpanded(!enrichmentExpanded)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${selectedTrack ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-gray-100 text-gray-400'}`}>3</span>
                                <div>
                                    <h2 className={`text-lg font-semibold transition-colors ${selectedTrack ? 'text-gray-900' : 'text-gray-400'}`}>Data Enrichment</h2>
                                    <p className="text-xs text-gray-500 font-medium">Configure what contact info to scrape and verify</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${enrichmentExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {enrichmentExpanded && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200 divide-y divide-gray-100">
                                {[
                                    { state: findEmails, setState: setFindEmails, icon: Key, title: "Decision Maker Emails", desc: "Find personal & corporate email addresses for key contacts" },
                                    { state: findLinkedin, setState: setFindLinkedin, icon: Hash, title: "LinkedIn Profiles", desc: "Extract URLs for businesses and individual decision makers" },
                                    { state: verifyData, setState: setVerifyData, icon: CheckCircle2, title: "Real-time Verification", desc: "Verify emails via SMTP and validate social profiles automatically" },
                                    { state: enrichCompany, setState: setEnrichCompany, icon: Database, title: "Deep Company Data", desc: "Extract tech stack, structured descriptions, employee count, and revenue estimates" },
                                ].map((item, idx) => (
                                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 bg-gray-50 p-2 rounded-lg border flex-shrink-0 ${item.state ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-gray-200 text-gray-400'}`}>
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <p className={`font-semibold text-sm ${item.state ? 'text-gray-900' : 'text-gray-600'}`}>{item.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <button
                                                onClick={() => item.setState(!item.state)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-sm ${item.state ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Outreach Config */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-12">
                        <div
                            className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between cursor-pointer group"
                            onClick={() => setSequenceExpanded(!sequenceExpanded)}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${selectedTrack ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-gray-100 text-gray-400'}`}>4</span>
                                <div>
                                    <h2 className={`text-lg font-semibold transition-colors ${selectedTrack ? 'text-gray-900' : 'text-gray-400'}`}>Outreach Configuration</h2>
                                    <p className="text-xs text-gray-500 font-medium">Set limits and sequence automation</p>
                                </div>
                            </div>
                            <ChevronDown className={`text-gray-400 transition-transform duration-300 ${sequenceExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        {sequenceExpanded && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-200 space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold tracking-wide text-gray-800 uppercase flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                        <Setting size={16} className="text-[#4F46E5]" /> Automation Limits
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-900">Maximum Leads to Scrape</label>
                                                <p className="text-xs text-gray-500 mt-1">Campaign pauses automatically when limit is reached</p>
                                            </div>
                                            <span className="text-2xl font-bold tracking-tight text-[#4F46E5]">{maxLeadsTarget}</span>
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
                                        <div className="flex justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-2 px-1">
                                            <span>10</span>
                                            <span>1k</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold tracking-wide text-gray-800 uppercase flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                                        <Bot size={16} className="text-[#4F46E5]" /> Sequence Assignment
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Auto-enroll into Sequence <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span></label>
                                            <select
                                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] shadow-sm appearance-none"
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Launch Footer */}
            <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-gray-600 hidden md:flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        Scraping usually takes <strong className="text-gray-900">5-15 mins</strong> to generate initial leads
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                        onClick={() => handleCreateCampaign('draft')}
                        disabled={isSubmitting || !campaignName || !selectedTrack}
                    >
                        Save as Draft
                    </button>
                    <button
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#4F46E5] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#4338CA] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleCreateCampaign('active')}
                        disabled={isSubmitting || !campaignName || !selectedTrack}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Rocket size={18} fill="currentColor" className="text-white" />
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

// Helper icons
const Setting = Settings;