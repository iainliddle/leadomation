import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type {
    PlanType,
    PlanLimits,
    FeatureAccess,
} from '../lib/planLimits';
import {
    getPlanLimits,
    getFeatureAccess,
    getEffectivePlan,
    getTrialDaysRemaining,
} from '../lib/planLimits';

interface UsePlanReturn {
    plan: PlanType;
    rawPlan: string;
    isLoading: boolean;
    trialDaysRemaining: number;
    isTrialActive: boolean;
    billingInterval: string | null;
    limits: PlanLimits;
    features: FeatureAccess;
    canAccess: (feature: keyof FeatureAccess) => boolean;
    usage: {
        leadsUsed: number;
        emailsUsed: number;
        voiceCallsUsed: number;
        aiEmailsUsed: number;
        keywordSearchesUsed: number;
        campaignsUsed: number;
        monthlyLeadsUsed: number;
        monthlyEmailsUsed: number;
        monthlyKeywordSearchesUsed: number;
    };
    canScrapeLeads: (count?: number) => boolean;
    canSendEmail: () => boolean;
    canMakeVoiceCall: () => boolean;
    canGenerateAiEmail: () => boolean;
    canSearchKeywords: () => boolean;
    canCreateCampaign: () => boolean;
    incrementUsage: (field: string, amount?: number) => Promise<void>;
    refreshPlan: () => Promise<void>;
}

