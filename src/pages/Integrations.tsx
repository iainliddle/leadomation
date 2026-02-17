import React, { useState, useEffect } from 'react';
import {
    Lightbulb,
    ExternalLink,
    CheckCircle2,
    Calendar,
    Save,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProfileData {
    id: string;
    meeting_link: string;
    hunter_api_key: string;
    apify_api_key: string;
    linkedin_connected: boolean;
    calendly_url?: string;
}

const Integrations: React.FC = () => {
    const [profile, setProfile] = useState<Partial<ProfileData>>({});
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
        } else if (data) {
            setProfile(data);
        }
        setIsLoading(false);
    };

    const handleSave = async (field: keyof ProfileData, value: any, sectionId: string) => {
        setIsSaving(sectionId);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    [field]: value,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setProfile(prev => ({ ...prev, [field]: value }));
        } catch (error) {
            console.error(`Error saving ${field}:`, error);
            alert(`Error saving ${field}. Make sure the column exists in the profiles table.`);
        } finally {
            setIsSaving(null);
        }
    };

    const integrations = [
        {
            id: 'apify',
            name: 'Apify',
            description: 'Google Maps business scraping. Extract leads from any location worldwide.',
            status: profile.apify_api_key ? 'Connected' : 'Not Connected',
            iconText: 'A',
            iconBg: 'bg-orange-500',
            apiKey: profile.apify_api_key,
            field: 'apify_api_key',
            type: 'API'
        },
        {
            id: 'hunter',
            name: 'Hunter.io',
            description: 'Email finding by domain. Find contact email addresses from business websites.',
            status: profile.hunter_api_key ? 'Connected' : 'Not Connected',
            iconText: 'H',
            iconBg: 'bg-orange-600',
            apiKey: profile.hunter_api_key,
            field: 'hunter_api_key',
            type: 'API'
        },
        {
            id: 'linkedin',
            name: 'LinkedIn Automation',
            description: 'Reach leads directly on LinkedIn. Automated connection requests and direct messages.',
            status: profile.linkedin_connected ? 'Connected' : 'Not Connected',
            iconText: 'L',
            iconBg: 'bg-blue-600',
            field: 'linkedin_connected',
            type: 'Toggle'
        },
        {
            id: 'supabase',
            name: 'Supabase',
            description: 'Core platform database. All your leads and campaign data is stored here.',
            status: 'Connected',
            iconText: 'S',
            iconBg: 'bg-emerald-500',
            type: 'Managed'
        }
    ];

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
                        <input
                            type="text"
                            placeholder="https://calendly.com/your-name"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-[#E5E7EB] rounded-xl text-sm font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white transition-all"
                            value={profile.meeting_link || ''}
                            onChange={(e) => setProfile(prev => ({ ...prev, meeting_link: e.target.value }))}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSave('meeting_link', profile.meeting_link, 'meeting')}
                            disabled={isSaving === 'meeting' || isLoading}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                        >
                            {isSaving === 'meeting' ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            SAVE
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {integrations.map(integration => (
                    <div key={integration.id} className="card bg-white border border-[#E5E7EB] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group">
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
                        </div>

                        <p className="text-sm text-[#6B7280] leading-relaxed mb-6 h-10 line-clamp-2">
                            {integration.description}
                        </p>

                        <div className="pt-4 border-t border-[#F3F4F6]">
                            {integration.type === 'API' ? (
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block">API KEY</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
                                            value={integration.apiKey || ''}
                                            onChange={(e) => setProfile(prev => ({ ...prev, [integration.field!]: e.target.value }))}
                                            placeholder="Paste API key here..."
                                        />
                                        <button
                                            onClick={() => handleSave(integration.field as any, profile[integration.field as keyof ProfileData], integration.id)}
                                            disabled={isSaving === integration.id || isLoading}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#4B5563] rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                                        >
                                            {isSaving === integration.id ? <Loader2 size={12} className="animate-spin" /> : 'Update'}
                                        </button>
                                    </div>
                                </div>
                            ) : integration.type === 'Toggle' ? (
                                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                    <span className="text-xs font-bold text-[#4B5563]">Account Connected</span>
                                    <div
                                        className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer ${profile.linkedin_connected ? 'bg-primary' : 'bg-gray-300'}`}
                                        onClick={() => handleSave('linkedin_connected', !profile.linkedin_connected, 'linkedin')}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${profile.linkedin_connected ? 'translate-x-5' : ''}`} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                                    <CheckCircle2 size={14} />
                                    Managed by Leadomation
                                </div>
                            )}
                        </div>
                    </div>
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
                        Check our <span className="underline cursor-pointer hover:text-blue-900">integration guides</span> for setup instructions.
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
