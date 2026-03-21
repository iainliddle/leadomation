import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    LayoutDashboard,
    Globe,
    Plus,
    Zap,
    Users,
    Mail,
    FileText,
    Link as LinkIcon,
    Settings,
    Shield,
    X,
    TrendingUp,
    LogOut,
    User,
    Phone,
    Inbox,
    CreditCard,
    ChevronLeft,
    ChevronRight,
    CalendarDays
} from 'lucide-react';
import { signOut } from '../lib/auth';
import logoFull from '../assets/logo-full.png';
import logoIcon from '../assets/logo-icon.png';
import SidebarLock from './SidebarLock';
import type { FeatureAccess } from '../lib/planLimits';

const SIDEBAR_COLLAPSED_KEY = 'leadomation_sidebar_collapsed';

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
        title={isCollapsed ? label : undefined}
        className={`
            w-full flex items-center transition-all duration-150 group relative
            ${isCollapsed ? 'justify-center px-0 py-2.5 mx-0' : 'gap-3 px-3 py-2.5 mx-2'}
            ${active
                ? 'bg-[#EEF2FF] text-[#4F46E5] font-medium rounded-lg'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg'
            }
        `}
        style={isCollapsed ? { width: 'calc(100% - 16px)', margin: '0 8px' } : {}}
    >
        {/* Active indicator bar */}
        {active && !isCollapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#4F46E5] rounded-r-full" />
        )}
        <Icon size={18} className={`shrink-0 transition-colors duration-150 ${active ? 'text-[#4F46E5]' : 'text-gray-400 group-hover:text-gray-600'}`} />
        {!isCollapsed && (
            <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="text-sm truncate">{label}</span>
                {badge !== undefined && (
                    <span className="bg-[#4F46E5] text-white min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center">
                        {badge}
                    </span>
                )}
            </div>
        )}
        {isCollapsed && badge !== undefined && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#4F46E5] text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {badge}
            </span>
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
            <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                {label}
                {badge && <span className="ml-1.5 px-1.5 py-0.5 bg-[#4F46E5] rounded text-[10px]">{badge}</span>}
            </div>
        )}
    </button>
);

