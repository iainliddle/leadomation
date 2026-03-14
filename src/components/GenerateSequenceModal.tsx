import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, RefreshCw, Check, ChevronRight, ChevronLeft, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BusinessProfile {
    business_name: string;
    industry: string;
    value_proposition: string;
    tone: string;
    target_audience: string;
    website_url: string;
}

interface Campaign {
    id: string;
    name: string;
    keyword?: string;
    location?: string;
}

interface GeneratedStep {
    step: number;
    subject: string;
    body: string;
    delay_days: number;
    channel: string;
}

interface GenerateSequenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUseSequence: (steps: GeneratedStep[]) => void;
}

const GenerateSequenceModal: React.FC<GenerateSequenceModalProps> = ({
    isOpen,
    onClose,
    onUseSequence
}) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Business profile state
    const [profile, setProfile] = useState<BusinessProfile>({
        business_name: '',
        industry: '',
        value_proposition: '',
        tone: 'professional',
        target_audience: '',
        website_url: ''
    });

    // Campaign selection
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
    const [numSteps, setNumSteps] = useState<3 | 4 | 5>(3);

    // Generated sequence
    const [generatedSteps, setGeneratedSteps] = useState<GeneratedStep[]>([]);
    const [regeneratingStep, setRegeneratingStep] = useState<number | null>(null);

    // Load business profile and campaigns on open
    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setGeneratedSteps([]);
            setError(null);
            return;
        }

        const loadData = async () => {
            setIsLoadingProfile(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Load business profile
                const { data: profileData } = await supabase
                    .from('user_business_profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (profileData) {
                    setProfile({
                        business_name: profileData.business_name || '',
                        industry: profileData.industry || '',
                        value_proposition: profileData.value_proposition || '',
                        tone: profileData.tone || 'professional',
                        target_audience: profileData.target_audience || '',
                        website_url: profileData.website_url || ''
                    });
                }

                // Load campaigns
                const { data: campaignsData } = await supabase
                    .from('campaigns')
                    .select('id, name, keyword, location')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                setCampaigns(campaignsData || []);
                if (campaignsData && campaignsData.length > 0) {
                    setSelectedCampaignId(campaignsData[0].id);
                }
            } catch (err) {
                console.error('Error loading data:', err);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        loadData();
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!profile.business_name || !profile.value_proposition) {
            setError('Business name and value proposition are required');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Save profile first
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('user_business_profiles').upsert({
                    user_id: user.id,
                    business_name: profile.business_name,
                    industry: profile.industry,
                    value_proposition: profile.value_proposition,
                    tone: profile.tone,
                    target_audience: profile.target_audience,
                    website_url: profile.website_url,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }

            // Get campaign context
            const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Please log in to use this feature');
            }

            // Generate sequence
            const response = await fetch('/api/generate-sequence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    business_name: profile.business_name,
                    industry: profile.industry,
                    value_proposition: profile.value_proposition,
                    target_audience: profile.target_audience,
                    tone: profile.tone,
                    campaign_keyword: selectedCampaign?.keyword || '',
                    campaign_location: selectedCampaign?.location || '',
                    num_steps: numSteps
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate sequence');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Generation failed');
            }

            setGeneratedSteps(data.steps);
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Failed to generate sequence');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerateStep = async (stepIndex: number) => {
        setRegeneratingStep(stepIndex);
        setError(null);

        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Please log in to use this feature');
            }

            const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
            const previousSteps = generatedSteps.slice(0, stepIndex);

            const response = await fetch('/api/regenerate-step', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    business_name: profile.business_name,
                    industry: profile.industry,
                    value_proposition: profile.value_proposition,
                    target_audience: profile.target_audience,
                    tone: profile.tone,
                    campaign_keyword: selectedCampaign?.keyword || '',
                    campaign_location: selectedCampaign?.location || '',
                    step_number: stepIndex + 1,
                    total_steps: generatedSteps.length,
                    previous_steps: previousSteps
                })
            });

            if (!response.ok) {
                throw new Error('Failed to regenerate step');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Regeneration failed');
            }

            // Update the specific step
            const newSteps = [...generatedSteps];
            newSteps[stepIndex] = data.step;
            setGeneratedSteps(newSteps);
        } catch (err: any) {
            setError(err.message || 'Failed to regenerate step');
        } finally {
            setRegeneratingStep(null);
        }
    };

    const handleUseSequence = () => {
        onUseSequence(generatedSteps);
        onClose();
    };

    if (!isOpen) return null;

    const inputStyle = "w-full p-3 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500";
    const labelStyle = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2";

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Generate with AI</h2>
                            <p className="text-xs text-gray-500">
                                {step === 1 ? 'Step 1: Business Profile' : 'Step 2: Review Sequence'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {isLoadingProfile ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <p className="text-sm text-gray-500">Loading your profile...</p>
                        </div>
                    ) : step === 1 ? (
                        <div className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Business Profile Card */}
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <Building2 size={16} className="text-gray-500" />
                                    <span className="text-sm font-bold text-gray-700">Business Profile</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelStyle}>Business Name *</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={profile.business_name}
                                            onChange={(e) => setProfile({ ...profile, business_name: e.target.value })}
                                            placeholder="e.g. Acme Marketing"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Industry</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={profile.industry}
                                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                                            placeholder="e.g. Digital Marketing"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelStyle}>What We Do (Value Proposition) *</label>
                                        <textarea
                                            className={`${inputStyle} min-h-[80px] resize-none`}
                                            value={profile.value_proposition}
                                            onChange={(e) => setProfile({ ...profile, value_proposition: e.target.value })}
                                            placeholder="e.g. We help local businesses get more customers through Google Ads and SEO"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Target Audience</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={profile.target_audience}
                                            onChange={(e) => setProfile({ ...profile, target_audience: e.target.value })}
                                            placeholder="e.g. Local service businesses"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelStyle}>Tone</label>
                                        <select
                                            className={inputStyle}
                                            value={profile.tone}
                                            onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
                                        >
                                            <option value="professional">Professional</option>
                                            <option value="friendly">Friendly</option>
                                            <option value="direct">Direct</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Sequence Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelStyle}>Campaign Context</label>
                                    <select
                                        className={inputStyle}
                                        value={selectedCampaignId}
                                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                                    >
                                        <option value="">No specific campaign</option>
                                        {campaigns.map(campaign => (
                                            <option key={campaign.id} value={campaign.id}>
                                                {campaign.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Optional: Use campaign targeting info to personalize emails
                                    </p>
                                </div>
                                <div>
                                    <label className={labelStyle}>Number of Steps</label>
                                    <select
                                        className={inputStyle}
                                        value={numSteps}
                                        onChange={(e) => setNumSteps(parseInt(e.target.value) as 3 | 4 | 5)}
                                    >
                                        <option value={3}>3 Steps</option>
                                        <option value={4}>4 Steps</option>
                                        <option value={5}>5 Steps</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Regenerate All Button */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                >
                                    <ChevronLeft size={16} />
                                    Back to Profile
                                </button>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                >
                                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                                    Regenerate All
                                </button>
                            </div>

                            {/* Generated Steps */}
                            {generatedSteps.map((genStep, index) => (
                                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <span className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-black">
                                                {genStep.step}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">
                                                {genStep.delay_days === 0 ? 'Send immediately' : `Wait ${genStep.delay_days} days`}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleRegenerateStep(index)}
                                            disabled={regeneratingStep !== null}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <RefreshCw size={12} className={regeneratingStep === index ? 'animate-spin' : ''} />
                                            Regenerate
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-3">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Subject</span>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{genStep.subject}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">Body</span>
                                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap leading-relaxed">
                                                {genStep.body}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>

                    {step === 1 ? (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !profile.business_name || !profile.value_proposition}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-bold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    Generate Sequence
                                    <ChevronRight size={16} />
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleUseSequence}
                            disabled={generatedSteps.length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm font-bold hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                        >
                            <Check size={16} />
                            Use This Sequence
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateSequenceModal;
