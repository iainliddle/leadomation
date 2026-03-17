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
    accentColor: string;
    icon: React.ReactNode;
    buttonText: string;
    savingsBadge?: string;
    onCheckout: (plan: string) => void;
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
    accentColor,
    icon,
    buttonText,
    savingsBadge,
    onCheckout
}) => (
    <div className={`relative flex flex-col p-8 bg-white rounded-2xl transition-all duration-300 ${isPopular
        ? `border-2 border-indigo-500 shadow-xl z-10`
        : 'border border-slate-200 shadow-sm hover:shadow-md'
        }`}>
        {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                MOST POPULAR
            </div>
        )}

        <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentColor}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </div>

        <div className="mb-8">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">{isAnnual ? annualPrice : monthlyPrice}</span>
                <span className="text-sm text-slate-500">{isAnnual ? '/year' : '/month'}</span>
                {isAnnual && savingsBadge && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full ml-2">
                        {savingsBadge}
                    </span>
                )}
            </div>
            {isAnnual && (
                <p className="text-sm text-slate-500 mt-1">({annualMonthlyRate}/mo)</p>
            )}
        </div>

        <div className="w-full h-px bg-slate-100 mb-8" />

        <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                {isPopular ? 'Everything in Starter, plus:' : 'Features'}
            </p>
            <ul className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check size={16} strokeWidth={3} className="text-indigo-600 w-4 h-4 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>

        <button
            onClick={() => onCheckout(title)}
            className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isPopular
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                : 'border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                }`}>
            {buttonText}
            <ArrowRight size={16} />
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
            a: "Your account switches to a read-only state. All your leads, campaigns, and data are preserved. Simply choose a plan to pick up where you left off. Your leads aren't going anywhere."
        },
        {
            q: "Do you offer refunds?",
            a: "We offer a 14-day money-back guarantee on all plans. If you're not satisfied, contact us within 14 days of purchase for a full refund."
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit and debit cards via Stripe. All payments are processed securely. Annual plans are charged upfront."
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1200px] mx-auto pb-24 pt-8 px-4 bg-gradient-to-b from-slate-50 to-white -m-6 p-6">
            <div className="text-center mb-16">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Choose Your Plan</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Scale your outreach with the right plan for your business
                </p>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <div className="bg-slate-100 rounded-xl p-1 inline-flex items-center">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${isAnnual ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                        >
                            Annual
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {cancelled && (
                    <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-500 max-w-md mx-auto">
                        Checkout was cancelled. You can try again anytime.
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-5 mb-16 max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-2 text-white">
                    <div className="flex items-center gap-3">
                        <Zap size={20} className="text-white" />
                        <span className="text-base font-bold">Start with a 7-day free trial</span>
                        <span className="text-sm text-indigo-200">Full Pro access, no restrictions on features.</span>
                    </div>
                    <p className="text-xs text-indigo-200">
                        Secure your trial with a card. Cancel anytime before day 7. Export limits apply during trial.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                <PricingCard
                    title="Starter"
                    description="Everything you need to start generating leads"
                    monthlyPrice="£49"
                    annualPrice="£490"
                    annualMonthlyRate="£40.83"
                    isAnnual={isAnnual}
                    savingsBadge="Save £98"
                    accentColor="bg-blue-50 text-primary"
                    icon={<Zap size={24} />}
                    buttonText={isLoading ? "Loading..." : "Start 7-Day Free Trial"}
                    onCheckout={() => handleCheckout('Starter')}
                    features={[
                        "3 active campaigns",
                        "500 leads per month",
                        "50 emails per day",
                        "Keyword searches (50/mo)",
                        "Email sequences up to 4 steps",
                        "Lead database with search & filters",
                        "6 pre-built email templates",
                        "Email signature builder",
                        "Basic dashboard & analytics",
                        "CSV export",
                        "Integrations panel",
                        "Email config & compliance tools"
                    ]}
                />
                <PricingCard
                    title="Pro"
                    description="The full arsenal for serious outreach teams"
                    monthlyPrice="£149"
                    annualPrice="£1,430"
                    annualMonthlyRate="£119.17"
                    isAnnual={isAnnual}
                    savingsBadge="Save £358"
                    isPopular={true}
                    accentColor="bg-purple-50 text-purple-600"
                    icon={<Sparkles size={24} />}
                    buttonText={isLoading ? "Loading..." : "Start 7-Day Free Trial"}
                    onCheckout={() => handleCheckout('Pro')}
                    features={[
                        "🤖 AI Voice Call Agent",
                        "Unlimited campaigns",
                        "Unlimited leads per month",
                        "Unlimited emails per day",
                        "Unlimited keyword searches",
                        "Unlimited sequence steps",
                        "🌍 Global Demand Intelligence",
                        "📊 Deal Pipeline / Kanban CRM",
                        "📥 Unified Inbox",
                        "✨ AI email personalisation",
                        "🔗 LinkedIn automation",
                        "🔀 Spintax support",
                        "📈 Advanced analytics & reporting",
                        "🔥 Inbox warm-up tools",
                        "📬 Inbox rotation (multi-account)",
                        "👤 Decision Maker enrichment"
                    ]}
                />
            </div>

            <div className="max-w-4xl mx-auto mb-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Feature Comparison</h2>
                        <p className="text-sm text-slate-500 mt-1">Detailed breakdown of what's included in each plan</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100">Feature</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-100 text-center">Starter</th>
                                <th className="px-8 py-4 text-xs font-semibold text-indigo-600 uppercase tracking-wide border-b border-slate-100 text-center">Pro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {([
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
                            ] as { name: string; starter: string | boolean; pro: string | boolean; note?: string }[]).map((row, idx) => (
                                <tr key={idx} className={`border-b border-slate-100 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900">{row.name}</span>
                                            {row.note && <span className="text-xs text-slate-400">{row.note}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        {typeof row.starter === 'boolean' ? (
                                            row.starter ? <Check size={16} className="text-indigo-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-slate-300 mx-auto" />
                                        ) : (
                                            <span className="text-sm text-slate-600">{row.starter}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        {typeof row.pro === 'boolean' ? (
                                            row.pro ? <Check size={16} className="text-indigo-600 mx-auto" strokeWidth={3} /> : <X size={16} className="text-slate-300 mx-auto" />
                                        ) : (
                                            <span className="text-sm font-semibold text-indigo-600">{row.pro}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-24 border-t border-gray-100 pt-8">
                <button
                    onClick={() => setExpandedTerms(!expandedTerms)}
                    className="flex items-center gap-2 text-sm font-black text-[#9CA3AF] hover:text-[#111827] transition-all uppercase tracking-widest mx-auto"
                >
                    Free trial terms
                    {expandedTerms ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedTerms && (
                    <div className="mt-8 bg-gray-50/50 rounded-3xl p-8 border border-gray-100 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ul className="space-y-4">
                                {["No CSV export during trial", "No bulk email actions during trial", "5-lead sample export maximum"].map((term, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-[#4B5563]">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                        {term}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex flex-col justify-center">
                                <p className="text-xs font-bold text-[#4B5563] leading-relaxed mb-1">
                                    Full feature access otherwise. Leads generated during trial are retained. Upgrade to access them.
                                </p>
                                <p className="text-xs font-black text-primary">
                                    "Your leads stay safe. Upgrade anytime to unlock everything you've built."
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="max-w-3xl mx-auto mb-24">
                <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                <div className="divide-y divide-slate-100">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border-b border-slate-100">
                            <button
                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between py-5 text-left focus:outline-none"
                            >
                                <span className="text-base font-semibold text-slate-900">{faq.q}</span>
                                {activeFaq === idx ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>
                            {activeFaq === idx && (
                                <div className="pt-3 pb-4 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-12 text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Still not sure?</h2>
                    <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                        Start your free trial and see the results for yourself.
                    </p>
                    <button
                        onClick={() => handleCheckout('Pro')}
                        disabled={isLoading}
                        className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2 mx-auto"
                    >
                        {isLoading && <Loader2 size={20} className="animate-spin" />}
                        Start 7-Day Free Trial
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-6 text-xs text-indigo-200">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} />
                            Card required to activate trial
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} />
                            Secure processing via Stripe
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
