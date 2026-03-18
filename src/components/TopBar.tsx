import React, { useEffect, useState } from 'react';
import { Bell, Plus, Search, Calendar, ChevronDown, Menu, User, Settings, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';

interface TopBarProps {
    activePage: string;
    onNewCampaign?: () => void;
    onMenuClick?: () => void;
}

// Page subtitle mapping
const PAGE_SUBTITLES: Record<string, string> = {
    'Dashboard': 'Overview of your outreach performance',
    'Global Demand': 'Discover high-intent prospects worldwide',
    'New Campaign': 'Create a new outreach campaign',
    'Active Campaigns': 'Monitor and manage your campaigns',
    'Lead Database': 'Manage and track all your leads',
    'Deal Pipeline': 'Track deals through your sales funnel',
    'Sequence Builder': 'Build automated email sequences',
    'Call Agent': 'AI-powered voice calling',
    'Inbox': 'Manage all your conversations',
    'Email Templates': 'Create reusable email templates',
    'Settings': 'Manage your account settings',
    'Integrations': 'Connect your tools and services',
    'Email Config': 'Configure email sending settings',
    'Compliance': 'Data privacy and compliance settings',
    'Pricing': 'Manage your subscription plan',
};

const TopBar: React.FC<TopBarProps> = ({ activePage, onNewCampaign, onMenuClick }) => {
    const [userName, setUserName] = useState('');
    const [userInitials, setUserInitials] = useState('');
    const [headerAvatarUrl, setHeaderAvatarUrl] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const loadAvatar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Set display name from user metadata as fallback
            const fullName = user.user_metadata?.full_name || user.email || '';
            const parts = fullName.split(' ');
            const first = parts[0] || '';
            const lastInitial = parts[1] ? parts[1][0] + '.' : '';
            setUserName(first + (lastInitial ? ' ' + lastInitial : ''));
            const initials = (first[0] || '') + (parts[1] ? parts[1][0] : '');
            setUserInitials(initials.toUpperCase() || '?');

            // Load profile data
            const { data } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (data?.full_name) {
                const nameParts = data.full_name.split(' ');
                const fn = nameParts[0] || '';
                const ln = nameParts.slice(1).join(' ') || '';
                const displayName = fn + (ln ? ' ' + ln[0] + '.' : '');
                setUserName(displayName || userName);
                const newInitials = (fn[0] || '') + (ln[0] || '');
                setUserInitials(newInitials.toUpperCase() || '?');
            }
        };
        loadAvatar();

        // Listen for avatar updates from Settings page
        const handler = (e: any) => setHeaderAvatarUrl(e.detail.url);
        window.addEventListener('avatarUpdated', handler);
        return () => window.removeEventListener('avatarUpdated', handler);
    }, []);

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
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Search"
                >
                    <Search size={20} />
                </button>

                {/* Date range button - hidden on small screens */}
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-gray-700">Last 30 days</span>
                    <ChevronDown size={14} className="text-gray-400" />
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
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                                    <p className="text-xs text-gray-400">Admin</p>
                                </div>
                                <button
                                    onClick={() => { setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                >
                                    <User size={16} className="text-gray-400" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => { setShowUserMenu(false); }}
                                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2.5"
                                >
                                    <Settings size={16} className="text-gray-400" />
                                    Settings
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
        </header>
    );
};

export default TopBar;
