import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const cards = [
  {
    id: 'lead-discovery',
    eyebrow: 'Lead Discovery',
    title: 'Find and enrich 500+ leads per campaign',
    description: 'Scrape Google Maps, enrich with verified emails and phone numbers via Hunter.io and Apollo.',
    accentColor: '#4F46E5',
    stats: [{ value: '500+', label: 'leads/campaign' }, { value: '3', label: 'enrichment layers' }],
    bgGradient: 'linear-gradient(135deg, #1a1040 0%, #2d1f7a 50%, #1a1040 100%)',
  },
  {
    id: 'email-sequences',
    eyebrow: 'Email Sequences',
    title: 'Write once. Follow up forever.',
    description: 'Build multi-step personalised email sequences with AI-written copy and spam checking.',
    accentColor: '#3B82F6',
    stats: [{ value: '8', label: 'sequence steps' }, { value: '34%', label: 'avg open rate' }],
    bgGradient: 'linear-gradient(135deg, #0a1535 0%, #1a3a8a 50%, #0a1535 100%)',
  },
  {
    id: 'linkedin-outreach',
    eyebrow: 'LinkedIn Outreach',
    title: 'A 35-day LinkedIn funnel on autopilot.',
    description: 'Six phases from silent awareness to soft offer, fully automated via Unipile.',
    accentColor: '#0077B5',
    stats: [{ value: '35', label: 'day funnel' }, { value: '6', label: 'phases' }],
    bgGradient: 'linear-gradient(135deg, #001525 0%, #00396b 50%, #001525 100%)',
  },
  {
    id: 'keyword-monitor',
    eyebrow: 'Keyword Monitor',
    title: 'Catch prospects the moment they signal intent.',
    description: 'Monitor LinkedIn every 2 hours for keyword matches. Auto-enrol hot leads.',
    accentColor: '#22D3EE',
    stats: [{ value: '2hr', label: 'scan interval' }, { value: 'Auto', label: 'enrolment' }],
    bgGradient: 'linear-gradient(135deg, #011820 0%, #045a6a 50%, #011820 100%)',
  },
  {
    id: 'ai-voice',
    eyebrow: 'AI Voice Calling',
    title: 'An AI agent that calls prospects for you.',
    description: 'Build an 8-step call script. Leadomation calls and leaves personalised voicemails.',
    accentColor: '#06B6D4',
    stats: [{ value: '8', label: 'script steps' }, { value: '50', label: 'calls/mo' }],
    bgGradient: 'linear-gradient(135deg, #011520 0%, #0c5060 50%, #011520 100%)',
  },
]

/* ─── Illustrations ─── */

const LeadDiscoveryIllustration = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
      {['New Business (271)', 'Hot (11)', 'Warm (9)'].map((tag, i) => (
        <div key={i} style={{ background: i === 0 ? 'rgba(79,70,229,0.25)' : 'rgba(239,68,68,0.18)', border: `1px solid ${i === 0 ? 'rgba(79,70,229,0.4)' : 'rgba(239,68,68,0.3)'}`, borderRadius: '4px', padding: '2px 7px', fontSize: '9px', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{tag}</div>
      ))}
    </div>
    {[
      { name: 'Dunmore Dental Care', role: 'Practice Owner', status: 'CONTACTED', intent: 'Warm 63', intentColor: '#f59e0b' },
      { name: 'Smile Clinic NW', role: 'Clinical Director', status: 'REPLIED', intent: 'Hot 95', intentColor: '#ef4444' },
      { name: 'Bright Smile Kent', role: 'Practice Owner', status: 'CONTACTED', intent: 'Hot 76', intentColor: '#ef4444' },
      { name: 'London Smile Studio', role: 'Clinical Director', status: 'REPLIED', intent: 'Hot 92', intentColor: '#ef4444' },
    ].map((lead, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#818cf8' }}>{lead.name}</div>
          <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)' }}>{lead.role}</div>
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <div style={{ background: lead.status === 'REPLIED' ? 'rgba(34,197,94,0.2)' : 'rgba(99,102,241,0.2)', borderRadius: '3px', padding: '1px 5px', fontSize: '7px', color: lead.status === 'REPLIED' ? '#4ade80' : '#a5b4fc', fontWeight: 600 }}>{lead.status}</div>
          <div style={{ fontSize: '8px', fontWeight: 700, color: lead.intentColor }}>{lead.intent}</div>
        </div>
      </div>
    ))}
  </div>
)

