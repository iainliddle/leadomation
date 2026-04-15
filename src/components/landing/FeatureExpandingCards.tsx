import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

// ============================================================================
// Card A — Lead Discovery illustration
// ============================================================================
function LeadDiscoveryIllustration() {
  const rows = [
    { company: 'Dunmore Dental', role: 'Practice Owner', email: 'kate@dunmore...', status: 'CONTACTED', statusColor: '#fbbf24', intent: 'Hot 95', intentColor: '#ef4444' },
    { company: 'Smile Clinic NW', role: 'Clinical Director', email: 'amit@smilecl...', status: 'REPLIED', statusColor: '#10b981', intent: 'Warm 63', intentColor: '#f59e0b' },
    { company: 'Bright Smile Kent', role: 'Practice Owner', email: 's.gallagher@...', status: 'CONTACTED', statusColor: '#fbbf24', intent: 'Hot 76', intentColor: '#ef4444' },
    { company: 'London Smile', role: 'Clinical Director', email: 'maria@london...', status: 'REPLIED', statusColor: '#10b981', intent: 'Warm 54', intentColor: '#f59e0b' },
  ]
  return (
    <div style={{
      position: 'absolute', inset: '14px 14px auto 14px', height: '200px',
      background: 'rgba(255,255,255,0.06)', borderRadius: '10px',
      border: '1px solid rgba(255,255,255,0.10)', overflow: 'hidden',
      fontFamily: 'Switzer, sans-serif',
    }}>
      {/* Browser bar */}
      <div style={{ height: '18px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />)}
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '3px', padding: '1px 6px', fontSize: '6px', color: 'rgba(255,255,255,0.5)' }}>
          app.leadomation.co.uk/lead-database
        </div>
      </div>
      {/* Header row */}
      <div style={{ display: 'flex', padding: '6px 8px', background: 'rgba(255,255,255,0.05)', fontSize: '6px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', gap: '6px' }}>
        <div style={{ flex: 1.2 }}>COMPANY</div>
        <div style={{ flex: 1 }}>EMAIL</div>
        <div style={{ flex: 0.7 }}>STATUS</div>
        <div style={{ flex: 0.6 }}>INTENT</div>
      </div>
      {/* Rows */}
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', padding: '6px 8px', borderTop: '1px solid rgba(255,255,255,0.06)', alignItems: 'center', gap: '6px' }}>
          <div style={{ flex: 1.2 }}>
            <div style={{ fontSize: '7px', fontWeight: 700, color: '#a5b4fc', lineHeight: 1.1 }}>{r.company}</div>
            <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>{r.role}</div>
          </div>
          <div style={{ flex: 1, fontSize: '6px', color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.email}</div>
          <div style={{ flex: 0.7 }}>
            <span style={{ fontSize: '5px', fontWeight: 700, padding: '1px 4px', borderRadius: '6px', background: `${r.statusColor}25`, color: r.statusColor, letterSpacing: '0.02em' }}>{r.status}</span>
          </div>
          <div style={{ flex: 0.6 }}>
            <span style={{ fontSize: '5px', fontWeight: 700, padding: '1px 4px', borderRadius: '6px', background: `${r.intentColor}25`, color: r.intentColor }}>{r.intent}</span>
          </div>
        </div>
      ))}
      {/* Add lead button top right */}
      <div style={{ position: 'absolute', top: '4px', right: '8px', background: '#4f46e5', color: 'white', fontSize: '5px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px' }}>+ Add Lead</div>
    </div>
  )
}

// ============================================================================
// Card B — Email Sequences illustration
// ============================================================================
function EmailSequencesIllustration() {
  const steps = [
    { step: 'Step 1 · Day 0', subject: 'Quick question about your practice', status: 'Sent', statusColor: '#10b981', accent: '#4f46e5' },
    { step: 'Step 2 · Day 3', subject: 'Following up on my last email', status: 'Opened', statusColor: '#f59e0b', accent: '#3b82f6' },
    { step: 'Step 3 · Day 7', subject: 'One more thing worth checking', status: 'Scheduled', statusColor: 'rgba(255,255,255,0.5)', accent: '#22d3ee' },
    { step: 'Step 4 · Day 14', subject: 'Last email I will send', status: 'Scheduled', statusColor: 'rgba(255,255,255,0.5)', accent: '#06b6d4' },
  ]
  return (
    <div style={{ position: 'absolute', inset: '14px 14px auto 14px', height: '200px', fontFamily: 'Switzer, sans-serif' }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.12)', borderRadius: '6px',
          padding: '6px 8px', marginBottom: '4px',
          borderLeft: `2px solid ${s.accent}`,
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '2px' }}>{s.step}</div>
            <div style={{ fontSize: '8px', color: 'white', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.subject}</div>
          </div>
          <span style={{ fontSize: '6px', fontWeight: 700, padding: '2px 5px', borderRadius: '100px', background: 'rgba(255,255,255,0.12)', color: s.statusColor }}>{s.status}</span>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 4px 0', fontSize: '7px', color: 'white', fontWeight: 700 }}>
        <div><span style={{ color: 'white' }}>847</span> <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>sent</span></div>
        <div><span style={{ color: '#22d3ee' }}>34.2%</span> <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>open</span></div>
        <div><span style={{ color: '#22d3ee' }}>12.8%</span> <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>reply</span></div>
      </div>
    </div>
  )
}

