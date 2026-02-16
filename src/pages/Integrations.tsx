import React from 'react';
import {
    Lightbulb,
    ExternalLink,
    CheckCircle2,
    Edit,
    Calendar,
    Save,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

interface Integration {
    id: string;
    name: string;
    description: string;
    status: 'Connected' | 'Not Connected';
    iconText: string;
    iconBg: string;
    apiKey?: string;
    type?: 'API' | 'Webhook' | 'Free';
    webhookUrl?: string;
}

const integrations: Integration[] = [
    {
        id: '1',
        name: 'Apify',
        description: 'Google Maps business scraping. Extract leads from any location worldwide.',
        status: 'Connected',
        iconText: 'A',
        iconBg: 'bg-orange-500',
        apiKey: '••••••••••••ap-7x2m',
        type: 'API'
    },
    {
        id: '2',
        name: 'SendGrid',
        description: 'Email delivery and tracking. Send cold email sequences with open and click tracking.',
        status: 'Connected',
        iconText: 'S',
        iconBg: 'bg-blue-500',
        apiKey: '••••••••••••sg-9k1p',
        type: 'API'
    },
    {
        id: '3',
        name: 'Supabase',
        description: 'Database storage. All leads, campaigns, and analytics data.',
        status: 'Connected',
        iconText: 'S',
        iconBg: 'bg-green-500',
        apiKey: '••••••••••••sb-3n8w',
        type: 'API'
    },
    {
        id: '4',
        name: 'Hunter.io',
        description: 'Email finding by domain. Find contact email addresses from business websites.',
        status: 'Not Connected',
        iconText: 'H',
        iconBg: 'bg-orange-600',
        type: 'API'
    },
    {
        id: '5',
        name: 'ZeroBounce',
        description: 'Email verification. Validate email addresses before sending to reduce bounces.',
        status: 'Not Connected',
        iconText: 'Z',
        iconBg: 'bg-teal-500',
        type: 'API'
    },
    {
        id: '6',
        name: 'Phantombuster',
        description: 'LinkedIn automation. Automated connection requests and direct messages.',
        status: 'Not Connected',
        iconText: 'P',
        iconBg: 'bg-purple-500',
        type: 'API'
    },
    {
        id: '7',
        name: 'Google Trends',
        description: 'Search trend data. Monitor global demand and seasonal patterns by region.',
        status: 'Connected',
        iconText: 'G',
        iconBg: 'bg-red-500',
        type: 'Free'
    },
    {
        id: '8',
        name: 'N8N',
        description: 'Workflow orchestration. Automates the scrape, enrich, verify, and send pipeline.',
        status: 'Connected',
        iconText: 'N',
        iconBg: 'bg-orange-400',
        webhookUrl: 'https://n8n.yourdomain.com/webhook/leadomation',
        type: 'Webhook'
    }
];

const IntegrationCard: React.FC<{ integration: Integration }> = ({ integration }) => (
    <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm ${integration.iconBg}`}>
                    {integration.iconText}
                </div>
                <div>
                    <h3 className="text-base font-bold text-[#111827]">{integration.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${integration.status === 'Connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-gray-300'}`}></div>
                        <span className={`text-[11px] font-bold ${integration.status === 'Connected' ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {integration.status}
                        </span>
                    </div>
                </div>
            </div>
            {integration.status === 'Connected' ? (
                <button className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] hover:bg-gray-50 transition-all shadow-sm">
                    Configure
                </button>
            ) : (
                <button className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-95">
                    Connect
                </button>
            )}
        </div>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-6 h-10 line-clamp-2">
            {integration.description}
        </p>

        {integration.status === 'Connected' && (
            <div className="pt-4 border-t border-[#F3F4F6] animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2 block">
                    {integration.type === 'Webhook' ? 'WEBHOOK URL' : 'API KEY'}
                </label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 group/field">
                    {integration.type === 'Free' ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 size={12} /> Free — No key required
                        </span>
                    ) : (
                        <>
                            <code className="text-[11px] font-mono font-bold text-[#4B5563] truncate mr-2">
                                {integration.type === 'Webhook' ? integration.webhookUrl : integration.apiKey}
                            </code>
                            <button className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline transition-all opacity-0 group-hover/field:opacity-100 transform translate-x-1 group-hover/field:translate-x-0 transition-opacity-transform duration-200">
                                <Edit size={10} /> EDIT
                            </button>
                        </>
                    )}
                </div>
            </div>
        )}
    </div>
);

const Integrations: React.FC = () => {
    const [meetingLink, setMeetingLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('meeting_link')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            } else if (data) {
                setMeetingLink(data.meeting_link || '');
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, []);

    const handleSaveMeetingLink = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    meeting_link: meetingLink,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            alert('Meeting link saved successfully!');
        } catch (error) {
            console.error('Error saving meeting link:', error);
            alert('Error saving meeting link. Please ensure the "meeting_link" column exists in the profiles table.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-700 max-w-[1200px] mx-auto pb-12">
            <div className="mb-10">
                <h1 className="text-2xl font-black text-[#111827] tracking-tight">Integrations</h1>
                <p className="text-sm text-[#6B7280] font-medium mt-1">Connect your tools and services to power Leadomation's pipeline.</p>
            </div>

            {/* Meeting Link Section */}
            <div className="card bg-white border border-[#E5E7EB] rounded-2xl p-8 mb-10 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors duration-500"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-[#111827]">Meeting Link</h3>
                            <p className="text-sm text-[#6B7280] font-medium mt-1">Paste your Calendly or Cal.com booking URL for email sequences.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="https://calendly.com/your-name"
                                className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all placeholder:text-gray-300"
                                value={meetingLink}
                                onChange={(e) => setMeetingLink(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSaveMeetingLink}
                            disabled={isSaving || isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            SAVE
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {integrations.map(integration => (
                    <IntegrationCard key={integration.id} integration={integration} />
                ))}
            </div>

            <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Lightbulb size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-[#1E40AF]">Need help connecting?</h4>
                    <p className="text-xs text-blue-700/80 font-medium mt-1 leading-relaxed">
                        Integrating your services is a key part of automating your outreach.
                        If you're having trouble connects, check our <span className="underline cursor-pointer hover:text-blue-900">integration guides</span> or
                        <span className="underline cursor-pointer ml-1 hover:text-blue-900">contact support</span> for assistance.
                    </p>
                </div>
                <button className="ml-auto p-2 text-primary hover:bg-white rounded-lg transition-all hidden sm:block">
                    <ExternalLink size={18} />
                </button>
            </div>
        </div>
    );
};

export default Integrations;