const NavSection: React.FC<{ title: string; children: React.ReactNode; isCollapsed?: boolean }> = ({ title, children, isCollapsed }) => (
    <div className="mb-1">
        {!isCollapsed && (
            <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 pt-4 pb-2">
                {title}
            </h3>
        )}
        {isCollapsed && <div className="h-3" />}
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
    isCollapsed: externalIsCollapsed,
    setIsCollapsed: externalSetIsCollapsed,
    userPlan,
    canAccess,
    triggerUpgrade
}) => {
    // Use internal state if no external state provided, with localStorage persistence
    const [internalCollapsed, setInternalCollapsed] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
            return stored === 'true';
        }
        return false;
    });

    const isCollapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalCollapsed;

    // Sync external state changes to localStorage
    useEffect(() => {
        if (externalIsCollapsed !== undefined) {
            localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(externalIsCollapsed));
        }
    }, [externalIsCollapsed]);

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
        const loadData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const [
                    { count: leads },
                    { count: deals },
                    { count: emails }
                ] = await Promise.all([
                    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                    supabase.from('emails').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                ]);

                setLeadCount(leads || 0);
                setDealCount(deals || 0);
                setEmailCount(emails || 0);
            } catch (err) {
                console.error('Error loading sidebar data:', err);
            }
        };
        loadData();
    }, []);

    const handleToggleCollapse = () => {
        const newValue = !isCollapsed;
        if (externalSetIsCollapsed) {
            externalSetIsCollapsed(newValue);
        } else {
            setInternalCollapsed(newValue);
        }
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
    };

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
                    width: isCollapsed ? '64px' : '240px',
                    minWidth: isCollapsed ? '64px' : '240px',
                    transition: 'width 0.2s ease-out, min-width 0.2s ease-out',
                }}
            >
                <div className="bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">

                    {/* Header: Logo + collapse button */}
                    <div className={`flex items-center ${isCollapsed ? 'justify-center py-5' : 'justify-between px-4 py-5'} relative`}>
                        {isCollapsed ? (
                            <img src={logoIcon} alt="L" className="h-8 w-auto" />
                        ) : (
                            <div className="flex flex-col min-w-0">
                                <img src={logoFull} alt="Leadomation" className="h-7 w-auto" />
                                <span className="text-[10px] text-gray-400 mt-1.5 pl-0.5 font-medium">B2B Outreach Platform</span>
                            </div>
                        )}

                        {/* Collapse toggle button */}
                        {!isCollapsed && (
                            <button
                                onClick={handleToggleCollapse}
                                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-all duration-150 shrink-0"
                                title="Collapse sidebar"
                            >
                                <ChevronLeft size={14} />
                            </button>
                        )}

                        {/* Mobile close button */}
                        <button
                            className="lg:hidden p-1 text-gray-400 hover:text-gray-700 absolute right-3 top-4"
                            onClick={() => setIsOpen?.(false)}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Collapsed state expand button */}
                    {isCollapsed && (
                        <div className="flex justify-center pb-2">
                            <button
                                onClick={handleToggleCollapse}
                                className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md border border-gray-200 bg-white text-gray-400 hover:text-[#4F46E5] hover:border-[#4F46E5] transition-all duration-150"
                                title="Expand sidebar"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-b border-gray-100 mx-3" />

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 scrollbar-hide">
                        <NavSection title="MAIN" isCollapsed={isCollapsed}>
                            <NavItem
                                icon={LayoutDashboard}
                                label="Dashboard"
                                active={activePage === 'Dashboard'}
                                onClick={() => { onPageChange('Dashboard'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
                            <SidebarLock
                                hasAccess={canAccess('globalDemand')}
                                onClick={() => triggerUpgrade('Global Demand Intelligence', 'pro')}
                                tooltipText="Pro feature. Upgrade to unlock Global Demand."
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
                                icon={Plus}
                                label="New Campaign"
                                active={activePage === 'New Campaign'}
                                onClick={() => { onPageChange('New Campaign'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
                            <NavItem
                                icon={Zap}
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
                                tooltipText="Pro feature. Upgrade to unlock Deal Pipeline."
                            >
                                <NavItem
                                    icon={TrendingUp}
                                    label="Deal Pipeline"
                                    active={activePage === 'Deal Pipeline'}
                                    onClick={() => { onPageChange('Deal Pipeline'); setIsOpen?.(false); }}
                                    isCollapsed={isCollapsed}
                                    badge={dealCount > 0 ? dealCount.toString() : undefined}
                                />
                            </SidebarLock>
                            <NavItem
                                icon={CalendarDays}
                                label="Calendar"
                                active={activePage === 'Calendar'}
                                onClick={() => { onPageChange('Calendar'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
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
                            <SidebarLock
                                hasAccess={canAccess('aiVoiceAgent')}
                                onClick={() => triggerUpgrade('AI Voice Agent', 'pro')}
                                tooltipText="Pro feature. Upgrade to unlock AI Voice Agent."
                            >
                                <NavItem
                                    icon={Phone}
                                    label="Call Agent"
                                    active={activePage === 'Call Agent'}
                                    onClick={() => { onPageChange('Call Agent'); setIsOpen?.(false); }}
                                    isCollapsed={isCollapsed}
                                />
                            </SidebarLock>
                            <SidebarLock
                                hasAccess={canAccess('inbox')}
                                onClick={() => triggerUpgrade('Unified Inbox', 'pro')}
                                tooltipText="Pro feature. Upgrade to unlock Unified Inbox."
                            >
                                <NavItem
                                    icon={Inbox}
                                    label="Inbox"
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
                                icon={CreditCard}
                                label="Pricing & Plans"
                                active={activePage === 'Pricing'}
                                onClick={() => { onPageChange('Pricing'); setIsOpen?.(false); }}
                                isCollapsed={isCollapsed}
                            />
                        </NavSection>
                    </nav>

                    {/* Upgrade card (free users only) */}
                    {userPlan === 'free' && !isCollapsed && (
                        <div className="px-3 pb-2">
                            <div
                                className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-xl p-4 text-white shadow-sm cursor-pointer hover:shadow-md transition-all"
                                onClick={() => onPageChange('Pricing')}
                            >
                                <p className="text-[10px] font-semibold opacity-80 mb-0.5 uppercase tracking-wide">Pro Plan</p>
                                <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
                                <p className="text-[11px] opacity-75 mb-3 leading-snug">Unlock AI Voice Call Agent and advanced analytics</p>
                                <button className="w-full py-1.5 bg-white text-[#4F46E5] text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-all">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-gray-200" />

                    {/* Sign Out Button */}
                    <div className="p-2">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-3 py-2 mx-2 mb-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium w-full"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className={isCollapsed ? 'hidden' : ''}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
