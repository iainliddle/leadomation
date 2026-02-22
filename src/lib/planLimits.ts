// ===== PLAN LIMITS & FEATURE GATES =====

export type PlanType = 'trial' | 'starter' | 'pro' | 'cancelled' | 'expired';

export interface PlanLimits {
    maxCampaigns: number;
    maxLeadsPerMonth: number;
    maxEmailsPerDay: number;
    maxSequenceSteps: number;
    maxKeywordSearches: number;
    maxEmailTemplates: number;
    trialMaxLeads: number;
    trialMaxEmails: number;
    trialMaxVoiceCalls: number;
    trialMaxAiEmails: number;
    trialMaxKeywordSearches: number;
    trialMaxCampaigns: number;
}

export interface FeatureAccess {
    dashboard: boolean;
    globalDemand: boolean;
    newCampaign: boolean;
    activeCampaigns: boolean;
    leadDatabase: boolean;
    dealPipeline: boolean;
    sequenceBuilder: boolean;
    inbox: boolean;
    emailTemplates: boolean;
    integrations: boolean;
    emailConfig: boolean;
    compliance: boolean;
    settings: boolean;
    pricingPage: boolean;
    csvExport: boolean;
    aiEmailGeneration: boolean;
    aiVoiceAgent: boolean;
    linkedinAutomation: boolean;
    spintax: boolean;
    advancedAnalytics: boolean;
    inboxWarmup: boolean;
    inboxRotation: boolean;
    decisionMakerEnrichment: boolean;
    multiChannelSequences: boolean;
    prioritySupport: boolean;
    unlimitedKeywordSearches: boolean;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
    trial: {
        maxCampaigns: 1,
        maxLeadsPerMonth: 25,
        maxEmailsPerDay: 10,
        maxSequenceSteps: 4,
        maxKeywordSearches: 5,
        maxEmailTemplates: 6,
        trialMaxLeads: 25,
        trialMaxEmails: 10,
        trialMaxVoiceCalls: 2,
        trialMaxAiEmails: 5,
        trialMaxKeywordSearches: 5,
        trialMaxCampaigns: 1,
    },
    starter: {
        maxCampaigns: 3,
        maxLeadsPerMonth: 500,
        maxEmailsPerDay: 50,
        maxSequenceSteps: 4,
        maxKeywordSearches: 50,
        maxEmailTemplates: 6,
        trialMaxLeads: 0,
        trialMaxEmails: 0,
        trialMaxVoiceCalls: 0,
        trialMaxAiEmails: 0,
        trialMaxKeywordSearches: 0,
        trialMaxCampaigns: 0,
    },
    pro: {
        maxCampaigns: Infinity,
        maxLeadsPerMonth: Infinity,
        maxEmailsPerDay: 200,
        maxSequenceSteps: Infinity,
        maxKeywordSearches: Infinity,
        maxEmailTemplates: Infinity,
        trialMaxLeads: 0,
        trialMaxEmails: 0,
        trialMaxVoiceCalls: 0,
        trialMaxAiEmails: 0,
        trialMaxKeywordSearches: 0,
        trialMaxCampaigns: 0,
    },
};