// ============================================================================
// Card C — AI Voice Calling illustration
// ============================================================================
function VoiceCallingIllustration() {
  const steps = [
    'Script Basics', 'Call Objective', 'Opening Line', 'Qualifying Qs',
    'Objections', 'When Yes', 'Voicemail', 'Tone',
  ]
  const objectives = [
    { label: 'Book Discovery', active: true },
    { label: 'Qualify Lead', active: false },
    { label: 'Schedule Demo', active: false },
    { label: 'Custom', active: false },
  ]
  return (
    <div style={{ position: 'absolute', inset: '14px 14px auto 14px', height: '200px', display: 'flex', gap: '6px', fontFamily: 'Switzer, sans-serif' }}>
      {/* Left: numbered steps */}
      <div style={{ width: '80px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {steps.map((label, i) => {
          const active = i === 1
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '2px 4px', borderRadius: '3px',
              background: active ? 'rgba(34,211,238,0.18)' : 'transparent',
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: active ? '#06b6d4' : 'rgba(255,255,255,0.12)',
                color: 'white', fontSize: '6px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ fontSize: '6px', color: active ? 'white' : 'rgba(255,255,255,0.55)', fontWeight: active ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
            </div>
          )
        })}
      </div>
      {/* Right: objectives grid */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '7px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '6px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '5px' }}>Call Objective</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', flex: 1 }}>
          {objectives.map((o, i) => (
            <div key={i} style={{
              background: o.active ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${o.active ? '#22d3ee' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '5px', padding: '5px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: o.active ? '#22d3ee' : 'rgba(255,255,255,0.15)' }} />
              <div style={{ fontSize: '5px', color: 'white', fontWeight: 600, textAlign: 'center' }}>{o.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
          <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.5)' }}>Step 2 of 8</div>
          <div style={{ background: '#06b6d4', color: 'white', fontSize: '5px', fontWeight: 700, padding: '2px 6px', borderRadius: '3px' }}>Next</div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Card D — LinkedIn Outreach illustration
// ============================================================================
function LinkedInIllustration() {
  const phases = ['Silent', 'Connect', 'Thanks', 'Advice', 'Follow', 'Offer']
  const prospects = [
    { name: 'Owen Dental Group', role: 'Dr Liam Owens', phase: 3, day: 14, progress: 40, status: 'ACTIVE' },
    { name: 'London Smile Studio', role: 'Dr Paul Morrison', phase: 2, day: 8, progress: 23, status: 'ACTIVE' },
    { name: 'Smile Clinic Nw', role: 'Dr Amit Patel', phase: 4, day: 21, progress: 60, status: 'PAUSED' },
  ]
  return (
    <div style={{ position: 'absolute', inset: '14px 14px auto 14px', height: '200px', fontFamily: 'Switzer, sans-serif' }}>
      {/* Phase tracker */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '8px', right: '8px', top: '7px', height: '1px', background: 'rgba(255,255,255,0.15)' }} />
        {phases.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', zIndex: 1 }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: i === 0 ? '#4f46e5' : 'rgba(30,27,75,0.9)',
              border: i === 0 ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.25)',
              color: 'white', fontSize: '7px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{i + 1}</div>
            <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{p}</div>
          </div>
        ))}
      </div>
      {/* Prospect cards */}
      {prospects.map((p, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.08)', borderRadius: '6px',
          padding: '5px 7px', marginBottom: '4px',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'linear-gradient(135deg,#0077b5,#3b82f6)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '7px', fontWeight: 700, color: '#7dd3fc' }}>{p.name}</div>
            <div style={{ fontSize: '5px', color: 'rgba(255,255,255,0.5)' }}>Day {p.day} of 35 · Phase {p.phase}</div>
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.12)', borderRadius: '100px', marginTop: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${p.progress}%`, height: '100%', background: '#0077b5' }} />
            </div>
          </div>
          <span style={{ fontSize: '5px', fontWeight: 700, padding: '1px 4px', borderRadius: '6px', background: p.status === 'ACTIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: p.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }}>{p.status}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Card F — Keyword Monitor illustration
// ============================================================================
function KeywordMonitorIllustration() {
  const campaigns = [
    { name: 'Law Firms - Full Pipeline', tags: ['law firm marketing', 'solicitor acquisition'], hits: 2 },
    { name: 'UK Hotels - Q2 Outreach', tags: ['hotel direct bookings', 'OTA commission'], hits: 4 },
  ]
  const hits = [
    { name: 'Emma Fitzgerald', status: 'Pending', statusColor: '#f59e0b' },
    { name: 'Callum Reid', status: 'Pending', statusColor: '#f59e0b' },
    { name: 'Simon Adeyemi', status: 'Enrolled', statusColor: '#10b981' },
  ]
  return (
    <div style={{ position: 'absolute', inset: '14px 14px auto 14px', height: '200px', fontFamily: 'Switzer, sans-serif' }}>
      {/* Info banner */}
      <div style={{
        background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.25)',
        borderRadius: '5px', padding: '4px 7px', marginBottom: '5px',
        fontSize: '6px', color: 'rgba(255,255,255,0.8)',
      }}>
        Scanning LinkedIn every 2 hours for keyword matches
      </div>
      {/* Campaigns */}
      {campaigns.map((c, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '5px', padding: '4px 6px', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '6px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>{c.name}</div>
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
              {c.tags.map((t, j) => (
                <span key={j} style={{ fontSize: '5px', padding: '1px 4px', borderRadius: '100px', background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.35)', color: '#67e8f9' }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ width: '14px', height: '7px', borderRadius: '100px', background: '#22d3ee', position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', right: '1px', top: '1px', width: '5px', height: '5px', borderRadius: '50%', background: 'white' }} />
          </div>
        </div>
      ))}
      {/* Recent hits */}
      <div style={{ marginTop: '5px' }}>
        {hits.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px', fontSize: '6px', color: 'rgba(255,255,255,0.75)' }}>
            <span style={{ fontWeight: 600 }}>{h.name}</span>
            <span style={{ fontSize: '5px', fontWeight: 700, padding: '1px 4px', borderRadius: '6px', background: `${h.statusColor}25`, color: h.statusColor }}>{h.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Feature card wrapper
// ============================================================================
type FeatureCardProps = {
  gridColumn: string
  gridRow: string
  minHeight: number
  illustrationBg: string
  accentColor: string
  eyebrow: string
  title: string
  description: string
  illustration: React.ReactNode
  delay: number
}

function FeatureCard({ gridColumn, gridRow, minHeight, illustrationBg, accentColor, eyebrow, title, description, illustration, delay }: FeatureCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        gridColumn, gridRow,
        minHeight: `${minHeight}px`,
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(226,232,240,0.8)',
        background: '#ffffff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      {/* Illustration area — dark brand-tinted background */}
      <div style={{
        position: 'relative',
        flex: 1,
        minHeight: '240px',
        background: illustrationBg,
        overflow: 'hidden',
      }}>
        {illustration}
      </div>

      {/* Text block — white */}
      <div style={{
        background: 'transparent',
        borderTop: '1px solid rgba(226,232,240,0.6)',
        padding: '16px 20px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: `${accentColor}12`,
          border: `1px solid ${accentColor}30`,
          color: accentColor,
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          borderRadius: '100px',
          padding: '3px 10px',
          textTransform: 'uppercase',
          marginBottom: '8px',
          fontFamily: 'Switzer, sans-serif',
        }}>{eyebrow}</div>
        <div style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#0f172a',
          lineHeight: 1.25,
          marginBottom: '4px',
          fontFamily: 'Switzer, sans-serif',
        }}>{title}</div>
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          lineHeight: 1.5,
          fontFamily: 'Switzer, sans-serif',
        }}>{description}</div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Brand card (E1)
// ============================================================================
function BrandCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        height: '160px',
        background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)',
        border: '1px solid #e0e7ff',
        borderRadius: '20px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
        padding: '16px',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <img src="/logo-full.png" alt="Leadomation" style={{ height: '28px' }} />
      <div style={{ fontSize: '13px', color: '#4f46e5', fontWeight: 500 }}>B2B lead generation, automated</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Hunter.io', 'Apollo', 'Unipile'].map((name) => (
          <span key={name} style={{
            background: 'white', border: '1px solid #e2e8f0',
            borderRadius: '100px', padding: '3px 10px',
            fontSize: '10px', color: '#64748b',
            display: 'inline-flex', alignItems: 'center', gap: '4px',
          }}>{name}</span>
        ))}
      </div>
    </motion.div>
  )
}

// ============================================================================
// Stats card (E2)
// ============================================================================
function StatsCard() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{
        height: '160px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(226,232,240,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '40px', fontWeight: 800, color: '#22d3ee', lineHeight: 1 }}>18%</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>avg reply rate</div>
      </div>
      <div style={{ width: '1px', height: '60%', background: 'rgba(255,255,255,0.15)' }} />
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ fontSize: '40px', fontWeight: 800, color: 'white', lineHeight: 1 }}>500+</div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginTop: '6px' }}>businesses</div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// Floating side cards
// ============================================================================
function FloatingCard({
  side, top, visible, delay, children,
}: {
  side: 'left' | 'right'
  top: number
  visible: boolean
  delay: number
  children: React.ReactNode
}) {
  const hiddenX = side === 'left' ? -320 : 320
  return (
    <motion.div
      animate={{
        x: visible ? 0 : hiddenX,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay }}
      style={{
        position: 'absolute',
        top: `${top}px`,
        ...(side === 'left' ? { left: '-250px' } : { right: '-250px' }),
        width: '220px',
        background: 'white',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.10)',
        border: '1px solid rgba(226,232,240,0.8)',
        fontFamily: 'Switzer, sans-serif',
        zIndex: 2,
      }}
    >
      <motion.div
        animate={{ y: visible ? [0, -8, 0] : 0 }}
        transition={{ duration: 3.5 + delay * 10, repeat: visible ? Infinity : 0, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function IntentScoringCard() {
  const leads = [
    { name: 'Smile Clinic NW', role: 'Clinical Director', score: 95, colour: '#ef4444', label: 'Hot' },
    { name: 'Dunmore Dental', role: 'Practice Owner', score: 63, colour: '#f59e0b', label: 'Warm' },
    { name: 'Bright Smile Kent', role: 'Practice Owner', score: 76, colour: '#ef4444', label: 'Hot' },
  ]
  return (
    <>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Intent Scoring</div>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>Live lead intelligence</div>
      {leads.map((l, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</div>
            <div style={{ fontSize: '8px', color: '#94a3b8' }}>{l.role}</div>
          </div>
          <span style={{ fontSize: '8px', fontWeight: 700, padding: '2px 6px', borderRadius: '100px', background: `${l.colour}15`, color: l.colour }}>{l.label} {l.score}</span>
        </div>
      ))}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '4px' }}>Average intent score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>78</div>
          <div style={{ flex: 1, height: '6px', borderRadius: '100px', background: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
          </div>
        </div>
      </div>
    </>
  )
}

function LinkedInFloatingCard() {
  const phases = [
    { label: 'Silent Awareness', active: true },
    { label: 'Connection', active: true },
    { label: 'Warm Thanks', active: true },
    { label: 'Advice Ask', active: false },
    { label: 'Follow Up', active: false },
    { label: 'Soft Offer', active: false },
  ]
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <div style={{ width: '16px', height: '16px', background: '#0077b5', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px', fontWeight: 800 }}>in</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>LinkedIn Outreach</div>
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>35-day automated funnel</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
        {phases.map((p, i) => (
          <span key={i} style={{
            fontSize: '8px', fontWeight: 600, padding: '3px 7px', borderRadius: '100px',
            background: p.active ? '#EEF2FF' : '#f8fafc',
            color: p.active ? '#4f46e5' : '#94a3b8',
          }}>{p.label}</span>
        ))}
      </div>
      <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a' }}>Owen Dental Group</div>
        <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '6px' }}>Day 14 of 35 · Phase 3: Warm Thanks</div>
        <div style={{ height: '4px', borderRadius: '100px', background: '#e2e8f0', overflow: 'hidden' }}>
          <div style={{ width: '40%', height: '100%', background: '#0077B5' }} />
        </div>
      </div>
      <div style={{ fontSize: '9px', fontWeight: 600, color: '#4f46e5', marginTop: '8px' }}>4 prospects active this week</div>
    </>
  )
}

function VoiceAgentCard() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <div style={{ width: '16px', height: '16px', background: '#06b6d4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 00-1.02.24l-2.2 2.2a15.1 15.1 0 01-6.59-6.59l2.2-2.2a1 1 0 00.24-1.02A11.36 11.36 0 018.5 4a1 1 0 00-1-1H4a1 1 0 00-1 1c0 9.39 7.61 17 17 17a1 1 0 001-1v-3.5a1 1 0 00-1-1z"/></svg>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>AI Voice Agent</div>
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>Automated outbound calling</div>
      <div style={{ background: '#f0fdfa', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}
          />
          <div style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a' }}>Live call · 0:47</div>
        </div>
        <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '6px' }}>Dunmore Dental Care</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scaleY: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08, ease: 'easeInOut' }}
              style={{ flex: 1, background: '#06b6d4', borderRadius: '1px', height: '100%', transformOrigin: 'center' }}
            />
          ))}
        </div>
      </div>
      <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: '6px' }}>50 calls/mo · 8 script steps · Auto voicemail</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 600 }}>
        <span style={{ color: '#10b981' }}>Answered 12</span>
        <span style={{ color: '#f59e0b' }}>Voicemail 28</span>
        <span style={{ color: '#94a3b8' }}>No ans 10</span>
      </div>
    </>
  )
}

