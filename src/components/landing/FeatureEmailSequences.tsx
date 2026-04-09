import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function CheckRow({ label, description }: { label: string; description: string }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{
        width: '24px', height: '24px', borderRadius: '50%',
        background: '#4F46E5', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0, marginTop: '1px',
      }}>
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1 4.5L3.5 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ fontSize: '15px', fontFamily: 'Switzer, sans-serif', lineHeight: 1.6, opacity: 1 }}>
        <span style={{ fontWeight: 600, color: '#0f172a', opacity: 1 }}>{label}</span>{' '}
        <span style={{ fontWeight: 400, color: '#64748b', opacity: 1 }}>{description}</span>
      </div>
    </div>
  )
}

function SequenceStep({
  step, accentColor, badgeBg, badgeColor, subject, meta, statusLabel, statusColor, statusBg, delay, inView,
}: {
  step: number; accentColor: string; badgeBg: string; badgeColor: string
  subject: string; meta: string; statusLabel: string; statusColor: string; statusBg: string
  delay: number; inView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '8px', bottom: '8px',
        width: '3px', borderRadius: '2px', background: accentColor,
      }} />

      <div style={{ flex: 1, marginLeft: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            background: badgeBg, color: badgeColor, fontSize: '10px',
            fontWeight: 700, borderRadius: '4px', padding: '2px 6px',
            fontFamily: 'Switzer, sans-serif',
          }}>Step {step}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{subject}</span>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>{meta}</span>
      </div>

      <div style={{
        background: statusBg, color: statusColor, fontSize: '10px',
        fontWeight: 700, borderRadius: '100px', padding: '3px 10px',
        fontFamily: 'Switzer, sans-serif', whiteSpace: 'nowrap' as const, flexShrink: 0,
      }}>
        {statusLabel}
      </div>
    </motion.div>
  )
}

function SequenceIllustration({ inView }: { inView: boolean }) {
  const steps = [
    { step: 1, accentColor: '#4F46E5', badgeBg: '#EEF2FF', badgeColor: '#4F46E5', subject: 'Quick question about {{business_name}}', meta: 'Day 0 \u00B7 Email', statusLabel: 'Sent', statusColor: '#15803d', statusBg: '#f0fdf4' },
    { step: 2, accentColor: '#3B82F6', badgeBg: '#EFF6FF', badgeColor: '#3B82F6', subject: 'Following up \u2014 did you get a chance to look?', meta: 'Day 3 \u00B7 Email', statusLabel: 'Opened', statusColor: '#d97706', statusBg: '#fffbeb' },
    { step: 3, accentColor: '#22D3EE', badgeBg: '#ECFEFF', badgeColor: '#06B6D4', subject: 'One last nudge from the Leadomation team', meta: 'Day 7 \u00B7 Email', statusLabel: 'Scheduled', statusColor: '#64748b', statusBg: '#f8fafc' },
    { step: 4, accentColor: '#06B6D4', badgeBg: '#ECFEFF', badgeColor: '#06B6D4', subject: 'Trying a different angle...', meta: 'Day 14 \u00B7 Email', statusLabel: 'Scheduled', statusColor: '#64748b', statusBg: '#f8fafc' },
  ]

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating badge */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{
          position: 'absolute', top: '-12px', right: '20px',
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px',
          padding: '8px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          zIndex: 3, fontSize: '12px', fontWeight: 600, color: '#0f172a',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        ✉ 12 new replies today
      </motion.div>

      <div style={{
        background: '#fff', borderRadius: '20px',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        padding: '28px', overflow: 'hidden', position: 'relative',
      }}>
        {/* Browser chrome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
          <div style={{
            marginLeft: '8px', background: '#f1f5f9', borderRadius: '6px',
            padding: '4px 12px', flex: 1,
          }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>app.leadomation.co.uk/sequences</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Sequence Builder</div>
          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Active campaign &middot; 4 steps</div>
        </div>

        {/* Step cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
          {steps.map((s, i) => (
            <SequenceStep key={i} {...s} delay={0.3 + i * 0.1} inView={inView} />
          ))}

          {/* Animated envelope between step 2 and step 3 */}
          <motion.div
            animate={{ y: [0, 30], opacity: [1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2, ease: 'easeIn' }}
            style={{
              position: 'absolute', top: '50%', right: '20px',
              color: '#4F46E5', fontSize: '16px', pointerEvents: 'none', zIndex: 2,
            }}
          >
            &#9993;
          </motion.div>
        </div>

        {/* Stats bar */}
        <div style={{
          marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '14px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', textAlign: 'center' as const,
        }}>
          {[
            { value: '847', label: 'Emails sent', color: '#0f172a' },
            { value: '34.2%', label: 'Open rate', color: '#22c55e' },
            { value: '12.8%', label: 'Reply rate', color: '#4F46E5' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: stat.color, fontFamily: 'Switzer, sans-serif' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FeatureEmailSequences() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
      fontFamily: 'Switzer, sans-serif',
      marginTop: '-2px',
    }}>
      <div style={{
        background: 'linear-gradient(180deg, transparent 0%, #ffffff 80px, #ffffff 100%)',
      }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '120px 48px',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '80px', alignItems: 'center',
        }}>
          {/* Left — illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <SequenceIllustration inView={inView} />
          </motion.div>

          {/* Right — text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#EEF2FF', borderRadius: '100px', padding: '6px 14px',
              width: 'fit-content', marginBottom: '20px',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
              <span style={{
                fontSize: '12px', fontWeight: 700, color: '#4F46E5',
                letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                fontFamily: 'Switzer, sans-serif',
              }}>Email sequences</span>
            </div>

            <h2 style={{
              fontSize: '44px', fontWeight: 800, letterSpacing: '-0.03em',
              lineHeight: 1.15, margin: 0,
              background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              fontFamily: 'Switzer, sans-serif',
            }}>
              Write once. Follow up forever.
            </h2>

            <p style={{
              fontSize: '17px', color: '#475569', lineHeight: 1.7, opacity: 1,
              marginTop: '16px', marginBottom: 0,
              fontFamily: 'Switzer, sans-serif',
            }}>
              Build personalised multi-step email sequences in minutes. Leadomation handles the timing, personalisation and follow-ups automatically - so every lead gets the right message at the right time.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
              <CheckRow label="Up to 8 sequence steps" description="across email, LinkedIn and voice" />
              <CheckRow label="AI-written personalisation" description="using business name, industry and intent signals" />
              <CheckRow label="Spam score checker built in" description="so your emails actually reach the inbox" />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
              <a href="/app/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1E1B4B', color: '#ffffff', textDecoration: 'none',
                borderRadius: '10px', padding: '14px 28px',
                fontSize: '15px', fontWeight: 600, fontFamily: 'Switzer, sans-serif', opacity: 1,
              }}>
                Start free trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#features" style={{
                display: 'inline-flex', alignItems: 'center',
                background: '#ECFEFF', color: '#06B6D4', textDecoration: 'none',
                borderRadius: '10px', padding: '14px 28px',
                fontSize: '15px', fontWeight: 600, fontFamily: 'Switzer, sans-serif',
                border: '1px solid #22D3EE', opacity: 1,
              }}>
                See all features
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      </div>
    </section>
  )
}
