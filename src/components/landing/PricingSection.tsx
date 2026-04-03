import React, { useState } from 'react'

interface PricingSectionProps {
  onNavigate: (page: string) => void
}

const tiers = [
  {
    name: 'Starter',
    monthly: 59,
    annual: 47,
    description: 'Perfect for individuals and small teams.',
    features: [
      '500 leads per month',
      'Email sequences',
      'Basic enrichment',
      'Lead scoring',
      'Email support',
    ],
    featured: false,
    cta: 'Start free trial',
    disabled: false,
  },
  {
    name: 'Pro',
    monthly: 159,
    annual: 127,
    description: 'For growing businesses serious about outreach.',
    features: [
      '2,000 leads per month',
      'Everything in Starter',
      'LinkedIn sequences',
      'AI voice calling',
      'Lead Intelligence 50/day',
      'A/B testing',
      'Campaign Performance Analyser',
      'Priority support',
    ],
    featured: true,
    cta: 'Start free trial',
    disabled: false,
  },
  {
    name: 'Scale',
    monthly: 359,
    annual: 287,
    description: 'For agencies and high volume teams.',
    features: [
      'Unlimited leads',
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    featured: false,
    cta: 'Join waitlist',
    disabled: true,
  },
]

const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate }) => {
  const [annual, setAnnual] = useState(false)

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
            Pricing
          </p>
          <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950">
            Simple, transparent pricing.
          </h2>
          <p className="lp-fade mt-6 text-lg text-gray-500">
            Start free. Upgrade when you are ready. No lock in contracts.
          </p>

          {/* Toggle */}
          <div className="lp-fade mt-10 inline-flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !annual ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                annual ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'
              }`}
            >
              Annual <span className="text-emerald-500 text-xs font-bold ml-1">20% off</span>
            </button>
          </div>
        </div>

        <div className="lp-fade grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-[2rem] p-10 ${
                tier.featured
                  ? 'bg-[#1E1B4B] ring-2 ring-[#4F46E5] shadow-xl'
                  : 'bg-white ring-1 ring-black/5 shadow-sm'
              } ${tier.disabled ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${tier.featured ? 'text-white' : 'text-gray-950'}`}>
                  {tier.name}
                </h3>
                {tier.disabled && (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Coming soon</span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-5xl font-bold tracking-tight ${tier.featured ? 'text-white' : 'text-gray-950'}`}>
                  {'\u00A3'}{annual ? tier.annual : tier.monthly}
                </span>
                <span className={`text-sm ${tier.featured ? 'text-white/60' : 'text-gray-400'}`}>/mo</span>
              </div>
              <p className={`text-sm mb-8 ${tier.featured ? 'text-white/60' : 'text-gray-500'}`}>
                {tier.description}
              </p>

              <ul className="space-y-3 mb-10">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg className={`w-4 h-4 mt-0.5 shrink-0 ${tier.featured ? 'text-[#22D3EE]' : 'text-[#4F46E5]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${tier.featured ? 'text-white/80' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !tier.disabled && onNavigate('Register')}
                disabled={tier.disabled}
                className={`w-full rounded-full py-3 text-sm font-semibold transition-colors ${
                  tier.featured
                    ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                    : tier.disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'ring-1 ring-[#4F46E5] text-[#4F46E5] hover:bg-[#EEF2FF]'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
