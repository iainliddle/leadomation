import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle,
    Clock,
    BarChart2,
    Lock
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlan } from '../hooks/usePlan';
import UpgradeModal from '../components/UpgradeModal';

interface Recommendation {
    priority: number;
    action: string;
    expected_impact: string;
}

interface SpamAccuracy {
    false_positive: number;
    false_negative: number;
}

interface ReportData {
    summary: string;
    open_rate_avg: number;
    click_rate_avg: number;
    reply_rate_avg: number;
    bounce_rate_avg: number;
    top_subject_patterns: string[];
    worst_subject_patterns: string[];
    best_send_window: string;
    sequence_insights: string;
    intent_accuracy: number;
    spam_accuracy: SpamAccuracy;
    recommendations: Recommendation[];
}

interface PerformanceReport {
    id: string;
    user_id: string;
    report_type: string;
    report_data: ReportData;
    emails_analysed: number;
    period_start: string;
    period_end: string;
    created_at: string;
}

const PerformanceInsights: React.FC = () => {
    const { canAccess } = usePlan();
    const hasAccess = canAccess('advancedAnalytics');

    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<PerformanceReport | null>(null);
    const [unanalysedCount, setUnanalysedCount] = useState(0);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Fetch latest report
                const { data: reportData } = await supabase
                    .from('performance_reports')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('report_type', 'user')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (reportData) {
                    setReport(reportData as PerformanceReport);
                }

                // Fetch unanalysed email count
                const { count } = await supabase
                    .from('email_events')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('analysed', false);

                setUnanalysedCount(count || 0);
            } catch (err) {
                console.error('Error fetching performance data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    // Skeleton loader component
    const SkeletonLoader = () => (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Header skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
                    <div>
                        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
                    </div>
                </div>
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Summary card skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-6 mb-6">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Metric cards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Recommendations skeleton */}
            <div className="mb-6">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-4">
                            <div className="h-4 w-20 bg-gray-200 rounded-full animate-pulse mb-2" />
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Subject insights skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                        <div className="space-y-2">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional insights skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-3" />
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );

    // Empty state component
    const EmptyState = () => {
        const emailsUntilReport = Math.max(0, 50 - unanalysedCount);

        return (
            <div className="p-6 bg-[#F8F9FA] min-h-screen">
                <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
                    <div className="max-w-md w-full bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                        {/* Card heading */}
                        <h1 className="text-xl font-semibold text-[#111827]">Performance Insights</h1>
                        <p className="text-sm text-[#6B7280] mt-1">AI-powered analysis of your outreach campaigns</p>
                        <div className="border-b border-gray-200 my-6" />

                        {/* Empty state content */}
                        <div className="flex justify-center mb-4">
                            <BarChart2 size={48} className="text-[#4F46E5]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[#111827] mt-4">
                            Your first report is on its way
                        </h2>
                        <p className="text-sm text-[#6B7280] mt-2">
                            We analyse your campaigns after every 50 emails sent. Keep sending and your first Performance Report will appear here automatically.
                        </p>
                        <p className="text-sm font-medium text-[#4F46E5] mt-4">
                            {unanalysedCount} emails sent. {emailsUntilReport} more until your first report.
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    // Locked state for Starter users
    const LockedState = () => (
        <div className="relative">
            {/* Blurred background */}
            <div className="p-6 bg-[#F8F9FA] min-h-screen filter blur-sm pointer-events-none">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <TrendingUp size={24} className="text-[#4F46E5]" />
                        <div>
                            <h1 className="text-2xl font-semibold text-[#111827]">Performance Insights</h1>
                            <p className="text-sm text-[#6B7280]">AI-powered analysis of your outreach campaigns</p>
                        </div>
                    </div>
                </div>

                {/* Summary card placeholder */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-6 mb-6">
                    <p className="text-[#111827]">Your campaign performance summary will appear here with AI-generated insights about your outreach effectiveness.</p>
                    <p className="text-sm text-[#6B7280] mt-3">Next report after 42 more emails</p>
                </div>

                {/* Metric cards placeholder */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {['Open Rate', 'Click Rate', 'Reply Rate', 'Bounce Rate'].map((label) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <div className="text-3xl font-bold text-[#111827]">24.5%</div>
                            <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                                {label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommendations placeholder */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#111827] mb-4">Your Top 5 Recommendations</h2>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-4">
                                <span className="inline-block bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold rounded-full px-2 py-1">
                                    Priority {i}
                                </span>
                                <p className="text-sm font-medium text-[#111827] mt-1">Sample recommendation action</p>
                                <p className="text-sm text-[#6B7280] mt-1">Expected impact description</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay card */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 max-w-md mx-4 text-center">
                    <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock size={28} className="text-[#4F46E5]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#111827] mb-2">Performance Insights</h2>
                    <p className="text-sm text-[#6B7280] mb-6">
                        Performance Insights is a Pro feature. Upgrade to unlock AI-powered campaign analysis after every 50 emails.
                    </p>
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-all flex items-center gap-2 mx-auto"
                    >
                        <Lock size={14} />
                        Upgrade to Pro
                    </button>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature="Performance Insights"
                targetPlan="pro"
            />
        </div>
    );

    // Show locked state for Starter users
    if (!hasAccess) {
        return <LockedState />;
    }

    // Show skeleton while loading
    if (loading) {
        return <SkeletonLoader />;
    }

    // Show empty state if no report exists
    if (!report) {
        return <EmptyState />;
    }

    const { report_data } = report;
    const emailsUntilNextReport = Math.max(0, 50 - unanalysedCount);

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            {/* Section 1: Page header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-[#4F46E5]" />
                    <div>
                        <h1 className="text-2xl font-semibold text-[#111827]">Performance Insights</h1>
                        <p className="text-sm text-[#6B7280]">AI-powered analysis of your outreach campaigns</p>
                    </div>
                </div>
                <p className="text-sm text-[#9CA3AF]">
                    Report generated {formatDate(report.created_at)}
                </p>
            </div>

            {/* Section 2: Summary card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-6 mb-6">
                <p className="text-[#111827]">{report_data.summary}</p>
                <p className="text-sm text-[#6B7280] mt-3">
                    Next report after {emailsUntilNextReport} more emails
                </p>
            </div>

            {/* Section 3: Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="text-3xl font-bold text-[#111827]">
                        {formatPercentage(report_data.open_rate_avg)}
                    </div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                        <TrendingUp size={14} className="text-green-500" />
                        Open Rate
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="text-3xl font-bold text-[#111827]">
                        {formatPercentage(report_data.click_rate_avg)}
                    </div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                        <TrendingUp size={14} className="text-green-500" />
                        Click Rate
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="text-3xl font-bold text-[#111827]">
                        {formatPercentage(report_data.reply_rate_avg)}
                    </div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                        <TrendingUp size={14} className="text-green-500" />
                        Reply Rate
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="text-3xl font-bold text-[#111827]">
                        {formatPercentage(report_data.bounce_rate_avg)}
                    </div>
                    <div className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                        <TrendingDown size={14} className="text-red-500" />
                        Bounce Rate
                    </div>
                </div>
            </div>

            {/* Section 4: Recommendations */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#111827] mb-4">Your Top 5 Recommendations</h2>
                <div className="space-y-3">
                    {report_data.recommendations.map((rec, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-[#4F46E5] p-4"
                        >
                            <span className="inline-block bg-[#EEF2FF] text-[#4F46E5] text-xs font-semibold rounded-full px-2 py-1">
                                Priority {rec.priority}
                            </span>
                            <p className="text-sm font-medium text-[#111827] mt-1">{rec.action}</p>
                            <p className="text-sm text-[#6B7280] mt-1">{rec.expected_impact}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 5: Subject line insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle size={18} className="text-green-500" />
                        <h3 className="text-base font-semibold text-[#111827]">What is Working</h3>
                    </div>
                    <ul className="space-y-2">
                        {report_data.top_subject_patterns.map((pattern, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-[#111827]">{pattern}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle size={18} className="text-red-500" />
                        <h3 className="text-base font-semibold text-[#111827]">What to Avoid</h3>
                    </div>
                    <ul className="space-y-2">
                        {report_data.worst_subject_patterns.map((pattern, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                                <span className="text-sm text-[#111827]">{pattern}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Section 6: Additional insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={18} className="text-[#4F46E5]" />
                        <h3 className="text-base font-semibold text-[#111827]">Best Send Window</h3>
                    </div>
                    <p className="text-sm text-[#111827]">{report_data.best_send_window}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart2 size={18} className="text-[#4F46E5]" />
                        <h3 className="text-base font-semibold text-[#111827]">Sequence Insights</h3>
                    </div>
                    <p className="text-sm text-[#111827]">{report_data.sequence_insights}</p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceInsights;
