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
    MessageSquare,
    TrendingUp,
    Gem,
    LogOut,
    User
} from 'lucide-react';
import { signOut } from '../lib/auth';
import logoFull from '../assets/logo-full.png';
import logoIcon from '../assets/logo-icon.png';
import SidebarLock from './SidebarLock';
import type { FeatureAccess } from '../lib/planLimits';

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
        className={`w-full flex items-center transition-all duration-200 group relative ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-4 py-2.5'
            } ${active
                ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold border-l-[3px] border-[#4F46E5]'
                : 'text-[#64748B] font-semibold text-[13px] hover:bg-gray-50 hover:text-[#374151]'
            }`}
    >
        <Icon size={isCollapsed ? 22 : 18} className="transition-colors duration-200" />
        {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-[13px] truncate">{label}</span>
                {badge !== undefined && (
                    <span className="bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">
                        {badge}
                    </span>
                )}
            </div>
        )}
    </button>
);

const NavSection: React.FC<{ title: string; children: React.ReactNode; isCollapsed?: boolean; marginTop?: string }> = ({ title, children, isCollapsed, marginTop = 'mt-5' }) => (
    <div className={`mb-4 ${isCollapsed ? 'px-0' : 'px-0'}`}>
        {!isCollapsed && (
            <h3 className={`text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest ${marginTop} mb-2 px-4 animate-in fade-in duration-300`}>
                {title}
            </h3>
        )}
        <div className="space-y-0.5">
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
    userPlan?: string;
    canAccess: (feature: keyof FeatureAccess) => boolean;
    triggerUpgrade: (feature: string, targetPlan?: 'starter' | 'pro') => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePage,
    onPageChange,
    isOpen,
    setIsOpen,
    isCollapsed = false,
    setIsCollapsed,
    userPlan,
    canAccess,
    triggerUpgrade
}) => {
    const [leadCount, setLeadCount] = useState(0);
    const [dealCount, setDealCount] = useState(0);
    const [emailCount, setEmailCount] = useState(0);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { count: leads } = await supabase
                    .from('leads')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const { count: deals } = await supabase
                    .from('deals')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                const { count: emails } = await supabase
                    .from('emails')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id);

                setLeadCount(leads || 0);
                setDealCount(deals || 0);
                setEmailCount(emails || 0);
            } catch (err) {
                console.error('Error loading sidebar counts:', err);
            }
        };
        loadCounts();
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

            <aside
                className={`fixed left-0 top-0 h-screen z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                style={{
                    width: isCollapsed ? '72px' : '260px',
                    minWidth: isCollapsed ? '72px' : '260px',
                    transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            >
                {/* Inner content wrapper — overflow hidden here so toggle button is not clipped */}
                <div
                    className="bg-white border-r border-[#E5E7EB] flex flex-col h-full"
                    style={{ overflow: 'hidden' }}
                >
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

                    <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide" style={{ whiteSpace: 'nowrap' }}>
                        <NavSection title="MAIN" isCollapsed={isCollapsed} marginTop="mt-2">
                            <NavItem
                                icon={LayoutGrid}
                                label="Dashboard"
                                active={activePage === 'Dashboard'}
                                onClick={() => { onPageChange('Dashboard'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
                            <SidebarLock
                                hasAccess={canAccess('globalDemand')}
                                onClick={() => triggerUpgrade('Global Demand Intelligence', 'pro')}
                            >
                                <NavItem
                                    icon={Globe}
                                    label="Global Demand"
                                    active={activePage === 'Global Demand'}
                                    onClick={() => { onPageChange('Global Demand'); setIsOpen?.(false); }}
                                    isCollapsed={isCollapsed}
                                />
                            </SidebarLock>
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
                            <SidebarLock
                                hasAccess={canAccess('dealPipeline')}
                                onClick={() => triggerUpgrade('Deal Pipeline / Kanban CRM', 'pro')}
                            >
                                <NavItem
                                    icon={TrendingUp}
                                    label="📊 Deal Pipeline"
                                    active={activePage === 'Deal Pipeline'}
                                    onClick={() => { onPageChange('Deal Pipeline'); setIsOpen?.(false); }}
                                    isCollapsed={isCollapsed}
                                    badge={dealCount > 0 ? dealCount.toString() : undefined}
                                />
                            </SidebarLock>
                        </NavSection>

                        <NavSection title="OUTREACH" isCollapsed={isCollapsed}>
                            <NavItem
                                icon={Mail}
                                label="Sequence Builder"
                                active={activePage === 'Sequence Builder'}
                                onClick={() => { onPageChange('Sequence Builder'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
                            <SidebarLock
                                hasAccess={canAccess('inbox')}
                                onClick={() => triggerUpgrade('Unified Inbox', 'pro')}
                            >
                                <NavItem
                                    icon={MessageSquare}
                                    label="📥 Inbox"
                                    active={activePage === 'Inbox'}
                                    onClick={() => { onPageChange('Inbox'); setIsOpen?.(false); }}
                                    isCollapsed={isCollapsed}
                                    badge={emailCount > 0 ? emailCount.toString() : undefined}
                                />
                            </SidebarLock>
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
                                icon={User}
                                label="My Profile"
                                active={activePage === 'Settings'}
                                onClick={() => { onPageChange('Settings'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
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

                    {userPlan === 'free' && (
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
                    )}

                    {/* Sign Out */}
                    <div className={`mt-auto border-t border-[#E5E7EB] ${isCollapsed ? 'px-2 py-3' : 'px-4 py-3'}`}>
                        <button
                            onClick={handleSignOut}
                            title={isCollapsed ? 'Sign Out' : ''}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-2 text-[13px] font-semibold text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all duration-200 border-none bg-transparent cursor-pointer`}
                        >
                            <LogOut size={18} />
                            {!isCollapsed && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>

                {/* Toggle Button — outside inner wrapper so it's never clipped */}
                <button
                    onClick={() => setIsCollapsed?.(!isCollapsed)}
                    className="hidden lg:flex"
                    style={{
                        position: 'absolute',
                        right: '-14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'white',
                        border: '1px solid #E2E4ED',
                        display: undefined,
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 50,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        padding: 0,
                        color: '#94A3B8',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F8FAFC';
                        e.currentTarget.style.borderColor = '#4F46E5';
                        e.currentTarget.style.color = '#4F46E5';
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(79,70,229,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.borderColor = '#E2E4ED';
                        e.currentTarget.style.color = '#94A3B8';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                >
                    <div style={{
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </div>
                </button>
            </aside>
        </>
    );
};

export default Sidebar;
