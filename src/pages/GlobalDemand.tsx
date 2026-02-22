import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { supabase } from '../lib/supabase';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup
} from 'react-simple-maps';
import {
    Globe,
    Search,
    TrendingUp,
    Building2,
    MapPin,
    ArrowRight,
    Loader2,
    ChevronDown,
    Sparkles,
    Filter,
    BarChart3,
    Zap,
    Info,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from 'lucide-react';

interface GlobalDemandProps {
    onPageChange: (page: string) => void;
}

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const INDUSTRIES = [
    'Cold Water Therapy', 'Spas & Wellness', 'Hotels & Hospitality',
    'Gyms & Fitness', 'Restaurants & Cafes', 'Real Estate Agencies',
    'Dental Practices', 'Law Firms', 'Accounting Firms', 'Auto Dealerships',
    'Insurance Agencies', 'Home Services', 'Marketing Agencies', 'IT Services',
    'Construction', 'Medical Practices', 'Veterinary Clinics', 'Beauty Salons',
    'Education & Tutoring', 'Retail Stores'
];

const COUNTRIES = [
    { name: 'United Kingdom', code: 2826, flag: '🇬🇧' },
    { name: 'United States', code: 2840, flag: '🇺🇸' },
    { name: 'UAE', code: 2784, flag: '🇦🇪' },
    { name: 'Australia', code: 2036, flag: '🇦🇺' },
    { name: 'Canada', code: 2124, flag: '🇨🇦' },
    { name: 'Germany', code: 2276, flag: '🇩🇪' },
    { name: 'France', code: 2250, flag: '🇫🇷' },
    { name: 'Saudi Arabia', code: 2682, flag: '🇸🇦' },
    { name: 'Singapore', code: 2702, flag: '🇸🇬' },
    { name: 'Ireland', code: 2372, flag: '🇮🇪' },
    { name: 'Netherlands', code: 2528, flag: '🇳🇱' },
    { name: 'Sweden', code: 2752, flag: '🇸🇪' },
    { name: 'Norway', code: 2578, flag: '🇳🇴' },
    { name: 'Denmark', code: 2208, flag: '🇩🇰' },
    { name: 'Qatar', code: 2634, flag: '🇶🇦' },
    { name: 'India', code: 2356, flag: '🇮🇳' },
    { name: 'South Africa', code: 2710, flag: '🇿🇦' },
];

const LOCATION_CODES: Record<string, number> = {
    'United Kingdom': 2826,
    'United States': 2840,
    'UAE': 2784,
    'Australia': 2036,
    'Canada': 2124,
    'Germany': 2276,
    'France': 2250,
    'Saudi Arabia': 2682,
    'Singapore': 2702,
    'Ireland': 2372,
    'Netherlands': 2528,
    'Sweden': 2752,
    'Norway': 2578,
    'Denmark': 2208,
    'Qatar': 2634,
    'India': 2356,
    'South Africa': 2710,
};

interface RegionData {
    id: string;
    name: string;
    subregion: string;
    lat: number;
    lng: number;
    businesses: number;
    growth: number;
    topCities: string[];
}


const getDotColor = (businesses: number, maxBusinesses: number): string => {
    const ratio = businesses / maxBusinesses;
    if (ratio > 0.7) return '#EF4444';
    if (ratio > 0.4) return '#F59E0B';
    if (ratio > 0.2) return '#3B82F6';
    return '#6366F1';
};

const getDotSize = (businesses: number, maxBusinesses: number): number => {
    const ratio = businesses / maxBusinesses;
    return 5 + ratio * 14;
};

const getHeatLabel = (businesses: number, maxBusinesses: number): string => {
    const ratio = businesses / maxBusinesses;
    if (ratio > 0.7) return 'Very High';
    if (ratio > 0.4) return 'High';
    if (ratio > 0.2) return 'Moderate';
    return 'Emerging';
};

const MapChart = memo(({
    regionData,
    maxBusinesses,
    hoveredRegion,
    selectedRegion,
    setHoveredRegion,
    setSelectedRegion,
    position,
    setPosition
}: {
    regionData: RegionData[];
    maxBusinesses: number;
    hoveredRegion: RegionData | null;
    selectedRegion: RegionData | null;
    setHoveredRegion: (r: RegionData | null) => void;
    setSelectedRegion: (r: RegionData | null) => void;
    position: { coordinates: [number, number]; zoom: number };
    setPosition: (p: { coordinates: [number, number]; zoom: number }) => void;
}) => {
    return (
        <ComposableMap
            projectionConfig={{
                rotate: [-10, 0, 0],
                scale: 147
            }}
            style={{ width: '100%', height: '100%' }}
        >
            <ZoomableGroup
                center={position.coordinates}
                zoom={position.zoom}
                onMoveEnd={(pos: any) => setPosition(pos)}
                minZoom={1}
                maxZoom={8}
            >
                <Geographies geography={GEO_URL}>
                    {({ geographies }: { geographies: any[] }) =>
                        geographies.map((geo: any) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#F1F5F9"
                                stroke="#E2E8F0"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: 'none' },
                                    hover: { fill: '#E2E8F0', outline: 'none' },
                                    pressed: { outline: 'none' }
                                }}
                            />
                        ))
                    }
                </Geographies>

                {regionData.map((region) => {
                    const color = getDotColor(region.businesses, maxBusinesses);
                    const rawSize = getDotSize(region.businesses, maxBusinesses);
                    const size = rawSize / Math.sqrt(position.zoom);
                    const isHovered = hoveredRegion?.id === region.id;
                    const isSelected = selectedRegion?.id === region.id;
                    const scale = isHovered || isSelected ? 1.3 : 1;

                    return (
                        <Marker
                            key={region.id}
                            coordinates={[region.lng, region.lat]}
                            onMouseEnter={() => setHoveredRegion(region)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            onClick={() => setSelectedRegion(region)}
                            className="cursor-pointer"
                        >
                            {/* Outer pulse ring */}
                            <circle
                                r={size * 0.8}
                                fill={color}
                                fillOpacity={0.15}
                                stroke={color}
                                strokeWidth={1.5}
                                strokeOpacity={0.3}
                            >
                                <animate
                                    attributeName="r"
                                    from={size * 0.5}
                                    to={size * 1.2}
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="fill-opacity"
                                    from="0.2"
                                    to="0"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-opacity"
                                    from="0.4"
                                    to="0"
                                    dur="2s"
                                    repeatCount="indefinite"
                                />
                            </circle>
                            {/* Glow */}
                            <circle
                                r={size * 0.4 * scale}
                                fill={color}
                                fillOpacity={0.1}
                            />
                            {/* Main dot */}
                            <circle
                                r={size * 0.35 * scale}
                                fill={color}
                                fillOpacity={0.85}
                                stroke="white"
                                strokeWidth={1.5}
                                filter={isHovered || isSelected ? 'url(#glow)' : undefined}
                            />
                            {/* Label */}
                            {(isHovered || isSelected) && (
                                <text
                                    textAnchor="middle"
                                    y={-size * 0.55 - 6}
                                    style={{
                                        fontSize: `${Math.max(8, 10 / Math.sqrt(position.zoom))}px`,
                                        fontWeight: 700,
                                        fill: '#374151',
                                        paintOrder: 'stroke',
                                        stroke: 'white',
                                        strokeWidth: 3,
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round'
                                    }}
                                >
                                    {region.name}
                                </text>
                            )}
                            {/* Business count badge */}
                            {(isHovered || isSelected) && (
                                <text
                                    textAnchor="middle"
                                    y={size * 0.5 + 12}
                                    style={{
                                        fontSize: `${Math.max(7, 9 / Math.sqrt(position.zoom))}px`,
                                        fontWeight: 800,
                                        fill: color,
                                        paintOrder: 'stroke',
                                        stroke: 'white',
                                        strokeWidth: 3,
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round'
                                    }}
                                >
                                    {region.businesses.toLocaleString()} businesses
                                </text>
                            )}
                        </Marker>
                    );
                })}
            </ZoomableGroup>

            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </ComposableMap>
    );
});

