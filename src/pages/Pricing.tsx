import React, { useState } from 'react';
import {
    Check,
    Sparkles,
    Zap,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    X,
    Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PricingCardProps {
    title: string;
    description: string;
    monthlyPrice: string;
    annualPrice: string;
    annualMonthlyRate: string;
    features: string[];
    isPopular?: boolean;
    isAnnual: boolean;
    icon: React.ReactNode;
    buttonText: string;
    savingsBadge?: string;
    onCheckout: (plan: string) => void;
    isComingSoon?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
    description,
    monthlyPrice,
    annualPrice,
    annualMonthlyRate,
    features,
    isPopular,
    isAnnual,
    icon,
    buttonText,
    savingsBadge,
    onCheckout,
    isComingSoon
}) => (
    <div className={`relative bg-white rounded-xl p-8 ${isPopular
        ? 'border-2 border-[#4F46E5] shadow-xl'
        : isComingSoon
            ? 'bg-gray-50 border border-[#E5E7EB] opacity-80'
            : 'border border-[#E5E7EB] shadow-sm'
        }`}>
        {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                MOST POPULAR
            </div>
        )}
        {isComingSoon && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                COMING SOON
            </div>
        )}

        <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPopular ? 'bg-purple-50 text-purple-600' : 'bg-[#EEF2FF] text-[#4F46E5]'}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
                <p className="text-sm text-[#6B7280]">{description}</p>
            </div>
        </div>

        <div className="mb-6">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#111827]">{isAnnual ? annualPrice : monthlyPrice}</span>
                <span className="text-sm text-gray-400">/{isAnnual ? 'year' : 'month'}</span>
            </div>
            {isAnnual && (
                <p className="text-sm text-[#6B7280] mt-1">({annualMonthlyRate}/mo)</p>
            )}
            {isAnnual && savingsBadge && (
                <span className="inline-block mt-2 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {savingsBadge}
                </span>
            )}
        </div>

        {isPopular && (
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">
                Everything in Starter, plus:
            </p>
        )}

        <ul className="space-y-3 mb-8">
            {features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                    <Check size={16} strokeWidth={3} className="text-[#4F46E5] w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-sm text-[#6B7280]">{feature}</span>
                </li>
            ))}
        </ul>

        <button
            onClick={() => !isComingSoon && onCheckout(title)}
            disabled={isComingSoon}
            className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isComingSoon
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : isPopular
                    ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                    : 'border border-[#4F46E5] text-[#4F46E5] hover:bg-[#EEF2FF]'
                }`}
        >
            {buttonText}
            {!isComingSoon && <ArrowRight size={16} />}
        </button>
    </div>
);

const Pricing: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [expandedTerms, setExpandedTerms] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelled, setCancelled] = useState(false);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('checkout') === 'cancelled') {
            setCancelled(true);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    const handleCheckout = async (plan: string) => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert('Please sign in to subscribe.');
                return;
            }

            const correctPriceId = plan === 'Starter'
                ? (isAnnual ? 'price_1T1nCe2LCoJYV9n6X6dU6Ybe' : 'price_1T1nCe2LCoJYV9n6l20Wnd9Y')
                : (isAnnual ? 'price_1T1nFP2LCoJYV9n6CyKYDjKE' : 'price_1T1nFP2LCoJYV9n6iKcaO1ZY');

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: correctPriceId,
                    userId: session.user.id,
                    userEmail: session.user.email
                })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const faqs = [
        {
            q: "Can I switch plans later?",
            a: "Yes, upgrade or downgrade anytime. When upgrading, you get immediate access to Pro features. When downgrading, your Pro features remain until the end of your billing period."
        },
        {
            q: "What happens when my trial ends?",
            a: "Your account switches to a read-only state. All your leads, campaigns, and data are preserved. Simply choose a plan to pick up where you left off."
        },
        {
            q: "Do you offer refunds?",
            a: "We offer a 14-day money-back guarantee on all plans. If you're not satisfied, contact us within 14 days of purchase for a full refund."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit and debit cards via Stripe. All payments are processed securely."
        }
    ];

    const comparisonData = [
        { name: "Keyword searches", starter: "50/month", pro: "Unlimited" },
        { name: "Active campaigns", starter: "3", pro: "Unlimited" },
        { name: "Leads per month", starter: "500", pro: "Unlimited" },
        { name: "Emails per day", starter: "50", pro: "Unlimited" },
        { name: "AI email personalisation", starter: false, pro: true },
        { name: "Deal Pipeline (CRM)", starter: false, pro: true },
        { name: "Unified Inbox", starter: false, pro: true },
        { name: "AI Voice Agent", starter: false, pro: true },
        { name: "Global Demand", starter: false, pro: true },
        { name: "LinkedIn automation", starter: false, pro: true }
    ];

    return (
        <div className="p-6 bg-[#F8F9FA] min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[#111827]">Choose Your Plan</h1>
                    <p className="text-[#6B7280] mt-2">Scale your outreach with the right plan</p>
                </div>

                {/* Monthly/Annual Toggle */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className={`text-sm ${!isAnnual ? 'text-[#111827] font-medium' : 'text-[#6B7280]'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-12 h-6 bg-[#4F46E5] rounded-full transition-all"
                    >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                    <span className={`text-sm ${isAnnual ? 'text-[#111827] font-medium' : 'text-[#6B7280]'}`}>Annual</span>
                    <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        Save 20%
                    </span>
                </div>

                {cancelled && (
                    <div className="max-w-md mx-auto mb-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm font-medium text-center">
                        Checkout was cancelled. You can try again anytime.
                    </div>
                )}

                {/* Free Trial Banner */}
                <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-xl p-5 mb-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                        <Zap size={20} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-[#111827]">Start with a 7-day free trial</span>
                        <span className="text-[#6B7280] ml-2">Full Pro access, no restrictions on features.</span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <PricingCard
                        title="Starter"
                        description="Everything to start generating leads"
                        monthlyPrice="£49"
                        annualPrice="£490"
                        annualMonthlyRate="£40.83"
                        isAnnual={isAnnual}
                        savingsBadge="Save £98"
                        icon={<Zap size={24} />}
                        buttonText={isLoading ? "Loading..." : "Start Free Trial"}
                        onCheckout={() => handleCheckout('Starter')}
                        features={[
                            "3 active campaigns",
                            "500 leads per month",
                            "50 emails per day",
                            "Keyword searches (50/mo)",
                            "Email sequences up to 4 steps",
                            "Lead database with filters"
                        ]}
                    />
                    <PricingCard
                        title="Pro"
                        description="Full arsenal for serious teams"
                        monthlyPrice="£149"
                        annualPrice="£1,430"
                        annualMonthlyRate="£119.17"
                        isAnnual={isAnnual}
                        savingsBadge="Save £358"
                        isPopular={true}
                        icon={<Sparkles size={24} />}
                        buttonText={isLoading ? "Loading..." : "Start Free Trial"}
                        onCheckout={() => handleCheckout('Pro')}
                        features={[
                            "AI Voice Call Agent",
                            "Unlimited campaigns",
                            "Unlimited leads per month",
                            "Unlimited emails per day",
                            "Deal Pipeline / Kanban CRM",
                            "Unified Inbox",
                            "AI email personalisation",
                            "LinkedIn automation"
                        ]}
                    />
                    <PricingCard
                        title="Scale"
                        description="Enterprise-grade features"
                        monthlyPrice="£349"
                        annualPrice="£3,490"
                        annualMonthlyRate="£290.83"
                        isAnnual={isAnnual}
                        isComingSoon={true}
                        icon={<ShieldCheck size={24} />}
                        buttonText="Coming Soon"
                        onCheckout={() => {}}
                        features={[
                            "Everything in Pro",
                            "Dedicated account manager",
                            "Custom integrations",
                            "Priority support",
                            "Team collaboration",
                            "Advanced analytics"
                        ]}
                    />
                </div>

                {/* Feature Comparison Table */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden mt-8">
                    <div className="p-6 border-b border-[#E5E7EB]">
                        <h2 className="text-xl font-semibold text-[#111827]">Feature Comparison</h2>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wide">Feature</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-[#6B7280] uppercase tracking-wide">Starter</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-50/50' : ''}>
                                    <td className="px-6 py-4 text-sm font-medium text-[#111827]">{row.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        {typeof row.starter === 'boolean' ? (
                                            row.starter ? <Check size={16} className="text-[#4F46E5] mx-auto" strokeWidth={3} /> : <X size={16} className="text-gray-300 mx-auto" />
                                        ) : (
                                            <span className="text-sm text-[#6B7280]">{row.starter}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {typeof row.pro === 'boolean' ? (
                                            row.pro ? <Check size={16} className="text-[#4F46E5] mx-auto" strokeWidth={3} /> : <X size={16} className="text-gray-300 mx-auto" />
                                        ) : (
                                            <span className="text-sm font-semibold text-[#4F46E5]">{row.pro}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Free Trial Terms */}
                <div className="border-t border-gray-100 pt-8 mt-8">
                    <button
                        onClick={() => setExpandedTerms(!expandedTerms)}
                        className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-all mx-auto"
                    >
                        Free trial terms
                        {expandedTerms ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedTerms && (
                        <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <ul className="space-y-2 text-sm text-[#6B7280]">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    No CSV export during trial
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    No bulk email actions during trial
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                    5-lead sample export maximum
                                </li>
                            </ul>
                            <p className="text-sm text-[#6B7280] mt-4">
                                Full feature access otherwise. Leads generated during trial are retained.
                            </p>
                        </div>
                    )}
                </div>

                {/* FAQ Section */}
                <div className="mt-12 mb-12">
                    <h2 className="text-2xl font-bold text-[#111827] text-center mb-8">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto divide-y divide-gray-100">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border-b border-gray-100">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between py-5 text-left focus:outline-none"
                                >
                                    <span className="text-base font-semibold text-[#111827]">{faq.q}</span>
                                    {activeFaq === idx ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </button>
                                {activeFaq === idx && (
                                    <div className="pb-5">
                                        <p className="text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-br from-[#EEF2FF] via-[#E0E7FF] to-[#F0F4FF] border border-indigo-100 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-[#111827] mb-3">Still not sure?</h2>
                    <p className="text-[#6B7280] mb-6 max-w-lg mx-auto">
                        Start your free trial and see the results for yourself.
                    </p>
                    <button
                        onClick={() => handleCheckout('Pro')}
                        disabled={isLoading}
                        className="px-8 py-3 bg-[#4F46E5] text-white font-semibold rounded-xl hover:bg-[#4338CA] transition-all shadow-lg flex items-center gap-2 mx-auto"
                    >
                        {isLoading && <Loader2 size={20} className="animate-spin" />}
                        Start 7-Day Free Trial
                    </button>
                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#6B7280]">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-[#4F46E5]" />
                            Card required to activate trial
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-[#4F46E5]" />
                            Secure processing via Stripe
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