const EmailSequenceIllustration = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Sequence Builder - 4 steps</div>
    {[
      { step: '1', subject: 'Quick question about {{business}}', day: '0', status: 'Sent', statusColor: '#4ade80', accent: '#4F46E5' },
      { step: '2', subject: 'Following up - did you see?', day: '3', status: 'Opened', statusColor: '#f59e0b', accent: '#3B82F6' },
      { step: '3', subject: 'One last nudge from the team', day: '7', status: 'Scheduled', statusColor: 'rgba(255,255,255,0.3)', accent: '#22D3EE' },
      { step: '4', subject: 'Trying a different angle...', day: '14', status: 'Scheduled', statusColor: 'rgba(255,255,255,0.3)', accent: '#06B6D4' },
    ].map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '6px 8px', borderLeft: `3px solid ${s.accent}` }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '8px', fontWeight: 700, color: s.accent }}>{s.step} - Day {s.day}</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subject}</div>
        </div>
        <div style={{ fontSize: '8px', fontWeight: 600, color: s.statusColor, alignSelf: 'center' }}>{s.status}</div>
      </div>
    ))}
    <div style={{ display: 'flex', gap: '14px', marginTop: '6px', padding: '6px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {[{ v: '847', l: 'Sent' }, { v: '34.2%', l: 'Opens', c: '#4ade80' }, { v: '12.8%', l: 'Replies', c: '#818cf8' }].map((s, i) => (
        <div key={i}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: s.c || 'white' }}>{s.v}</div>
          <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
        </div>
      ))}
    </div>
  </div>
)

const LinkedInIllustration = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 2px' }}>
      {['1', '2', '3', '4', '5', '6'].map((n, i) => (
        <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: i === 0 ? '#0077B5' : 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 700, color: 'white', border: i === 0 ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.15)' }}>{n}</div>
      ))}
    </div>
    {[
      { name: 'Owen Dental Group', phase: 'Phase 1: Silent Awareness', status: 'ACTIVE', day: 4, color: '#4ade80' },
      { name: 'London Smile Studio', phase: 'Phase 3: Warm Thanks', status: 'PAUSED', day: 14, color: '#f59e0b' },
      { name: 'Smile Clinic NW', phase: 'Phase 3: Warm Thanks', status: 'PAUSED', day: 12, color: '#f59e0b' },
    ].map((lead, i) => (
      <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '6px 8px', marginBottom: '5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <div style={{ fontSize: '9px', fontWeight: 600, color: '#7dd3fc' }}>{lead.name}</div>
          <div style={{ fontSize: '7px', fontWeight: 700, color: lead.color, background: `${lead.color}20`, borderRadius: '3px', padding: '1px 5px' }}>{lead.status}</div>
        </div>
        <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)' }}>{lead.phase} - Day {lead.day}/35</div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginTop: '3px' }}>
          <div style={{ height: '100%', width: `${(lead.day / 35) * 100}%`, background: '#0077B5', borderRadius: '2px' }} />
        </div>
      </div>
    ))}
  </div>
)

