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
import GlobalDemand from './pages/GlobalDemand';
import { supabase } from './lib/supabase';
import { usePlan } from './hooks/usePlan';
import TrialBanner from './components/TrialBanner';
import FeatureGate from './components/FeatureGate';
import ExpiredOverlay from './components/ExpiredOverlay';
import UpgradeModal from './components/UpgradeModal';
import AuthCallback from './pages/AuthCallback';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Landing');
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

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        if (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register') {
          setActivePage('Dashboard');
        }
      }
      setLoading(false);
    });

    // Listen for auth changes - General session handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Auto-navigate to dashboard if logged in and on public pages
      if (session && (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register')) {
        setActivePage('Dashboard');
      }
      // Auto-navigate to landing if logged out and on protected pages
      else if (!session && activePage !== 'Register' && activePage !== 'Terms' && activePage !== 'Privacy' && activePage !== 'Login') {
        setActivePage('Landing');
      }
    });

    return () => subscription.unsubscribe();
  }, [activePage]);

  // Dedicated handler for auth callback / welcome email
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
        return <ActiveCampaigns onPageChange={setActivePage} />;
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

  if (loading || planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle dedicated auth callback route
  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />;
  }

  // Handle public pages
  if (activePage === 'Terms') {
    return <TermsOfService onGoToLogin={() => setActivePage('Login')} />;
  }

  if (activePage === 'Privacy') {
    return <PrivacyPolicy onGoToLogin={() => setActivePage('Login')} />;
  }

  if (!session && activePage === 'Register') {
    return (
      <Register
        onGoToLogin={() => setActivePage('Login')}
        onGoToTerms={() => setActivePage('Terms')}
        onGoToPrivacy={() => setActivePage('Privacy')}
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
          <div className="flex flex-col h-full">
            <TrialBanner
              daysRemaining={trialDaysRemaining}
              plan={plan}
              onUpgradeClick={goToPricing}
            />
            {renderPage(page)}
          </div>
        )}
      </Layout>

      {(plan === 'expired' || plan === 'cancelled') && (
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