export const FEATURE_ACCESS: Record<string, FeatureAccess> = {
    trial: {
        dashboard: true,
        globalDemand: true,
        newCampaign: true,
        activeCampaigns: true,
        leadDatabase: true,
        dealPipeline: true,
        sequenceBuilder: true,
        inbox: true,
        emailTemplates: true,
        integrations: true,
        emailConfig: true,
        compliance: true,
        settings: true,
        pricingPage: true,
        csvExport: false,
        aiEmailGeneration: true,
        aiVoiceAgent: true,
        linkedinAutomation: true,
        spintax: true,
        advancedAnalytics: true,
        inboxWarmup: false,
        inboxRotation: false,
        decisionMakerEnrichment: true,
        multiChannelSequences: true,
        prioritySupport: false,
        unlimitedKeywordSearches: false,
    },
    starter: {
        dashboard: true,
        globalDemand: false,
        newCampaign: true,
        activeCampaigns: true,
        leadDatabase: true,
        dealPipeline: false,
        sequenceBuilder: true,
        inbox: false,
        emailTemplates: true,
        integrations: true,
        emailConfig: true,
        compliance: true,
        settings: true,
        pricingPage: true,
        csvExport: true,
        aiEmailGeneration: false,
        aiVoiceAgent: false,
        linkedinAutomation: true,
        spintax: false,
        advancedAnalytics: false,
        inboxWarmup: false,
        inboxRotation: false,
        decisionMakerEnrichment: false,
        multiChannelSequences: false,
        prioritySupport: false,
        unlimitedKeywordSearches: false,
    },
    pro: {
        dashboard: true,
        globalDemand: true,
        newCampaign: true,
        activeCampaigns: true,
        leadDatabase: true,
        dealPipeline: true,
        sequenceBuilder: true,
        inbox: true,
        emailTemplates: true,
        integrations: true,
        emailConfig: true,
        compliance: true,
        settings: true,
        pricingPage: true,
        csvExport: true,
        aiEmailGeneration: true,
        aiVoiceAgent: true,
        linkedinAutomation: true,
        spintax: true,
        advancedAnalytics: true,
        inboxWarmup: true,
        inboxRotation: true,
        decisionMakerEnrichment: true,
        multiChannelSequences: true,
        prioritySupport: true,
        unlimitedKeywordSearches: true,
    },
    cancelled: {
        dashboard: true,
        globalDemand: false,
        newCampaign: false,
        activeCampaigns: false,
        leadDatabase: false,
        dealPipeline: false,
        sequenceBuilder: false,
        inbox: false,
        emailTemplates: false,
        integrations: false,
        emailConfig: false,
        compliance: false,
        settings: true,
        pricingPage: true,
        csvExport: false,
        aiEmailGeneration: false,
        aiVoiceAgent: false,
        linkedinAutomation: false,
        spintax: false,
        advancedAnalytics: false,
        inboxWarmup: false,
        inboxRotation: false,
        decisionMakerEnrichment: false,
        multiChannelSequences: false,
        prioritySupport: false,
        unlimitedKeywordSearches: false,
    },
    expired: {
        dashboard: true,
        globalDemand: false,
        newCampaign: false,
        activeCampaigns: false,
        leadDatabase: false,
        dealPipeline: false,
        sequenceBuilder: false,
        inbox: false,
        emailTemplates: false,
        integrations: false,
        emailConfig: false,
        compliance: false,
        settings: true,
        pricingPage: true,
        csvExport: false,
        aiEmailGeneration: false,
        aiVoiceAgent: false,
        linkedinAutomation: false,
        spintax: false,
        advancedAnalytics: false,
        inboxWarmup: false,
        inboxRotation: false,
        decisionMakerEnrichment: false,
        multiChannelSequences: false,
        prioritySupport: false,
        unlimitedKeywordSearches: false,
    },
};

export const getPlanLimits = (plan: string): PlanLimits => {
    return PLAN_LIMITS[plan] || PLAN_LIMITS['cancelled'];
};

export const getFeatureAccess = (plan: string): FeatureAccess => {
    return FEATURE_ACCESS[plan] || FEATURE_ACCESS['cancelled'];
};

export const isTrialActive = (trialEnd: string | null): boolean => {
    if (!trialEnd) return false;
    return new Date(trialEnd) > new Date();
};

export const getTrialDaysRemaining = (trialEnd: string | null): number => {
    if (!trialEnd) return 0;
    const end = new Date(trialEnd);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const getEffectivePlan = (
    plan: string,
    trialEnd: string | null
): PlanType => {
    if (plan === 'trial') {
        return isTrialActive(trialEnd) ? 'trial' : 'expired';
    }
    if (plan === 'cancelled') return 'cancelled';
    if (plan === 'starter' || plan === 'pro') return plan as PlanType;
    return 'expired';
};