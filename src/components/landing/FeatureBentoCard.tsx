import { useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const TABS = [
  {
    id: 'campaigns',
    label: 'Campaigns',
    badge: null,
    header: 'Active Campaigns',
    description: 'Your outreach campaigns running right now.',
  },
  {
    id: 'leads',
    label: 'Lead Database',
    badge: '271',
    header: 'Lead Database',
    description: 'Every enriched lead across all campaigns.',
  },
  {
    id: 'call-agent',
    label: 'Call Agent',
    badge: null,
    header: 'AI Call Agent',
    description: 'Configure your AI voice agent for outbound calls.',
  },
  {
    id: 'performance',
    label: 'Performance',
    badge: null,
    header: 'Campaign Analytics',
    description: 'Open rates, reply rates and conversion data.',
  },
]

const CampaignsContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {[
      { name: 'Dental Practices - UK Q2', leads: 271, status: 'Active', replied: 18, color: '#4ade80' },
      { name: 'Law Firms - Full Pipeline', leads: 143, status: 'Active', replied: 12, color: '#4ade80' },
      { name: 'UK Hotels - Q2 Outreach', leads: 89, status: 'Paused', replied: 6, color: '#f59e0b' },
    ].map((c, i) => (
      <div key={i} style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.12)', borderRadius: '8px', padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#1e1b4b' }}>{c.name}</span>
          <span style={{ fontSize: '9px', fontWeight: 700, color: c.color, background: `${c.color}18`, borderRadius: '4px', padding: '2px 6px' }}>{c.status}</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div><span style={{ fontSize: '12px', fontWeight: 700, color: '#4F46E5' }}>{c.leads}</span><span style={{ fontSize: '9px', color: '#94a3b8', marginLeft: '4px' }}>leads</span></div>
          <div><span style={{ fontSize: '12px', fontWeight: 700, color: '#22D3EE' }}>{c.replied}</span><span style={{ fontSize: '9px', color: '#94a3b8', marginLeft: '4px' }}>replied</span></div>
        </div>
      </div>
    ))}
    <button style={{ marginTop: '4px', background: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Switzer, sans-serif', width: '100%' }}>
      + New Campaign
    </button>
  </div>
)

const LeadsContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
      {['New Business (271)', 'Hot (11)', 'Warm (9)'].map((tag, i) => (
        <div key={i} style={{ background: i === 0 ? 'rgba(79,70,229,0.1)' : i === 1 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${i === 0 ? 'rgba(79,70,229,0.2)' : i === 1 ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '9px', color: i === 0 ? '#4F46E5' : i === 1 ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{tag}</div>
      ))}
    </div>
    {[
      { name: 'Dunmore Dental Care', role: 'Practice Owner', status: 'CONTACTED', intent: 'Warm 63', ic: '#f59e0b', sc: '#4F46E5' },
      { name: 'Smile Clinic Northwest', role: 'Clinical Director', status: 'REPLIED', intent: 'Hot 95', ic: '#ef4444', sc: '#22c55e' },
      { name: 'Bright Smile Kent', role: 'Practice Owner', status: 'CONTACTED', intent: 'Hot 76', ic: '#ef4444', sc: '#4F46E5' },
      { name: 'London Smile Studio', role: 'Clinical Director', status: 'REPLIED', intent: 'Hot 92', ic: '#ef4444', sc: '#22c55e' },
    ].map((lead, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#4F46E5' }}>{lead.name}</div>
          <div style={{ fontSize: '9px', color: '#94a3b8' }}>{lead.role}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ background: `${lead.sc}15`, border: `1px solid ${lead.sc}30`, borderRadius: '4px', padding: '1px 6px', fontSize: '8px', color: lead.sc, fontWeight: 600 }}>{lead.status}</div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: lead.ic }}>{lead.intent}</div>
        </div>
      </div>
    ))}
  </div>
)

const CallAgentContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <div style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.15)', borderRadius: '8px', padding: '8px 10px', marginBottom: '6px' }}>
      <div style={{ fontSize: '9px', color: '#64748b' }}>Agent Personality</div>
      <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
        {['Professional', 'Friendly & Warm', 'Consultative', 'Direct'].map((p, i) => (
          <div key={i} style={{ background: i === 0 ? '#4F46E5' : 'rgba(79,70,229,0.06)', border: `1px solid ${i === 0 ? '#4F46E5' : 'rgba(79,70,229,0.15)'}`, borderRadius: '6px', padding: '3px 8px', fontSize: '9px', color: i === 0 ? 'white' : '#64748b', fontWeight: i === 0 ? 600 : 400 }}>{p}</div>
        ))}
      </div>
    </div>
    {[
      { n: 1, label: 'Script Basics', done: true },
      { n: 2, label: 'Call Objective', done: true },
      { n: 3, label: 'Opening Line', done: true },
      { n: 4, label: 'Qualifying Questions', done: true },
      { n: 5, label: 'Objection Handling', done: false },
      { n: 6, label: 'When They Say Yes', done: false },
      { n: 7, label: 'Voicemail Script', done: false },
      { n: 8, label: 'Tone & Context', done: false },
    ].map((step, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 6px', borderRadius: '6px', background: step.n === 5 ? 'rgba(79,70,229,0.08)' : 'transparent' }}>
        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: step.done ? '#4F46E5' : 'rgba(79,70,229,0.1)', border: `1px solid ${step.done ? '#4F46E5' : 'rgba(79,70,229,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {step.done ? <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> : <span style={{ fontSize: '7px', color: '#4F46E5', fontWeight: 700 }}>{step.n}</span>}
        </div>
        <span style={{ fontSize: '10px', color: step.n === 5 ? '#4F46E5' : step.done ? '#94a3b8' : '#475569', fontWeight: step.n === 5 ? 600 : 400 }}>{step.label}</span>
      </div>
    ))}
  </div>
)

const PerformanceContent = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
      {[
        { label: 'Emails sent', value: '847', color: '#0f172a' },
        { label: 'Open rate', value: '34.2%', color: '#4F46E5' },
        { label: 'Reply rate', value: '12.8%', color: '#22D3EE' },
      ].map((s, i) => (
        <div key={i} style={{ background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.1)', borderRadius: '8px', padding: '8px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: '8px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
        </div>
      ))}
    </div>
    <div style={{ background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.1)', borderRadius: '8px', padding: '10px' }}>
      <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Performance over time</div>
      <svg viewBox="0 0 200 60" style={{ width: '100%', height: '60px' }}>
        <defs>
          <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3}/>
            <stop offset="100%" stopColor="#4F46E5" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <path d="M0,50 C20,45 40,35 60,30 S100,20 120,22 S160,15 200,10" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
        <path d="M0,50 C20,45 40,35 60,30 S100,20 120,22 S160,15 200,10 L200,60 L0,60 Z" fill="url(#perfGrad)"/>
        <path d="M0,55 C20,52 40,48 60,45 S100,40 120,42 S160,38 200,35" fill="none" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4,2"/>
      </svg>
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '2px', background: '#4F46E5', borderRadius: '1px' }}/><span style={{ fontSize: '8px', color: '#94a3b8' }}>Open rate</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '2px', background: '#22D3EE', borderRadius: '1px' }}/><span style={{ fontSize: '8px', color: '#94a3b8' }}>Reply rate</span></div>
      </div>
    </div>
    <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: '8px', padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#0f172a' }}>Best performing campaign</div>
        <div style={{ fontSize: '9px', color: '#64748b' }}>Dental Practices - UK Q2</div>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 800, color: '#22D3EE' }}>18%</div>
    </div>
  </div>
)

export default function FeatureBentoCard() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [activeTab, setActiveTab] = useState(TABS[0])
  const { isMobile } = useBreakpoint()
  const ease = [0.21, 0.47, 0.32, 0.98] as any

  const content = useMemo(() => {
    switch (activeTab.id) {
      case 'campaigns': return <CampaignsContent />
      case 'leads': return <LeadsContent />
      case 'call-agent': return <CallAgentContent />
      case 'performance': return <PerformanceContent />
      default: return null
    }
  }, [activeTab.id])

  return (
    <div
      id="how-it-works"
      ref={sectionRef}
      className="bg-arch"
      style={{
        position: 'relative',
        overflow: 'hidden',
        paddingTop: isMobile ? '40px' : '120px',
        paddingBottom: isMobile ? '40px' : '120px',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: isMobile ? '16px' : '48px', paddingRight: isMobile ? '16px' : '48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>

          {/* LEFT - text */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '6px 14px', marginBottom: '24px' }}>
              SEE IT IN ACTION
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 44px)', letterSpacing: '-0.03em', lineHeight: 1.15, background: 'linear-gradient(135deg, #0a0e1a 0%, #3730a3 40%, #4F46E5 60%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block', margin: '0 0 16px 0' }}>
              One dashboard. Every tool you need.
            </h2>
            <p style={{ color: '#334155', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px' }}>
              Campaigns, leads, call scripts and analytics all live in one place. No switching between tools, no copy-pasting data, no wasted time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
              {[
                { label: 'Launch a campaign in under 5 minutes', icon: 'z' },
                { label: 'Every lead enriched automatically on import', icon: 't' },
                { label: 'AI handles calls, emails and LinkedIn together', icon: 'r' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {i === 0 && <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}
                      {i === 1 && <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}
                      {i === 2 && <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}
                    </svg>
                  </div>
                  <span style={{ fontSize: '15px', color: '#020617', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="https://leadomation.co.uk/register" style={{
                background: '#1E1B4B', color: 'white', borderRadius: '10px',
                padding: isMobile ? '12px 20px' : '14px 28px', fontWeight: 600, fontSize: '15px',
                fontFamily: 'Switzer, sans-serif', textDecoration: 'none', display: 'inline-block',
              }}>Start free trial →</a>
              <a href="#features" onClick={(e) => {
                e.preventDefault()
                const target = document.querySelector('#features')
                if (target) {
                  const top = target.getBoundingClientRect().top + window.scrollY - 80
                  window.scrollTo({ top, behavior: 'smooth' })
                }
              }} style={{
                background: '#ECFEFF', color: '#06B6D4', border: '1px solid #22D3EE',
                borderRadius: '10px', padding: isMobile ? '12px 20px' : '14px 28px', fontWeight: 600,
                fontSize: '15px', fontFamily: 'Switzer, sans-serif', textDecoration: 'none', display: 'inline-block',
              }}>See all features</a>
            </div>
          </motion.div>

          {/* RIGHT - interactive product card */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
          >
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 8px 40px rgba(79,70,229,0.12), 0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>

              {/* Card header */}
              <div style={{ padding: '20px 24px 0', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Leadomation Platform</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>{activeTab.header}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>{activeTab.description}</div>

                {/* Browser chrome dots */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' } as any}>
                  {TABS.map((tab) => {
                    const isActive = activeTab.id === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab)}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: isMobile ? '8px 10px' : '8px 14px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: isActive ? '2px solid #4F46E5' : '2px solid transparent',
                          cursor: 'pointer',
                          fontSize: isMobile ? '11px' : '12px',
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? '#4F46E5' : '#94a3b8',
                          fontFamily: 'Switzer, sans-serif',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tab.label}
                        {tab.badge && (
                          <span style={{ fontSize: '9px', fontWeight: 700, color: isActive ? '#4F46E5' : '#94a3b8', background: isActive ? 'rgba(79,70,229,0.1)' : 'rgba(148,163,184,0.1)', borderRadius: '10px', padding: '1px 5px' }}>{tab.badge}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tab content */}
              <div style={{ padding: '16px 24px 24px', minHeight: '320px' }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {content}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
