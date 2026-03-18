import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Target, CheckCircle2, Key, Database, Users, Building2, Briefcase, Hash, Rocket, Loader2, Activity, FileText, Zap, Send, Info, ChevronDown, Mail, Linkedin, Sparkles
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
    const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([]);
    const [customKeywords, setCustomKeywords] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [cityInput, setCityInput] = useState('');
    const [radius, setRadius] = useState('25');
    const [minRating, setMinRating] = useState('4.0');

    // Smart Intent State
    const [buyingSignals, setBuyingSignals] = useState(true);
    const [competitorMentions, setCompetitorMentions] = useState(false);
    const [recentGrowth, setRecentGrowth] = useState(true);

    // Automation State
    const [findEmails, setFindEmails] = useState(true);
    const [findLinkedin, setFindLinkedin] = useState(true);
    const [verifyData, setVerifyData] = useState(true);
    const [enrichCompany, setEnrichCompany] = useState(false);

    // Outreach Sequence State
    const [selectedSequence, setSelectedSequence] = useState('');
    const [maxLeadsTarget, setMaxLeadsTarget] = useState(100);
    const [availableSequences, setAvailableSequences] = useState<{ id: string, name: string }[]>([]);
    const [selectedOutreachStrategy, setSelectedOutreachStrategy] = useState('cold_email');

    // Navigation State
    const [activeSection, setActiveSection] = useState('campaign_details');

    // Dropdown States
    const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
    const [radiusDropdownOpen, setRadiusDropdownOpen] = useState(false);
    const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
    const [sequenceDropdownOpen, setSequenceDropdownOpen] = useState(false);

    const businessTypes = [
        "SaaS", "E-commerce", "Healthcare", "Real Estate", "Financial Services", "Legal", "Marketing Agency", "Manufacturing", "Logistics", "Software Development", "Construction", "Education"
    ];

    const regions = [
        { value: '', label: 'Select region' },
        { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'CA', label: 'Canada' },
        { value: 'AU', label: 'Australia' },
        { value: 'EU', label: 'Europe' },
    ];

    const radiusOptions = [
        { value: '10', label: '10 Miles' },
        { value: '25', label: '25 Miles' },
        { value: '50', label: '50 Miles' },
        { value: '100', label: '100 Miles' },
    ];

    const ratingOptions = [
        { value: 'any', label: 'Any rating' },
        { value: '3.0', label: '3.0+ Stars' },
        { value: '4.0', label: '4.0+ Stars' },
        { value: '4.5', label: '4.5+ Stars' },
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
            icon: <Building2 className="w-5 h-5" />,
            metrics: 'High Volume · Local',
            color: 'blue'
        },
        {
            id: 2,
            title: 'B2B Services',
            description: 'Target professional services, agencies, and consulting firms.',
            icon: <Briefcase className="w-5 h-5" />,
            metrics: 'High Value · B2B',
            color: 'indigo'
        },
        {
            id: 3,
            title: 'Custom Search',
            description: 'Define your exact ideal customer profile with advanced filtering parameters.',
            icon: <Target className="w-5 h-5" />,
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

    const navItems = [
        { id: 'campaign_details', label: 'Campaign details', icon: FileText },
        { id: 'targeting', label: 'Advanced targeting', icon: Target },
        { id: 'intent_filters', label: 'Intent filters', icon: Zap },
        { id: 'enrichment', label: 'Data enrichment', icon: Database },
        { id: 'outreach', label: 'Outreach config', icon: Send },
    ];

    const sectionOrder = ['campaign_details', 'targeting', 'intent_filters', 'enrichment', 'outreach'];

    const goToNextSection = () => {
        const currentIndex = sectionOrder.indexOf(activeSection);
        if (currentIndex < sectionOrder.length - 1) {
            setActiveSection(sectionOrder[currentIndex + 1]);
        }
    };

    const goToPrevSection = () => {
        const currentIndex = sectionOrder.indexOf(activeSection);
        if (currentIndex > 0) {
            setActiveSection(sectionOrder[currentIndex - 1]);
        }
    };

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#111827] mb-6"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <div className="flex gap-6">
                {/* Left Nav Panel */}
                <div className="w-52 shrink-0">
                    <div className="sticky top-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {navItems.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-2 text-left ${
                                    activeSection === id
                                        ? 'bg-[#EEF2FF] text-[#4F46E5] border-[#4F46E5]'
                                        : 'text-[#6B7280] border-transparent hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={16} className="shrink-0" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Content Panel */}
                <div className="flex-1">
                    {/* Campaign Details Section */}
                    {activeSection === 'campaign_details' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-[#111827] mb-1">Campaign details</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Name your campaign and choose the type of leads you want to find.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Campaign name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        placeholder="e.g. Q3 NYC B2B Outreach"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Campaign type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {tracks.map(track => (
                                            <div
                                                key={track.id}
                                                onClick={() => setSelectedTrack(track.id)}
                                                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                                    selectedTrack === track.id
                                                        ? 'border-[#4F46E5] bg-[#EEF2FF]'
                                                        : 'border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-[#EEF2FF]'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                                    selectedTrack === track.id ? 'bg-[#4F46E5] text-white' : 'bg-[#EEF2FF] text-[#4F46E5]'
                                                }`}>
                                                    {track.icon}
                                                </div>
                                                <h3 className="text-sm font-semibold text-[#111827] mb-1">{track.title}</h3>
                                                <p className="text-xs text-[#6B7280]">{track.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={goToNextSection}
                                        className="px-5 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Advanced Targeting Section */}
                    {activeSection === 'targeting' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-[#111827] mb-1">Advanced targeting</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Define exactly which businesses to find.</p>

                            <div className="space-y-6">
                                {/* Business Type Tags */}
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Business type</label>
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
                                                className={`px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${
                                                    selectedBusinessTypes.includes(type)
                                                        ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                                                        : 'border-[#E5E7EB] text-[#374151] hover:border-[#4F46E5]'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Custom Keywords */}
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Custom keywords</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                        placeholder="e.g. software, consultant, marketing, B2B, wholesale"
                                        value={customKeywords}
                                        onChange={(e) => setCustomKeywords(e.target.value)}
                                    />
                                </div>

                                {/* Geographic */}
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Region Dropdown */}
                                    <div className="relative">
                                        <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Geographic region</label>
                                        <button
                                            onClick={() => { setRegionDropdownOpen(!regionDropdownOpen); setRadiusDropdownOpen(false); setRatingDropdownOpen(false); }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white flex items-center justify-between"
                                        >
                                            <span>{regions.find(r => r.value === selectedRegion)?.label || 'Select region'}</span>
                                            <ChevronDown size={16} className="text-[#6B7280]" />
                                        </button>
                                        {regionDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                {regions.map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => { setSelectedRegion(option.value); setRegionDropdownOpen(false); }}
                                                        className={`w-full px-3 py-2 text-left text-sm transition-all ${
                                                            selectedRegion === option.value
                                                                ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                                : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* City Input */}
                                    <div>
                                        <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">City</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                                            placeholder="e.g. London"
                                            value={cityInput}
                                            onChange={e => setCityInput(e.target.value)}
                                        />
                                    </div>

                                    {/* Radius Dropdown */}
                                    <div className="relative">
                                        <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Search radius</label>
                                        <button
                                            onClick={() => { setRadiusDropdownOpen(!radiusDropdownOpen); setRegionDropdownOpen(false); setRatingDropdownOpen(false); }}
                                            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white flex items-center justify-between"
                                        >
                                            <span>{radiusOptions.find(r => r.value === radius)?.label || '25 Miles'}</span>
                                            <ChevronDown size={16} className="text-[#6B7280]" />
                                        </button>
                                        {radiusDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                                {radiusOptions.map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => { setRadius(option.value); setRadiusDropdownOpen(false); }}
                                                        className={`w-full px-3 py-2 text-left text-sm transition-all ${
                                                            radius === option.value
                                                                ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                                : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Google Rating Dropdown */}
                                <div className="relative max-w-xs">
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Minimum Google rating</label>
                                    <button
                                        onClick={() => { setRatingDropdownOpen(!ratingDropdownOpen); setRegionDropdownOpen(false); setRadiusDropdownOpen(false); }}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white flex items-center justify-between"
                                    >
                                        <span>{ratingOptions.find(r => r.value === minRating)?.label || '4.0+ Stars'}</span>
                                        <ChevronDown size={16} className="text-[#6B7280]" />
                                    </button>
                                    {ratingDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                            {ratingOptions.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => { setMinRating(option.value); setRatingDropdownOpen(false); }}
                                                    className={`w-full px-3 py-2 text-left text-sm transition-all ${
                                                        minRating === option.value
                                                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                            : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={goToPrevSection}
                                        className="px-5 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={goToNextSection}
                                        className="px-5 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Intent Filters Section */}
                    {activeSection === 'intent_filters' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-[#111827] mb-1">Intent filters</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Target leads most likely to need your service right now.</p>

                            <div className="space-y-0">
                                {[
                                    { state: buyingSignals, setState: setBuyingSignals, icon: Target, title: "Active buying signals", desc: "Detect recent job postings, technology stack changes, or executive hiring" },
                                    { state: competitorMentions, setState: setCompetitorMentions, icon: Users, title: "Competitor mentions", desc: "Find businesses discussing alternative solutions on social platforms" },
                                    { state: recentGrowth, setState: setRecentGrowth, icon: Activity, title: "Recent growth indicators", desc: "Prioritize companies with recent funding or headcount expansion" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                                            <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => item.setState(!item.state)}
                                            className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${item.state ? 'translate-x-4' : ''}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={goToPrevSection}
                                    className="px-5 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={goToNextSection}
                                    className="px-5 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Data Enrichment Section */}
                    {activeSection === 'enrichment' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-[#111827] mb-1">Data enrichment</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Choose what additional data to find for each lead.</p>

                            <div className="space-y-0">
                                {[
                                    { state: findEmails, setState: setFindEmails, icon: Key, title: "Decision maker emails", desc: "Find personal & corporate email addresses for key contacts" },
                                    { state: findLinkedin, setState: setFindLinkedin, icon: Hash, title: "LinkedIn profiles", desc: "Extract URLs for businesses and individual decision makers" },
                                    { state: verifyData, setState: setVerifyData, icon: CheckCircle2, title: "Real-time verification", desc: "Verify emails via SMTP and validate social profiles automatically" },
                                    { state: enrichCompany, setState: setEnrichCompany, icon: Database, title: "Deep company data", desc: "Extract tech stack, structured descriptions, employee count, and revenue estimates" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-[#111827]">{item.title}</p>
                                            <p className="text-xs text-[#6B7280] mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => item.setState(!item.state)}
                                            className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${item.state ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform duration-200 ${item.state ? 'translate-x-4' : ''}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={goToPrevSection}
                                    className="px-5 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={goToNextSection}
                                    className="px-5 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Outreach Config Section */}
                    {activeSection === 'outreach' && (
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h2 className="text-base font-semibold text-[#111827] mb-1">Outreach config</h2>
                            <p className="text-sm text-[#6B7280] mb-6">Set how many leads to find and how to contact them.</p>

                            <div className="space-y-6">
                                {/* Number of leads slider */}
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Number of leads</label>
                                    <div className="text-2xl font-semibold text-[#4F46E5] mb-3">{maxLeadsTarget}</div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="1000"
                                        step="10"
                                        value={maxLeadsTarget}
                                        onChange={(e) => setMaxLeadsTarget(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4F46E5]"
                                    />
                                    <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                                        <span>10</span>
                                        <span>1,000</span>
                                    </div>
                                </div>

                                {/* Sequence selection dropdown */}
                                <div className="relative">
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Auto-enrol into sequence</label>
                                    <button
                                        onClick={() => setSequenceDropdownOpen(!sequenceDropdownOpen)}
                                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent bg-white flex items-center justify-between"
                                    >
                                        <span>{selectedSequence ? availableSequences.find(s => s.id === selectedSequence)?.name : 'No automatic sequence'}</span>
                                        <ChevronDown size={16} className="text-[#6B7280]" />
                                    </button>
                                    {sequenceDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto">
                                            <button
                                                onClick={() => { setSelectedSequence(''); setSequenceDropdownOpen(false); }}
                                                className={`w-full px-3 py-2 text-left text-sm transition-all ${
                                                    selectedSequence === ''
                                                        ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                        : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                }`}
                                            >
                                                No automatic sequence
                                            </button>
                                            {availableSequences.map(seq => (
                                                <button
                                                    key={seq.id}
                                                    onClick={() => { setSelectedSequence(seq.id); setSequenceDropdownOpen(false); }}
                                                    className={`w-full px-3 py-2 text-left text-sm transition-all ${
                                                        selectedSequence === seq.id
                                                            ? 'bg-[#EEF2FF] text-[#4F46E5] font-semibold'
                                                            : 'text-[#374151] hover:bg-gray-50 font-medium'
                                                    }`}
                                                >
                                                    {seq.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Outreach Strategy Cards */}
                                <div>
                                    <label className="text-xs font-medium text-[#6B7280] mb-1.5 block">Outreach strategy</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div
                                            onClick={() => setSelectedOutreachStrategy('cold_email')}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                                selectedOutreachStrategy === 'cold_email'
                                                    ? 'border-[#4F46E5] bg-[#EEF2FF]'
                                                    : 'border-[#E5E7EB] hover:border-[#4F46E5] hover:bg-[#EEF2FF]'
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                                                selectedOutreachStrategy === 'cold_email' ? 'bg-[#4F46E5] text-white' : 'bg-[#EEF2FF] text-[#4F46E5]'
                                            }`}>
                                                <Mail size={18} />
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#111827] mb-1">Cold email + AI voice</h3>
                                            <p className="text-xs text-[#6B7280]">Email sequences with AI-powered voice follow-ups</p>
                                        </div>

                                        <div
                                            onClick={() => setSelectedOutreachStrategy('linkedin')}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                                selectedOutreachStrategy === 'linkedin'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-[#E5E7EB] hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    selectedOutreachStrategy === 'linkedin' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                    <Linkedin size={18} />
                                                </div>
                                                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#4F46E5] text-white rounded-full">Pro</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#111827] mb-1">LinkedIn only</h3>
                                            <p className="text-xs text-[#6B7280]">Connection requests and InMail sequences</p>
                                        </div>

                                        <div
                                            onClick={() => setSelectedOutreachStrategy('full_pipeline')}
                                            className={`border rounded-xl p-4 cursor-pointer transition-all ${
                                                selectedOutreachStrategy === 'full_pipeline'
                                                    ? 'border-purple-500 bg-purple-50'
                                                    : 'border-[#E5E7EB] hover:border-purple-500 hover:bg-purple-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                    selectedOutreachStrategy === 'full_pipeline' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-500'
                                                }`}>
                                                    <Sparkles size={18} />
                                                </div>
                                                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#4F46E5] text-white rounded-full">Pro</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-[#111827] mb-1">Full pipeline</h3>
                                            <p className="text-xs text-[#6B7280]">Email, LinkedIn, and AI voice combined</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={goToPrevSection}
                                        className="px-5 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => handleCreateCampaign('draft')}
                                        disabled={isSubmitting || !campaignName || !selectedTrack}
                                        className="px-5 py-2 border border-[#E5E7EB] bg-white text-[#374151] rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Save as draft
                                    </button>
                                    <button
                                        onClick={() => handleCreateCampaign('active')}
                                        disabled={isSubmitting || !campaignName || !selectedTrack}
                                        className="flex items-center gap-2 px-5 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Rocket size={16} />
                                                Launch campaign
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-4 py-3 bg-[#EEF2FF] border border-indigo-100 rounded-xl mt-4">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs font-medium text-[#374151] leading-relaxed">
                            Campaigns automatically scrape Google Maps leads, enrich with decision maker emails, score intent, and enrol into your chosen outreach sequence.
                        </p>
                    </div>
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
