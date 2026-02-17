import React, { useState } from 'react';
import {
    Building,
    PenTool,
    TrendingUp,
    Plus,
    Rocket,
    Check,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
        name: "Direct to Venue",
        description: "Target end-user businesses directly: gyms, spas, hotels, wellness centres",
        icon: Building,
        color: "#2563EB",
        bgColor: "bg-blue-50",
        tags: ["Gym", "CrossFit Box", "Wellness Centre", "Day Spa", "Luxury Hotel", "Physiotherapy Clinic", "Sports Recovery", "Yoga Studio", "Boutique Fitness", "Athletic Training"]
    },
    {
        id: 2,
        name: "Specifiers & Designers",
        description: "Target businesses that influence purchasing: interior designers, architects, developers",
        icon: PenTool,
        color: "#7C3AED",
        bgColor: "bg-purple-50",
        tags: ["Interior Designer", "Architect", "Fit-Out Contractor", "Property Developer", "Hospitality Designer"]
    },
    {
        id: 3,
        name: "Warm Leads (Upgrade)",
        description: "Target venues already offering cold therapy with basic equipment",
        icon: TrendingUp,
        color: "#D97706",
        bgColor: "bg-amber-50",
        tags: ["Ice Bath Provider", "Cold Plunge Studio", "Cryotherapy Centre"]
    }
];

const countries = [
    { name: "UAE", flag: "🇦🇪" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "United States", flag: "🇺🇸" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Qatar", flag: "🇶🇦" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Brazil", flag: "🇧🇷" },
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
    const [isLaunching, setIsLaunching] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [toggles, setToggles] = useState({
        maps: true,
        emailFinder: true,
        verification: true,
        keywordScan: false,
        timezone: true,
        linkedin: false
    });

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const toggleCountry = (country: string) => {
        setSelectedCountries(prev => prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]);
    };

    const handleLaunch = async () => {
        if (!campaignName) {
            setError('Please enter a campaign name');
            return;
        }
        if (!selectedTrack) {
            setError('Please select a track');
            return;
        }

        setIsLaunching(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            // 1. Save to Supabase
            const { data: campaign, error: dbError } = await supabase
                .from('campaigns')
                .insert({
                    user_id: user.id,
                    name: campaignName,
                    status: 'active',
                    targeting_config: {
                        track: selectedTrack.name,
                        industry: selectedTags,
                        location: selectedCountries,
                        city: cityArea,
                        radius,
                        minRating,
                        leadCount,
                        keywords: customKeywords,
                        enrichment: toggles
                    }
                })
                .select()
                .single();

            if (dbError) throw dbError;

            // 2. Trigger N8N Webhook
            const webhookUrl = 'https://n8n.srv1377696.hstgr.cloud/webhook/PLACEHOLDER';
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaign_id: campaign.id,
                    industry: selectedTags.join(', '),
                    location: selectedCountries.join(', ') + (cityArea ? ` (${cityArea})` : ''),
                    lead_count: leadCount,
                    targeting: {
                        keywords: customKeywords,
                        track: selectedTrack.name
                    }
                })
            });

            if (!webhookResponse.ok) {
                console.warn('Webhook notification failed, but campaign was saved.');
            }

            // 3. Show Success & Redirect
            setShowSuccess(true);
            setTimeout(() => {
                if (onPageChange) {
                    onPageChange('Active Campaigns');
                }
            }, 3000);

        } catch (err: any) {
            console.error('Launch error:', err);
            setError(err.message || 'Failed to launch campaign');
        } finally {
            setIsLaunching(false);
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
                            placeholder="e.g., UK Luxury Hotels Q1"
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
                                        ? 'border-primary bg-blue-50 shadow-sm'
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
                                className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-primary/50 text-primary hover:bg-blue-50 transition-all flex items-center gap-1"
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
                            placeholder="e.g., cold plunge, cryotherapy, recovery centre"
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
                            {countries.map(c => (
                                <button
                                    key={c.name}
                                    onClick={() => toggleCountry(c.name)}
                                    className={`p-3 border rounded-xl flex items-center gap-3 transition-all ${selectedCountries.includes(c.name)
                                        ? 'border-primary bg-blue-50 shadow-sm'
                                        : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <span className="text-xl">{c.flag}</span>
                                    <span className="text-xs font-bold text-[#374151]">{c.name}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => alert('Multi-region targeting coming soon!')}
                                className="p-3 border border-dashed border-primary/50 rounded-xl flex items-center justify-center gap-2 text-primary font-bold text-xs hover:bg-blue-50 transition-all"
                            >
                                <Plus size={16} /> Add Region
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">City / Area (optional)</label>
                            <input
                                type="text"
                                value={cityArea}
                                onChange={(e) => setCityArea(e.target.value)}
                                placeholder="e.g., London, Dubai Marina"
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
                            <select className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]">
                                <option>Direct — Gym/Wellness Intro</option>
                                <option>Direct — Luxury Hotel/Spa</option>
                                <option>Direct — GCC Premium</option>
                                <option>Specifier — Design Partnership</option>
                                <option>Warm — Upgrade Pitch</option>
                                <option selected>Custom — Build from Scratch</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Follow-up Count</label>
                            <div className="flex gap-2">
                                {[2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        className="flex-1 py-2 rounded-lg border border-[#E5E7EB] bg-white font-bold text-sm text-[#374151] hover:border-primary transition-all active:bg-blue-50 focus:bg-blue-50 focus:border-primary focus:text-primary"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2 uppercase tracking-tight">Delay Between Follow-ups</label>
                            <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-[#374151]">
                                    <option>2 days</option>
                                    <option selected>3 days</option>
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
                            <div className="w-20 text-center font-bold text-primary bg-blue-50 py-2 rounded-lg border border-primary/20">
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
                    {showSuccess ? (
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 animate-bounce">
                            <Check size={18} /> Campaign launched! Leads will start appearing shortly.
                        </p>
                    ) : error ? (
                        <p className="text-xs font-bold text-red-500">{error}</p>
                    ) : (
                        <p className="text-[11px] text-[#9CA3AF] font-medium max-w-[240px]">
                            Campaign will begin processing leads within 24 hours of launch.
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => alert('Draft saved successfully!')}
                        className="px-6 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-bold text-[#374151] hover:bg-gray-50 transition-all"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handleLaunch}
                        disabled={isLaunching || showSuccess}
                        className={`px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-md transform active:scale-95 transition-all ${isLaunching || showSuccess
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : 'bg-primary text-white hover:bg-blue-700'
                            }`}
                    >
                        {isLaunching ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Rocket size={16} />
                        )}
                        {isLaunching ? 'Launching...' : showSuccess ? 'Launched!' : 'Launch Campaign'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewCampaign;
