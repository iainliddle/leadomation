import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NewCampaign from './pages/NewCampaign';
import LeadDatabase from './pages/LeadDatabase';
import SequenceBuilder from './pages/SequenceBuilder';
import EmailTemplates from './pages/EmailTemplates';
import Integrations from './pages/Integrations';
import EmailConfig from './pages/EmailConfig';
import Compliance from './pages/Compliance';
import LeadInbox from './pages/LeadInbox';
import DealPipeline from './pages/DealPipeline';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import ActiveCampaigns from './pages/ActiveCampaigns';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import GlobalDemand from './pages/GlobalDemand';
import CallScriptBuilder from './pages/CallScriptBuilder';
import Calendar from './pages/Calendar';
import KeywordMonitor from './pages/KeywordMonitor';
import PerformanceInsights from './pages/PerformanceInsights';
import { supabase } from './lib/supabase';
import { usePlan } from './hooks/usePlan';
import TrialBanner from './components/TrialBanner';
import FeatureGate from './components/FeatureGate';
import UpgradeModal from './components/UpgradeModal';
import AuthCallback from './pages/AuthCallback';
import TrialSetup from './pages/TrialSetup';
import CancellationFeedback from './pages/CancellationFeedback';

// Map URL paths to page names
const urlToPage: Record<string, string> = {
  '/': 'Landing',
  '/dashboard': 'Dashboard',
  '/global-demand': 'Global Demand',
  '/campaigns/new': 'New Campaign',
  '/campaigns/active': 'Active Campaigns',
  '/lead-database': 'Lead Database',
  '/deal-pipeline': 'Deal Pipeline',
  '/calendar': 'Calendar',
  '/keyword-monitor': 'Keyword Monitor',
  '/sequence-builder': 'Sequence Builder',
  '/call-agent': 'Call Agent',
  '/inbox': 'Inbox',
  '/email-templates': 'Email Templates',
  '/analytics': 'Analytics',
  '/performance': 'Performance',
  '/settings/profile': 'Settings',
  '/integrations': 'Integrations',
  '/email-config': 'Email Config',
  '/compliance': 'Compliance',
  '/pricing': 'Pricing',
  '/login': 'Login',
  '/register': 'Register',
  '/terms': 'Terms',
  '/privacy': 'Privacy',
  '/refund': 'Refund',
  '/cancellation-feedback': 'CancellationFeedback',
};

// Reverse mapping: page names to URL paths
const pageToUrl: Record<string, string> = Object.fromEntries(
  Object.entries(urlToPage).map(([url, page]) => [page, url])
);

