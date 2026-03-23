import React, { useEffect, useState, useRef } from 'react';
import { Bell, Plus, Search, ChevronDown, Menu, User, Settings, LogOut, X, CreditCard, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';

interface TopBarProps {
    activePage: string;
    onNewCampaign?: () => void;
    onMenuClick?: () => void;
    onPageChange?: (page: string) => void;
}

interface SearchResult {
    id: string;
    type: 'lead' | 'campaign' | 'deal';
    title: string;
    subtitle: string;
}

// Page subtitle mapping
const PAGE_SUBTITLES: Record<string, string> = {
    'Dashboard': 'Overview of your outreach performance',
    'Global Demand': 'Discover high-intent prospects worldwide',
    'New Campaign': 'Create a new outreach campaign',
    'Active Campaigns': 'Monitor and manage your campaigns',
    'Lead Database': 'Manage and track all your leads',
    'Deal Pipeline': 'Track deals through your sales funnel',
    'Sequence Builder': 'Build automated outreach sequences',
    'Call Agent': 'AI-powered voice calling',
    'Inbox': 'Manage all your conversations',
    'Email Templates': 'Create reusable email templates',
    'Settings': 'Manage your account settings',
    'Integrations': 'Connect your tools and services',
    'Email Config': 'Configure email sending settings',
    'Compliance': 'Data privacy and compliance settings',
    'Pricing': 'Manage your subscription plan',
};

const TopBar: React.FC<TopBarProps> = ({ activePage, onNewCampaign, onMenuClick, onPageChange }) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userInitials, setUserInitials] = useState('');
    const [headerAvatarUrl, setHeaderAvatarUrl] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadAvatar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Set user email
            setUserEmail(user.email || '');

            // Set display name from user metadata as fallback
            const fullName = user.user_metadata?.full_name || user.email || '';
            const parts = fullName.split(' ');
            const first = parts[0] || '';
            const lastInitial = parts[1] ? parts[1][0] + '.' : '';
            setUserName(first + (lastInitial ? ' ' + lastInitial : ''));
            const initials = (first[0] || '') + (parts[1] ? parts[1][0] : '');
            setUserInitials(initials.toUpperCase() || '?');

            // Load profile data including avatar_url
            const { data } = await supabase
                .from('profiles')
                .select('full_name, first_name, last_name, avatar_url')
                .eq('id', user.id)
                .single();

            if (data) {
                // Use first_name/last_name if available, otherwise parse full_name
                const fn = data.first_name || (data.full_name ? data.full_name.split(' ')[0] : '') || '';
                const ln = data.last_name || (data.full_name ? data.full_name.split(' ').slice(1).join(' ') : '') || '';
                const displayName = fn + (ln ? ' ' + ln[0] + '.' : '');
                setUserName(displayName || userName);
                const newInitials = (fn[0] || '') + (ln[0] || '');
                setUserInitials(newInitials.toUpperCase() || '?');

                // Load avatar_url from profile
                if (data.avatar_url) {
                    setHeaderAvatarUrl(data.avatar_url);
                }
            }
        };
        loadAvatar();

        // Listen for avatar updates from Settings page
        const avatarHandler = (e: any) => setHeaderAvatarUrl(e.detail.url);
        window.addEventListener('avatarUpdated', avatarHandler);

        // Listen for profile name updates from Settings page
        const profileHandler = (e: any) => {
            const { firstName, lastName } = e.detail;
            const displayName = firstName + (lastName ? ' ' + lastName[0] + '.' : '');
            setUserName(displayName);
            const newInitials = (firstName[0] || '') + (lastName[0] || '');
            setUserInitials(newInitials.toUpperCase() || '?');
        };
        window.addEventListener('profileUpdated', profileHandler);

        return () => {
            window.removeEventListener('avatarUpdated', avatarHandler);
            window.removeEventListener('profileUpdated', profileHandler);
        };
    }, []);

    // Focus search input when modal opens
    useEffect(() => {
        if (showSearch && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showSearch]);

    // Handle search
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const searchTerm = `%${query.toLowerCase()}%`;

            // Search leads
            const { data: leads } = await supabase
                .from('leads')
                .select('id, company, first_name, last_name')
                .eq('user_id', user.id)
                .or(`company.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`)
                .limit(5);

            // Search campaigns
            const { data: campaigns } = await supabase
                .from('campaigns')
                .select('id, name, status')
                .eq('user_id', user.id)
                .ilike('name', searchTerm)
                .limit(5);

            // Search deals
            const { data: deals } = await supabase
                .from('deals')
                .select('id, name, company')
                .eq('user_id', user.id)
                .or(`name.ilike.${searchTerm},company.ilike.${searchTerm}`)
                .limit(5);

            const results: SearchResult[] = [
                ...(leads || []).map(l => ({
                    id: l.id,
                    type: 'lead' as const,
                    title: l.company || `${l.first_name || ''} ${l.last_name || ''}`.trim() || 'Unknown Lead',
                    subtitle: 'Lead'
                })),
                ...(campaigns || []).map(c => ({
                    id: c.id,
                    type: 'campaign' as const,
                    title: c.name || 'Unnamed Campaign',
                    subtitle: `Campaign · ${c.status || 'Draft'}`
                })),
                ...(deals || []).map(d => ({
                    id: d.id,
                    type: 'deal' as const,
                    title: d.name || d.company || 'Unnamed Deal',
                    subtitle: 'Deal'
                }))
            ];

            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchResultClick = (result: SearchResult) => {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);

        if (onPageChange) {
            switch (result.type) {
                case 'lead':
                    onPageChange('Lead Database');
                    break;
                case 'campaign':
                    onPageChange('Active Campaigns');
                    break;
                case 'deal':
                    onPageChange('Deal Pipeline');
                    break;
            }
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const displayInitials = userInitials || '?';

    return (
        <header className="sticky top-0 right-0 left-0 bg-[#F8F9FA] h-16 flex items-center justify-between px-6 z-10">
            {/* Left side: Mobile menu + Page title */}
            <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                <div>
                    <h1 className="text-xl font-semibold text-gray-900 leading-tight">{activePage}</h1>
                    <p className="text-sm text-gray-500 mt-0.5 hidden sm:block">
                        {PAGE_SUBTITLES[activePage] || 'Manage your leads and outreach campaigns'}
                    </p>
                </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2">
                {/* TopBar actions portal target */}
                <div id="topbar-actions" className="flex items-center gap-2"></div>

                {/* Search button */}
                <button
                    onClick={() => setShowSearch(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Search"
                >
                    <Search size={20} />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 relative transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="p-4">
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <Bell size={20} className="text-gray-300" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-500">No new notifications</p>
                                        <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                {/* User profile */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-1 pr-2 py-1 group cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900">{userName || 'User'}</span>
                            <span className="text-[11px] text-gray-400">Admin</span>
                        </div>
                        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF] shrink-0">
                            {headerAvatarUrl
                                ? <img src={headerAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                : displayInitials}
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 hidden sm:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                                    <p className="text-xs text-gray-400 truncate">{userEmail || 'No email'}</p>
                                </div>
                                <button
                                    onClick={() => { setShowUserMenu(false); onPageChange?.('Settings'); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                >
                                    <User size={16} className="text-gray-400" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); onPageChange?.('Pricing'); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                >
                                    <CreditCard size={16} className="text-gray-400" />
                                    Pricing & Plans
                                </button>
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                                    >
                                        <LogOut size={16} />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                {/* New Campaign button */}
                <button
                    onClick={onNewCampaign}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-medium text-sm hover:bg-[#4338CA] transition-all shadow-sm active:scale-95"
                >
                    <Plus size={16} />
                    New Campaign
                </button>

                {/* Mobile new campaign button */}
                <button
                    onClick={onNewCampaign}
                    className="sm:hidden p-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-all shadow-sm active:scale-95"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Search Modal */}
            {showSearch && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-150"
                        onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                    />
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <Search size={20} className="text-gray-400 shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search leads, campaigns, deals..."
                                className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
                            />
                            {isSearching && <Loader2 size={16} className="text-gray-400 animate-spin" />}
                            <button
                                onClick={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <div className="py-2">
                                    {searchResults.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => handleSearchResultClick(result)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                result.type === 'lead' ? 'bg-blue-50 text-blue-600' :
                                                result.type === 'campaign' ? 'bg-purple-50 text-purple-600' :
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {result.type === 'lead' ? <User size={16} /> :
                                                 result.type === 'campaign' ? <Settings size={16} /> :
                                                 <CreditCard size={16} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                                                <p className="text-xs text-gray-400">{result.subtitle}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : searchQuery.trim() && !isSearching ? (
                                <div className="py-8 text-center">
                                    <Search size={32} className="mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm font-medium text-gray-500">No results found</p>
                                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                                </div>
                            ) : !searchQuery.trim() ? (
                                <div className="py-8 text-center">
                                    <Search size={32} className="mx-auto text-gray-200 mb-3" />
                                    <p className="text-sm font-medium text-gray-500">Search across your data</p>
                                    <p className="text-xs text-gray-400 mt-1">Find leads, campaigns, and deals by name or company</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default TopBar;
