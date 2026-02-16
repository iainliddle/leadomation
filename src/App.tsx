import React, { useState, useEffect } from 'react';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
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
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';

import ActiveCampaigns from './pages/ActiveCampaigns';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Login');
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        if (activePage === 'Login' || activePage === 'Register') {
          setActivePage('Dashboard');
        }
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (activePage === 'Login' || activePage === 'Register') {
          setActivePage('Dashboard');
        }
      } else if (activePage !== 'Register') {
        setActivePage('Login');
      }
    });

    return () => subscription.unsubscribe();
  }, [activePage]);

  const renderPage = (page: string) => {
    switch (page) {
      case 'Dashboard':
        return <Dashboard />;
      case 'New Campaign':
        return <NewCampaign />;
      case 'Active Campaigns':
        return <ActiveCampaigns />;
      case 'Lead Database':
        return <LeadDatabase />;
      case 'Deal Pipeline':
        return <DealPipeline />;
      case 'Sequence Builder':
        return <SequenceBuilder />;
      case 'Inbox':
        return <UnifiedInbox />;
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
      default:
        return (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-4">
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-sm font-bold text-[#6B7280] uppercase tracking-widest">Initialising Leadomation...</p>
      </div>
    );
  }

  if (!session && activePage === 'Register') {
    return <Register onGoToLogin={() => setActivePage('Login')} />;
  }

  if (!session) {
    return <Login onLogin={() => setActivePage('Dashboard')} onGoToRegister={() => {
      console.log('Going to register');
      setActivePage('Register');
    }} />;
  }

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      {(page) => renderPage(page)}
    </Layout>
  );
};

export default App;
