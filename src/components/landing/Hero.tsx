import { useEffect, useState, type ReactElement } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import HeroDashboardMockup from './HeroDashboardMockup'

/* ─── Floating side cards ─── */

interface CardProps {
  cardVisible: boolean
}

function IntentScoringCard({ cardVisible }: CardProps): ReactElement {
  return (
    <motion.div
      animate={{ x: cardVisible ? 0 : -280, opacity: cardVisible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
      style={{ position: 'absolute', left: 0, top: '60px', width: '230px', zIndex: 10 }}
    >
      <motion.div
        animate={{ y: cardVisible ? [0, -10, 0] : 0 }}
        transition={{ duration: 3.5, repeat: cardVisible ? Infinity : 0, ease: 'easeInOut' }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(226,232,240,0.8)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
          🔥 Intent Scoring
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '12px' }}>Live lead intelligence</div>

        {[
          { name: 'Smile Clinic NW', role: 'Clinical Director', badge: 'Hot 95', color: '#ef4444', bg: '#fef2f2' },
          { name: 'Dunmore Dental', role: 'Practice Owner', badge: 'Warm 63', color: '#f59e0b', bg: '#fffbeb' },
          { name: 'Bright Smile Kent', role: 'Practice Owner', badge: 'Hot 76', color: '#ef4444', bg: '#fef2f2' },
        ].map((lead, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '7px',
            marginBottom: '7px',
            borderBottom: i < 2 ? '1px solid #f8fafc' : 'none',
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{lead.name}</div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>{lead.role}</div>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: lead.color,
              background: lead.bg,
              borderRadius: '6px',
              padding: '3px 8px',
            }}>
              {lead.badge}
            </span>
          </div>
        ))}

        <div style={{ marginTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', color: '#94a3b8' }}>Average intent score</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>78</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
            <motion.div
              style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg,#f59e0b,#ef4444)' }}
              initial={{ width: '0%' }}
              animate={{ width: cardVisible ? '78%' : '0%' }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function LinkedInFunnelCard({ cardVisible }: CardProps): ReactElement {
  return (
    <motion.div
      animate={{ x: cardVisible ? 0 : -280, opacity: cardVisible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.1 }}
      style={{ position: 'absolute', left: 0, top: '330px', width: '230px', zIndex: 10 }}
    >
      <motion.div
        animate={{ y: cardVisible ? [0, 10, 0] : 0 }}
        transition={{ duration: 4, repeat: cardVisible ? Infinity : 0, ease: 'easeInOut', delay: 1 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(226,232,240,0.8)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            background: '#0077B5',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '9px', fontWeight: 700, color: 'white' }}>in</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>LinkedIn Outreach</span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>35-day automated funnel</div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {['Silent Awareness', 'Connection', 'Warm Thanks', 'Advice Ask', 'Follow Up', 'Soft Offer'].map((phase, i) => (
            <span key={i} style={{
              fontSize: '8px',
              padding: '3px 6px',
              borderRadius: '4px',
              background: i < 3 ? '#EEF2FF' : '#f8fafc',
              color: i < 3 ? '#4F46E5' : '#94a3b8',
              fontWeight: i < 3 ? 600 : 400,
            }}>
              {phase}
            </span>
          ))}
        </div>

        <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>Owen Dental Group</div>
        <div style={{ fontSize: '9px', color: '#64748b' }}>Day 14 of 35 · Phase 3: Warm Thanks</div>
        <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
          <motion.div
            style={{ height: '100%', borderRadius: '2px', background: '#0077B5' }}
            initial={{ width: '0%' }}
            animate={{ width: cardVisible ? '40%' : '0%' }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </div>
        <div style={{ fontSize: '9px', color: '#4F46E5', fontWeight: 600, marginTop: '8px' }}>
          4 prospects active this week
        </div>
      </motion.div>
    </motion.div>
  )
}

function EmailPerformanceCard({ cardVisible }: CardProps): ReactElement {
  const bars: Array<{ x: number; h: number }> = [
    { x: 5, h: 18 }, { x: 28, h: 30 }, { x: 51, h: 24 }, { x: 74, h: 38 },
    { x: 97, h: 32 }, { x: 120, h: 44 }, { x: 143, h: 36 }, { x: 166, h: 42 },
  ]

  return (
    <motion.div
      animate={{ x: cardVisible ? 0 : 280, opacity: cardVisible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.05 }}
      style={{ position: 'absolute', right: 0, top: '60px', width: '230px', zIndex: 10 }}
    >
      <motion.div
        animate={{ y: cardVisible ? [0, -8, 0] : 0 }}
        transition={{ duration: 3, repeat: cardVisible ? Infinity : 0, ease: 'easeInOut', delay: 0.5 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(226,232,240,0.8)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
          ✉ Email Sequences
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '12px' }}>
          Active campaign performance
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
          {[
            { v: '847', l: 'emails sent', c: '#0f172a' },
            { v: '34.2%', l: 'open rate', c: '#22c55e' },
            { v: '12.8%', l: 'reply rate', c: '#4F46E5' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>{s.l}</div>
            </div>
          ))}
        </div>

        <svg width="100%" height="44" viewBox="0 0 190 44">
          {bars.map((bar, i) => (
            <motion.rect
              key={i}
              x={bar.x}
              width={14}
              rx={3}
              fill="#4F46E5"
              fillOpacity={bar.h === 44 ? 1 : 0.25}
              initial={{ height: 0, y: 44 }}
              animate={{
                height: cardVisible ? bar.h : 0,
                y: cardVisible ? 44 - bar.h : 44,
              }}
              transition={{ duration: 0.8, delay: cardVisible ? 0.5 + (i * 0.08) : 0 }}
            />
          ))}
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <text key={i} x={12 + (i * 23)} y={44} fontSize={6} fill="#94a3b8" textAnchor="middle">
              {d}
            </text>
          ))}
        </svg>

        <div style={{ fontSize: '9px', color: '#64748b', marginTop: '8px' }}>4 steps active</div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
          {['Day 0', 'Day 3', 'Day 7', 'Day 14'].map((d, i) => (
            <span key={i} style={{
              fontSize: '8px',
              background: '#EEF2FF',
              color: '#4F46E5',
              borderRadius: '4px',
              padding: '2px 6px',
            }}>
              {d}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function AIVoiceCard({ cardVisible }: CardProps): ReactElement {
  const barHeights = [4, 8, 14, 20, 16, 10, 18, 22, 12, 8, 16, 10]

  return (
    <motion.div
      animate={{ x: cardVisible ? 0 : 280, opacity: cardVisible ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14, delay: 0.15 }}
      style={{ position: 'absolute', right: 0, top: '340px', width: '230px', zIndex: 10 }}
    >
      <motion.div
        animate={{ y: cardVisible ? [0, 10, 0] : 0 }}
        transition={{ duration: 4.5, repeat: cardVisible ? Infinity : 0, ease: 'easeInOut', delay: 1.5 }}
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
          border: '1px solid rgba(226,232,240,0.8)',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            background: '#06B6D4',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.18 19.79 19.79 0 01.13 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>AI Voice Agent</span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>Automated outbound calling</div>

        <div style={{ background: '#f0fdfa', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <motion.div
              animate={{ opacity: cardVisible ? [1, 0.3, 1] : 1 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}
            />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#0f172a' }}>Live call · 0:47</span>
          </div>
          <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>Dunmore Dental Care</div>

          <svg width="100%" height="28" viewBox="0 0 170 28">
            {barHeights.map((h, i) => (
              <motion.rect
                key={i}
                x={i * 14 + 2}
                y={(28 - h) / 2}
                width={8}
                height={h}
                rx={2}
                fill="#06B6D4"
                animate={{ scaleY: cardVisible ? [0.2, 1, 0.2] : 0.2 }}
                transition={{
                  duration: 0.4 + (i % 3) * 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.07,
                }}
                style={{ transformOrigin: 'center' }}
              />
            ))}
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {['50 calls/mo', '8 script steps', 'Auto voicemail'].map((s, i) => (
            <span key={i} style={{ fontSize: '8px', color: '#64748b' }}>{s}</span>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #f0fdfa', paddingTop: '8px' }}>
          <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '4px' }}>This month</div>
          {[
            { icon: '✓', label: 'Answered: 12', color: '#22c55e' },
            { icon: '✉', label: 'Voicemail: 28', color: '#f59e0b' },
            { icon: '-', label: 'No answer: 10', color: '#94a3b8' },
          ].map((row, i) => (
            <div key={i} style={{ fontSize: '9px', color: row.color, fontWeight: 600 }}>
              {row.icon} {row.label}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Hero Component ─── */

export default function Hero(): ReactElement {
  const { isMobile } = useBreakpoint()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollProgress = Math.min(scrollY / 400, 1)
  const cardsVisible = scrollProgress > 0.25
  const cardVisible = cardsVisible && scrollY < 700

  return (
    <div id="hero" className="bg-arch" style={{
      position: 'relative',
      minHeight: 'auto',
      paddingBottom: '80px',
    }}>

      {/* Hero content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Hero text */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: isMobile ? '80px 16px 12px' : '80px 24px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(238,242,255,0.9)', border: '1px solid #c7d2fe', borderRadius: '9999px', padding: '5px 16px', fontSize: '13px', fontWeight: 500, color: '#4F46E5', fontFamily: 'Switzer, sans-serif', marginBottom: '28px', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
            B2B lead generation, automated
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontFamily: 'Switzer, sans-serif', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 auto 24px', maxWidth: '820px', background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Your next 100 clients<br />are already out there.<br />Leadomation finds them.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            style={{ fontFamily: 'Switzer, sans-serif', fontSize: '18px', fontWeight: 400, color: '#475569', maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Find and enrich B2B leads, write personalised outreach, automate LinkedIn and call prospects with an AI voice agent. Your pipeline fills while you focus on closing.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}>
            <a href="https://leadomation.co.uk/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1E1B4B', color: '#fff', textDecoration: 'none', borderRadius: '12px', padding: '14px 32px', fontSize: '15px', fontWeight: 600, fontFamily: 'Switzer, sans-serif', boxShadow: '0 4px 16px rgba(30,27,75,0.25)' }}>
              Start free trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#how-it-works" onClick={(e) => {
              e.preventDefault()
              const target = document.querySelector('#how-it-works')
              if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: 'smooth' })
              }
            }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.85)', color: '#0f172a', textDecoration: 'none', borderRadius: '12px', padding: '14px 32px', fontSize: '15px', fontWeight: 500, fontFamily: 'Switzer, sans-serif', border: '1.5px solid rgba(226,232,240,0.8)', backdropFilter: 'blur(8px)' }}>
              See how it works
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.65 }}
            style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>
            7 day free trial. Secure with a card. Cancel anytime.
          </motion.p>
        </div>

        {/* Laptop + floating cards */}
        {isMobile ? (
          <div style={{
            position: 'relative',
            width: '100%',
            padding: '0 16px',
            marginTop: '24px',
            marginBottom: '0px',
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              <img
                src="/screenshots/laptop-mockup.png"
                alt="Leadomation App"
                style={{
                  width: '100%',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 20px 40px rgba(79,70,229,0.20)) drop-shadow(0 8px 20px rgba(0,0,0,0.10))',
                }}
              />
              <div style={{
                position: 'absolute',
                top: '16.8%',
                left: '12.2%',
                width: '75.8%',
                height: '65.8%',
                zIndex: 2,
                borderRadius: '4px',
                overflow: 'hidden',
                background: 'white',
              }}>
                <div style={{
                  width: '620px',
                  height: '500px',
                  transform: 'scale(0.46)',
                  transformOrigin: 'top left',
                  pointerEvents: 'none',
                }}>
                  <HeroDashboardMockup staticMode={true} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            width: '1300px',
            maxWidth: '100%',
            margin: '0px auto 0',
            overflow: 'visible',
            zIndex: 2,
          }}>
            {/* MacBook mockup with animated dashboard inside */}
            <div style={{
              position: 'relative',
              width: '860px',
              margin: '0 auto',
            }}>
              {/* MacBook PNG — no blend mode, renders naturally */}
              <img
                src="/screenshots/laptop-mockup.png"
                alt="Leadomation App"
                style={{
                  width: '100%',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 40px 80px rgba(79,70,229,0.20)) drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
                }}
              />

              {/* Dashboard overlay — sits ON TOP of PNG, clipped to screen cavity */}
              <div style={{
                position: 'absolute',
                top: '16.8%',
                left: '12.2%',
                width: '75.8%',
                height: '65.8%',
                zIndex: 2,
                borderRadius: '6px',
                overflow: 'hidden',
                background: 'white',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
              }}>
                <HeroDashboardMockup />
              </div>
            </div>

            <IntentScoringCard cardVisible={cardVisible} />
            <LinkedInFunnelCard cardVisible={cardVisible} />
            <EmailPerformanceCard cardVisible={cardVisible} />
            <AIVoiceCard cardVisible={cardVisible} />
          </div>
        )}
      </div>
    </div>
  )
}
