import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 59,
    annualPrice: 47,
    annualTotal: 566,
    annualMonthly: 47.17,
    annualSaving: 142,
    description: 'Perfect for solo founders and small teams getting started with B2B outreach.',
    color: '#4F46E5',
    featured: false,
    comingSoon: false,
    features: [
      '300 leads per month',
      '30 emails per day',
      '25 keyword searches',
      '4 sequence steps',
      'Email outreach only',
      'Spam score checker',
      'AI sequence generator',
      'Template library',
      'Campaign analytics',
    ],
    cta: 'Start free trial',
    ctaStyle: 'outline',
  },
  {
    name: 'Pro',
    monthlyPrice: 159,
    annualPrice: 127,
    annualTotal: 1526,
    annualMonthly: 127.17,
    annualSaving: 382,
    description: 'For growing teams who need LinkedIn, voice calling and unlimited sequences.',
    color: '#4F46E5',
    featured: true,
    comingSoon: false,
    features: [
      '2,000 leads per month',
      '100 emails per day',
      '75 keyword searches',
      'Unlimited sequence steps',
      'LinkedIn outreach included',
      '50 AI voice calls per month',
      'Intent scoring on every lead',
      'Campaign performance analyser',
      'Priority support',
    ],
    cta: 'Start free trial',
    ctaStyle: 'filled',
  },
  {
    name: 'Scale',
    monthlyPrice: 359,
    annualPrice: 287,
    annualTotal: 3446,
    annualMonthly: 287.17,
    annualSaving: 861,
    description: 'SMS, WhatsApp and AI video prospecting for high-volume outreach teams.',
    color: '#06B6D4',
    featured: false,
    comingSoon: true,
    features: [
      'Everything in Pro',
      'SMS outreach via Twilio',
      'WhatsApp outreach',
      'AI video prospecting',
      '30 AI videos per month',
      'HeyGen integration',
      'Dedicated account manager',
      'Custom integrations',
      'SLA support',
    ],
    cta: 'Join waitlist',
    ctaStyle: 'outline',
  },
]

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="8" fill={color} fillOpacity="0.12" />
    <polyline points="4.5,8 7,10.5 11.5,5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

export default function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [annual, setAnnual] = useState(false)
  const ease = [0.21, 0.47, 0.32, 0.98] as any

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, transparent 120px, transparent 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '120px',
        paddingBottom: '120px',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: '48px', paddingRight: '48px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '6px 14px', marginBottom: '24px' }}>
            • PRICING
          </div>
          <div style={{ fontWeight: 800, fontSize: '48px', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block', marginBottom: '16px' }}>
            Simple, transparent pricing.
          </div>
          <p style={{ color: '#475569', fontSize: '18px', lineHeight: 1.7, margin: '0 auto 32px', maxWidth: '500px' }}>
            Start with a 7-day free trial. Secure with a card. Cancel anytime.
          </p>

          {/* Annual toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: annual ? '#94a3b8' : '#0f172a', fontWeight: annual ? 400 : 600, transition: 'all 0.2s' }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              style={{
                width: '48px',
                height: '26px',
                borderRadius: '13px',
                background: annual ? '#4F46E5' : '#e2e8f0',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.3s ease',
                padding: 0,
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'white',
                position: 'absolute',
                top: '3px',
                left: annual ? '25px' : '3px',
                transition: 'left 0.3s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', color: annual ? '#0f172a' : '#94a3b8', fontWeight: annual ? 600 : 400, transition: 'all 0.2s' }}>Annual</span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '2px 8px' }}>Save 20%</span>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              style={{
                background: plan.featured ? 'linear-gradient(160deg, #1E1B4B 0%, #2d2a6e 100%)' : 'white',
                borderRadius: '24px',
                padding: '32px',
                border: plan.featured ? 'none' : '1px solid rgba(226,232,240,0.8)',
                boxShadow: plan.featured
                  ? '0 24px 80px rgba(79,70,229,0.35), 0 8px 24px rgba(79,70,229,0.2)'
                  : '0 4px 24px rgba(0,0,0,0.06)',
                position: 'relative',
                marginTop: plan.featured ? '-16px' : '0',
                overflow: 'hidden',
              }}
            >
              {/* Featured glow */}
              {plan.featured && (
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              )}

              {/* Most popular badge */}
              {plan.featured && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'linear-gradient(135deg, #22D3EE, #06B6D4)', color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '4px 10px' }}>
                  MOST POPULAR
                </div>
              )}

              {/* Coming soon badge */}
              {plan.comingSoon && (
                <div style={{ position: 'absolute', top: '20px', right: '20px', background: '#EEF2FF', color: '#4F46E5', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '4px 10px', border: '1px solid rgba(79,70,229,0.2)' }}>
                  COMING SOON
                </div>
              )}

              {/* Plan name */}
              <div style={{ fontSize: '13px', fontWeight: 700, color: plan.featured ? 'rgba(255,255,255,0.6)' : '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                {plan.name}
              </div>

              {/* Price */}
              {annual ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: plan.featured ? 'white' : '#0f172a', lineHeight: 1 }}>
                      £{plan.annualTotal}
                    </span>
                    <span style={{ fontSize: '14px', color: plan.featured ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: '8px' }}>/yr</span>
                  </div>
                  <div style={{ fontSize: '13px', color: plan.featured ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: '8px' }}>
                    £{plan.annualMonthly}/mo billed annually
                  </div>
                  <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '2px 8px', marginBottom: '4px' }}>
                    Save £{plan.annualSaving}
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em', color: plan.featured ? 'white' : '#0f172a', lineHeight: 1 }}>
                    £{plan.monthlyPrice}
                  </span>
                  <span style={{ fontSize: '14px', color: plan.featured ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom: '8px' }}>/mo</span>
                </div>
              )}

              <p style={{ fontSize: '13px', color: plan.featured ? 'rgba(255,255,255,0.65)' : '#64748b', lineHeight: 1.6, marginBottom: '24px', marginTop: '8px' }}>
                {plan.description}
              </p>

              {/* Divider */}
              <div style={{ height: '1px', background: plan.featured ? 'rgba(255,255,255,0.1)' : '#f1f5f9', marginBottom: '20px' }} />

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {plan.features.map((feature, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckIcon color={plan.featured ? '#22D3EE' : plan.color} />
                    <span style={{ fontSize: '13px', color: plan.featured ? 'rgba(255,255,255,0.8)' : '#475569' }}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: plan.comingSoon ? 'default' : 'pointer',
                  fontFamily: 'Switzer, sans-serif',
                  transition: 'all 0.2s ease',
                  border: plan.featured ? 'none' : '1px solid rgba(79,70,229,0.3)',
                  background: plan.featured
                    ? 'linear-gradient(135deg, #22D3EE, #06B6D4)'
                    : plan.comingSoon
                    ? 'rgba(79,70,229,0.06)'
                    : 'rgba(79,70,229,0.06)',
                  color: plan.featured ? 'white' : '#4F46E5',
                  opacity: plan.comingSoon ? 0.6 : 1,
                }}
              >
                {plan.cta} {!plan.comingSoon && '→'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ textAlign: 'center', marginTop: '48px' }}
        >
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            All plans include a 7-day free trial. Card required to start. Cancel anytime.
          </p>
        </motion.div>

      </div>
    </div>
  )
}
