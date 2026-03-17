import React, { useEffect, useState } from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TopBarProps {
    activePage: string;
    onNewCampaign?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ activePage, onNewCampaign }) => {
    const [userName, setUserName] = useState('');
    const [userInitials, setUserInitials] = useState('');
    const [headerAvatarUrl, setHeaderAvatarUrl] = useState<string | null>(null);
    const [headerFirstName, setHeaderFirstName] = useState('');
    const [headerLastName, setHeaderLastName] = useState('');

    useEffect(() => {
        // Load initial avatar from profiles table
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

            // Load profile data (profiles table has full_name, not first_name/last_name)
            const { data } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            if (data?.full_name) {
                const nameParts = data.full_name.split(' ');
                const fn = nameParts[0] || '';
                const ln = nameParts.slice(1).join(' ') || '';
                setHeaderFirstName(fn);
                setHeaderLastName(ln);
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

    const displayInitials = userInitials ||
        ((headerFirstName?.[0] || '') + (headerLastName?.[0] || '')).toUpperCase() || '?';

    return (
        <header className="sticky top-0 right-0 left-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10">
            <div>
                <h2 className="text-xl font-semibold text-gray-900 leading-tight">{activePage}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your leads and outreach campaigns</p>
            </div>

            <div className="flex items-center gap-3">
                <div id="topbar-actions" className="flex items-center gap-2 mr-1"></div>

                <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Search"
                >
                    <Search size={20} />
                </button>

                <button
                    onClick={() => alert('You have no new notifications.')}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 relative transition-colors"
                >
                    <Bell size={20} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-1 group cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 transition-colors">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900">{userName || 'User'}</span>
                        <span className="text-xs text-gray-400">Admin</span>
                    </div>
                    <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center bg-[#EEF2FF] text-[#4F46E5] font-semibold border border-[#E0E7FF] shrink-0">
                        {headerAvatarUrl
                            ? <img src={headerAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : displayInitials}
                    </div>
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>

                <button
                    onClick={onNewCampaign}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg font-medium text-sm hover:bg-[#4338CA] transition-all shadow-sm active:scale-95"
                >
                    <Plus size={16} />
                    New Campaign
                </button>
            </div>
        </header>
    );
};

export default TopBar;