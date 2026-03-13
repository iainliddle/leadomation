import React, { useState, useEffect } from 'react';
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
import UnifiedInbox from './pages/UnifiedInbox';
import DealPipeline from './pages/DealPipeline';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import ActiveCampaigns from './pages/ActiveCampaigns';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import GlobalDemand from './pages/GlobalDemand';
import CallScriptBuilder from './pages/CallScriptBuilder';
import { supabase } from './lib/supabase';
import { usePlan } from './hooks/usePlan';
import TrialBanner from './components/TrialBanner';
import FeatureGate from './components/FeatureGate';
import ExpiredOverlay from './components/ExpiredOverlay';
import UpgradeModal from './components/UpgradeModal';
import AuthCallback from './pages/AuthCallback';
import TrialSetup from './pages/TrialSetup';
import CancellationFeedback from './pages/CancellationFeedback';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return params.get('checkout') === 'success' ? 'CheckoutSuccess' : 'Landing';
  });
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const {
    plan,
    isLoading: planLoading,
    trialDaysRemaining,
    canAccess,
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
    setActivePage('Pricing');
  };

  const [sessionChecked, setSessionChecked] = useState(false);

  const checkTrialStatus = async (user: any) => {
    try {
      const profilePromise = supabase.from('profiles').select('stripe_customer_id, plan').eq('id', user.id).single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000));
      const { data } = await Promise.race([profilePromise, timeoutPromise]) as any;
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
          return;
        }

        if (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register') {
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
            setActivePage('Landing');
          }
          return;
        }

        if (session && (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register')) {
          setLoading(true);
          const nextPage = await checkTrialStatus(session.user);
          setActivePage(nextPage);
        }
      } finally {
        setLoading(false);
        setSessionChecked(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [activePage]);

  useEffect(() => {
    if (activePage === 'CheckoutSuccess') {
      window.history.replaceState({}, '', window.location.pathname);
      const timer = setTimeout(() => setActivePage('Dashboard'), 3000);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session && window.location.pathname === '/auth/callback') {
        const firstName = session.user.user_metadata?.full_name?.split(' ')[0] || 'there';
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: session.user.email, type: 'welcome', firstName })
        });
        window.location.href = '/dashboard';
      }
    });
  }, []);

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
        return <NewCampaign onPageChange={setActivePage} />;
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
      case 'Sequence Builder':
        return <SequenceBuilder onPageChange={setActivePage} />;
      case 'Call Agent':
        return <CallScriptBuilder />;
      case 'Inbox':
        return (
          <FeatureGate feature="Unified Inbox" hasAccess={canAccess('inbox')} targetPlan="pro">
            <UnifiedInbox onPageChange={setActivePage} />
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

  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  if (window.location.pathname === '/cancellation-feedback') {
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
        canAccess={canAccess}
        triggerUpgrade={triggerUpgrade}
      >
        {(page: string) => (
          <div className="flex flex-col h-full relative">
            <TrialBanner
              daysRemaining={trialDaysRemaining}
              plan={plan}
              onUpgradeClick={goToPricing}
            />
            {renderPage(page)}
          </div>
        )}
      </Layout>

      {(plan === 'expired' || plan === 'cancelled') && activePage !== 'Pricing' && (
        <ExpiredOverlay
          type={plan as 'expired' | 'cancelled'}
          onViewPlans={goToPricing}
        />
      )}

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