// Pages that don't require authentication
const publicPages = ['Landing', 'Login', 'Register', 'Terms', 'Privacy', 'Refund', 'Pricing', 'CancellationFeedback'];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (params.get('checkout') === 'success') return 'CheckoutSuccess';

    // Check URL path for deep linking
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const pageFromUrl = urlToPage[path];
    if (pageFromUrl) return pageFromUrl;

    return 'Landing';
  });
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Navigation function that updates both state and URL
  const navigateTo = useCallback((page: string) => {
    setActivePage(page);
    const url = pageToUrl[page];
    if (url) {
      navigate(url);
    }
  }, [navigate]);

  const {
    plan,
    selectedPlan,
    isLoading: planLoading,
    trialDaysRemaining,
    canAccess,
    stripeSubscriptionStatus,
  } = usePlan();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [upgradeTargetPlan, setUpgradeTargetPlan] = useState<'starter' | 'pro'>('pro');

  const triggerUpgrade = (feature: string, targetPlan: 'starter' | 'pro' = 'pro') => {
    setUpgradeFeature(feature);
    setUpgradeTargetPlan(targetPlan);
    setShowUpgradeModal(true);
  };

  const goToPricing = () => {
    navigateTo('Pricing');
  };

  const [sessionChecked, setSessionChecked] = useState(false);

  const checkTrialStatus = async (user: any) => {
    try {
      const profilePromise = supabase.from('profiles').select('stripe_customer_id, plan').eq('id', user.id).single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
      const { data } = await Promise.race([profilePromise, timeoutPromise]) as any;
      // Users with a valid subscription (including 'trialing' with card on file) go to Dashboard
      // Users without a Stripe customer ID or with 'free'/'trial' plan need to set up trial
      if (data && (!data.stripe_customer_id || data.stripe_customer_id.trim() === '') && (!data.plan || data.plan === 'free' || data.plan === 'trial')) {
        return 'TrialSetup';
      }
      return 'Dashboard';
    } catch {
      return 'Dashboard';
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        setSession(session);

        if (!session) {
          const currentPath = location.pathname;
          // Allow cancellation-feedback route for unauthenticated users
          if (currentPath === '/cancellation-feedback') {
            setActivePage('CancellationFeedback');
            setLoading(false);
            return;
          }
          // If user is trying to access a protected page, redirect to login with return path
          if (!publicPages.includes(activePage)) {
            // Store the intended destination and redirect to login
            navigate(`/login?redirect=${encodeURIComponent(currentPath)}`, { replace: true });
            setActivePage('Login');
          }
          return;
        }

        if (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register') {
          // Check for redirect parameter in URL (user just logged in)
          const params = new URLSearchParams(location.search);
          const redirectPath = params.get('redirect');

          if (redirectPath) {
            // Map the redirect path to a page name
            const redirectPage = urlToPage[redirectPath];
            if (redirectPage && !publicPages.includes(redirectPage)) {
              navigate(redirectPath, { replace: true });
              setActivePage(redirectPage);
              setLoading(false);
              setSessionChecked(true);
              return;
            }
          }

          const nextPage = await checkTrialStatus(session.user);
          setActivePage(nextPage);
        }
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setSession(session);

        if (event === 'SIGNED_OUT' || !session) {
          if (activePage !== 'Register' && activePage !== 'Terms' && activePage !== 'Privacy' && activePage !== 'Refund' && activePage !== 'Login') {
            navigate('/', { replace: true });
            setActivePage('Landing');
          }
          return;
        }

        if (session && (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register')) {
          setLoading(true);

          // Check for redirect parameter in URL
          const params = new URLSearchParams(location.search);
          const redirectPath = params.get('redirect');

          if (redirectPath) {
            // Map the redirect path to a page name
            const redirectPage = urlToPage[redirectPath];
            if (redirectPage && !publicPages.includes(redirectPage)) {
              navigate(redirectPath, { replace: true });
              setActivePage(redirectPage);
              return;
            }
          }

          const nextPage = await checkTrialStatus(session.user);
          setActivePage(nextPage);
        }
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [activePage, location.search, navigate]);

  // Sync URL with activePage changes
  useEffect(() => {
    const url = pageToUrl[activePage];
    if (url && location.pathname !== url) {
      navigate(url, { replace: true });
    }
  }, [activePage, location.pathname, navigate]);

  useEffect(() => {
    if (activePage === 'CheckoutSuccess') {
      const timer = setTimeout(() => setActivePage('Dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  // Redirect expired trial users to pricing page
  useEffect(() => {
    if (planLoading || !session) return;

    // Only redirect if trial/subscription is expired/cancelled
    // and user doesn't have an active subscription
    const isExpiredOrCancelled = plan === 'expired' || plan === 'cancelled';
    const hasActiveSubscription = stripeSubscriptionStatus === 'active' || stripeSubscriptionStatus === 'trialing';
    const isOnAllowedPage = activePage === 'Pricing' || activePage === 'Settings';

    if (isExpiredOrCancelled && !hasActiveSubscription && !isOnAllowedPage) {
      navigate('/pricing', { replace: true });
      setActivePage('Pricing');
    }
  }, [plan, stripeSubscriptionStatus, planLoading, session, activePage, navigate]);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && location.pathname === '/auth/callback') {
        // Fetch first_name from profiles table
        let firstName = 'there';
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', session.user.id)
          .single();

        if (profile?.first_name) {
          firstName = profile.first_name;
        } else if (session.user.user_metadata?.full_name) {
          firstName = session.user.user_metadata.full_name.split(' ')[0];
        }

        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: session.user.email, type: 'welcome', firstName })
        });
        navigate('/dashboard', { replace: true });
        setActivePage('Dashboard');
      }
    });
  }, [location.pathname, navigate]);

  const renderPage = (page: string) => {
    switch (page) {
      case 'Dashboard':
        return <Dashboard onPageChange={setActivePage} />;
      case 'Global Demand':
        return (
          <FeatureGate feature="Global Demand Intelligence" hasAccess={canAccess('globalDemand')} targetPlan="pro">
            <GlobalDemand onPageChange={setActivePage} />
          </FeatureGate>
        );
      case 'New Campaign':
        return <NewCampaign onBack={() => setActivePage('Dashboard')} />;
      case 'Active Campaigns':
        return <ActiveCampaigns key={activePage} onPageChange={setActivePage} />;
      case 'Lead Database':
        return <LeadDatabase canAccess={canAccess} triggerUpgrade={triggerUpgrade} />;
      case 'Deal Pipeline':
        return (
          <FeatureGate feature="Deal Pipeline / Kanban CRM" hasAccess={canAccess('dealPipeline')} targetPlan="pro">
            <DealPipeline />
          </FeatureGate>
        );
      case 'Calendar':
        return (
          <FeatureGate feature="Calendar" hasAccess={canAccess('dealPipeline')} targetPlan="pro">
            <Calendar />
          </FeatureGate>
        );
      case 'Keyword Monitor':
        return (
          <FeatureGate feature="LinkedIn Keyword Monitor" hasAccess={canAccess('keywordMonitor')} targetPlan="pro">
            <KeywordMonitor />
          </FeatureGate>
        );
      case 'Sequence Builder':
        return <SequenceBuilder onPageChange={setActivePage} />;
      case 'Call Agent':
        return (
          <FeatureGate feature="AI Voice Agent" hasAccess={canAccess('aiVoiceAgent')} targetPlan="pro">
            <CallScriptBuilder />
          </FeatureGate>
        );
      case 'Inbox':
        return (
          <FeatureGate feature="Unified Inbox" hasAccess={canAccess('inbox')} targetPlan="pro">
            <LeadInbox onPageChange={setActivePage} />
          </FeatureGate>
        );
      case 'Email Templates':
        return <EmailTemplates />;
      case 'Integrations':
        return <Integrations />;
      case 'Email Config':
        return <EmailConfig />;
      case 'Compliance':
        return <Compliance />;
      case 'Pricing':
        return <Pricing />;
      case 'Settings':
        return <Settings onPageChange={setActivePage} />;
      case 'Performance':
        return <PerformanceInsights />;
      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-[#EEF2FF] text-[#4F46E5] rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">L</span>
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">{page}</h2>
            <p className="text-[#6B7280] mt-2 max-w-md">
              This page is currently being built. Check back soon for the latest updates to the Leadomation platform.
            </p>
          </div>
        );
    }
  };

  // Standalone public routes - bypass all auth checks
  if (location.pathname === '/cancellation-feedback') {
    return <CancellationFeedback />;
  }

  if (!sessionChecked || loading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (activePage === 'CheckoutSuccess') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 animate-in fade-in duration-500 p-4 text-center">
        <div className="text-6xl mb-6 flex items-center justify-center animate-bounce">
          🎉
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Trial activated!</h1>
        <p className="text-gray-600 font-medium text-lg">Taking you to your dashboard...</p>
      </div>
    );
  }

  if (activePage === 'TrialSetup') {
    return (
      <TrialSetup />
    );
  }

  if (location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  if (location.pathname === '/cancellation-feedback') {
    return <CancellationFeedback />;
  }

  if (activePage === 'Terms') {
    return <TermsOfService onBack={() => setActivePage('Login')} onNavigate={(page) => setActivePage(page)} />;
  }

  if (activePage === 'Privacy') {
    return <PrivacyPolicy onGoToLogin={() => setActivePage('Login')} />;
  }

  if (activePage === 'Refund') {
    return <RefundPolicy onBack={() => setActivePage('Login')} />;
  }

  if (!session && activePage === 'Register') {
    return (
      <Register
        onGoToLogin={() => setActivePage('Login')}
        onGoToTerms={() => setActivePage('Terms')}
        onGoToPrivacy={() => setActivePage('Privacy')}
        onGoToRefund={() => setActivePage('Refund')}
      />
    );
  }

  if (!session && activePage === 'Login') {
    return (
      <Login
        onLogin={() => { }}
        onGoToRegister={() => setActivePage('Register')}
        onGoToTerms={() => setActivePage('Terms')}
        onGoToPrivacy={() => setActivePage('Privacy')}
        onGoToRefund={() => setActivePage('Refund')}
      />
    );
  }

  if (!session) {
    return (
      <LandingPage onNavigate={(page) => {
        if (page === 'Register') {
          setActivePage('Register');
        } else if (page === 'Login') {
          setActivePage('Login');
        }
      }} />
    );
  }

  return (
    <>
      <Layout
        activePage={activePage}
        onPageChange={setActivePage}
        userPlan={plan || undefined}
        stripeSubscriptionStatus={stripeSubscriptionStatus}
        canAccess={canAccess}
        triggerUpgrade={triggerUpgrade}
        isLoading={planLoading}
      >
        {(page: string) => (
          <div className="flex flex-col h-full relative">
            <TrialBanner
              daysRemaining={trialDaysRemaining}
              plan={plan}
              selectedPlan={selectedPlan}
              onUpgradeClick={goToPricing}
            />
            {renderPage(page)}
          </div>
        )}
      </Layout>

      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={upgradeFeature}
        targetPlan={upgradeTargetPlan}
      />
    </>
  );
};

export default App;
