import React from 'react';
import { FlaskConical, X, Trophy, BarChart3 } from 'lucide-react';

interface ABTestData {
    subject_b: string;
    ab_test_active: boolean;
    ab_sample_size: number;
    ab_winner: string | null;
    ab_variant_a_sends: number;
    ab_variant_a_opens: number;
    ab_variant_b_sends: number;
    ab_variant_b_opens: number;
}

interface ABTestConfigProps {
    subjectA: string;
    abTestData: ABTestData;
    onSubjectAChange: (value: string) => void;
    onABTestDataChange: (data: Partial<ABTestData>) => void;
    onEnableABTest: () => void;
    onRemoveABTest: () => void;
}

const ABTestConfig: React.FC<ABTestConfigProps> = ({
    subjectA,
    abTestData,
    onSubjectAChange,
    onABTestDataChange,
    onEnableABTest,
    onRemoveABTest
}) => {
    const calculateOpenRate = (opens: number, sends: number): string => {
        if (sends === 0) return '0';
        return ((opens / sends) * 100).toFixed(1);
    };

    const getWinnerStatus = (): 'testing' | 'winner_a' | 'winner_b' | 'no_data' => {
        if (abTestData.ab_winner === 'variant_a') return 'winner_a';
        if (abTestData.ab_winner === 'variant_b') return 'winner_b';

        const totalSends = abTestData.ab_variant_a_sends + abTestData.ab_variant_b_sends;
        if (totalSends === 0) return 'no_data';
        if (totalSends < abTestData.ab_sample_size) return 'testing';

        // Auto-determine winner based on open rate if sample size reached
        const rateA = abTestData.ab_variant_a_sends > 0
            ? abTestData.ab_variant_a_opens / abTestData.ab_variant_a_sends
            : 0;
        const rateB = abTestData.ab_variant_b_sends > 0
            ? abTestData.ab_variant_b_opens / abTestData.ab_variant_b_sends
            : 0;

        if (rateA > rateB) return 'winner_a';
        if (rateB > rateA) return 'winner_b';
        return 'testing';
    };

    const winnerStatus = abTestData.ab_test_active ? getWinnerStatus() : 'no_data';

    // Not in A/B test mode - show the Add A/B Test button
    if (!abTestData.ab_test_active) {
        return (
            <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">
                    Subject Line
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        className="flex-1 text-2xl font-black text-[#111827] focus:outline-none placeholder:text-gray-200 bg-transparent"
                        value={subjectA}
                        onChange={(e) => onSubjectAChange(e.target.value)}
                        placeholder="Enter subject line..."
                    />
                    <button
                        onClick={onEnableABTest}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border border-amber-200 rounded-xl text-xs font-black hover:from-amber-100 hover:to-orange-100 transition-all shrink-0"
                    >
                        <FlaskConical size={14} />
                        Add A/B Test
                    </button>
                </div>
            </div>
        );
    }

    // A/B Test mode - show both variants and config
    return (
        <div className="space-y-6">
            {/* Variant A */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-[9px] font-black">A</span>
                        Variant A (Original)
                        {winnerStatus === 'winner_a' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] font-black">
                                <Trophy size={10} />
                                WINNER
                            </span>
                        )}
                    </label>
                </div>
                <input
                    type="text"
                    className="w-full text-xl font-black text-[#111827] focus:outline-none placeholder:text-gray-200 bg-transparent p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={subjectA}
                    onChange={(e) => onSubjectAChange(e.target.value)}
                    placeholder="Enter subject line..."
                />
            </div>

            {/* Variant B */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-[9px] font-black">B</span>
                        Variant B
                        {winnerStatus === 'winner_b' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] font-black">
                                <Trophy size={10} />
                                WINNER
                            </span>
                        )}
                    </label>
                    <button
                        onClick={onRemoveABTest}
                        className="flex items-center gap-1 px-2 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-bold transition-all"
                    >
                        <X size={12} />
                        Remove A/B Test
                    </button>
                </div>
                <input
                    type="text"
                    className="w-full text-xl font-black text-[#111827] focus:outline-none placeholder:text-gray-200 bg-transparent p-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    value={abTestData.subject_b}
                    onChange={(e) => onABTestDataChange({ subject_b: e.target.value })}
                    placeholder="Enter variant B subject line..."
                />
            </div>

            {/* Config Row */}
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
                <FlaskConical size={18} className="text-amber-600 shrink-0" />
                <p className="text-sm font-medium text-amber-800 flex-1">
                    Test the first{' '}
                    <input
                        type="number"
                        min={10}
                        max={1000}
                        className="w-16 px-2 py-1 mx-1 bg-white border border-amber-200 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        value={abTestData.ab_sample_size}
                        onChange={(e) => onABTestDataChange({ ab_sample_size: parseInt(e.target.value) || 50 })}
                    />
                    {' '}sends equally, then send the winner automatically.
                </p>
            </div>

            {/* Results Panel */}
            {(abTestData.ab_variant_a_sends > 0 || abTestData.ab_variant_b_sends > 0) && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <BarChart3 size={16} className="text-gray-500" />
                        A/B Test Results
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Variant A Results */}
                        <div className={`p-3 rounded-xl border ${winnerStatus === 'winner_a' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-[9px] font-black">A</span>
                                <span className="text-xs font-bold text-gray-700">Variant A</span>
                                {winnerStatus === 'winner_a' && (
                                    <Trophy size={12} className="text-green-600 ml-auto" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Sends</span>
                                    <span className="font-bold text-gray-900">{abTestData.ab_variant_a_sends}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Opens</span>
                                    <span className="font-bold text-gray-900">{abTestData.ab_variant_a_opens}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Open Rate</span>
                                    <span className={`font-black ${winnerStatus === 'winner_a' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {calculateOpenRate(abTestData.ab_variant_a_opens, abTestData.ab_variant_a_sends)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Variant B Results */}
                        <div className={`p-3 rounded-xl border ${winnerStatus === 'winner_b' ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded flex items-center justify-center text-[9px] font-black">B</span>
                                <span className="text-xs font-bold text-gray-700">Variant B</span>
                                {winnerStatus === 'winner_b' && (
                                    <Trophy size={12} className="text-green-600 ml-auto" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Sends</span>
                                    <span className="font-bold text-gray-900">{abTestData.ab_variant_b_sends}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Opens</span>
                                    <span className="font-bold text-gray-900">{abTestData.ab_variant_b_opens}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Open Rate</span>
                                    <span className={`font-black ${winnerStatus === 'winner_b' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {calculateOpenRate(abTestData.ab_variant_b_opens, abTestData.ab_variant_b_sends)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-center">
                        {winnerStatus === 'testing' && (
                            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                                Testing in progress ({abTestData.ab_variant_a_sends + abTestData.ab_variant_b_sends}/{abTestData.ab_sample_size} sends)
                            </span>
                        )}
                        {winnerStatus === 'winner_a' && (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Trophy size={12} />
                                Winner: Variant A
                            </span>
                        )}
                        {winnerStatus === 'winner_b' && (
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                <Trophy size={12} />
                                Winner: Variant B
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ABTestConfig;
