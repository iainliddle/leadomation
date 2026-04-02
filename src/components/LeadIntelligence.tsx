import React, { useState, useEffect } from 'react';
import { Brain, Target, Lightbulb, Sparkles, RefreshCw, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlan } from '../hooks/usePlan';

interface IntelligenceData {
    opportunity_rating: 'Hot' | 'Warm' | 'Cold';
    opportunity_reason: string;
    pain_intensity_score: number;
    pain_point: string;
    consequences_of_inaction: string;
    buying_readiness: string;
    decision_maker_profile: string;
    outreach_angle: string;
    personalisation_hook: string;
    suggested_subject_line: string;
    suggested_opening_line: string;
}

interface LeadIntelligenceProps {
    leadId: string;
    leadName: string;
    cachedIntelligence?: IntelligenceData | null;
    cachedAt?: string | null;
}

const ratingConfig = {
    Hot: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700', icon: '🔥' },
    Warm: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', icon: '⚡' },
    Cold: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', icon: '❄️' },
};

const LeadIntelligence: React.FC<LeadIntelligenceProps> = ({
    leadId,
    leadName,
    cachedIntelligence,
    cachedAt,
}) => {
    const { plan } = usePlan();
    const [intelligence, setIntelligence] = useState<IntelligenceData | null>(cachedIntelligence || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCached, setIsCached] = useState(!!cachedIntelligence);

    const dailyLimit = plan === 'pro' || plan === 'trial' || plan === 'trialing' ? 50 : 10;
    const [remaining, setRemaining] = useState(dailyLimit);

    const handleResearch = async (forceRefresh = false) => {
        if (!forceRefresh && intelligence) return;

        setIsLoading(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            // If force refresh, clear cache first
            if (forceRefresh) {
                await supabase
                    .from('leads')
                    .update({ lead_intelligence: null, intelligence_generated_at: null })
                    .eq('id', leadId);
            }

            const response = await fetch('/api/research-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ lead_id: leadId }),
            });

            if (response.status === 429) {
                const data = await response.json();
                setError(`Daily research limit reached (${data.limit}/day). Resets tomorrow.`);
                setRemaining(0);
                return;
            }

            if (!response.ok) throw new Error('Research failed');

            const data = await response.json();
            setIntelligence(data.intelligence);
            setIsCached(data.cached);
            if (!data.cached) {
                setRemaining(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            setError('Research failed. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (cachedIntelligence) {
            setIntelligence(cachedIntelligence);
            setIsCached(true);
        } else {
            setIntelligence(null);
            setIsCached(false);
        }
    }, [leadId, cachedIntelligence]);

    const rating = intelligence?.opportunity_rating;
    const config = rating ? ratingConfig[rating] : null;

    return (
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain size={16} className="text-[#4F46E5]" />
                    <h3 className="text-sm font-semibold text-gray-900">Lead intelligence</h3>
                    {isCached && cachedAt && (
                        <span className="text-xs text-gray-400">
                            Generated {new Date(cachedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {intelligence && (
                        <button
                            onClick={() => handleResearch(true)}
                            disabled={isLoading || remaining <= 0}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#4F46E5] transition-colors"
                            title="Re-research this lead"
                        >
                            <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    )}
                    <span className="text-xs text-gray-400">{remaining} remaining today</span>
                </div>
            </div>

            {/* Not yet researched state */}
            {!intelligence && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-3">
                        <Sparkles size={22} className="text-[#4F46E5]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">AI lead research</p>
                    <p className="text-xs text-gray-500 max-w-[220px] mb-4">
                        Get an AI-generated intelligence report for {leadName} including opportunity rating, pain points and outreach angles.
                    </p>
                    {remaining <= 0 ? (
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                            <Lock size={12} />
                            Daily limit reached. Resets tomorrow.
                        </div>
                    ) : (
                        <button
                            onClick={() => handleResearch()}
                            className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white text-sm font-medium rounded-lg hover:bg-[#4338CA] transition-colors"
                        >
                            <Brain size={14} />
                            Research this lead
                        </button>
                    )}
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-10">
                    <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mb-3" />
                    <p className="text-sm text-gray-500">Researching {leadName}...</p>
                    <p className="text-xs text-gray-400 mt-1">This takes 10 to 20 seconds</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Intelligence cards */}
            {intelligence && !isLoading && (
                <div className="space-y-3">

                    {/* Opportunity Rating */}
                    {config && (
                        <div className={`${config.bg} ${config.border} border rounded-xl p-4`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{config.icon}</span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Opportunity rating</span>
                                </div>
                                <span className={`${config.badge} text-xs font-bold px-2.5 py-0.5 rounded-full`}>
                                    {intelligence.opportunity_rating}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{intelligence.opportunity_reason}</p>
                            {intelligence.pain_intensity_score && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Pain intensity</span>
                                    <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#4F46E5] rounded-full"
                                            style={{ width: `${intelligence.pain_intensity_score * 10}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700">{intelligence.pain_intensity_score}/10</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pain Point */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={14} className="text-[#4F46E5]" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pain point</span>
                        </div>
                        <p className="text-sm text-gray-700">{intelligence.pain_point}</p>
                        {intelligence.consequences_of_inaction && (
                            <p className="text-xs text-gray-500 mt-2 italic">{intelligence.consequences_of_inaction}</p>
                        )}
                    </div>

                    {/* Outreach Angle */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target size={14} className="text-[#4F46E5]" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outreach angle</span>
                        </div>
                        <p className="text-sm text-gray-700">{intelligence.outreach_angle}</p>
                    </div>

                    {/* Personalisation Hook */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Lightbulb size={14} className="text-amber-500" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personalisation hook</span>
                        </div>
                        <p className="text-sm text-gray-700">{intelligence.personalisation_hook}</p>
                    </div>

                    {/* Suggested outreach */}
                    {(intelligence.suggested_subject_line || intelligence.suggested_opening_line) && (
                        <div className="bg-[#EEF2FF] border border-indigo-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={14} className="text-[#4F46E5]" />
                                <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">Suggested outreach</span>
                            </div>
                            {intelligence.suggested_subject_line && (
                                <div className="mb-2">
                                    <span className="text-xs font-medium text-gray-500">Subject line</span>
                                    <p className="text-sm font-medium text-gray-900 mt-0.5">{intelligence.suggested_subject_line}</p>
                                </div>
                            )}
                            {intelligence.suggested_opening_line && (
                                <div>
                                    <span className="text-xs font-medium text-gray-500">Opening line</span>
                                    <p className="text-sm text-gray-700 mt-0.5">{intelligence.suggested_opening_line}</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};

export default LeadIntelligence;
