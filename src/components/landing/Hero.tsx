import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { GradFlow } from 'gradflow'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '150vh',
        overflow: 'hidden',
      }}
    >
      {/* Gradient shader background - full coverage */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        opacity: 0.6,
      }}>
        <GradFlow config={{
          color1: { r: 255, g: 255, b: 255 },
          color2: { r: 34, g: 211, b: 238 },
          color3: { r: 79, g: 70, b: 229 },
          speed: 0.3,
          scale: 1.2,
          type: 'stripe',
          noise: 0.06,
        }} />
      </div>

      {/* White overlay to keep background soft and text readable */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        background: 'rgba(255,255,255,0.45)',
        pointerEvents: 'none',
      }} />

      {/* Hero content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        paddingTop: '140px',
        paddingBottom: '60px',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '140px 24px 60px',
      }}>

        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(238,242,255,0.9)',
            border: '1px solid #c7d2fe',
            borderRadius: '9999px',
            padding: '5px 16px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#4F46E5',
            fontFamily: 'Switzer, sans-serif',
            marginBottom: '28px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: '#4F46E5',
            display: 'inline-block',
          }} />
          B2B lead generation, automated
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#0f172a',
            margin: '0 auto 24px',
            maxWidth: '820px',
          }}
        >
          Your next 100 clients
          <br />
          are already out there.
          <br />
          <span style={{ color: '#4F46E5' }}>
            Leadomation finds them.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: 'Switzer, sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            color: '#475569',
            maxWidth: '540px',
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}
        >
          Find and enrich B2B leads, write personalised outreach, automate LinkedIn and call prospects with an AI voice agent. Your pipeline fills while you focus on closing.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '12px',
          }}
        >
          <a
            href="/app/signup"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1E1B4B',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Switzer, sans-serif',
              boxShadow: '0 4px 16px rgba(30,27,75,0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            Start free trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href="#how-it-works"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.85)',
              color: '#0f172a',
              textDecoration: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 500,
              fontFamily: 'Switzer, sans-serif',
              border: '1.5px solid rgba(226,232,240,0.8)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease',
            }}
          >
            See how it works
          </a>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{
            fontSize: '13px',
            color: '#94a3b8',
            fontFamily: 'Switzer, sans-serif',
            marginBottom: '60px',
          }}
        >
          7 day free trial. Secure with a card. Cancel anytime.
        </motion.p>
      </div>

      {/* Container scroll animation - dashboard card */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '120px',
      }}>
        <div style={{ perspective: '1200px', width: '100%', maxWidth: '1100px', padding: '0 24px' }}>
          <motion.div
            style={{
              rotateX: rotate,
              scale,
              translateY,
              transformOrigin: 'top center',
              boxShadow: '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(226,232,240,0.8)',
            }}
          >
            {/* Browser chrome */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fca5a5' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fcd34d' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#86efac' }} />
              <div style={{
                flex: 1,
                height: '24px',
                background: '#f1f5f9',
                borderRadius: '6px',
                marginLeft: '12px',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '12px',
                gap: '6px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
                <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  app.leadomation.co.uk
                </span>
              </div>
            </div>

            {/* Dashboard layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: '520px' }}>

              {/* Sidebar */}
              <div style={{
                background: '#4F46E5',
                padding: '20px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '26px', height: '26px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '7px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 800, color: '#fff',
                    fontFamily: 'Switzer, sans-serif',
                  }}>L</div>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px', fontFamily: 'Switzer, sans-serif' }}>
                    Leadomation
                  </span>
                </div>
                {[
                  { label: 'Dashboard', active: true },
                  { label: 'Leads', active: false },
                  { label: 'Campaigns', active: false },
                  { label: 'Inbox', active: false },
                  { label: 'Pipeline', active: false },
                  { label: 'Templates', active: false },
                  { label: 'Call agent', active: false },
                  { label: 'Settings', active: false },
                ].map(item => (
                  <div key={item.label} style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: item.active ? 600 : 400,
                    color: item.active ? '#fff' : 'rgba(255,255,255,0.58)',
                    background: item.active ? 'rgba(255,255,255,0.16)' : 'transparent',
                    fontFamily: 'Switzer, sans-serif',
                    cursor: 'pointer',
                  }}>
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ background: '#F8F9FA', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>
                      Dashboard
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>
                      Good morning, Iain
                    </div>
                  </div>
                  <div style={{
                    background: '#4F46E5',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontFamily: 'Switzer, sans-serif',
                    cursor: 'pointer',
                  }}>
                    + New campaign
                  </div>
                </div>

                {/* Metric cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[
                    { label: 'Leads found', value: '271', delta: '+12%', color: '#4F46E5', bg: '#EEF2FF' },
                    { label: 'Replies', value: '14', delta: '+8%', color: '#06B6D4', bg: '#F0FFFE' },
                    { label: 'Calls booked', value: '6', delta: '+3', color: '#22D3EE', bg: '#F0FFFE' },
                    { label: 'Deliverability', value: '94%', delta: '↑ 2%', color: '#4F46E5', bg: '#EEF2FF' },
                  ].map(m => (
                    <div key={m.label} style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '14px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '6px' }}>
                        {m.label}
                      </div>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: m.color, fontFamily: 'Switzer, sans-serif', lineHeight: 1 }}>
                        {m.value}
                      </div>
                      <div style={{ fontSize: '11px', color: '#22c55e', fontFamily: 'Switzer, sans-serif', marginTop: '4px' }}>
                        {m.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lead table */}
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  flex: 1,
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.8fr 1.4fr 1fr 0.9fr',
                    padding: '10px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: '#fafafa',
                    gap: '8px',
                  }}>
                    {['Lead name', 'Company', 'Intent', 'Status'].map(h => (
                      <div key={h} style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.08em',
                        color: '#94a3b8',
                        fontFamily: 'Switzer, sans-serif',
                      }}>{h}</div>
                    ))}
                  </div>
                  {[
                    { name: 'Sarah Mitchell', co: 'Apex Digital', intent: 'Hot 95', bc: '#fef2f2', bt: '#dc2626', status: 'Emailed' },
                    { name: 'James Hartley', co: 'Hartley Solicitors', intent: 'Warm 72', bc: '#fff7ed', bt: '#ea580c', status: 'Connected' },
                    { name: 'Priya Anand', co: 'Anand Consulting', intent: 'Cool 48', bc: '#eff6ff', bt: '#2563eb', status: 'New' },
                    { name: 'David Clarke', co: 'Clarke & Sons', intent: 'Hot 88', bc: '#fef2f2', bt: '#dc2626', status: 'Replied' },
                    { name: 'Emma Wilson', co: 'Wilson Digital', intent: 'Warm 65', bc: '#fff7ed', bt: '#ea580c', status: 'Emailed' },
                  ].map((row, i) => (
                    <div key={i} style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr 1.4fr 1fr 0.9fr',
                      padding: '11px 16px',
                      borderBottom: '1px solid #f8fafc',
                      gap: '8px',
                      alignItems: 'center',
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>
                        {row.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>
                        {row.co}
                      </div>
                      <div style={{
                        display: 'inline-flex',
                        padding: '3px 8px',
                        borderRadius: '100px',
                        background: row.bc,
                        color: row.bt,
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'Switzer, sans-serif',
                        width: 'fit-content',
                      }}>
                        {row.intent}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#64748b',
                        background: '#f8fafc',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontFamily: 'Switzer, sans-serif',
                        width: 'fit-content',
                      }}>
                        {row.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bar chart */}
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  padding: '14px 16px',
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748b',
                    fontFamily: 'Switzer, sans-serif',
                    marginBottom: '12px',
                  }}>
                    Weekly email sends
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '48px' }}>
                    {[35, 58, 42, 76, 51, 68, 90].map((h, i) => (
                      <div key={i} style={{
                        flex: 1,
                        borderRadius: '4px 4px 0 0',
                        height: `${h}%`,
                        background: i === 6 ? '#4F46E5' : i === 3 ? '#22D3EE' : '#EEF2FF',
                        transition: 'height 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', marginTop: '6px' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} style={{
                        flex: 1,
                        fontSize: '10px',
                        color: '#94a3b8',
                        textAlign: 'center' as const,
                        fontFamily: 'Switzer, sans-serif',
                      }}>{d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
