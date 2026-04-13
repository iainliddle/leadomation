import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const cards = [
  {
    id: 'lead-discovery',
    eyebrow: 'Lead Discovery',
    title: 'Find and enrich 500+ leads per campaign',
    description: 'Scrape Google Maps, enrich with verified emails and phone numbers via Hunter.io and Apollo. Every lead comes with contact details, industry, location and intent signals.',
    backgroundImage: '/screenshots/lead-database.png.png',
    accentColor: '#4F46E5',
    stats: [{ value: '500+', label: 'leads per campaign' }, { value: '3', label: 'enrichment layers' }],
    icon: (size: number, color: string) => (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="6" stroke={color} strokeWidth="1.8" />
        <line x1="13.5" y1="13.5" x2="17" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'email-sequences',
    eyebrow: 'Email Sequences',
    title: 'Write once. Follow up forever.',
    description: 'Build multi-step personalised email sequences with AI-written copy, spam checking and open rate tracking. Set it up once and Leadomation handles every follow-up.',
    backgroundImage: '/screenshots/email-sequences.png.png',
    accentColor: '#3B82F6',
    stats: [{ value: '8', label: 'sequence steps' }, { value: '34%', label: 'avg open rate' }],
    icon: (size: number, color: string) => (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.8" />
        <path d="M2 6l8 5 8-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'linkedin-outreach',
    eyebrow: 'LinkedIn Outreach',
    title: 'A 35-day LinkedIn funnel on autopilot.',
    description: 'Six phases from silent awareness to soft offer. Leadomation manages connection requests, message timing and reply detection automatically via Unipile.',
    backgroundImage: '/screenshots/linkedin-sequences.png.png',
    accentColor: '#0077B5',
    stats: [{ value: '35', label: 'day funnel' }, { value: '6', label: 'funnel phases' }],
    icon: (size: number, color: string) => (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="16" height="16" rx="4" stroke={color} strokeWidth="1.8" />
        <text x="7" y="14.5" fill={color} fontSize="10" fontWeight="700" fontFamily="Switzer, sans-serif">in</text>
      </svg>
    ),
  },
  {
    id: 'keyword-monitor',
    eyebrow: 'Keyword Monitor',
    title: 'Catch prospects the moment they signal intent.',
    description: 'Monitor LinkedIn every 2 hours for posts matching your keywords. When someone signals buying intent, Leadomation auto-enrols them into your LinkedIn sequencer as a hot lead.',
    backgroundImage: '/screenshots/keyword-monitor.png.png',
    accentColor: '#22D3EE',
    stats: [{ value: '2hr', label: 'scan interval' }, { value: 'Auto', label: 'enrolment' }],
    icon: (size: number, color: string) => (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.8" />
        <circle cx="10" cy="10" r="6.5" stroke={color} strokeWidth="1.2" opacity="0.5" />
        <circle cx="10" cy="10" r="9" stroke={color} strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'ai-voice',
    eyebrow: 'AI Voice Calling',
    title: 'An AI agent that calls prospects for you.',
    description: 'Build an 8-step call script covering objectives, opening lines, objection handling and voicemail. Leadomation calls prospects automatically and leaves personalised voicemails.',
    backgroundImage: '/screenshots/call-agent.png.png',
    accentColor: '#06B6D4',
    stats: [{ value: '8', label: 'script steps' }, { value: '50', label: 'calls per month' }],
    icon: (size: number, color: string) => (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 3C4.67 3 4 3.67 4 4.5v1c0 5.52 4.48 10 10 10h1c.83 0 1.5-.67 1.5-1.5v-1.5a1 1 0 0 0-.8-.98l-2.7-.54a1 1 0 0 0-.95.27l-1.1 1.1a8.04 8.04 0 0 1-3.3-3.3l1.1-1.1a1 1 0 0 0 .27-.95L8.48 3.8A1 1 0 0 0 7.5 3H5.5z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function FeatureExpandingCards() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(238,242,255,0.6) 30%, rgba(240,244,255,0.8) 70%, transparent 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '120px',
        paddingBottom: '120px',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: '700px',
          margin: '0 auto 64px',
          textAlign: 'center',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            background: '#EEF2FF',
            color: '#4F46E5',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            borderRadius: '100px',
            padding: '6px 14px',
            marginBottom: '24px',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          • EVERYTHING YOU NEED
        </span>
        <span
          style={{
            fontWeight: 800,
            fontSize: '48px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            marginBottom: '16px',
            fontFamily: 'Switzer, sans-serif',
          }}
        >
          Five tools. One platform. Zero manual work.
        </span>
        <p
          style={{
            color: '#475569',
            fontSize: '18px',
            lineHeight: 1.7,
            fontFamily: 'Switzer, sans-serif',
            margin: 0,
          }}
        >
          Every feature your outreach needs, built in and working together from day one.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          display: 'flex',
          gap: '12px',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          height: '520px',
          alignItems: 'stretch',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => setActiveIndex(index)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              flex: activeIndex === index ? '5' : '1',
              minWidth: activeIndex === index ? '0' : '72px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {/* Background image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${card.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                transition: 'transform 0.6s ease, filter 0.6s ease',
                transform: activeIndex === index ? 'scale(1)' : 'scale(1.05)',
                filter: activeIndex === index ? 'grayscale(0%) brightness(0.35)' : 'grayscale(80%) brightness(0.25)',
              }}
            />

            {/* Dark gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: activeIndex === index
                  ? 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)'
                  : 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%)',
                transition: 'background 0.6s ease',
                zIndex: 1,
              }}
            />

            {/* Accent color top border */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: card.accentColor,
                zIndex: 2,
                opacity: activeIndex === index ? 1 : 0.4,
                transition: 'opacity 0.4s ease',
              }}
            />

            {/* Collapsed state content */}
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                opacity: activeIndex === index ? 0 : 1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              {card.icon(20, card.accentColor)}
              <span
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'Switzer, sans-serif',
                }}
              >
                {card.eyebrow}
              </span>
            </div>

            {/* Expanded state content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px',
                zIndex: 3,
                opacity: activeIndex === index ? 1 : 0,
                transition: 'opacity 0.4s ease 0.2s',
                pointerEvents: activeIndex === index ? 'auto' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                {card.icon(24, card.accentColor)}
                <span
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    borderRadius: '100px',
                    padding: '4px 12px',
                    textTransform: 'uppercase',
                    backdropFilter: 'blur(8px)',
                    fontFamily: 'Switzer, sans-serif',
                  }}
                >
                  {card.eyebrow}
                </span>
              </div>

              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'white',
                  lineHeight: 1.2,
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Switzer, sans-serif',
                }}
              >
                {card.title}
              </div>

              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.6,
                  marginBottom: '20px',
                  maxWidth: '400px',
                  fontFamily: 'Switzer, sans-serif',
                  margin: '0 0 20px 0',
                }}
              >
                {card.description}
              </p>

              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                {card.stats.map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: 800,
                        color: card.accentColor,
                        fontFamily: 'Switzer, sans-serif',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        fontFamily: 'Switzer, sans-serif',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <button
                style={{
                  background: card.accentColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Switzer, sans-serif',
                  display: 'inline-block',
                  width: 'fit-content',
                }}
              >
                See feature →
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
