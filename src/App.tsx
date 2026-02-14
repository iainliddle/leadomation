import React, { useState } from 'react';
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

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('Login');

  const renderPage = (page: string) => {
    switch (page) {
      case 'Dashboard':
        return <Dashboard />;
      case 'New Campaign':
        return <NewCampaign />;
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

  if (activePage === 'Login') {
    return <Login onLogin={() => setActivePage('Dashboard')} onGoToRegister={() => setActivePage('Register')} />;
  }

  if (activePage === 'Register') {
    return <Register onRegister={() => setActivePage('Dashboard')} onGoToLogin={() => setActivePage('Login')} />;
  }

  return (
    <Layout activePage={activePage} onPageChange={setActivePage}>
      {(page) => renderPage(page)}
    </Layout>
  );
};

export default App;
