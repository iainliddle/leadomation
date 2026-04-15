import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

type Feature = {
  id: string
  eyebrow: string
  title: string
  description: string
  stats: { value: string; label: string }[]
  screenshot: string
  accentColor: string
  cta: string
}

const features: Feature[] = [
  {
    id: 'lead-discovery',
    eyebrow: 'Lead Discovery',
    title: 'Find and enrich 500+ leads per campaign',
    description: 'Scrape Google Maps for local businesses, then enrich each lead with verified emails and direct phone numbers through Hunter.io and Apollo. Three enrichment layers mean you rarely hit a dead end.',
    stats: [{ value: '500+', label: 'leads per campaign' }, { value: '3', label: 'enrichment layers' }],
    screenshot: '/screenshots/lead-database.png',
    accentColor: '#4F46E5',
    cta: 'See lead discovery →',
  },
  {
    id: 'email-sequences',
    eyebrow: 'Email Sequences',
    title: 'Write once. Follow up automatically.',
    description: 'Build multi-step personalised sequences with AI-written copy. Spam checking, A/B subject line testing and automatic reply detection mean your sequences improve every time they run.',
    stats: [{ value: '34%', label: 'avg open rate' }, { value: '8', label: 'sequence steps' }],
    screenshot: '/screenshots/email-sequences.png',
    accentColor: '#3B82F6',
    cta: 'See email sequences →',
  },
  {
    id: 'linkedin-outreach',
    eyebrow: 'LinkedIn Outreach',
    title: 'A 35-day LinkedIn funnel running on autopilot.',
    description: 'Six phases from silent awareness to soft offer, fully automated via Unipile. Leadomation monitors for replies and pauses the sequence the moment a prospect responds.',
    stats: [{ value: '35', label: 'day funnel' }, { value: '6', label: 'funnel phases' }],
    screenshot: '/screenshots/linkedin-sequences.png',
    accentColor: '#0077B5',
    cta: 'See LinkedIn outreach →',
  },
  {
    id: 'keyword-monitor',
    eyebrow: 'Keyword Monitor',
    title: 'Catch prospects the moment they signal intent.',
    description: 'Leadomation scans LinkedIn every two hours for posts matching your keywords. When someone signals they need what you offer, they get auto-enrolled as a hot lead before your competitors see it.',
    stats: [{ value: '2hr', label: 'scan interval' }, { value: 'Auto', label: 'enrolment' }],
    screenshot: '/screenshots/keyword-monitor.png',
    accentColor: '#22D3EE',
    cta: 'See keyword monitor →',
  },
  {
    id: 'ai-voice',
    eyebrow: 'AI Voice Calling',
    title: 'An AI agent that calls your prospects for you.',
    description: 'Build an 8-step call script once. Leadomation calls each prospect, delivers your pitch naturally and leaves personalised voicemails. Call outcomes feed back into your pipeline automatically.',
    stats: [{ value: '50', label: 'calls per month' }, { value: '8', label: 'script steps' }],
    screenshot: '/screenshots/call-agent.png',
    accentColor: '#06B6D4',
    cta: 'See AI calling →',
  },
]

