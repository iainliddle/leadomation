import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    LayoutGrid,
    Globe,
    PlusCircle,
    PlayCircle,
    Users,
    Mail,
    FileText,
    Link as LinkIcon,
    Settings,
    Shield,
    X,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    TrendingUp,
    Gem
} from 'lucide-react';
import logoFull from '../assets/logo-full.png';
import logoIcon from '../assets/logo-icon.png';

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
    isCollapsed?: boolean;
    badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick, isCollapsed, badge }) => (
    <button
        onClick={onClick}
        title={isCollapsed ? label : ''}
        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2.5 text-sm font-semibold transition-all duration-200 group relative rounded-lg ${active
            ? 'bg-[#EFF6FF] text-primary'
            : 'text-[#6B7280] hover:bg-gray-50 hover:text-gray-900'
            }`}
    >
        {active && <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary rounded-r-full" />}
        <Icon size={18} className={active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
        {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate animate-in fade-in duration-300">{label}</span>
                {badge && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                        {badge}
                    </span>
                )}
            </div>
        )}
    </button>
);

const NavSection: React.FC<{ title: string; children: React.ReactNode; isCollapsed?: boolean }> = ({ title, children, isCollapsed }) => (
    <div className={`mb-6 ${isCollapsed ? 'px-0' : 'px-2'}`}>
        {!isCollapsed && (
            <h3 className="px-2 mb-2 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider animate-in fade-in duration-300">
                {title}
            </h3>
        )}
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

interface SidebarProps {
    activePage: string;
    onPageChange: (page: string) => void;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePage,
    onPageChange,
    isOpen,
    setIsOpen,
    isCollapsed = false,
    setIsCollapsed
}) => {
    const [leadCount, setLeadCount] = useState<number>(0);

    useEffect(() => {
        let channel: any;

        const setupCount = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const fetchCount = async () => {
                const { count } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);
                setLeadCount(count || 0);
            };

            await fetchCount();

            channel = supabase
                .channel('lead-count-sidebar')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'leads',
                        filter: `user_id=eq.${user.id}`
                    },
                    () => {
                        fetchCount();
                    }
                )
                .subscribe();
        };

        setupCount();

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsOpen?.(false)}
                />
            )}

            <aside className={`
        fixed left-0 top-0 h-screen bg-white border-r border-[#E5E7EB] flex flex-col z-40 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed?.(!isCollapsed)}
                    className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-[#E5E7EB] rounded-full items-center justify-center text-[#9CA3AF] hover:text-[#111827] shadow-sm hover:shadow-md transition-all z-50 group"
                >
                    {isCollapsed ? (
                        <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    ) : (
                        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                    )}
                </button>

                <div className={`relative flex items-center justify-center pt-[20px] pb-[24px] ${isCollapsed ? 'px-0' : 'px-6'} overflow-hidden transition-all`}>
                    {isCollapsed ? (
                        <img
                            src={logoIcon}
                            alt="Logo Icon"
                            className="h-[36px] w-auto animate-in zoom-in duration-300 mx-auto"
                        />
                    ) : (
                        <img
                            src={logoFull}
                            alt="Leadomation"
                            className="h-[46px] w-auto animate-in fade-in duration-300 mx-auto"
                        />
                    )}
                    <button
                        className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-dark transition-colors"
                        onClick={() => setIsOpen?.(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto pt-4 scrollbar-hide">
                    <NavSection title="MAIN" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={LayoutGrid}
                            label="Dashboard"
                            active={activePage === 'Dashboard'}
                            onClick={() => { onPageChange('Dashboard'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Globe}
                            label="Global Demand"
                            active={activePage === 'Global Demand'}
                            onClick={() => { onPageChange('Global Demand'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </NavSection>

                    <NavSection title="CAMPAIGNS" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={PlusCircle}
                            label="New Campaign"
                            active={activePage === 'New Campaign'}
                            onClick={() => { onPageChange('New Campaign'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={PlayCircle}
                            label="Active Campaigns"
                            active={activePage === 'Active Campaigns'}
                            onClick={() => { onPageChange('Active Campaigns'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </NavSection>

                    <NavSection title="LEADS" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={Users}
                            label="Lead Database"
                            active={activePage === 'Lead Database'}
                            onClick={() => { onPageChange('Lead Database'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                            badge={leadCount > 0 ? leadCount.toString() : undefined}
                        />
                    </NavSection>

                    <NavSection title="CRM" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={TrendingUp}
                            label="📊 Deal Pipeline"
                            active={activePage === 'Deal Pipeline'}
                            onClick={() => { onPageChange('Deal Pipeline'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                            badge="6"
                        />
                    </NavSection>

                    <NavSection title="OUTREACH" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={Mail}
                            label="Sequence Builder"
                            active={activePage === 'Sequence Builder'}
                            onClick={() => { onPageChange('Sequence Builder'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={MessageSquare}
                            label="📥 Inbox"
                            active={activePage === 'Inbox'}
                            onClick={() => { onPageChange('Inbox'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                            badge="12"
                        />
                        <NavItem
                            icon={FileText}
                            label="Email Templates"
                            active={activePage === 'Email Templates'}
                            onClick={() => { onPageChange('Email Templates'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </NavSection>

                    <NavSection title="SETTINGS" isCollapsed={isCollapsed}>
                        <NavItem
                            icon={LinkIcon}
                            label="Integrations"
                            active={activePage === 'Integrations'}
                            onClick={() => { onPageChange('Integrations'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Settings}
                            label="Email Config"
                            active={activePage === 'Email Config'}
                            onClick={() => { onPageChange('Email Config'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Shield}
                            label="Compliance"
                            active={activePage === 'Compliance'}
                            onClick={() => { onPageChange('Compliance'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Gem}
                            label="💎 Pricing & Plans"
                            active={activePage === 'Pricing'}
                            onClick={() => { onPageChange('Pricing'); setIsOpen?.(false); }}
                            isCollapsed={isCollapsed}
                        />
                    </NavSection>
                </nav>

                <div className={`p-4 border-t border-[#E5E7EB] transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden p-0 border-0' : 'opacity-100 h-auto'}`}>
                    <div
                        className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-xl p-5 text-white shadow-lg overflow-hidden relative group cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                        onClick={() => onPageChange('Pricing')}
                    >
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                        <p className="text-[10px] font-bold opacity-80 mb-1 uppercase tracking-tight relative z-10">PRO PLAN</p>
                        <p className="text-sm font-bold mb-1 relative z-10 text-white">Upgrade to Pro</p>
                        <p className="text-[11px] opacity-80 mb-4 leading-tight relative z-10 text-blue-50">Unlock AI Voice Call Agent & advanced analytics</p>
                        <button className="w-full py-2.5 bg-white text-primary text-xs font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5 shadow-sm relative z-10">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
