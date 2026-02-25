import React, { useEffect, useState } from 'react';
import { Bell, ChevronDown, Download, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TopBarProps {
    activePage: string;
    onNewCampaign?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ activePage, onNewCampaign }) => {
    const [userName, setUserName] = useState('');
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const fullName = user.user_metadata?.full_name || user.email || '';
                const parts = fullName.split(' ');
                const first = parts[0] || '';
                const lastInitial = parts[1] ? parts[1][0] + '.' : '';
                setUserName(first + (lastInitial ? ' ' + lastInitial : ''));
                const initials = (first[0] || '') + (parts[1] ? parts[1][0] : '');
                setUserInitials(initials.toUpperCase() || '?');
            }
        };
        getUser();
    }, []);

    return (
        <header className="sticky top-0 right-0 left-0 bg-white border-b border-[#E5E7EB] h-20 flex items-center justify-between px-8 z-10 shadow-sm">
            <h2 className="text-xl font-bold text-[#111827]">{activePage}</h2>

            <div className="flex items-center gap-4">
                <div
                    onClick={() => alert('Date range filtering coming soon!')}
                    className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-sm text-[#374151] font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                >
                    <span>Jan 1, 2024 - Feb 1, 2024</span>
                    <ChevronDown size={16} className="text-[#9CA3AF]" />
                </div>

                <button
                    onClick={() => alert('Exporting functionality coming soon!')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-lg font-bold text-sm text-[#374151] hover:bg-gray-50 transition-colors"
                >
                    <Download size={16} />
                    Export
                </button>

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
                    <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] font-black border border-[#BFDBFE] shadow-sm transform group-hover:scale-105 transition-all cursor-pointer">
                        {userInitials || '?'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;