function FeatureRow({ feature, index, isMobile, isLast }: { feature: Feature; index: number; isMobile: boolean; isLast: boolean }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isReversed = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98], delay: index * 0.08 }}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : isReversed ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: isMobile ? '40px' : '80px',
        padding: isMobile ? '40px 16px' : '64px 24px',
        borderBottom: !isLast ? '1px solid #f1f5f9' : 'none',
        maxWidth: '1160px',
        margin: '0 auto',
      }}
    >
      {/* SCREENSHOT SIDE */}
      <div style={{ flex: isMobile ? '1 1 auto' : '0 0 52%', position: 'relative', width: isMobile ? '100%' : 'auto' }}>
        {/* Browser chrome wrapper */}
        <div style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid rgba(226,232,240,0.8)',
          background: '#ffffff',
        }}>
          <div style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d1d5db' }} />
              ))}
            </div>
            <div style={{
              flex: 1,
              background: 'white',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              padding: '3px 10px',
              fontSize: '10px',
              color: '#94a3b8',
              fontFamily: 'Switzer, sans-serif',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}>
              app.leadomation.co.uk/{feature.id.replace('-', '/')}
            </div>
          </div>

          <img
            src={feature.screenshot}
            alt={feature.title}
            style={{
              width: '100%',
              display: 'block',
              aspectRatio: '16/10',
              objectFit: 'cover',
              objectPosition: 'top left',
            }}
          />
        </div>

        {/* Floating stat pill — hidden on mobile */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            bottom: '-16px',
            ...(isReversed ? { left: '-16px' } : { right: '-16px' }),
            background: 'white',
            borderRadius: '10px',
            padding: '10px 16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            border: '1px solid rgba(226,232,240,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'Switzer, sans-serif',
          }}>
            {feature.stats.map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center',
                paddingRight: i < feature.stats.length - 1 ? '10px' : 0,
                borderRight: i < feature.stats.length - 1 ? '1px solid #f1f5f9' : 'none',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: feature.accentColor, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TEXT SIDE */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: `${feature.accentColor}12`,
          border: `1px solid ${feature.accentColor}30`,
          borderRadius: '100px',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: 700,
          color: feature.accentColor,
          letterSpacing: '0.04em',
          marginBottom: '16px',
          fontFamily: 'Switzer, sans-serif',
        }}>
          {feature.eyebrow}
        </div>

        <h3 style={{
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 16px',
          fontFamily: 'Switzer, sans-serif',
        }}>
          {feature.title}
        </h3>

        <p style={{
          fontSize: '16px',
          color: '#64748b',
          lineHeight: 1.75,
          margin: '0 0 28px',
          fontFamily: 'Switzer, sans-serif',
        }}>
          {feature.description}
        </p>

        <a
          href="/app/signup"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: 600,
            color: feature.accentColor,
            textDecoration: 'none',
            fontFamily: 'Switzer, sans-serif',
            borderBottom: `1.5px solid ${feature.accentColor}40`,
            paddingBottom: '1px',
            transition: 'border-color 0.2s ease',
          }}
        >
          {feature.cta}
        </a>
      </div>
    </motion.div>
  )
}

export default function FeatureExpandingCards() {
  const { isMobile } = useBreakpoint()
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section style={{
      background: 'linear-gradient(180deg, #ffffff 0%, transparent 120px, transparent 100%)',
      position: 'relative',
      paddingTop: isMobile ? '60px' : '100px',
      paddingBottom: isMobile ? '60px' : '100px',
      fontFamily: 'Switzer, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '-5%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        right: '-5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{
            textAlign: 'center',
            maxWidth: '640px',
            margin: '0 auto 80px',
            padding: '0 24px',
          }}
        >
          <div style={{
            background: '#EEF2FF',
            color: '#4F46E5',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            borderRadius: '100px',
            padding: '5px 14px',
            textTransform: 'uppercase',
            marginBottom: '20px',
            display: 'inline-block',
            fontFamily: 'Switzer, sans-serif',
          }}>
            Features
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 16px',
            fontFamily: 'Switzer, sans-serif',
          }}>
            Five tools. One platform. Zero manual work.
          </h2>

          <p style={{
            fontSize: '17px',
            color: '#64748b',
            lineHeight: 1.7,
            margin: 0,
            fontFamily: 'Switzer, sans-serif',
          }}>
            Every feature your outreach needs, built in and working together from day one.
          </p>
        </motion.div>

        {/* Feature rows */}
        {features.map((feature, index) => (
          <FeatureRow
            key={feature.id}
            feature={feature}
            index={index}
            isMobile={isMobile}
            isLast={index === features.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
