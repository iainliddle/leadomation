import React from 'react';
import { Lock } from 'lucide-react';

interface SidebarLockProps {
    hasAccess: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    tooltipText?: string;
}

const SidebarLock: React.FC<SidebarLockProps> = ({ hasAccess, children, onClick, tooltipText }) => {
    if (hasAccess) return <>{children}</>;

    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group"
        >
            <div className="opacity-50 pointer-events-none">
                {children}
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                <Lock size={12} className="text-[#9CA3AF]" />
            </div>
            {/* Hover Tooltip */}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
                <div className="bg-[#1F2937] text-white text-[11px] font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-1.5">
                    <Lock size={10} className="text-amber-400 shrink-0" />
                    {tooltipText || 'Upgrade to Pro to unlock'}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-[#1F2937]" />
                </div>
            </div>
        </div>
    );
};

export default SidebarLock;
