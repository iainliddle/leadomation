import type { SupabaseClient } from '@supabase/supabase-js';
import { getEffectivePlan, getPlanLimits } from './planLimits.js';

export type PlanCapKind = 'daily_emails' | 'monthly_keyword_search';

export interface PlanCapDenyBody {
    error: string;
    code: 'plan_limit_reached';
    kind: PlanCapKind;
    plan: string;
    limit: number;
    used: number;
    resetsAt: string;
}

export type PlanCapResult =
    | { ok: true; plan: string; limit: number; used: number; resetsAt: string }
    | { ok: false; status: 402; body: PlanCapDenyBody };

function startOfUtcDay(now: Date): Date {
    const d = new Date(now);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function startOfNextUtcDay(now: Date): Date {
    const d = startOfUtcDay(now);
    d.setUTCDate(d.getUTCDate() + 1);
    return d;
}

function startOfUtcMonth(now: Date): Date {
    const d = new Date(now);
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function startOfNextUtcMonth(now: Date): Date {
    const d = startOfUtcMonth(now);
    d.setUTCMonth(d.getUTCMonth() + 1);
    return d;
}

export async function assertWithinPlanCap(
    supabase: SupabaseClient,
    userId: string,
    kind: PlanCapKind
): Promise<PlanCapResult> {
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan, trial_end')
        .eq('id', userId)
        .single();

    const plan = getEffectivePlan(profile?.plan ?? null, profile?.trial_end ?? null);
    const limits = getPlanLimits(plan);
    const now = new Date();

    let limit: number;
    let used: number;
    let resetsAt: string;

    if (kind === 'daily_emails') {
        limit = limits.maxEmailsPerDay;
        const windowStart = startOfUtcDay(now);
        resetsAt = startOfNextUtcDay(now).toISOString();

        const { count, error } = await supabase
            .from('sequence_step_logs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('channel', 'email')
            .eq('status', 'sent')
            .gte('sent_at', windowStart.toISOString());

        if (error) throw error;
        used = count || 0;
    } else {
        limit = limits.maxKeywordSearches;
        const windowStart = startOfUtcMonth(now);
        resetsAt = startOfNextUtcMonth(now).toISOString();

        const { count, error } = await supabase
            .from('demand_data')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('searched_at', windowStart.toISOString());

        if (error) throw error;
        used = count || 0;
    }

    if (Number.isFinite(limit) && used >= limit) {
        return {
            ok: false,
            status: 402,
            body: {
                error: `You've reached your ${plan} plan limit. Upgrade to keep going.`,
                code: 'plan_limit_reached',
                kind,
                plan,
                limit,
                used,
                resetsAt,
            },
        };
    }

    return { ok: true, plan, limit, used, resetsAt };
}