function KeywordMonitorFloatingCard() {
  const campaigns = [
    { name: 'Law Firms - Full Pipeline', tags: ['law firm marketing', 'solicitor acquisition'], hits: 2 },
    { name: 'UK Hotels - Q2 Outreach', tags: ['hotel direct bookings', 'OTA commission'], hits: 4 },
  ]
  const hits = [
    { name: 'Emma Fitzgerald', status: 'Pending', colour: '#f59e0b' },
    { name: 'Callum Reid', status: 'Pending', colour: '#f59e0b' },
    { name: 'Simon Adeyemi', status: 'Enrolled', colour: '#10b981' },
  ]
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
        <div style={{ width: '16px', height: '16px', background: '#22d3ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" strokeLinecap="round" /></svg>
        </div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Keyword Monitor</div>
      </div>
      <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>Live LinkedIn intelligence</div>
      {campaigns.map((c, i) => (
        <div key={i} style={{ padding: '6px 0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.name}</div>
            <span style={{ fontSize: '8px', fontWeight: 700, color: '#22d3ee', marginLeft: '6px' }}>{c.hits} hits</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
            {c.tags.map((t, j) => (
              <span key={j} style={{ fontSize: '7px', padding: '1px 5px', borderRadius: '100px', background: '#ecfeff', color: '#0e7490', border: '1px solid #cffafe' }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
        {hits.map((h, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0' }}>
            <span style={{ fontSize: '9px', color: '#64748b' }}>{h.name}</span>
            <span style={{ fontSize: '8px', fontWeight: 700, padding: '1px 5px', borderRadius: '100px', background: `${h.colour}15`, color: h.colour }}>{h.status}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '8px', fontSize: '9px', fontWeight: 700, color: '#22d3ee' }}>+ Enrol now</div>
    </>
  )
}

// ============================================================================
// Main component
// ============================================================================
export default function FeatureExpandingCards() {
  const { isMobile } = useBreakpoint()
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sectionTop, setSectionTop] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop)
    }
  }, [])

  const relativeScroll = scrollY - sectionTop + 400
  const sideCardsVisible = !isMobile && relativeScroll > 0 && relativeScroll < 1200

  return (
    <section
      ref={sectionRef}
      style={{
        background: '#ffffff',
        position: 'relative',
        paddingTop: isMobile ? '60px' : '100px',
        paddingBottom: isMobile ? '60px' : '140px',
        fontFamily: 'Switzer, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '5%', left: '-5%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '5%', right: '-5%',
        width: '450px', height: '450px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(100px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Section header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{
          textAlign: 'center', maxWidth: '680px',
          margin: '0 auto', paddingBottom: '64px',
          padding: '0 24px 64px',
          position: 'relative', zIndex: 1,
        }}
      >
        <div style={{
          background: '#EEF2FF', color: '#4f46e5',
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
          borderRadius: '100px', padding: '5px 14px',
          textTransform: 'uppercase', marginBottom: '20px',
          display: 'inline-block', fontFamily: 'Switzer, sans-serif',
        }}>
          Everything you need
        </div>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 16px',
          background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          display: 'block',
          fontFamily: 'Switzer, sans-serif',
        }}>
          Five tools. One platform. Zero manual work.
        </h2>
        <p style={{
          fontSize: '17px', color: '#64748b',
          lineHeight: 1.7, margin: 0,
          fontFamily: 'Switzer, sans-serif',
        }}>
          Every feature your outreach needs, built in and working together from day one.
        </p>
      </motion.div>

      {/* Bento grid wrapper — must allow overflow visible for floating cards */}
      <div style={{
        position: 'relative',
        maxWidth: '1160px',
        margin: '0 auto',
        padding: '0 24px',
        zIndex: 1,
        overflow: 'visible',
      }}>
        {/* Floating side cards */}
        {!isMobile && (
          <>
            <FloatingCard side="left" top={40} visible={sideCardsVisible} delay={0}>
              <IntentScoringCard />
            </FloatingCard>
            <FloatingCard side="left" top={500} visible={sideCardsVisible} delay={0.16}>
              <LinkedInFloatingCard />
            </FloatingCard>
            <FloatingCard side="right" top={40} visible={sideCardsVisible} delay={0.08}>
              <VoiceAgentCard />
            </FloatingCard>
            <FloatingCard side="right" top={500} visible={sideCardsVisible} delay={0.24}>
              <KeywordMonitorFloatingCard />
            </FloatingCard>
          </>
        )}

        {/* Bento grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
          gridAutoRows: 'auto',
          gap: '16px',
        }}>
          <FeatureCard
            gridColumn={isMobile ? '1' : '1'}
            gridRow={isMobile ? 'auto' : '1'}
            minHeight={380}
            illustrationBg="linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)"
            accentColor="#4f46e5"
            eyebrow="Lead Discovery"
            title="Find and enrich 500+ leads per campaign"
            description="Google Maps scraping with 3-layer enrichment via Hunter.io and Apollo."
            illustration={<LeadDiscoveryIllustration />}
            delay={0}
          />
          <FeatureCard
            gridColumn={isMobile ? '1' : '2'}
            gridRow={isMobile ? 'auto' : '1'}
            minHeight={300}
            illustrationBg="linear-gradient(135deg, #0c4a6e 0%, #097b8f 100%)"
            accentColor="#06b6d4"
            eyebrow="Email Sequences"
            title="Write once. Follow up automatically."
            description="AI-written multi-step sequences with spam checking and A/B testing."
            illustration={<EmailSequencesIllustration />}
            delay={0.08}
          />
          <FeatureCard
            gridColumn={isMobile ? '1' : '3'}
            gridRow={isMobile ? 'auto' : '1'}
            minHeight={380}
            illustrationBg="linear-gradient(135deg, #1e1b4b 0%, #0c4a6e 100%)"
            accentColor="#097b8f"
            eyebrow="AI Voice Calling"
            title="An AI agent that calls your prospects."
            description="8-step call scripts with auto voicemail. 50 calls per month on Pro."
            illustration={<VoiceCallingIllustration />}
            delay={0.16}
          />
          <FeatureCard
            gridColumn={isMobile ? '1' : '1'}
            gridRow={isMobile ? 'auto' : '2'}
            minHeight={380}
            illustrationBg="linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)"
            accentColor="#0077b5"
            eyebrow="LinkedIn Outreach"
            title="A 35-day LinkedIn funnel on autopilot."
            description="Six phases from silent awareness to soft offer via Unipile."
            illustration={<LinkedInIllustration />}
            delay={0.24}
          />
          {/* Centre column row 2: stacked brand + stats */}
          <div style={{
            gridColumn: isMobile ? '1' : '2',
            gridRow: isMobile ? 'auto' : '2',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
            <BrandCard />
            <StatsCard />
          </div>
          <FeatureCard
            gridColumn={isMobile ? '1' : '3'}
            gridRow={isMobile ? 'auto' : '2'}
            minHeight={380}
            illustrationBg="linear-gradient(135deg, #064e3b 0%, #097b8f 100%)"
            accentColor="#22d3ee"
            eyebrow="Keyword Monitor"
            title="Catch prospects signalling intent in real time."
            description="LinkedIn scanned every 2 hours. Hot leads auto-enrolled instantly."
            illustration={<KeywordMonitorIllustration />}
            delay={0.32}
          />
        </div>
      </div>
    </section>
  )
}
