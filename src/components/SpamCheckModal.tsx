import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SpamCheckResult {
    score: number;
    issues: string[];
    suggestions: string[];
    flagged_words: string[];
}

interface SpamCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    subject: string;
    body: string;
    sequenceId?: string;
    stepIndex: number;
    onScoreUpdate?: (stepIndex: number, score: number) => void;
}

const SpamCheckModal: React.FC<SpamCheckModalProps> = ({
    isOpen,
    onClose,
    subject,
    body,
    sequenceId,
    stepIndex,
    onScoreUpdate
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<SpamCheckResult | null>(null);

    const runSpamCheck = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Get auth token
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) {
                throw new Error('Please log in to use this feature');
            }

            const response = await fetch('/api/spam-check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subject, body })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze email');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Analysis failed');
            }

            setResult({
                score: data.score,
                issues: data.issues,
                suggestions: data.suggestions,
                flagged_words: data.flagged_words
            });

            // Save to Supabase
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('spam_check_scores').insert({
                    user_id: user.id,
                    sequence_id: sequenceId || null,
                    step_index: stepIndex,
                    subject: subject,
                    score: data.score,
                    issues: data.issues,
                    suggestions: data.suggestions,
                    checked_at: new Date().toISOString()
                });
            }

            // Notify parent of score update
            if (onScoreUpdate) {
                onScoreUpdate(stepIndex, data.score);
            }

        } catch (err: any) {
            setError(err.message || 'Failed to check deliverability');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            runSpamCheck();
        } else {
            setResult(null);
            setError(null);
        }
    }, [isOpen, subject, body]);

    if (!isOpen) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return { bg: '#D1FAE5', text: '#059669', ring: '#10B981' };
        if (score >= 50) return { bg: '#FEF3C7', text: '#D97706', ring: '#F59E0B' };
        return { bg: '#FEE2E2', text: '#DC2626', ring: '#EF4444' };
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 50) return 'Needs Work';
        return 'High Risk';
    };

    const scoreColors = result ? getScoreColor(result.score) : null;

    // Function to highlight flagged words in the body
    const highlightFlaggedWords = (text: string, flaggedWords: string[]) => {
        if (!flaggedWords || flaggedWords.length === 0) return text;

        let highlightedText = text;
        flaggedWords.forEach(word => {
            const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="bg-red-100 text-red-700 px-1 rounded">$1</mark>');
        });
        return highlightedText;
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-black text-[#111827]">Deliverability Check</h2>
                        <p className="text-sm text-gray-500">Step {stepIndex + 1} Analysis</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-sm font-medium text-gray-600">Analyzing your email...</p>
                            <p className="text-xs text-gray-400 mt-1">This takes a few seconds</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">Analysis Failed</p>
                            <p className="text-xs text-gray-500 mb-4">{error}</p>
                            <button
                                onClick={runSpamCheck}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                        </div>
                    ) : result ? (
                        <div className="space-y-6">
                            {/* Score Dial */}
                            <div className="flex items-center justify-center">
                                <div className="relative">
                                    <svg width="160" height="160" viewBox="0 0 160 160">
                                        {/* Background circle */}
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="12"
                                        />
                                        {/* Score arc */}
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            fill="none"
                                            stroke={scoreColors?.ring}
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            strokeDasharray={`${(result.score / 100) * 440} 440`}
                                            transform="rotate(-90 80 80)"
                                            style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-black" style={{ color: scoreColors?.text }}>
                                            {result.score}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                            {getScoreLabel(result.score)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Issues */}
                            {result.issues.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-red-500" />
                                        Issues Found ({result.issues.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {result.issues.map((issue, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg"
                                            >
                                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                    <AlertTriangle size={12} className="text-red-600" />
                                                </div>
                                                <p className="text-sm text-red-800">{issue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {result.suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle size={16} className="text-green-500" />
                                        Suggestions ({result.suggestions.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {result.suggestions.map((suggestion, i) => (
                                            <div
                                                key={i}
                                                className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg"
                                            >
                                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                    <CheckCircle size={12} className="text-green-600" />
                                                </div>
                                                <p className="text-sm text-green-800">{suggestion}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Flagged Words */}
                            {result.flagged_words.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3">
                                        Flagged Words
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.flagged_words.map((word, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Preview with highlights */}
                            {result.flagged_words.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 mb-3">
                                        Email Preview
                                    </h3>
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <p className="text-sm font-bold text-gray-900 mb-2">
                                            Subject: <span dangerouslySetInnerHTML={{ __html: highlightFlaggedWords(subject, result.flagged_words) }} />
                                        </p>
                                        <div
                                            className="text-sm text-gray-600 whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: highlightFlaggedWords(body, result.flagged_words) }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* No issues found */}
                            {result.issues.length === 0 && result.suggestions.length === 0 && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Looking great!</p>
                                    <p className="text-xs text-gray-500 mt-1">No deliverability issues detected.</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                {result && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={runSpamCheck}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-bold transition-all"
                        >
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                            Re-check
                        </button>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpamCheckModal;
