import React from 'react';
import Layout from './layouts/Layout';
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
  return (
    <Layout>
      {(activePage: string) => {
        switch (activePage) {
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
                <h2 className="text-2xl font-bold text-dark">{activePage}</h2>
                <p className="text-muted mt-2 max-w-md">
                  This page is currently being built. Check back soon for the latest updates to the Leadomation platform.
                </p>
                <div className="mt-8 flex gap-3">
                  <div className="h-1.5 w-8 bg-primary rounded-full"></div>
                  <div className="h-1.5 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-1.5 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            );
        }
      }}
    </Layout>
  );
};

export default App;
