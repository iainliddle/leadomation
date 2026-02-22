import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: (activePage: string) => React.ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
    userPlan?: string;
    canAccess: (feature: any) => boolean;
    triggerUpgrade: (feature: string, targetPlan?: 'starter' | 'pro') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePage, onPageChange, userPlan = 'free', canAccess, triggerUpgrade }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
            <Sidebar
                activePage={activePage}
                onPageChange={onPageChange}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                userPlan={userPlan}
                canAccess={canAccess}
                triggerUpgrade={triggerUpgrade}
            />

            <div
                className="flex-1 main-content-area flex flex-col min-w-0"
                style={{
                    transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <style>{`
                    @media (min-width: 1024px) {
                        .main-content-area {
                            margin-left: ${isCollapsed ? '72px' : '260px'};
                        }
                    }
                `}</style>
                <div className="flex items-center lg:sticky lg:top-0 z-30 bg-white">
                    <button
                        className="lg:hidden p-4 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1">
                        <TopBar
                            activePage={activePage}
                            onNewCampaign={() => onPageChange('New Campaign')}
                        />
                    </div>
                </div>

                <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
                    <div className="max-w-[1400px] mx-auto">
                        {children(activePage)}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
