import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function CheckRow({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div style={{
        width: '22px', height: '22px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #4F46E5, #22D3EE)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
      }}>
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: '#64748b', fontFamily: 'Switzer, sans-serif', lineHeight: 1.6 }}>{description}</div>
      </div>
    </div>
  )
}

function LeadDatabaseIllustration() {
  const leads = [
    { name: 'Dunmore Dental Care', role: 'Practice Owner', email: 'kate@dunmore...', phone: '+44 1732 441 188', loc: 'Kent', status: 'CONTACTED', sc: '#06B6D4', sb: '#F0FFFE', intent: 'Warm 63', ic: '#fff7ed', it: '#ea580c' },
    { name: 'Smile Clinic Northwest', role: 'Clinical Director', email: 'amir@smileclinic...', phone: '+44 207 734 5566', loc: 'London', status: 'REPLIED', sc: '#22c55e', sb: '#f0fdf4', intent: 'Hot 95', ic: '#fef2f2', it: '#dc2626' },
    { name: 'Bright Smile Kent', role: 'Practice Owner', email: 's.gallagher@bright...', phone: '+44 1622 678 900', loc: 'Kent', status: 'CONTACTED', sc: '#06B6D4', sb: '#F0FFFE', intent: 'Hot 76', ic: '#fef2f2', it: '#dc2626' },
    { name: 'London Smile Studio', role: 'Clinical Director', email: 'paul@londonsmile...', phone: '+44 207 836 4422', loc: 'London', status: 'REPLIED', sc: '#22c55e', sb: '#f0fdf4', intent: 'Hot 92', ic: '#fef2f2', it: '#dc2626' },
    { name: 'Owen Dental Group', role: 'Practice Director', email: 'lewis@owendentalg...', phone: '+44 208 445 6677', loc: 'London', status: 'CONTACTED', sc: '#06B6D4', sb: '#F0FFFE', intent: 'Hot 80', ic: '#fef2f2', it: '#dc2626' },
  ]

  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(79,70,229,0.12), 0 4px 16px rgba(0,0,0,0.06)',
    }}>
      {/* Browser chrome */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#fca5a5' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#fcd34d' }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#86efac' }} />
        <div style={{ flex: 1, height: '20px', background: '#f1f5f9', borderRadius: '5px', marginLeft: '10px', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>app.leadomation.co.uk/lead-database</span>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Lead Database</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>271 enriched leads</div>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['New Business (271)', 'Hot (11)', 'Warm (9)'].map(f => (
            <div key={f} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '100px', padding: '3px 8px', fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr 0.7fr 0.8fr 0.8fr', padding: '8px 16px', background: '#fafafa', borderBottom: '1px solid #f1f5f9', gap: '8px' }}>
        {['COMPANY', 'EMAIL', 'PHONE', 'LOCATION', 'STATUS', 'INTENT'].map(h => (
          <div key={h} style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', fontFamily: 'Switzer, sans-serif' }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      {leads.map((lead, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.8fr 1.2fr 1fr 0.7fr 0.8fr 0.8fr',
            padding: '9px 16px',
            borderBottom: '1px solid #f8fafc',
            gap: '8px',
            alignItems: 'center',
            background: i === 1 ? '#fafeff' : '#fff',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#4F46E5', fontFamily: 'Switzer, sans-serif' }}>{lead.name}</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>{lead.role}</div>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{lead.email}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{lead.phone}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{lead.loc}</div>
          <div style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: '100px', background: lead.sb, color: lead.sc, fontSize: '10px', fontWeight: 700, fontFamily: 'Switzer, sans-serif', width: 'fit-content' }}>{lead.status}</div>
          <div style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: '100px', background: lead.ic, color: lead.it, fontSize: '10px', fontWeight: 700, fontFamily: 'Switzer, sans-serif', width: 'fit-content' }}>{lead.intent}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default function SolutionSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      position: 'relative',
      padding: '100px 24px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(240,244,255,0.5) 30%, transparent 100%)',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '20%', right: '-8%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'center' }}>

          {/* Left — text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#EEF2FF', border: '1px solid #c7d2fe',
              borderRadius: '100px', padding: '4px 14px',
              fontSize: '12px', fontWeight: 600, color: '#4F46E5',
              fontFamily: 'Switzer, sans-serif', marginBottom: '20px',
              letterSpacing: '0.02em',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
              The solution
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 46px)',
              fontWeight: 800,
              fontFamily: 'Switzer, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              One platform. Every step of your outreach, automated.
            </h2>

            <p style={{
              fontSize: '16px', color: '#64748b',
              fontFamily: 'Switzer, sans-serif', lineHeight: 1.7,
              marginBottom: '36px',
            }}>
              Leadomation handles lead discovery, enrichment, personalised email sequences, LinkedIn outreach and AI voice calling. Your pipeline fills while you focus on closing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              <CheckRow
                title="AI-powered lead discovery"
                description="Scrapes Google Maps and enriches every lead with verified emails, phone numbers and decision maker contacts automatically."
              />
              <CheckRow
                title="Intent scoring on every lead"
                description="Hot, Warm, Cool and Cold scores tell you exactly who to contact first so you never waste effort on the wrong prospects."
              />
              <CheckRow
                title="Full multichannel outreach"
                description="Email sequences, 35-day LinkedIn funnels and AI voice calling, all coordinated from one campaign builder."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/app/signup" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1E1B4B', color: '#fff', textDecoration: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '14px', fontWeight: 600, fontFamily: 'Switzer, sans-serif',
                boxShadow: '0 4px 12px rgba(30,27,75,0.25)',
              }}>
                Start free trial
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#features" style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'transparent', color: '#4F46E5', textDecoration: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontSize: '14px', fontWeight: 600, fontFamily: 'Switzer, sans-serif',
                border: '1.5px solid #c7d2fe',
              }}>
                See all features
              </a>
            </div>
          </motion.div>

          {/* Right — Lead Database CSS illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ position: 'relative', overflow: 'visible' }}
          >
            {/* Glow behind card */}
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 70%)',
              borderRadius: '50%', filter: 'blur(30px)',
              pointerEvents: 'none', zIndex: 0,
            }} />

            {/* Floating stat badges */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '-16px', right: '-16px',
                background: '#fff', borderRadius: '12px',
                padding: '10px 14px', zIndex: 2,
                boxShadow: '0 8px 24px rgba(79,70,229,0.15)',
                border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Leads found</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#4F46E5', fontFamily: 'Switzer, sans-serif', lineHeight: 1 }}>271</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              style={{
                position: 'absolute', bottom: '-24px', left: '-32px',
                background: '#fff', borderRadius: '12px',
                padding: '10px 14px', zIndex: 2,
                boxShadow: '0 8px 24px rgba(34,211,238,0.15)',
                border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F0FFFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13"/></svg>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Reply rate</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#06B6D4', fontFamily: 'Switzer, sans-serif', lineHeight: 1 }}>18%</div>
              </div>
            </motion.div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <LeadDatabaseIllustration />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