export const usePlan = (): UsePlanReturn => {
    const [rawPlan, setRawPlan] = useState<string>('trial');
    const [trialEnd, setTrialEnd] = useState<string | null>(null);
    const [billingInterval, setBillingInterval] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [usage, setUsage] = useState({
        leadsUsed: 0,
        emailsUsed: 0,
        voiceCallsUsed: 0,
        aiEmailsUsed: 0,
        keywordSearchesUsed: 0,
        campaignsUsed: 0,
        monthlyLeadsUsed: 0,
        monthlyEmailsUsed: 0,
        monthlyKeywordSearchesUsed: 0,
    });

    const loadPlan = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('plan, trial_end, billing_interval, trial_leads_used, trial_emails_used, trial_voice_calls_used, trial_ai_emails_used, trial_keyword_searches_used, trial_campaigns_used, monthly_leads_used, monthly_emails_used, monthly_keyword_searches_used, monthly_reset_date')
                .eq('id', user.id)
                .single();

            if (profile) {
                setRawPlan(profile.plan || 'trial');
                setTrialEnd(profile.trial_end);
                setBillingInterval(profile.billing_interval);
                setUsage({
                    leadsUsed: profile.trial_leads_used || 0,
                    emailsUsed: profile.trial_emails_used || 0,
                    voiceCallsUsed: profile.trial_voice_calls_used || 0,
                    aiEmailsUsed: profile.trial_ai_emails_used || 0,
                    keywordSearchesUsed: profile.trial_keyword_searches_used || 0,
                    campaignsUsed: profile.trial_campaigns_used || 0,
                    monthlyLeadsUsed: profile.monthly_leads_used || 0,
                    monthlyEmailsUsed: profile.monthly_emails_used || 0,
                    monthlyKeywordSearchesUsed: profile.monthly_keyword_searches_used || 0,
                });

                if (profile.monthly_reset_date) {
                    const resetDate = new Date(profile.monthly_reset_date);
                    if (new Date() > resetDate) {
                        const nextReset = new Date();
                        nextReset.setMonth(nextReset.getMonth() + 1);
                        nextReset.setDate(1);
                        nextReset.setHours(0, 0, 0, 0);

                        await supabase
                            .from('profiles')
                            .update({
                                monthly_leads_used: 0,
                                monthly_emails_used: 0,
                                monthly_keyword_searches_used: 0,
                                monthly_reset_date: nextReset.toISOString(),
                            })
                            .eq('id', user.id);

                        setUsage(prev => ({
                            ...prev,
                            monthlyLeadsUsed: 0,
                            monthlyEmailsUsed: 0,
                            monthlyKeywordSearchesUsed: 0,
                        }));
                    }
                }
            }
        } catch (err) {
            console.error('Error loading plan:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadPlan();
    }, []);

    const effectivePlan = getEffectivePlan(rawPlan, trialEnd);
    const limits = getPlanLimits(effectivePlan);
    const features = getFeatureAccess(effectivePlan);
    const trialDaysRemaining = getTrialDaysRemaining(trialEnd);
    const isTrialActiveNow = effectivePlan === 'trial';

    const canAccess = (feature: keyof FeatureAccess): boolean => {
        return features[feature] === true;
    };

    const canScrapeLeads = (count: number = 1): boolean => {
        if (effectivePlan === 'trial') {
            return usage.leadsUsed + count <= limits.trialMaxLeads;
        }
        if (effectivePlan === 'starter') {
            return usage.monthlyLeadsUsed + count <= limits.maxLeadsPerMonth;
        }
        if (effectivePlan === 'pro') return true;
        return false;
    };

    const canSendEmail = (): boolean => {
        if (effectivePlan === 'trial') {
            return usage.emailsUsed < limits.trialMaxEmails;
        }
        return effectivePlan === 'starter' || effectivePlan === 'pro';
    };

    const canMakeVoiceCall = (): boolean => {
        if (!features.aiVoiceAgent) return false;
        if (effectivePlan === 'trial') {
            return usage.voiceCallsUsed < limits.trialMaxVoiceCalls;
        }
        return effectivePlan === 'pro';
    };

    const canGenerateAiEmail = (): boolean => {
        if (!features.aiEmailGeneration) return false;
        if (effectivePlan === 'trial') {
            return usage.aiEmailsUsed < limits.trialMaxAiEmails;
        }
        return effectivePlan === 'pro';
    };

    const canSearchKeywords = (): boolean => {
        if (effectivePlan === 'trial') {
            return usage.keywordSearchesUsed < limits.trialMaxKeywordSearches;
        }
        if (effectivePlan === 'starter') {
            return usage.monthlyKeywordSearchesUsed < limits.maxKeywordSearches;
        }
        if (effectivePlan === 'pro') return true;
        return false;
    };

    const canCreateCampaign = (): boolean => {
        if (effectivePlan === 'trial') {
            return usage.campaignsUsed < limits.trialMaxCampaigns;
        }
        if (effectivePlan === 'starter' || effectivePlan === 'pro') {
            return true;
        }
        return false;
    };

    const incrementUsage = async (field: string, amount: number = 1) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const fieldMap: Record<string, string> = {
                leads: effectivePlan === 'trial' ? 'trial_leads_used' : 'monthly_leads_used',
                emails: effectivePlan === 'trial' ? 'trial_emails_used' : 'monthly_emails_used',
                voiceCalls: 'trial_voice_calls_used',
                aiEmails: 'trial_ai_emails_used',
                keywordSearches: effectivePlan === 'trial' ? 'trial_keyword_searches_used' : 'monthly_keyword_searches_used',
                campaigns: 'trial_campaigns_used',
            };

            const dbField = fieldMap[field];
            if (!dbField) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select(dbField)
                .eq('id', user.id)
                .single();

            if (profile) {
                const currentValue = (profile as any)[dbField] || 0;
                await supabase
                    .from('profiles')
                    .update({ [dbField]: currentValue + amount })
                    .eq('id', user.id);

                setUsage(prev => {
                    const usageFieldMap: Record<string, string> = {
                        leads: effectivePlan === 'trial' ? 'leadsUsed' : 'monthlyLeadsUsed',
                        emails: effectivePlan === 'trial' ? 'emailsUsed' : 'monthlyEmailsUsed',
                        voiceCalls: 'voiceCallsUsed',
                        aiEmails: 'aiEmailsUsed',
                        keywordSearches: effectivePlan === 'trial' ? 'keywordSearchesUsed' : 'monthlyKeywordSearchesUsed',
                        campaigns: 'campaignsUsed',
                    };
                    const key = usageFieldMap[field];
                    return { ...prev, [key]: (prev as any)[key] + amount };
                });
            }
        } catch (err) {
            console.error('Error incrementing usage:', err);
        }
    };

    return {
        plan: effectivePlan,
        rawPlan,
        isLoading,
        trialDaysRemaining,
        isTrialActive: isTrialActiveNow,
        billingInterval,
        limits,
        features,
        canAccess,
        usage,
        canScrapeLeads,
        canSendEmail,
        canMakeVoiceCall,
        canGenerateAiEmail,
        canSearchKeywords,
        canCreateCampaign,
        incrementUsage,
        refreshPlan: loadPlan,
    };
};