const GlobalDemand: React.FC<GlobalDemandProps> = ({ onPageChange }) => {
    const [activeTab, setActiveTab] = useState<'density' | 'search'>('density');
    const [selectedIndustry, setSelectedIndustry] = useState('Cold Water Therapy');
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
    const [keywordInput, setKeywordInput] = useState('');
    const [keywordResults, setKeywordResults] = useState<any[]>([]);
    const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
    const [keywordError, setKeywordError] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: number; flag: string }>({ name: 'United Kingdom', code: 2826, flag: '🇬🇧' });
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearchQuery, setCountrySearchQuery] = useState('');
    const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
        coordinates: [0, 20],
        zoom: 1
    });

    const [regionData, setRegionData] = useState<RegionData[]>([]);
    const [isLoadingDensity, setIsLoadingDensity] = useState(false);

    useEffect(() => {
        const fetchDemandData = async () => {
            setIsLoadingDensity(true);
            setSelectedRegion(null);
            try {
                const { data, error } = await supabase
                    .from('demand_data')
                    .select('*')
                    .eq('industry', selectedIndustry);

                if (error) {
                    console.error('Error fetching demand data:', error);
                    setRegionData([]);
                    return;
                }

                if (data && data.length > 0) {
                    const mapped: RegionData[] = data.map((row: any) => ({
                        id: row.region_id,
                        name: row.region_name,
                        subregion: row.subregion || '',
                        lat: row.lat,
                        lng: row.lng,
                        businesses: row.business_count || 0,
                        growth: row.growth_rate || 0,
                        topCities: row.top_cities || []
                    }));
                    setRegionData(mapped);
                } else {
                    setRegionData([]);
                }
            } catch (err) {
                console.error('Failed to fetch demand data:', err);
                setRegionData([]);
            } finally {
                setIsLoadingDensity(false);
            }
        };

        fetchDemandData();
    }, [selectedIndustry]);
    const maxBusinesses = useMemo(() => regionData.length > 0 ? Math.max(...regionData.map(r => r.businesses)) : 0, [regionData]);
    const totalBusinesses = useMemo(() => regionData.reduce((sum, r) => sum + r.businesses, 0), [regionData]);
    const topRegion = useMemo(() => regionData.length > 0 ? regionData.reduce((max, r) => r.businesses > max.businesses ? r : max, regionData[0]) : { name: 'N/A', businesses: 0 }, [regionData]);

    const sortedRegions = useMemo(() =>
        [...regionData].sort((a, b) => b.businesses - a.businesses),
        [regionData]
    );

    const filteredIndustries = INDUSTRIES.filter(i =>
        i.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleIndustrySelect = useCallback((industry: string) => {
        setIsSearching(true);
        setSelectedIndustry(industry);
        setShowIndustryDropdown(false);
        setSearchQuery('');
        setSelectedRegion(null);
        setTimeout(() => setIsSearching(false), 600);
    }, []);

    const handleLaunchCampaign = useCallback(() => {
        onPageChange('New Campaign');
    }, [onPageChange]);

    const handleZoomIn = () => {
        setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.5, 8) }));
    };

    const handleZoomOut = () => {
        setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.5, 1) }));
    };

    const handleKeywordSearch = async () => {
        if (!keywordInput.trim()) return;

        // Parse comma-separated keywords
        const keywordList = keywordInput
            .split(',')
            .map(k => k.trim())
            .filter(k => k.length > 0)
            .slice(0, 10);

        if (keywordList.length === 0) return;

        setIsLoadingKeywords(true);
        setKeywordError('');
        setKeywordResults([]);

        try {
            // Check plan limits
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setKeywordError('Please sign in to perform searches.');
                setIsLoadingKeywords(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('plan')
                .eq('id', user.id)
                .single();

            if (profile?.plan === 'starter') {
                // Count searches this month
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const { count } = await supabase
                    .from('demand_data')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('searched_at', startOfMonth.toISOString());

                if ((count || 0) >= 50) {
                    setKeywordError('Monthly limit reached: Starter plan includes 50 keyword searches/month. Upgrade to Pro for unlimited searches.');
                    setIsLoadingKeywords(false);
                    return;
                }
            }

            const locationCode = LOCATION_CODES[selectedCountry.name] || 2826;

            const response = await fetch('/api/keyword-search-volume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    keywords: keywordList,
                    location_code: locationCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setKeywordError(data.error || 'Something went wrong. Please try again.');
                return;
            }

            setKeywordResults(data.results || []);

            // Track usage in Supabase (increment keyword search count)
            if (user) {
                await supabase.from('demand_data').insert({
                    user_id: user.id,
                    keywords: keywordList,
                    location: selectedCountry.name,
                    searched_at: new Date().toISOString(),
                });
            }

        } catch (err) {
            console.error('Keyword search error:', err);
            setKeywordError('Network error. Please try again.');
        } finally {
            setIsLoadingKeywords(false);
        }
    };

    const handleReset = () => {
        setPosition({ coordinates: [0, 20], zoom: 1 });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#4338CA] flex items-center justify-center">
                            <Globe size={16} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-[#111827] tracking-tight">Global Demand Map</h1>
                    </div>
                    <p className="text-sm text-[#6B7280] font-medium">Discover high-demand markets and launch targeted campaigns in seconds</p>
                </div>

                {/* Industry Selector */}
                <div className="relative w-full md:w-[320px]">
                    <button
                        onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] hover:border-indigo-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-[#4F46E5]" />
                            <span>{selectedIndustry}</span>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showIndustryDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowIndustryDropdown(false)} />
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 max-h-[320px] overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search industries..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-indigo-300"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="overflow-y-auto max-h-[250px]">
                                    {filteredIndustries.map((industry) => (
                                        <button
                                            key={industry}
                                            onClick={() => handleIndustrySelect(industry)}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${industry === selectedIndustry
                                                ? 'bg-blue-50 text-blue-600 font-bold'
                                                : 'text-[#374151] hover:bg-gray-50'
                                                }`}
                                        >
                                            {industry}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab('density')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'density'
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Building2 size={14} />
                        Business Density
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('search')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'search'
                        ? 'bg-white text-[#111827] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <Search size={14} />
                        Search Demand
                    </span>
                </button>
            </div>

            {activeTab === 'density' && (
                <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 size={14} className="text-[#4F46E5]" />
                                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Total Businesses</span>
                            </div>
                            <p className="text-2xl font-black text-[#111827]">{totalBusinesses.toLocaleString()}</p>
                            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">across {regionData.length} regions</p>
                        </div>
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Hottest Market</span>
                            </div>
                            <p className="text-2xl font-black text-[#111827]">{topRegion.name}</p>
                            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">{topRegion.businesses.toLocaleString()} businesses</p>
                        </div>
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-purple-500" />
                                <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Industry</span>
                            </div>
                            <p className="text-2xl font-black text-[#111827] truncate">{selectedIndustry}</p>
                            <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">selected sector</p>
                        </div>
                    </div>

                    {/* Map + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

                        {/* Map */}
                        <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all relative">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Globe size={16} className="text-[#4F46E5]" />
                                    <h3 className="text-sm font-black text-[#111827] uppercase tracking-wide">Business Density Map</h3>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
                                        <span>Emerging</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                                        <span>Moderate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                                        <span>High</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                                        <span>Very High</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative" style={{ height: '480px', background: '#FAFBFD' }}>
                                {isSearching && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                            <span className="text-sm font-bold text-[#6B7280]">Analysing global demand...</span>
                                        </div>
                                    </div>
                                )}

                                {isLoadingDensity && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                            <span className="text-sm font-bold text-[#6B7280]">Loading business density data...</span>
                                        </div>
                                    </div>
                                )}

                                <MapChart
                                    regionData={regionData}
                                    maxBusinesses={maxBusinesses}
                                    hoveredRegion={hoveredRegion}
                                    selectedRegion={selectedRegion}
                                    setHoveredRegion={setHoveredRegion}
                                    setSelectedRegion={setSelectedRegion}
                                    position={position}
                                    setPosition={setPosition}
                                />

                                {/* Zoom Controls */}
                                <div className="absolute bottom-4 left-4 flex flex-col gap-1 z-10">
                                    <button
                                        onClick={handleZoomIn}
                                        className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-all shadow-sm"
                                    >
                                        <ZoomIn size={14} />
                                    </button>
                                    <button
                                        onClick={handleZoomOut}
                                        className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-all shadow-sm"
                                    >
                                        <ZoomOut size={14} />
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-300 transition-all shadow-sm"
                                    >
                                        <RotateCcw size={14} />
                                    </button>
                                </div>

                                {/* Hover tooltip */}
                                {hoveredRegion && !selectedRegion && (
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg z-10 min-w-[220px] animate-in fade-in zoom-in duration-200">
                                        <p className="text-xs font-black text-[#111827] mb-1">{hoveredRegion.name}</p>
                                        <p className="text-[10px] text-[#9CA3AF] font-medium mb-2">{hoveredRegion.subregion}</p>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-lg font-black text-[#111827]">{hoveredRegion.businesses.toLocaleString()}</p>
                                                <p className="text-[10px] text-[#9CA3AF] font-medium">businesses</p>
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-emerald-600">+{hoveredRegion.growth}%</p>
                                                <p className="text-[10px] text-[#9CA3AF] font-medium">growth</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Region List */}
                        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <BarChart3 size={16} className="text-blue-500" />
                                    <h3 className="text-sm font-black text-[#111827] uppercase tracking-wide">Top Markets</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[460px]">
                                {sortedRegions.map((region, index) => {
                                    const isSelected = selectedRegion?.id === region.id;
                                    const barWidth = (region.businesses / maxBusinesses) * 100;

                                    return (
                                        <button
                                            key={region.id}
                                            onClick={() => setSelectedRegion(isSelected ? null : region)}
                                            className={`w-full text-left px-5 py-3.5 border-b border-gray-50 transition-all hover:bg-gray-50/80 ${isSelected ? 'bg-indigo-50/80 border-l-2 border-l-[#4F46E5]' : ''}`}
                                        >
                                            <div className="flex items-center justify-between mb-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-[#9CA3AF] w-5">{index + 1}.</span>
                                                    <span className="text-xs font-bold text-[#111827]">{region.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-7">
                                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${barWidth}%`,
                                                            backgroundColor: getDotColor(region.businesses, maxBusinesses)
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-[#6B7280] w-12 text-right">
                                                    {region.businesses >= 1000 ? `${(region.businesses / 1000).toFixed(1)}k` : region.businesses}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Selected Region Detail */}
                    {selectedRegion && (
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-6 animate-in slide-in-from-bottom-4 fade-in duration-300">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: getDotColor(selectedRegion.businesses, maxBusinesses) + '15' }}
                                        >
                                            <MapPin size={18} style={{ color: getDotColor(selectedRegion.businesses, maxBusinesses) }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-[#111827]">{selectedRegion.name}</h3>
                                            <p className="text-xs text-[#9CA3AF] font-medium">{selectedRegion.subregion} · {selectedIndustry}</p>
                                        </div>
                                        <span
                                            className="ml-2 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                                            style={{
                                                backgroundColor: getDotColor(selectedRegion.businesses, maxBusinesses) + '15',
                                                color: getDotColor(selectedRegion.businesses, maxBusinesses)
                                            }}
                                        >
                                            {getHeatLabel(selectedRegion.businesses, maxBusinesses)} Demand
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mt-4">
                                        <div>
                                            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Businesses Found</p>
                                            <p className="text-xl font-black text-[#111827]">{selectedRegion.businesses.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Top Cities</p>
                                            <p className="text-sm font-bold text-[#374151]">{selectedRegion.topCities.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleLaunchCampaign()}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white text-sm font-bold rounded-xl hover:from-[#4338CA] hover:to-[#3730A3] transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
                                    >
                                        <Zap size={16} />
                                        Launch Campaign
                                        <ArrowRight size={14} />
                                    </button>
                                    <p className="text-[10px] text-[#9CA3AF] font-medium text-center">
                                        Target {selectedRegion.businesses.toLocaleString()} businesses in {selectedRegion.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-5 py-4 bg-[#EEF2FF]/80 border border-indigo-100 rounded-xl">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs text-[#3730A3] font-medium leading-relaxed">
                            <span className="font-bold">How it works:</span> Select your target industry, explore demand hotspots across the globe, then click "Launch Campaign" to start scraping leads and building your outreach sequence for that market. Data is sourced from Google Places, company registries, and aggregated platform intelligence. Growth trend data will be available after 6 months of data collection to show accurate year-over-year market changes.
                        </p>
                    </div>
                </>
            )}

            {activeTab === 'search' && (
                <>
                    {/* Search Input */}
                    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                            <Search size={16} className="text-[#4F46E5]" />
                            <h3 className="text-sm font-black text-[#111827] uppercase tracking-wide">Keyword Search Volume</h3>
                        </div>
                        <p className="text-xs text-[#6B7280] font-medium mb-4">Enter up to 10 keywords separated by commas and select a target market to see real Google search volume data</p>

                        <div className="flex flex-col gap-3">
                            {/* Keywords + Country row */}
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. ice bath, cold plunge pool, commercial ice bath, cold water therapy"
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
                                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Country Selector */}
                                <div className="relative w-[220px]">
                                    <button
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] hover:border-indigo-300 transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{selectedCountry.flag}</span>
                                            <span>{selectedCountry.name}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showCountryDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setShowCountryDropdown(false)} />
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 max-h-[280px] overflow-hidden">
                                                <div className="p-2 border-b border-gray-100">
                                                    <input
                                                        type="text"
                                                        placeholder="Search countries..."
                                                        value={countrySearchQuery}
                                                        onChange={(e) => setCountrySearchQuery(e.target.value)}
                                                        className="w-full px-3 py-2 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-indigo-300"
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="overflow-y-auto max-h-[220px]">
                                                    {COUNTRIES.filter(c => c.name.toLowerCase().includes(countrySearchQuery.toLowerCase())).map((country) => (
                                                        <button
                                                            key={country.code}
                                                            onClick={() => {
                                                                setSelectedCountry(country);
                                                                setShowCountryDropdown(false);
                                                                setCountrySearchQuery('');
                                                            }}
                                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-2 ${country.code === selectedCountry.code
                                                                ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold'
                                                                : 'text-[#374151] hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <span className="text-base">{country.flag}</span>
                                                            <span>{country.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handleKeywordSearch}
                                    disabled={isLoadingKeywords || !keywordInput.trim()}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoadingKeywords ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Analysing...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                            </svg>
                                            Analyse
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {keywordError && (
                            <p className="text-xs text-red-500 font-medium mt-2">{keywordError}</p>
                        )}
                    </div>

                    {/* Results */}
                    {keywordResults.length > 0 && (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin size={14} className="text-[#4F46E5]" />
                                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Target Market</span>
                                    </div>
                                    <p className="text-2xl font-black text-[#111827]">{selectedCountry.flag} {selectedCountry.name}</p>
                                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5">{keywordResults.length} keywords analysed</p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Total Monthly Searches</span>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-600">
                                        {keywordResults.reduce((sum: number, k: any) => sum + (k.search_volume || 0), 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={14} className="text-amber-500" />
                                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Top Keyword</span>
                                    </div>
                                    <p className="text-lg font-black text-[#111827] truncate">
                                        {keywordResults.reduce((max: any, k: any) => (k.search_volume || 0) > (max.search_volume || 0) ? k : max, keywordResults[0])?.keyword}
                                    </p>
                                </div>
                                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 size={14} className="text-purple-500" />
                                        <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Avg CPC</span>
                                    </div>
                                    <p className="text-2xl font-black text-[#111827]">
                                        £{(keywordResults.reduce((sum: number, k: any) => sum + (k.cpc || 0), 0) / keywordResults.length).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Results Table */}
                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-[#111827] uppercase tracking-tight mb-4">
                                    Search Volume Results — {selectedCountry.name}
                                </h3>
                                <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                                            <tr>
                                                <th className="text-left px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide">Keyword</th>
                                                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide">Monthly Searches</th>
                                                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide">Competition</th>
                                                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide">CPC</th>
                                                <th className="text-right px-4 py-3 text-xs font-bold text-[#6B7280] uppercase tracking-wide">Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F3F4F6]">
                                            {keywordResults.map((result, index) => (
                                                <tr key={index} className="hover:bg-[#F9FAFB] transition-colors">
                                                    <td className="px-4 py-3 font-semibold text-[#111827]">{result.keyword}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className="font-bold text-[#4F46E5]">
                                                            {result.search_volume.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold ${result.competition_level === 'HIGH' ? 'bg-red-100 text-red-600' :
                                                            result.competition_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-green-100 text-green-600'
                                                            }`}>
                                                            {result.competition_level}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-[#374151] font-medium">
                                                        {result.cpc > 0 ? `£${result.cpc.toFixed(2)}` : '—'}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {result.monthly_searches && result.monthly_searches.length > 0 ? (
                                                            <div className="flex items-center justify-end gap-0.5">
                                                                {result.monthly_searches.slice(-6).map((m: any, i: number) => {
                                                                    const max = Math.max(...result.monthly_searches.map((x: any) => x.search_volume));
                                                                    const height = max > 0 ? Math.max(4, Math.round((m.search_volume / max) * 20)) : 4;
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className="w-1.5 bg-[#4F46E5] rounded-sm opacity-70"
                                                                            style={{ height: `${height}px` }}
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                        ) : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-start gap-3 px-5 py-4 bg-[#EEF2FF]/80 border border-indigo-100 rounded-xl">
                        <Info size={16} className="text-[#4F46E5] mt-0.5 shrink-0" />
                        <p className="text-xs text-[#3730A3] font-medium leading-relaxed">
                            <span className="font-bold">Search Demand Intelligence:</span> Enter keywords related to your target niche to see real Google search volume data. Use this to identify high-demand keywords, understand seasonal trends, and find opportunities your competitors might be missing. Data powered by Google Ads via DataForSEO.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default GlobalDemand;
