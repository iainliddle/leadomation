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
    X
} from 'lucide-react';

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
    buttonText
}) => (
    <div className={`relative flex flex-col p-8 bg-white rounded-3xl border transition-all duration-300 ${isPopular
        ? `border-primary shadow-[0_20px_50px_rgba(37,99,235,0.1)] scale-105 z-10`
        : 'border-gray-100 shadow-sm hover:shadow-md'
        }`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full tracking-widest uppercase">
                MOST POPULAR
            </div>
        )}

        <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentColor}`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl font-black text-[#111827]">{title}</h3>
                <p className="text-xs text-[#6B7280] font-medium">{description}</p>
            </div>
        </div>

        <div className="mb-8">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[#111827]">{isAnnual ? annualPrice : monthlyPrice}</span>
                <span className="text-sm font-bold text-[#6B7280]">{isAnnual ? '/year' : '/month'}</span>
            </div>
            {isAnnual && (
                <p className="text-xs font-bold text-[#9CA3AF] mt-1">({annualMonthlyRate}/mo)</p>
            )}
        </div>

        <div className="w-full h-px bg-gray-50 mb-8" />

        <div className="flex-1">
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-4">
                {isPopular ? 'Everything in Starter, plus:' : 'Features'}
            </p>
            <ul className="space-y-4 mb-8">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPopular ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-xs font-semibold text-[#4B5563] leading-relaxed">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>

        <button className={`w-full py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${isPopular
            ? 'bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95'
            : 'bg-white border-2 border-gray-100 text-[#4B5563] hover:border-primary hover:text-primary active:scale-95'
            }`}>
            {buttonText} — {isAnnual ? annualPrice : monthlyPrice}
            <ArrowRight size={16} />
        </button>
    </div>
);

const Pricing: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(true);
    const [expandedTerms, setExpandedTerms] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

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
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1200px] mx-auto pb-24 pt-8 px-4">
            {/* Header Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-[#111827] tracking-tight mb-4">Choose Your Plan</h1>
                <p className="text-lg text-[#6B7280] font-medium max-w-2xl mx-auto">
                    Scale your outreach with the right plan for your business
                </p>

                {/* Annual/Monthly Toggle */}
                <div className="mt-12 flex items-center justify-center gap-4">
                    <span className={`text-sm font-bold ${!isAnnual ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>Monthly</span>
                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-14 h-7 bg-gray-100 rounded-full p-1 transition-all"
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${isAnnual ? 'translate-x-7 bg-primary' : 'translate-x-0'}`} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isAnnual ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>Annual</span>
                        <div className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            Save 2 months free
                        </div>
                    </div>
                </div>
            </div>

            {/* Trial Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 mb-16 max-w-4xl mx-auto shadow-sm">
                <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3">
                        <Zap size={20} className="text-primary animate-pulse" />
                        <span className="text-base font-black text-[#111827]">🚀 Start with a 7-day free trial</span>
                        <span className="text-xs font-bold text-[#6B7280]">Full Pro access, no restrictions on features.</span>
                    </div>
                    <p className="text-[11px] font-bold text-[#9CA3AF]">
                        No credit card required to start • Export limits apply during trial
                    </p>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
                <PricingCard
                    title="Starter"
                    description="Everything you need to start generating leads"
                    monthlyPrice="£49"
                    annualPrice="£490"
                    annualMonthlyRate="£40.83"
                    isAnnual={isAnnual}
                    accentColor="bg-blue-50 text-primary"
                    icon={<Zap size={24} />}
                    buttonText="Get Started"
                    features={[
                        "3 active campaigns",
                        "500 leads per month",
                        "50 emails per day",
                        "Email sequences up to 4 steps",
                        "LinkedIn automation",
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
                    annualPrice="£1,490"
                    annualMonthlyRate="£124.17"
                    isAnnual={isAnnual}
                    isPopular={true}
                    accentColor="bg-purple-50 text-purple-600"
                    icon={<Sparkles size={24} />}
                    buttonText="Upgrade to Pro"
                    features={[
                        "🤖 AI Voice Call Agent",
                        "Unlimited campaigns",
                        "5,000+ leads per month",
                        "200 emails per day",
                        "Unlimited sequence steps",
                        "🌍 Global Demand Intelligence",
                        "📊 Deal Pipeline / Kanban CRM",
                        "📥 Unified Inbox",
                        "✨ AI email generation & suggestions",
                        "🔀 Multi-channel sequence builder",
                        "🔀 Spintax support",
                        "📈 Advanced analytics & reporting",
                        "🔥 Inbox warm-up tools",
                        "📬 Inbox rotation (multi-account)",
                        "👤 Decision Maker enrichment",
                        "⭐ Priority support"
                    ]}
                />
            </div>

            {/* Feature Comparison Table */}
            <div className="max-w-4xl mx-auto mb-24 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-[#111827] tracking-tight">Feature Comparison</h2>
                        <p className="text-xs font-bold text-[#6B7280] mt-1">Detailed breakdown of what's included in each plan</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-4 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest border-b border-gray-100">Feature</th>
                                <th className="px-8 py-4 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest border-b border-gray-100 text-center">Starter</th>
                                <th className="px-8 py-4 text-[10px] font-black text-primary uppercase tracking-widest border-b border-gray-100 text-center">Pro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[
                                { name: "AI Voice Call Agent", starter: false, pro: true, note: "Automated phone outreach" },
                                { name: "Active Campaigns", starter: "3", pro: "Unlimited" },
                                { name: "Leads per Month", starter: "500", pro: "5,000+" },
                                { name: "Email Sending", starter: "50/day", pro: "200/day" },
                                { name: "Deal Pipeline / CRM", starter: false, pro: true },
                                { name: "Unified Inbox", starter: false, pro: true },
                                { name: "AI Email Generation", starter: false, pro: true },
                                { name: "Global Demand Intel", starter: false, pro: true },
                                { name: "CSV Export", starter: true, pro: true },
                                { name: "Priority Support", starter: false, pro: true }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#111827]">{row.name}</span>
                                            {row.note && <span className="text-[10px] font-medium text-[#9CA3AF]">{row.note}</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        {typeof row.starter === 'boolean' ? (
                                            row.starter ? <Check size={16} className="text-emerald-500 mx-auto" strokeWidth={3} /> : <X size={16} className="text-gray-200 mx-auto" />
                                        ) : (
                                            <span className="text-xs font-black text-[#6B7280]">{row.starter}</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-4 text-center">
                                        {typeof row.pro === 'boolean' ? (
                                            row.pro ? <Check size={16} className="text-primary mx-auto" strokeWidth={3} /> : <X size={16} className="text-gray-200 mx-auto" />
                                        ) : (
                                            <span className="text-xs font-black text-primary">{row.pro}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Trial Terms Section */}
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
                                    Full feature access otherwise. Leads generated during trial are retained — upgrade to access them.
                                </p>
                                <p className="text-xs font-black text-primary">
                                    "Your leads stay safe — upgrade anytime to unlock everything you've built"
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mb-24">
                <h2 className="text-3xl font-black text-[#111827] text-center mb-12">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-gray-200"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                            >
                                <span className="text-sm font-black text-[#111827]">{faq.q}</span>
                                {activeFaq === idx ? <ChevronUp size={18} className="text-[#9CA3AF]" /> : <ChevronDown size={18} className="text-[#9CA3AF]" />}
                            </button>
                            {activeFaq === idx && (
                                <div className="px-6 pb-6 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <p className="text-xs text-[#6B7280] font-medium leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center bg-gray-900 rounded-[40px] p-16 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700" />
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tight mb-4">Still not sure?</h2>
                    <p className="text-lg text-gray-400 font-medium mb-10 max-w-xl mx-auto">
                        Start your free trial and see the results for yourself.
                    </p>
                    <button className="px-12 py-5 bg-primary text-white text-lg font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/40 active:scale-95">
                        Start 7-Day Free Trial
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-blue-500" />
                            Secure processing via Stripe
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
