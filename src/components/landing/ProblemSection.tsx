import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function ProblemCard({
  illustration,
  title,
  description,
  delay,
  bgGradient,
}: {
  illustration: React.ReactNode
  title: string
  description: string
  delay: number
  accentColor?: string
  bgGradient: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        border: '1px solid rgba(226,232,240,0.8)',
        cursor: 'default',
        flex: 1,
      }}
    >
      {/* Illustration area */}
      <div style={{
        height: '220px',
        background: bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
      }}>
        {illustration}
      </div>

      {/* Text content */}
      <div style={{ padding: '28px 28px 32px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#0f172a',
          fontFamily: 'Switzer, sans-serif',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '15px',
          color: '#64748b',
          fontFamily: 'Switzer, sans-serif',
          lineHeight: 1.7,
          margin: 0,
        }}>
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// Illustration 1: Clock and crawling progress bar
function ManualProspectingIllustration() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px' }}>
      {/* Fake browser search bar */}
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Searching for leads manually...</span>
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ width: '2px', height: '14px', background: '#4F46E5', marginLeft: '2px' }}
        />
      </div>

      {/* Lead rows loading one by one */}
      {[
        { name: 'Acme Corp', email: 'info@acme...', delay: 0 },
        { name: 'BlueSky Ltd', email: 'contact@blue...', delay: 0.4 },
        { name: 'Titan Group', email: 'hello@titan...', delay: 0.8 },
      ].map((lead, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: lead.delay, repeat: Infinity, repeatDelay: 2.4 }}
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: 700, color: '#4F46E5', fontFamily: 'Switzer, sans-serif' }}>{lead.name[0]}</span>
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{lead.name}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>{lead.email}</div>
            </div>
          </div>
          <div style={{ width: '48px', height: '4px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 1.5, delay: lead.delay, repeat: Infinity, repeatDelay: 1.7 }}
              style={{ height: '100%', background: '#cbd5e1', borderRadius: '100px' }}
            />
          </div>
        </motion.div>
      ))}

      {/* Time indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '4px',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>3.5 hours spent today</span>
      </div>
    </div>
  )
}

// Illustration 2: Inbox with unread/ignored emails
function IgnoredEmailsIllustration() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
      {/* Open rate gauge */}
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Campaign open rate</span>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: '14px', fontWeight: 800, color: '#dc2626', fontFamily: 'Switzer, sans-serif' }}
          >
            2.1%
          </motion.span>
        </div>
        <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{ width: '2.1%', height: '100%', background: '#dc2626', borderRadius: '100px' }} />
        </div>
      </div>

      {/* Email list - all unread */}
      {[
        { subject: 'Quick question about your business', time: '3d ago' },
        { subject: 'Following up on my last email', time: '5d ago' },
        { subject: 'Last attempt to connect', time: '8d ago' },
      ].map((email, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '8px',
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{email.subject}</div>
          </div>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', whiteSpace: 'nowrap' as const }}>{email.time}</span>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: '#94a3b8', flexShrink: 0,
          }} />
        </div>
      ))}

      <div style={{ textAlign: 'center' as const, marginTop: '2px' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>No replies received</span>
      </div>
    </div>
  )
}

// Illustration 3: Flat analytics line and question marks
function BlindOutreachIllustration() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px' }}>
      {/* Disconnected metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
        {[
          { label: 'Emails sent', value: '847', icon: '?' },
          { label: 'Opened', value: '???', icon: '?' },
          { label: 'Replied', value: '???', icon: '?' },
        ].map((stat, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '8px',
            padding: '10px 8px',
            textAlign: 'center' as const,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: i === 0 ? '#0f172a' : '#cbd5e1', fontFamily: 'Switzer, sans-serif' }}>{stat.value}</div>
            <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Flat line chart */}
      <div style={{
        background: 'rgba(255,255,255,0.9)',
        borderRadius: '10px',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '8px' }}>Performance over time</div>
        <svg viewBox="0 0 200 50" style={{ width: '100%', height: '50px' }}>
          {/* Flat line with tiny random bumps */}
          <polyline
            points="0,40 20,39 40,41 60,38 80,40 100,39 120,41 140,38 160,40 180,39 200,40"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Question mark circles */}
          {[50, 120, 175].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="20" r="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
              <text x={x} y="24" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="sans-serif">?</text>
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>No actionable data</span>
        </div>
      </div>
    </div>
  )
}

export default function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px 100px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #f8faff 40%, #f0f4ff 100%)',
      overflow: 'hidden',
    }}>
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-5%',
        width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#dc2626',
            fontFamily: 'Switzer, sans-serif',
            marginBottom: '20px',
            letterSpacing: '0.02em',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            The problem
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            color: '#0f172a',
            fontFamily: 'Switzer, sans-serif',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 auto 16px',
            maxWidth: '720px',
          }}>
            You're spending more time finding leads than closing them.
          </h2>

          <p style={{
            fontSize: '17px',
            color: '#64748b',
            fontFamily: 'Switzer, sans-serif',
            lineHeight: 1.7,
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            Manual prospecting, generic templates and zero visibility on what's working. Sound familiar?
          </p>
        </motion.div>

        {/* Three cards */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'stretch',
        }}>
          <ProblemCard
            delay={0.1}
            accentColor="#dc2626"
            bgGradient="linear-gradient(135deg, #fff5f5 0%, #fef2f2 50%, #fff7ed 100%)"
            title="Hours lost to manual prospecting"
            description="Searching for leads one by one, verifying contact details by hand, and building lists manually takes hours every day. Time you should be spending on closing."
            illustration={<ManualProspectingIllustration />}
          />
          <ProblemCard
            delay={0.2}
            accentColor="#f59e0b"
            bgGradient="linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)"
            title="Generic emails that never get replies"
            description="Copy-paste templates feel exactly like what they are. Without personalisation, real intent signals and proper deliverability, your emails go straight to spam."
            illustration={<IgnoredEmailsIllustration />}
          />
          <ProblemCard
            delay={0.3}
            accentColor="#6366f1"
            bgGradient="linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f0f4ff 100%)"
            title="No idea which outreach is actually working"
            description="Without proper analytics you're guessing. Which campaigns, sequences and messages are driving replies? You have no way to know what to fix or double down on."
            illustration={<BlindOutreachIllustration />}
          />
        </div>
      </div>
    </section>
  )
}
