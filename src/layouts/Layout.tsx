import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import PaymentFailedBar from '../components/PaymentFailedBar';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: (activePage: string) => React.ReactNode;
    activePage: string;
    onPageChange: (page: string) => void;
    userPlan?: string;
    stripeSubscriptionStatus?: string | null;
    canAccess: (feature: any) => boolean;
    triggerUpgrade: (feature: string, targetPlan?: 'starter' | 'pro') => void;
    isLoading?: boolean;
}

const SIDEBAR_WIDTH_EXPANDED = 240;
const SIDEBAR_WIDTH_COLLAPSED = 64;

const Layout: React.FC<LayoutProps> = ({ children, activePage, onPageChange, userPlan = 'free', stripeSubscriptionStatus, canAccess, triggerUpgrade, isLoading }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsedState] = useState(() => {
        try {
            return localStorage.getItem('sidebar-collapsed') === 'true';
        } catch {
            return false;
        }
    });

    const setIsCollapsed = (collapsed: boolean) => {
        setIsCollapsedState(collapsed);
        try {
            localStorage.setItem('sidebar-collapsed', String(collapsed));
        } catch {
            // ignore
        }
    };

    const sidebarWidth = isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex font-sans">
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
                isLoading={isLoading}
            />

            <div
                className="flex-1 main-content-area flex flex-col min-w-0"
                style={{
                    marginLeft: sidebarWidth,
                    transition: 'margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                <div className="lg:sticky lg:top-0 z-30 bg-[#F8F9FA]">
                    <div className="flex items-center">
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
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                    <PaymentFailedBar stripeSubscriptionStatus={stripeSubscriptionStatus || null} />
                </div>

                <main className="flex-1 overflow-y-auto">
                    <div className="w-full">
                        {children(activePage)}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
