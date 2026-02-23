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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        if (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register') {
          setActivePage('Dashboard');
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (activePage === 'Landing' || activePage === 'Login' || activePage === 'Register') {
          setActivePage('Dashboard');
        }
      } else if (activePage !== 'Register' && activePage !== 'Terms' && activePage !== 'Privacy') {
        setActivePage('Landing');
      }
    });

    return () => subscription.unsubscribe();
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
