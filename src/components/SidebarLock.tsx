import React from 'react';
import { Lock } from 'lucide-react';

interface SidebarLockProps {
    hasAccess: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const SidebarLock: React.FC<SidebarLockProps> = ({ hasAccess, children, onClick }) => {
    if (hasAccess) return <>{children}</>;

    return (
        <div
            onClick={onClick}
            className="relative cursor-pointer group"
            title="Upgrade to unlock"
        >
            <div className="opacity-50 pointer-events-none">
                {children}
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity">
                <Lock size={12} className="text-[#9CA3AF]" />
            </div>
        </div>
    );
};

export default SidebarLock;
