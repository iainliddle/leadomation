import React, { useEffect, useState } from 'react';
import { Bell, Plus } from 'lucide-react';
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

            // Load profile data
            const { data } = await supabase
                .from('profiles')
                .select('first_name, last_name')
                .eq('id', user.id)
                .single();

            if (data?.first_name) {
                setHeaderFirstName(data.first_name);
                const fn = data.first_name || '';
                const ln = data.last_name || '';
                const displayName = fn + (ln ? ' ' + ln[0] + '.' : '');
                setUserName(displayName || userName);
                const newInitials = (fn[0] || '') + (ln[0] || '');
                setUserInitials(newInitials.toUpperCase() || '?');
            }
            if (data?.last_name) setHeaderLastName(data.last_name);
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
        <header className="sticky top-0 right-0 left-0 bg-white border-b border-[#E5E7EB] h-20 flex items-center justify-between px-8 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-[#111827]">{activePage}</h2>

            <div className="flex items-center gap-4">
                <div id="topbar-actions" className="flex items-center gap-4"></div>

                <button
                    onClick={onNewCampaign}
                    className="flex items-center gap-2 px-5 py-2 bg-[#2563EB] text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:transform active:scale-95"
                >
                    <Plus size={16} />
                    New Campaign
                </button>

                <div className="w-px h-8 bg-[#E5E7EB] mx-2"></div>

                <button
                    onClick={() => alert('You have no new notifications.')}
                    className="p-2 text-[#9CA3AF] hover:text-[#111827] relative transition-colors"
                >
                    <Bell size={22} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC2626] rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-2 group">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-[#111827]">{userName || 'User'}</span>
                        <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-tight">admin</span>
                    </div>
                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[#EFF6FF] text-[#2563EB] font-black border border-[#BFDBFE] shadow-sm transform group-hover:scale-105 transition-all cursor-pointer">
                        {headerAvatarUrl
                            ? <img src={headerAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : displayInitials}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;