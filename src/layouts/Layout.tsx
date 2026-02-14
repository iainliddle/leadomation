import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: (activePage: string) => React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [activePage, setActivePage] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex font-sans">
            <Sidebar
                activePage={activePage}
                onPageChange={setActivePage}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'} flex flex-col min-w-0`}>
                <div className="flex items-center lg:sticky lg:top-0 z-30 bg-white">
                    <button
                        className="lg:hidden p-4 text-[#9CA3AF] hover:text-[#111827] transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1">
                        <TopBar
                            title={activePage}
                            onNewCampaign={() => setActivePage('New Campaign')}
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
