import React, { useState, useEffect } from 'react';
import {
    Building,
    PenTool,
    TrendingUp,
    Plus,
    Rocket,
    Check,
    ChevronDown,
    ChevronUp,
    Loader2,
    X,
    Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import UpgradePrompt from '../components/UpgradePrompt';

interface Track {
    id: number;
    name: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    tags: string[];
}

const tracks: Track[] = [
    {
        id: 1,
        name: "Local Businesses",
        description: "Target local service businesses directly: restaurants, salons, clinics, retailers, tradespeople",
        icon: Building,
        color: "#4F46E5",
        bgColor: "bg-[#EEF2FF]",
        tags: ["Restaurant", "Cafe", "Hair Salon", "Beauty Clinic", "Dental Practice", "Law Firm", "Accountant", "Estate Agent", "Gym", "Retail Shop"]
    },
    {
        id: 2,
        name: "B2B Services",
        description: "Target businesses that sell to other businesses: agencies, consultants, software, suppliers",
        icon: PenTool,
        color: "#7C3AED",
        bgColor: "bg-purple-50",
        tags: ["Marketing Agency", "IT Consultant", "Recruitment Agency", "Business Coach", "Accountancy Firm", "Legal Services", "PR Agency", "Web Design Agency"]
    },
    {
        id: 3,
        name: "Custom Search",
        description: "Define your own target audience using custom keywords and business types",
        icon: TrendingUp,
        color: "#059669",
        bgColor: "bg-emerald-50",
        tags: ["Add Custom"]
    }
];

const countryCodes: Record<string, string> = {
    'UAE': 'ae',
    'United Kingdom': 'gb',
    'United States': 'us',
    'Australia': 'au',
    'Saudi Arabia': 'sa',
    'Germany': 'de',
    'Sweden': 'se',
    'France': 'fr',
    'Singapore': 'sg',
    'Qatar': 'qa',
    'New Zealand': 'nz',
    'Brazil': 'br',
    'Ireland': 'ie',
    'Netherlands': 'nl',
    'Italy': 'it',
    'Spain': 'es',
    'Portugal': 'pt',
    'Canada': 'ca',
    'India': 'in',
    'Japan': 'jp',
    'South Korea': 'kr',
    'China': 'cn',
    'Thailand': 'th',
    'Mexico': 'mx',
    'South Africa': 'za',
    'Kenya': 'ke',
    'Nigeria': 'ng',
    'Egypt': 'eg',
    'Jordan': 'jo',
    'Oman': 'om',
    'Bahrain': 'bh',
    'Kuwait': 'kw',
    'Malaysia': 'my',
    'Indonesia': 'id',
    'Philippines': 'ph',
    'Vietnam': 'vn',
    'Poland': 'pl',
    'Czech Republic': 'cz',
    'Austria': 'at',
    'Switzerland': 'ch',
    'Denmark': 'dk',
    'Norway': 'no',
    'Finland': 'fi'
};

const intentFilterOptions = [
    {
        id: 'new_business',
        icon: '🆕',
        label: 'Newly Opened Businesses',
        description: 'Businesses opened in the last 6 months. They need everything and are open to new suppliers.',
        badge: 'HOT',
        badgeColor: 'bg-red-50 text-red-600 border-red-100',
        note: 'Availability depends on Google data. Filters are applied only where opening dates are present.'
    },
    {
        id: 'low_rating',
        icon: '⭐',
        label: 'Low Google Rating',
        description: 'Under 4.0 stars. These businesses have a clear pain point and high motivation to improve their reputation.',
        badge: 'HIGH INTENT',
        badgeColor: 'bg-amber-50 text-amber-600 border-amber-100',
        hasSubOption: true
    },
    {
        id: 'no_photos',
        icon: '📸',
        label: 'Missing or Few Photos',
        description: 'Under 5 photos on their Google profile. This indicates a weak online presence and represents an easy win.',
        badge: null,
        badgeColor: ''
    },
    {
        id: 'no_recent_reviews',
        icon: '💬',
        label: 'No Recent Reviews',
        description: 'Last review over 6 months ago. This suggests a disengaged owner who likely needs support.',
        badge: null,
        badgeColor: ''
    },
    {
        id: 'incomplete_profile',
        icon: '📋',
        label: 'Incomplete Google Profile',
        description: 'Missing website, phone, or hours. These are unprofessional listings and serve as easy conversation starters.',
        badge: null,
        badgeColor: ''
    }
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="card p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-bold text-[#111827] mb-6">{title}</h3>
        {children}
    </div>
);

interface NewCampaignProps {
    onPageChange?: (page: string) => void;
}

const NewCampaign: React.FC<NewCampaignProps> = ({ onPageChange }) => {
    const [campaignName, setCampaignName] = useState('');
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [customKeywords, setCustomKeywords] = useState('');
    const [cityArea, setCityArea] = useState('');
    const [radius, setRadius] = useState('25 miles');
    const [minRating, setMinRating] = useState('4+ stars');
    const [leadCount, setLeadCount] = useState(10);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [followUpCount, setFollowUpCount] = useState(3);
    const [sendingDelay, setSendingDelay] = useState('3 days');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState('');
    const [sequences, setSequences] = useState<any[]>([]);
    const [selectedSequenceId, setSelectedSequenceId] = useState<string>('');
    const [userPlan, setUserPlan] = useState<string>('trial');
    const [filtersExpanded, setFiltersExpanded] = useState(false);

    const [activeFilters, setActiveFilters] = useState({
        new_business: false,
        low_rating: false,
        low_rating_max: '4.0',
        no_photos: false,
        no_recent_reviews: false,
        incomplete_profile: false
    });

    const [toggles, setToggles] = useState({
        maps: true,
        emailFinder: true,
        verification: true,
        keywordScan: false,
        timezone: true,
        linkedin: false
    });

    useEffect(() => {
        const loadSequences = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase
                .from('sequences')
                .select('id, name')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false });
            setSequences(data || []);
        };
        loadSequences();
    }, []);

    useEffect(() => {
        const loadUserPlan = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: profile } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', user.id)
                .single();
            setUserPlan(profile?.plan || 'trial');
        };
        loadUserPlan();
    }, []);

    const toggleFilter = (filterId: string) => {
        setActiveFilters(prev => ({ ...prev, [filterId]: !prev[filterId as keyof typeof prev] }));
    };

    const activeFilterCount = Object.entries(activeFilters).filter(([key, value]) => key !== 'low_rating_max' && value === true).length;

    const isStarterPlan = userPlan === 'starter';

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const toggleCountry = (country: string) => {
        setSelectedCountries(prev => prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]);
    };

    const checkLeadsLimit = async (): Promise<boolean> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single();

        const plan = profile?.plan || 'trial';
        if (plan === 'pro') return true;

        const limits: Record<string, number> = { trial: 100, starter: 500 };
        const limit = limits[plan] || 100;

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth.toISOString());

        const currentCount = count || 0;
        const remaining = Math.max(0, limit - currentCount);

        if (currentCount + leadCount > limit) {
            const msg = remaining === 0
                ? plan === 'starter'
                    ? "You've reached your Starter plan limit. Upgrade to Pro for unlimited access."
                    : `Monthly leads limit reached. Your ${plan} plan includes ${limit} leads/month. Upgrade to Pro for unlimited leads.`
                : `This campaign would exceed your monthly limit. You have ${remaining} leads remaining this month.`;

            setUpgradeMessage(msg);
            setShowUpgradeModal(true);
            setError(msg);
            return false;
        }
        return true;
    };

    const saveCampaign = async (status: 'draft' | 'active') => {
        if (!campaignName?.trim()) {
            setError('Please enter a campaign name.');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('Please log in first.');
                return;
            }

            if (status === 'active') {
                const canLaunch = await checkLeadsLimit();
                if (!canLaunch) {
                    setSaving(false);
                    return;
                }
            }

            if (status === 'active') {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('plan, trial_end')
                    .eq('id', user.id)
                    .single();

                if (profile?.plan === 'trial') {
                    const trialActive = profile.trial_end && new Date(profile.trial_end) > new Date();
                    if (trialActive) {
                        const { count } = await supabase
                            .from('campaigns')
                            .select('*', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('status', 'active');

                        if ((count || 0) >= 5) {
                            setError('Trial limit reached: maximum 5 active campaigns during trial.');
                            setSaving(false);
                            return;
                        }
                    }
                }

                if (profile?.plan === 'starter') {
                    const { count } = await supabase
                        .from('campaigns')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('status', 'active');

                    if ((count || 0) >= 3) {
                        const msg = "You've reached your Starter plan limit. Upgrade to Pro for unlimited access.";
                        setUpgradeMessage(msg);
                        setShowUpgradeModal(true);
                        setError(msg);
                        setSaving(false);
                        return;
                    }
                }
            }

            const locationParts = [];
            if (selectedCountries && selectedCountries.length > 0) {
                locationParts.push(selectedCountries.join(', '));
            }
            if (cityArea?.trim()) {
                locationParts.push(cityArea.trim());
            }

            const trackMap: Record<string, string> = {
                'Local Businesses': 'direct',
                'B2B Services': 'specifier',
                'Custom Search': 'custom'
            };

            const insertData = {
                user_id: user.id,
                name: campaignName.trim(),
                track: selectedTrack ? (trackMap[selectedTrack.name] || 'direct') : 'direct',
                status: status,
                target_industry: selectedTags.length > 0 ? selectedTags.join(', ') : (customKeywords || ''),
                target_location: locationParts.join(', '),
                target_job_titles: [],
                leads_found: 0,
                leads_requested: leadCount,
                emails_sent: 0,
                replies: 0,
                reply_rate: 0,
                sequence_id: selectedSequenceId || null
            };

            const { data: insertedCampaign, error: dbError } = await supabase
                .from('campaigns')
                .insert(insertData)
                .select('id')
                .single();

            if (dbError) {
                console.error('Error saving campaign:', dbError);
                alert('Failed to save campaign. Please try again.');
                return;
            }

            // Save intent filters via RPC to bypass schema cache issue
            const filtersToSave = isStarterPlan ? {} : activeFilters;
            const { error: filterError } = await supabase.rpc('update_campaign_filters', {
                campaign_id: insertedCampaign.id,
                filters: filtersToSave
            });

            if (filterError) {
                console.error('Error saving filters:', filterError);
            }

            if (status === 'active') {
                try {
                    await fetch('https://n8n.srv1377696.hstgr.cloud/webhook/e1a8d0f0-f81f-4aff-bc0b-a50211f74519', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            campaign_id: insertedCampaign.id,
                            user_id: user.id,
                            industry: selectedTags.length > 0 ? selectedTags.join(', ') : (customKeywords || ''),
                            location: selectedCountries.join(', '),
                            city: cityArea?.trim() || '',
                            max_leads: leadCount,
                            intent_filters: isStarterPlan ? {} : activeFilters
                        })
                    });

                    await supabase
                        .from('campaigns')
                        .update({ scraping_status: 'scraping' })
                        .eq('id', insertedCampaign.id);
                } catch (webhookErr) {
                    console.error('Webhook fetch error:', webhookErr);
                }
            }

            if (onPageChange) {
                onPageChange('Active Campaigns');
            }

        } catch (err) {
            console.error('Save error:', err);
            alert('Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-[800px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Section 1: Campaign Details */}
            <Section title="Campaign Details">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Campaign Name</label>
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="e.g., Manchester Plumbers Q1"
                            className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-3 uppercase tracking-tight">Select Track</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {tracks.map(track => (
                                <button
                                    key={track.id}
                                    onClick={() => { setSelectedTrack(track); setSelectedTags([]); }}
                                    className={`p-4 border text-left rounded-xl transition-all duration-300 relative group ${selectedTrack?.id === track.id
                                        ? 'border-[#4F46E5] bg-[#EEF2FF] shadow-sm'
                                        : 'border-[#E5E7EB] bg-white hover:border-gray-300 hover:shadow-sm'
                                        }`}
                                >
                                    {selectedTrack?.id === track.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                    )}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${track.bgColor}`}>
                                        <track.icon size={20} style={{ color: track.color }} />
                                    </div>
                                    <h4 className="text-xs font-bold text-[#111827] mb-1">{track.name}</h4>
                                    <p className="text-[10px] text-[#6B7280] leading-tight">{track.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Section 2: Targeting */}
            <Section title="Targeting">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-3 uppercase tracking-tight">Business Type Tags</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(selectedTrack ? selectedTrack.tags : []).map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedTags.includes(tag)
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'border border-[#E5E7EB] text-[#6B7280] hover:border-gray-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                            <button
                                onClick={() => alert('Custom tag creation coming soon!')}
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-[#4F46E5]/50 text-[#4F46E5] hover:bg-[#EEF2FF] transition-all flex items-center gap-1"
                            >
                                <Plus size={14} /> Add Custom
                            </button>
                        </div>
                        {!selectedTrack && <p className="text-[11px] text-[#9CA3AF] italic">Select a track above to see recommended business types</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Custom Keywords</label>
                        <input
                            type="text"
                            value={customKeywords}
                            onChange={(e) => setCustomKeywords(e.target.value)}
                            placeholder="e.g., plumber, electrician, solicitor"
                            className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>
                </div>
            </Section>

            {/* Section 3: Geographic Targeting */}
            <Section title="Geographic Targeting">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-3 uppercase tracking-tight">Regions</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                            {selectedCountries.map(regionName => (
                                <div
                                    key={regionName}
                                    className="p-3 border border-[#4F46E5] bg-[#EEF2FF] shadow-sm rounded-xl flex items-center justify-between gap-2 animate-in zoom-in-95 duration-200"
                                >
                                    <span className="text-xs font-bold text-[#374151] truncate flex items-center">
                                        <img
                                            src={`https://flagcdn.com/20x15/${countryCodes[regionName]}.png`}
                                            alt={regionName}
                                            className="inline-block mr-2"
                                            width={20}
                                            height={15}
                                        />
                                        {regionName}
                                    </span>
                                    <button
                                        onClick={() => toggleCountry(regionName)}
                                        className="w-5 h-5 rounded-full hover:bg-blue-100 flex items-center justify-center text-[#4F46E5] transition-colors"
                                    >
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}

                            <div className="relative">
                                <select
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            toggleCountry(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                    className="w-full h-full p-3 border border-dashed border-[#4F46E5]/50 rounded-xl bg-white text-[#4F46E5] font-bold text-xs hover:bg-[#EEF2FF] transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20"
                                >
                                    <option value="">+ Add Region...</option>
                                    {Object.entries(countryCodes)
                                        .filter(([regionName]) => !selectedCountries.includes(regionName))
                                        .map(([regionName]) => (
                                            <option key={regionName} value={regionName}>
                                                {regionName}
                                            </option>
                                        ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">City / Area (optional)</label>
                            <input
                                type="text"
                                value={cityArea}
                                onChange={(e) => setCityArea(e.target.value)}
                                placeholder="e.g., Manchester, Birmingham"
                                className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Radius</label>
                            <div className="relative">
                                <select
                                    value={radius}
                                    onChange={(e) => setRadius(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]"
                                >
                                    <option>10 miles</option>
                                    <option>25 miles</option>
                                    <option>50 miles</option>
                                    <option>100 miles</option>
                                    <option>Entire Country</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Minimum Google Rating</label>
                        <div className="relative">
                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(e.target.value)}
                                className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]"
                            >
                                <option>Any</option>
                                <option>3+ stars</option>
                                <option>4+ stars</option>
                                <option>4.5+ stars</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </Section>

            {/* Section 3.5: Smart Intent Filters */}
            <div className="card bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-8 overflow-hidden">
                <button
                    onClick={() => !isStarterPlan && setFiltersExpanded(!filtersExpanded)}
                    className="w-full p-6 flex items-center justify-between text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🎯</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-[#111827]">Smart Intent Filters</h3>
                                <span className="px-2 py-0.5 bg-[#EEF2FF] text-[#4F46E5] text-[9px] font-black rounded-full border border-[#C7D2FE] uppercase tracking-tight">
                                    Recommended
                                </span>
                                {activeFilterCount > 0 && (
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black rounded-full border border-green-100">
                                        {activeFilterCount} active
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#6B7280] mt-0.5">Target businesses most likely to need your services right now</p>
                        </div>
                    </div>
                    {isStarterPlan ? (
                        <Lock size={18} className="text-[#9CA3AF]" />
                    ) : (
                        filtersExpanded ? <ChevronUp size={18} className="text-[#9CA3AF]" /> : <ChevronDown size={18} className="text-[#9CA3AF]" />
                    )}
                </button>

                {isStarterPlan && (
                    <div className="px-6 pb-6">
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                            <Lock size={24} className="mx-auto text-[#9CA3AF] mb-2" />
                            <p className="text-sm font-bold text-[#374151] mb-1">Available on Trial & Pro plans</p>
                            <p className="text-xs text-[#6B7280] mb-3">Smart Filters help you target warm leads that convert 3-5x higher than cold outreach.</p>
                            <button
                                onClick={() => {
                                    setUpgradeMessage('Upgrade to Pro to unlock Smart Intent Filters and target warm leads with higher conversion rates.');
                                    setShowUpgradeModal(true);
                                }}
                                className="px-6 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-[#4338CA] transition-all"
                            >
                                Upgrade to Pro
                            </button>
                        </div>
                    </div>
                )}

                {!isStarterPlan && filtersExpanded && (
                    <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div style={{
                            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 100%)',
                            border: '1px solid #C7D2FE',
                            borderRadius: '12px',
                            padding: '14px 18px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px'
                        }}>
                            <span style={{ fontSize: '18px' }}>⚡</span>
                            <p style={{ margin: 0, fontSize: '12px', color: '#4B5563', lineHeight: '1.6' }}>
                                Smart filters identify businesses showing clear buying signals right now. Target leads that are actively struggling so your outreach arrives at exactly the right moment. These convert at <strong style={{ color: '#4F46E5' }}>3-5x higher rates</strong> than cold lists.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {intentFilterOptions.map(filter => (
                                <div
                                    key={filter.id}
                                    className={`p-4 rounded-xl border transition-all duration-200 ${activeFilters[filter.id as keyof typeof activeFilters]
                                        ? 'border-[#4F46E5] bg-[#F5F3FF] shadow-sm'
                                        : 'border-[#F3F4F6] bg-white hover:border-gray-200 hover:bg-[#F9FAFB]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <span className="text-xl shrink-0">{filter.icon}</span>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="text-sm font-bold text-[#374151]">{filter.label}</p>
                                                    {filter.badge && (
                                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${filter.badgeColor}`}>
                                                            {filter.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-[#6B7280] mt-0.5">{filter.description}</p>
                                                {filter.note && activeFilters[filter.id as keyof typeof activeFilters] && (
                                                    <p className="text-[10px] text-[#9CA3AF] mt-1 italic">{filter.note}</p>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleFilter(filter.id)}
                                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ml-4 ${activeFilters[filter.id as keyof typeof activeFilters] ? 'bg-[#4F46E5]' : 'bg-[#E5E7EB]'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${activeFilters[filter.id as keyof typeof activeFilters] ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    {filter.hasSubOption && activeFilters.low_rating && filter.id === 'low_rating' && (
                                        <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center gap-3 animate-in fade-in duration-200">
                                            <label className="text-xs font-bold text-[#6B7280]">Maximum rating:</label>
                                            <div className="relative">
                                                <select
                                                    value={activeFilters.low_rating_max}
                                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, low_rating_max: e.target.value }))}
                                                    className="appearance-none px-3 py-1.5 pr-8 bg-white border border-[#E5E7EB] rounded-lg text-xs font-bold text-[#374151] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option value="3.0">3.0 stars</option>
                                                    <option value="3.5">3.5 stars</option>
                                                    <option value="4.0">4.0 stars</option>
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {activeFilterCount > 0 && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
                                <span className="text-green-600 text-sm">✅</span>
                                <p className="text-xs font-bold text-green-700">
                                    {activeFilterCount} intent filter{activeFilterCount > 1 ? 's' : ''} active, targeting warm leads only
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Section 4: Data Enrichment */}
            <Section title="Data Enrichment">
                <div className="space-y-4">
                    {[
                        { id: 'maps', label: 'Google Maps Scrape', desc: 'Auto-extract business data and ratings', alwaysOn: true },
                        { id: 'emailFinder', label: 'Website Email Finder', desc: 'Crawl business sites for direct contact info' },
                        { id: 'verification', label: 'Email Verification', desc: 'Real-time SMTP validation to reduce bounce rate' },
                        { id: 'keywordScan', label: 'Portfolio Keyword Scan', desc: 'Scan site content for specific service keywords', track2Only: true },
                        { id: 'timezone', label: 'Timezone-Aware Sending', desc: 'Deliver emails during prospects work hours' },
                    ].map(item => {
                        const isDisabled = item.track2Only && selectedTrack?.id !== 2;
                        return (
                            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border border-[#F3F4F6] transition-all ${isDisabled ? 'opacity-40 grayscale' : 'hover:bg-[#F9FAFB]'}`}>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-bold ${isDisabled ? 'text-[#9CA3AF]' : 'text-[#374151]'}`}>{item.label}</p>
                                        {item.track2Only && <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded uppercase tracking-tight">Track 2 Only</span>}
                                    </div>
                                    <p className="text-[11px] text-[#9CA3AF]">{item.desc}</p>
                                </div>
                                <button
                                    disabled={item.alwaysOn || isDisabled}
                                    onClick={() => setToggles(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof toggles] }))}
                                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${toggles[item.id as keyof typeof toggles] ? 'bg-primary' : 'bg-[#E5E7EB]'
                                        } ${item.alwaysOn ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${toggles[item.id as keyof typeof toggles] ? 'translate-x-5' : ''
                                        }`} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </Section>

            {/* Section 5: Outreach Configuration */}
            <Section title="Outreach Configuration">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Email Sequence</label>
                        <div className="relative">
                            <select
                                value={selectedSequenceId}
                                onChange={(e) => setSelectedSequenceId(e.target.value)}
                                className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]"
                            >
                                <option value="">Custom: Build from Scratch</option>
                                {sequences.map(seq => (
                                    <option key={seq.id} value={seq.id}>{seq.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] mt-2 italic">Select a sequence to automatically enrol leads into your outreach flow.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Follow-up Count</label>
                            <div className="flex gap-2">
                                {[2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setFollowUpCount(num)}
                                        className={`flex-1 py-2 rounded-lg border font-bold text-sm transition-all active:scale-95 ${followUpCount === num
                                            ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                                            : 'border-[#E5E7EB] bg-white text-[#374151] hover:border-gray-300'}`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Delay Between Follow-ups</label>
                            <div className="relative">
                                <select
                                    value={sendingDelay}
                                    onChange={(e) => setSendingDelay(e.target.value)}
                                    className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]"
                                >
                                    <option>2 days</option>
                                    <option>3 days</option>
                                    <option>5 days</option>
                                    <option>7 days</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Number of Leads</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10"
                                max="500"
                                step="10"
                                value={leadCount}
                                onChange={(e) => setLeadCount(parseInt(e.target.value))}
                                className="flex-1 accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="w-20 text-center font-bold text-[#4F46E5] bg-[#EEF2FF] py-2 rounded-lg border border-[#4F46E5]/20">
                                {leadCount}
                            </div>
                        </div>
                        <p className="text-[10px] text-[#9CA3AF] mt-2 italic">Default is 10 leads. Higher counts may take longer to process.</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-[#F3F4F6] bg-gradient-to-r from-[#F9FAFB] to-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center text-purple-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#374151]">Enable LinkedIn Outreach</p>
                                <p className="text-[11px] text-[#9CA3AF]">Send connection requests & DMs automatically</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setToggles(prev => ({ ...prev, linkedin: !prev.linkedin }))}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${toggles.linkedin ? 'bg-purple-600' : 'bg-[#E5E7EB]'
                                }`}
                        >
                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${toggles.linkedin ? 'translate-x-5' : ''
                                }`} />
                        </button>
                    </div>
                </div>
            </Section>

            {/* Section 6: Launch Controls */}
            <div className="bg-white border-t border-[#E5E7EB] -mx-8 px-8 py-6 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex-1">
                    {error ? (
                        <p className="text-xs font-bold text-red-500">{error}</p>
                    ) : (
                        <p className="text-[11px] text-[#9CA3AF] font-medium max-w-[240px]">
                            Scraping typically takes 2–5 minutes. Leads will appear in your Lead Database automatically.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => saveCampaign('draft')}
                        disabled={saving}
                        className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button
                        onClick={() => saveCampaign('active')}
                        disabled={saving}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transform active:scale-95 transition-all ${saving
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-primary text-white hover:bg-[#4338CA]'
                            }`}
                    >
                        {saving ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Rocket size={16} />
                        )}
                        {saving ? 'Launching...' : '🚀 Launch Campaign'}
                    </button>
                </div>
            </div>

            {showUpgradeModal && (
                <UpgradePrompt
                    message={upgradeMessage}
                    onClose={() => setShowUpgradeModal(false)}
                    onUpgrade={() => {
                        setShowUpgradeModal(false);
                        if (onPageChange) onPageChange('Pricing');
                    }}
                />
            )}
        </div>
    );
};

export default NewCampaign;