const KeywordMonitorIllustration = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '6px', padding: '5px 8px', marginBottom: '8px', fontSize: '8px', color: 'rgba(255,255,255,0.6)' }}>
      Scanning LinkedIn every 2 hours for keyword matches
    </div>
    {[
      { campaign: 'Law Firms - Full Pipeline', tags: ['law firm marketing', 'solicitor acquisition'], hits: '2 hits' },
      { campaign: 'UK Hotels - Q2 Outreach', tags: ['hotel direct bookings', 'reduce booking.com fees'], hits: '4 hits' },
    ].map((m, i) => (
      <div key={i} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', padding: '6px 8px', marginBottom: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{m.campaign}</div>
          <div style={{ width: '22px', height: '12px', background: '#22D3EE', borderRadius: '6px', position: 'relative' }}>
            <div style={{ position: 'absolute', right: '2px', top: '2px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '3px' }}>
          {m.tags.map((t, j) => <div key={j} style={{ background: 'rgba(34,211,238,0.10)', borderRadius: '3px', padding: '1px 5px', fontSize: '7px', color: '#67e8f9' }}>{t}</div>)}
        </div>
        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.35)' }}><span style={{ color: '#22D3EE', fontWeight: 600 }}>{m.hits}</span></div>
      </div>
    ))}
    <div style={{ fontSize: '8px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent hits</div>
    {['Emma Fitzgerald', 'Callum Reid'].map((name, i) => (
      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>{name}</div>
        <div style={{ fontSize: '7px', fontWeight: 700, color: '#f59e0b', background: 'rgba(245,158,11,0.12)', borderRadius: '3px', padding: '1px 5px' }}>Pending</div>
      </div>
    ))}
  </div>
)

const CallAgentIllustration = () => (
  <div style={{ padding: '0 14px' }}>
    <div style={{ display: 'flex', gap: '7px', alignItems: 'center', background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '6px', padding: '6px 8px', marginBottom: '8px' }}>
      <div style={{ width: '22px', height: '22px', background: 'rgba(6,182,212,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.18 19.79 19.79 0 0 1 .13 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </div>
      <div>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#06B6D4' }}>AI Call Agent</div>
        <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.4)' }}>8-step script builder</div>
      </div>
    </div>
    {[
      { n: 1, label: 'Script Basics' }, { n: 2, label: 'Call Objective' }, { n: 3, label: 'Opening Line' },
      { n: 4, label: 'Qualifying Questions' }, { n: 5, label: 'Objection Handling' },
      { n: 6, label: 'When They Say Yes' }, { n: 7, label: 'Voicemail Script' },
      { n: 8, label: 'Tone & Context', active: true },
    ].map((step, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 6px', borderRadius: '4px', background: (step as any).active ? 'rgba(6,182,212,0.12)' : 'transparent', marginBottom: '1px' }}>
        <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: (step as any).active ? '#06B6D4' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 700, color: (step as any).active ? 'white' : 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{step.n}</div>
        <div style={{ fontSize: '9px', color: (step as any).active ? '#06B6D4' : 'rgba(255,255,255,0.45)', fontWeight: (step as any).active ? 600 : 400 }}>{step.label}</div>
      </div>
    ))}
  </div>
)

const illustrations = [LeadDiscoveryIllustration, EmailSequenceIllustration, LinkedInIllustration, KeywordMonitorIllustration, CallAgentIllustration]

export default function FeatureExpandingCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [activeIndex, setActiveIndex] = useState(0)
  const { isMobile } = useBreakpoint()
  const ease = [0.21, 0.47, 0.32, 0.98] as any

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, transparent 120px, transparent 100%)',
        position: 'relative',
        paddingTop: isMobile ? '60px' : '120px',
        paddingBottom: isMobile ? '60px' : '120px',
        fontFamily: 'Switzer, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: '5%', left: '-12%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '15%', right: '-12%', width: '550px', height: '550px', background: 'radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease }}
        style={{ maxWidth: '700px', margin: '0 auto 64px', textAlign: 'center', paddingLeft: '24px', paddingRight: '24px', position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '6px 14px', marginBottom: '24px' }}>
          EVERYTHING YOU NEED
        </div>
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.03em', lineHeight: 1.1, background: 'linear-gradient(135deg, #0a0e1a 0%, #3730a3 40%, #4F46E5 60%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block', margin: '0 0 16px 0' }}>
          Five tools. One platform. Zero manual work.
        </h2>
        <p style={{ color: '#334155', fontSize: '18px', lineHeight: 1.7, margin: 0 }}>
          Every feature your outreach needs, built in and working together from day one.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease, delay: 0.2 }}
        style={{ display: 'flex', flexDirection: isMobile ? 'column' as const : 'row' as const, gap: isMobile ? '8px' : '12px', maxWidth: '1200px', margin: '0 auto', paddingLeft: isMobile ? '16px' : '24px', paddingRight: isMobile ? '16px' : '24px', height: isMobile ? 'auto' : '480px', position: 'relative', zIndex: 1 }}
      >
        {cards.map((card, index) => {
          const Illustration = illustrations[index]
          const isActive = activeIndex === index
          return (
            <div
              key={card.id}
              onClick={() => setActiveIndex(index)}
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: isMobile ? '16px' : '20px',
                cursor: 'pointer',
                ...(isMobile
                  ? { flex: 'none', width: '100%', height: isActive ? '380px' : '56px', minWidth: 'auto', transition: 'height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }
                  : { flex: isActive ? '5' : '1', minWidth: isActive ? '0' : '68px', transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }
                ),
                background: card.bgGradient,
                border: `1px solid ${isActive ? card.accentColor + '60' : 'rgba(255,255,255,0.10)'}`,
                boxShadow: isActive ? `0 20px 60px ${card.accentColor}30` : '0 4px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: '3px', background: card.accentColor, flexShrink: 0, opacity: isActive ? 1 : 0.4, transition: 'opacity 0.4s ease' }} />

              {/* Illustration area - fills remaining space, content centered */}
              <div style={{
                flex: 1,
                overflow: 'hidden',
                opacity: isActive ? 1 : 0.35,
                transition: 'opacity 0.5s ease',
                display: 'flex',
                alignItems: 'center',
              }}>
                <div style={{ width: '100%' }}>
                  <Illustration />
                </div>
              </div>

              {/* Collapsed label - shown when card is narrow */}
              <div style={{
                position: 'absolute',
                ...(isMobile
                  ? { top: '50%', left: '16px', transform: 'translateY(-50%)' }
                  : { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
                ),
                zIndex: 5, opacity: isActive ? 0 : 1, transition: 'opacity 0.3s ease',
                pointerEvents: 'none', whiteSpace: 'nowrap',
              }}>
                <span style={{ ...(isMobile ? {} : { writingMode: 'vertical-rl' as const, textOrientation: 'mixed' as const }), fontSize: isMobile ? '13px' : '11px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{card.eyebrow}</span>
              </div>

              {/* Expanded text content - pushed to bottom */}
              <div style={{
                flexShrink: 0,
                padding: '0 20px 18px',
                opacity: isActive ? 1 : 0,
                maxHeight: isActive ? '300px' : '0px',
                overflow: 'hidden',
                transition: 'opacity 0.4s ease 0.1s, max-height 0.5s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ background: `${card.accentColor}25`, border: `1px solid ${card.accentColor}50`, borderRadius: '100px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, color: card.accentColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{card.eyebrow}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '6px', letterSpacing: '-0.02em' }}>{card.title}</div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '12px' }}>{card.description}</p>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '12px' }}>
                  {card.stats.map((stat, i) => (
                    <div key={i}>
                      <div style={{ fontSize: '17px', fontWeight: 800, color: card.accentColor }}>{stat.value}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                <button style={{ background: card.accentColor, color: 'white', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Switzer, sans-serif' }}>
                  See feature →
                </button>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
