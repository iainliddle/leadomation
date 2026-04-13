import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GradFlow } from 'gradflow'
import { useBreakpoint } from '../../hooks/useBreakpoint'

type Scene = 'dashboard' | 'leads' | 'pipeline' | 'campaigns'

export default function Hero() {
  const { isMobile, isTablet } = useBreakpoint()
  const [scene, setScene] = useState<Scene>('dashboard')
  const [showPanel, setShowPanel] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 120, y: 300 })
  const [clicking, setClicking] = useState(false)
  const [counts, setCounts] = useState({ leads: 0, replies: 0, calls: 0, delivery: 0 })

  useEffect(() => {
    // Animate metrics on first load
    const duration = 1200
    const steps = 40
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      setCounts({
        leads: Math.round(271 * progress),
        replies: Math.round(14 * progress),
        calls: Math.round(6 * progress),
        delivery: Math.round(94 * progress),
      })
      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const sequence = async () => {
      // SCENE 1: Dashboard
      // Cursor rests on Dashboard sidebar item
      setScene('dashboard')
      setShowPanel(false)
      setCursorPos({ x: 100, y: 218 })
      await sleep(3500)

      // Cursor moves to Lead Database in sidebar
      setCursorPos({ x: 100, y: 400 })
      await sleep(700)
      // Click Lead Database
      setClicking(true)
      await sleep(150)
      setClicking(false)

      // SCENE 2: Lead Database loads
      setScene('leads')
      setShowPanel(false)
      await sleep(1200)

      // Cursor moves to second lead row (Smile Clinic Northwest)
      setCursorPos({ x: 420, y: 310 })
      await sleep(800)
      // Click the lead row
      setClicking(true)
      await sleep(150)
      setClicking(false)

      // Side panel slides in
      setShowPanel(true)
      await sleep(800)

      // Cursor moves to AI CALL AGENT button in side panel
      setCursorPos({ x: 820, y: 422 })
      await sleep(1200)

      // Cursor moves back to Deal Pipeline in sidebar
      setCursorPos({ x: 100, y: 458 })
      await sleep(700)
      // Click Deal Pipeline
      setClicking(true)
      await sleep(150)
      setClicking(false)

      // SCENE 3: Deal Pipeline loads
      setScene('pipeline')
      setShowPanel(false)
      await sleep(1200)

      // Cursor moves to a deal card in Qualified column
      setCursorPos({ x: 390, y: 360 })
      await sleep(1000)

      // Cursor moves to a deal card in Won column
      setCursorPos({ x: 820, y: 340 })
      await sleep(1500)

      // Cursor moves to Active Campaigns in sidebar
      setCursorPos({ x: 100, y: 341 })
      await sleep(700)
      // Click Active Campaigns
      setClicking(true)
      await sleep(150)
      setClicking(false)

      // SCENE 4: Active Campaigns loads
      setScene('campaigns')
      await sleep(1200)

      // Cursor moves to View Leads on first campaign card
      setCursorPos({ x: 340, y: 306 })
      await sleep(1000)

      // Cursor moves to View Full Analytics on second campaign
      setCursorPos({ x: 790, y: 306 })
      await sleep(1200)

      // Cursor moves back to Dashboard in sidebar
      setCursorPos({ x: 100, y: 218 })
      await sleep(700)
      // Click Dashboard
      setClicking(true)
      await sleep(150)
      setClicking(false)
    }

    const loop = (): Promise<void> => sequence().then((): void => { loop() })
    const startDelay = setTimeout(loop, 1500)
    return () => clearTimeout(startDelay)
  }, [isMobile])

  return (
    <div style={{ position: 'relative' }}>
      {/* Fixed gradient background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0, opacity: 0.65,
      }}>
        <GradFlow config={{
          color1: { r: 255, g: 255, b: 255 },
          color2: { r: 34, g: 211, b: 238 },
          color3: { r: 79, g: 70, b: 229 },
          speed: 0.3, scale: 1.2, type: 'stripe', noise: 0.06,
        }} />
      </div>

      {/* White overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1, background: 'rgba(255,255,255,0.42)', pointerEvents: 'none',
      }} />

      {/* Hero text content */}
      <div style={{
        position: 'relative', zIndex: 2,
        textAlign: 'center', padding: isMobile ? '80px 16px 40px' : '120px 24px 60px',
        maxWidth: '900px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(238,242,255,0.9)', border: '1px solid #c7d2fe',
            borderRadius: '9999px', padding: '5px 16px',
            fontSize: '13px', fontWeight: 500, color: '#4F46E5',
            fontFamily: 'Switzer, sans-serif', marginBottom: '28px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4F46E5', display: 'inline-block' }} />
          B2B lead generation, automated
        </motion.div>

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
            margin: '0 auto 24px',
            maxWidth: '820px',
            background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Your next 100 clients<br />
          are already out there.<br />
          Leadomation finds them.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: 'Switzer, sans-serif', fontSize: '18px',
            fontWeight: 400, color: '#475569',
            maxWidth: '540px', margin: '0 auto 40px', lineHeight: 1.7,
          }}
        >
          Find and enrich B2B leads, write personalised outreach, automate LinkedIn and call prospects with an AI voice agent. Your pipeline fills while you focus on closing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '12px' }}
        >
          <a href="/app/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#1E1B4B', color: '#fff', textDecoration: 'none',
            borderRadius: '12px', padding: '14px 32px',
            fontSize: '15px', fontWeight: 600, fontFamily: 'Switzer, sans-serif',
            boxShadow: '0 4px 16px rgba(30,27,75,0.25)',
          }}>
            Start free trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#how-it-works" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.85)', color: '#0f172a', textDecoration: 'none',
            borderRadius: '12px', padding: '14px 32px',
            fontSize: '15px', fontWeight: 500, fontFamily: 'Switzer, sans-serif',
            border: '1.5px solid rgba(226,232,240,0.8)', backdropFilter: 'blur(8px)',
          }}>
            See how it works
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{ fontSize: '13px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}
        >
          7 day free trial. Secure with a card. Cancel anytime.
        </motion.p>
      </div>

      {/* Animated dashboard card */}
      {!isMobile && (
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', justifyContent: 'center',
        padding: '0 24px 100px',
      }}>
        <div style={{
          width: '100%', maxWidth: isTablet ? '900px' : '1100px',
          borderRadius: '20px', overflow: 'hidden',
          border: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.14), 0 8px 24px rgba(79,70,229,0.10)',
          background: '#fff', position: 'relative',
        }}>

          {/* Browser chrome */}
          <div style={{
            background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fca5a5' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fcd34d' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#86efac' }} />
            <div style={{
              flex: 1, height: '24px', background: '#f1f5f9',
              borderRadius: '6px', marginLeft: '12px',
              display: 'flex', alignItems: 'center', paddingLeft: '12px', gap: '6px',
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e2e8f0' }} />
              <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }}>app.leadomation.co.uk</span>
            </div>
          </div>

          {/* App layout */}
          <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '160px 1fr' : '200px 1fr', minHeight: '520px', position: 'relative' }}>

            {/* Sidebar */}
            <div style={{
              background: '#ffffff', borderRight: '1px solid #e2e8f0',
              padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '1px',
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', marginBottom: '16px' }}>
                <img src="/src/assets/logo-full.png" alt="Leadomation" style={{ height: '22px', width: 'auto' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>

              <SidebarLabel>MAIN</SidebarLabel>
              <SidebarItem label="Dashboard" active={scene === 'dashboard'} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
              } />
              <SidebarItem label="Global Demand" active={false} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              } />

              <SidebarLabel>CAMPAIGNS</SidebarLabel>
              <SidebarItem label="New Campaign" active={false} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              } />
              <SidebarItem label="Active Campaigns" active={scene === 'campaigns'} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              } />

              <SidebarLabel>LEADS</SidebarLabel>
              <SidebarItem label="Lead Database" active={scene === 'leads'} badge="271" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              } />

              <SidebarLabel>CRM</SidebarLabel>
              <SidebarItem label="Deal Pipeline" active={scene === 'pipeline'} badge="10" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              } />
              <SidebarItem label="Calendar" active={false} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              } />

              <SidebarLabel>OUTREACH</SidebarLabel>
              <SidebarItem label="Sequence Builder" active={false} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              } />
              <SidebarItem label="Call Agent" active={false} icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.18 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.45-1.45a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              } />
              <SidebarItem label="Inbox" active={false} badge="12" icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              } />
            </div>

            {/* Main content area - animated scenes */}
            <div style={{ position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}>

              <AnimatePresence mode="wait">
                {scene === 'dashboard' && (
                  <motion.div key="dashboard"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '20px', height: '100%', overflowY: 'hidden' as const }}
                  >
                    {/* Top bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Dashboard</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Good morning, Iain 👋</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '5px 10px', fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          4 Mar - 3 Apr 2026
                        </div>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '5px 10px', fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Export</div>
                        <div style={{ background: '#4F46E5', color: '#fff', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>+ New Campaign</div>
                      </div>
                    </div>

                    {/* Metric cards row - 4 cards + plan card */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 1.2fr', gap: '10px', marginBottom: '14px' }}>
                      {[
                        { label: 'Total Leads', value: counts.leads, color: '#06B6D4', bars: [20,35,28,45,38,52,48,60,55,70,65,80] },
                        { label: 'Leads with Emails', value: 14, color: '#22D3EE', bars: [10,15,12,20,18,22,25,28,24,30,28,31] },
                        { label: 'Leads Contacted', value: 600, color: '#8B5CF6', bars: [40,55,48,62,58,70,65,78,72,85,80,90] },
                        { label: 'Total Deals', value: 94, color: '#F59E0B', bars: [2,4,3,5,4,6,5,7,6,8,7,10] },
                      ].map((m, idx) => (
                        <div key={idx} style={{ background: '#fff', borderRadius: '10px', padding: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>{m.label}</div>
                          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif', lineHeight: 1 }}>{m.value}</div>
                          <div style={{ fontSize: '10px', color: '#22c55e', fontFamily: 'Switzer, sans-serif', marginTop: '2px' }}>↑ +12%</div>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '28px', marginTop: '8px' }}>
                            {m.bars.map((h, i) => (
                              <div key={i} style={{
                                flex: 1, borderRadius: '2px 2px 0 0',
                                height: `${(h / Math.max(...m.bars)) * 100}%`,
                                background: i === m.bars.length - 1 ? m.color : `${m.color}35`,
                              }} />
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* Plan card */}
                      <div style={{ background: '#EEF2FF', borderRadius: '10px', padding: '12px', border: '1px solid #c7d2fe', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '9px', fontWeight: 700, color: '#4F46E5', letterSpacing: '0.08em', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>CURRENT PLAN</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Pro</div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif', marginBottom: '10px' }}>Pro plan active</div>
                        </div>
                        <div style={{ background: '#4F46E5', color: '#fff', borderRadius: '6px', padding: '6px 8px', fontSize: '10px', fontWeight: 600, fontFamily: 'Switzer, sans-serif', textAlign: 'center' as const }}>Manage plan</div>
                      </div>
                    </div>

                    {/* Chart + Top campaigns - two column */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
                      {/* Campaign performance */}
                      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>Campaign Performance</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '10px' }}>Last 14 days</div>
                        <svg viewBox="0 0 300 70" style={{ width: '100%', height: '70px' }}>
                          {[0,25,50].map(y => <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1"/>)}
                          <polyline points="0,55 40,50 80,40 120,45 160,25 200,35 240,30 280,40 300,38" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="0,65 40,58 80,52 120,35 160,15 200,28 240,42 280,48 300,46" fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="0,45 40,25 80,48 120,52 160,58 200,55 240,62 280,64 300,64" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '6px', marginBottom: '10px' }}>
                          {[{ label: 'AI Calls', color: '#8B5CF6' }, { label: 'Emails', color: '#22D3EE' }, { label: 'New Leads', color: '#22c55e' }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.color }} />
                              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{l.label}</span>
                            </div>
                          ))}
                        </div>
                        {/* Bottom stats bar */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                          {[{ label: 'TOTAL LEADS', value: '271' }, { label: 'CONTACTED', value: '184' }, { label: 'QUALIFIED', value: '47' }, { label: 'DEALS', value: '10' }].map(s => (
                            <div key={s.label} style={{ textAlign: 'center' as const }}>
                              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{s.value}</div>
                              <div style={{ fontSize: '8px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', letterSpacing: '0.05em' }}>{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top performing campaigns */}
                      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '14px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '14px' }}>Top Performing Campaigns</div>
                        {[
                          { name: 'Dental Clinics - LinkedIn', type: 'SPECIFIER', rate: '6.74%', color: '#8B5CF6', w: '35%' },
                          { name: 'Law Firms - Full Pipeline', type: 'DIRECT', rate: '11.22%', color: '#4F46E5', w: '75%' },
                          { name: 'Plumbers in Edinburgh', type: 'DIRECT', rate: '0%', color: '#4F46E5', w: '5%' },
                          { name: 'Solicitors Edinburgh', type: 'DIRECT', rate: '0%', color: '#4F46E5', w: '5%' },
                        ].map((c, i) => (
                          <div key={i} style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{c.name}</div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{c.rate}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: c.color, background: `${c.color}15`, padding: '2px 5px', borderRadius: '4px', fontFamily: 'Switzer, sans-serif' }}>{c.type}</span>
                              <div style={{ flex: 1, height: '3px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                                <div style={{ width: c.w, height: '100%', background: c.color, borderRadius: '100px' }} />
                              </div>
                            </div>
                          </div>
                        ))}
                        <div style={{ fontSize: '11px', color: '#4F46E5', fontWeight: 600, fontFamily: 'Switzer, sans-serif', textAlign: 'center' as const, marginTop: '8px' }}>VIEW ALL CAMPAIGNS</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {scene === 'leads' && (
                  <motion.div key="leads"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', height: '100%', position: 'relative' }}
                  >
                    {/* Lead database main */}
                    <div style={{ flex: 1, padding: '20px', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                          <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Lead Database</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Manage and track all your leads</div>
                        </div>
                        <div style={{ background: '#4F46E5', color: '#fff', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>+ Add Lead</div>
                      </div>
                      {/* Filter pills */}
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'New Business', val: '271', color: '#F59E0B' },
                          { label: 'Hot', val: '11', color: '#dc2626' },
                          { label: 'Warm', val: '9', color: '#ea580c' },
                          { label: 'Cool', val: '0', color: '#2563eb' },
                        ].map(f => (
                          <div key={f.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '100px', padding: '3px 10px', fontSize: '10px', fontFamily: 'Switzer, sans-serif', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: f.color, fontWeight: 600 }}>{f.label}</span>
                            <span style={{ color: '#94a3b8' }}>({f.val})</span>
                          </div>
                        ))}
                      </div>
                      {/* Table */}
                      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 0.9fr 0.8fr 0.7fr 0.7fr', padding: '8px 14px', borderBottom: '1px solid #f1f5f9', background: '#fafafa', gap: '8px' }}>
                          {['Company', 'Email', 'Phone', 'Location', 'Status', 'Intent'].map(h => (
                            <div key={h} style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' as const, color: '#94a3b8', fontFamily: 'Switzer, sans-serif', letterSpacing: '0.06em' }}>{h}</div>
                          ))}
                        </div>
                        {[
                          { co: 'Dunmore Dental Care', role: 'Practice Owner', email: 'kate@dunmore...', phone: '+44 1732 441 188', loc: 'Kent', status: 'CONTACTED', statusColor: '#06B6D4', intent: 'Warm 63', ic: '#fff7ed', it: '#ea580c' },
                          { co: 'Smile Clinic Northwest', role: 'Clinical Director', email: 'amir@smileclinic...', phone: '+44 207 734 5566', loc: 'London', status: 'REPLIED', statusColor: '#22c55e', intent: 'Hot 95', ic: '#fef2f2', it: '#dc2626' },
                          { co: 'Bright Smile Kent', role: 'Practice Owner', email: 's.gallagher@bright...', phone: '+44 1622 678 900', loc: 'Kent', status: 'CONTACTED', statusColor: '#06B6D4', intent: 'Hot 76', ic: '#fef2f2', it: '#dc2626' },
                          { co: 'London Smile Studio', role: 'Clinical Director', email: 'paul@londonsmile...', phone: '+44 207 836 4422', loc: 'London', status: 'REPLIED', statusColor: '#22c55e', intent: 'Hot 92', ic: '#fef2f2', it: '#dc2626' },
                          { co: 'Owen Dental Group', role: 'Practice Director', email: 'lewis@owendentalg...', phone: '+44 208 445 6677', loc: 'London', status: 'CONTACTED', statusColor: '#06B6D4', intent: 'Hot 80', ic: '#fef2f2', it: '#dc2626' },
                          { co: 'Surrey Dental Specialists', role: 'Practice Manager', email: 'nina@surrey...', phone: '+44 1483 445 211', loc: 'Surrey', status: 'CONTACTED', statusColor: '#06B6D4', intent: 'Warm 71', ic: '#fff7ed', it: '#ea580c' },
                        ].map((row, i) => (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.3 }}
                            style={{
                              display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 0.9fr 0.8fr 0.7fr 0.7fr',
                              padding: '9px 14px', borderBottom: '1px solid #f8fafc', gap: '8px', alignItems: 'center',
                              background: i === 1 && showPanel ? '#fafeff' : '#fff',
                            }}
                          >
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#4F46E5', fontFamily: 'Switzer, sans-serif' }}>{row.co}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>{row.role}</div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{row.email}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{row.phone}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{row.loc}</div>
                            <div style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: '100px', background: `${row.statusColor}20`, color: row.statusColor, fontSize: '10px', fontWeight: 700, fontFamily: 'Switzer, sans-serif', width: 'fit-content' }}>{row.status}</div>
                            <div style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: '100px', background: row.ic, color: row.it, fontSize: '10px', fontWeight: 700, fontFamily: 'Switzer, sans-serif', width: 'fit-content' }}>{row.intent}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Side panel */}
                    <AnimatePresence>
                      {showPanel && (
                        <motion.div
                          initial={{ x: 300, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 300, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          style={{
                            width: '260px', borderLeft: '1px solid #e2e8f0',
                            background: '#fff', padding: '16px', flexShrink: 0,
                          }}
                        >
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>Smile Clinic Northwest</div>
                          <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>ENRICHED</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>Clinical Director</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '14px' }}>Dr Amir Patel</div>
                          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '14px', paddingBottom: '8px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#4F46E5', fontFamily: 'Switzer, sans-serif', borderBottom: '2px solid #4F46E5', paddingBottom: '4px' }}>Details</div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Intelligence</div>
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.06em', fontFamily: 'Switzer, sans-serif', marginBottom: '6px' }}>LEAD STATUS</div>
                          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '12px' }}>replied</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>EMAIL</div>
                              <div style={{ fontSize: '10px', color: '#4F46E5', fontFamily: 'Switzer, sans-serif' }}>amir@smileclinic...</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>PHONE</div>
                              <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>+44 207 734 5566</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>LOCATION</div>
                              <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>London</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>INDUSTRY</div>
                              <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Healthcare</div>
                            </div>
                          </div>
                          {[
                            { label: 'AI CALL AGENT', bg: '#22c55e', color: '#fff' },
                            { label: 'ENRICH LEAD DATA', bg: '#EEF2FF', color: '#4F46E5' },
                            { label: 'ENROL IN LINKEDIN SEQUENCE', bg: '#EEF2FF', color: '#4F46E5' },
                            { label: 'START OUTREACH', bg: '#4F46E5', color: '#fff' },
                          ].map(btn => (
                            <div key={btn.label} style={{
                              background: btn.bg, color: btn.color,
                              borderRadius: '8px', padding: '9px',
                              fontSize: '10px', fontWeight: 700,
                              fontFamily: 'Switzer, sans-serif',
                              textAlign: 'center' as const,
                              marginBottom: '6px', cursor: 'pointer',
                              letterSpacing: '0.04em',
                            }}>{btn.label}</div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {scene === 'pipeline' && (
                  <motion.div key="pipeline"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '20px', height: '100%' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Deal Pipeline</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Track deals through your sales funnel</div>
                      </div>
                      <div style={{ background: '#4F46E5', color: '#fff', borderRadius: '7px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>+ Add deal</div>
                    </div>
                    {/* Summary cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px', marginBottom: '14px' }}>
                      {[
                        { label: 'Total deals', value: '10' },
                        { label: 'Total pipeline', value: '\u00A315,600' },
                        { label: 'Weighted pipeline', value: '\u00A35,511' },
                        { label: 'Won deals', value: '3' },
                        { label: 'Won value', value: '\u00A35,400' },
                        { label: 'Avg deal value', value: '\u00A31,560' },
                      ].map(s => (
                        <div key={s.label} style={{ background: '#fff', borderRadius: '8px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>{s.label}</div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                    {/* Kanban columns */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', height: '320px' }}>
                      {[
                        {
                          col: 'New Reply', count: 2, total: '\u00A31,750', border: '#22D3EE',
                          deals: [
                            { name: 'Owen Dental - Local SEO', val: '\u00A3850', person: 'Dr Lewis Owens', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                            { name: 'The Grand Manchester', val: '\u00A3900', person: 'Sarah Mitchell', tag: 'Google Maps', label: 'Today', labelColor: '#22c55e' },
                          ]
                        },
                        {
                          col: 'Qualified', count: 2, total: '\u00A34,150', border: '#F59E0B',
                          deals: [
                            { name: 'Donovan Solicitors - PPC', val: '\u00A3950', person: 'Claire Donovan', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                            { name: 'Fletcher Law - Client', val: '\u00A33,200', person: 'Andrew Fletcher', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                          ]
                        },
                        {
                          col: 'Proposal Sent', count: 1, total: '\u00A31,500', border: '#8B5CF6',
                          deals: [
                            { name: 'Blackwell Partners - SEO', val: '\u00A31,500', person: 'Tom Blackwell', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                          ]
                        },
                        {
                          col: 'Negotiating', count: 1, total: '\u00A32,800', border: '#F97316',
                          deals: [
                            { name: 'London Smile Studio', val: '\u00A32,800', person: 'Dr Paul Nkemdirim', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                          ]
                        },
                        {
                          col: 'Won', count: 3, total: '\u00A35,400', border: '#22c55e',
                          deals: [
                            { name: 'Smile Clinic NW', val: '\u00A31,200', person: 'Dr Amir Patel', tag: 'LinkedIn', label: 'Overdue', labelColor: '#dc2626' },
                            { name: 'The Rivington - SEO', val: '\u00A31,800', person: 'Priya Sharma', tag: 'Google Maps', label: 'Overdue', labelColor: '#dc2626' },
                            { name: 'Harbour Hotels', val: '\u00A32,400', person: 'James Hartley', tag: 'Google Maps', label: 'Overdue', labelColor: '#dc2626' },
                          ]
                        },
                      ].map((col, ci) => (
                        <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: `2px solid ${col.border}` }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{col.col}</div>
                            <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>{col.count}</div>
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>{col.total}</div>
                          {col.deals.map((deal, di) => (
                            <motion.div key={di}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: di * 0.1 + ci * 0.05 }}
                              style={{
                                background: '#fff', borderRadius: '8px', padding: '8px',
                                border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                              }}
                            >
                              <div style={{ fontSize: '10px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '2px' }}>{deal.name}</div>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>{deal.val}</div>
                              <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>{deal.person}</div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ background: '#EEF2FF', color: '#4F46E5', fontSize: '9px', fontWeight: 600, padding: '1px 5px', borderRadius: '4px', fontFamily: 'Switzer, sans-serif' }}>{deal.tag}</span>
                                <span style={{ color: deal.labelColor, fontSize: '9px', fontWeight: 600, fontFamily: 'Switzer, sans-serif' }}>{deal.label}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {scene === 'campaigns' && (
                  <motion.div key="campaigns"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ padding: '20px', height: '100%' }}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>Active Campaigns</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>Monitor and manage your campaigns</div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                      {[
                        { name: 'Dental Clinics - LinkedIn', status: 'active', leads: 6, rate: '0.0%', progress: 89 },
                        { name: 'Law Firms - Full Pipeline', status: 'active', leads: 6, rate: '0.0%', progress: 100 },
                        { name: 'Plumbers in Edinburgh', status: 'completed', leads: 10, rate: '0.0%', progress: 100 },
                        { name: 'Solicitors in Edinburgh', status: 'completed', leads: 10, rate: '0.0%', progress: 100 },
                        { name: 'Lawyers in Singapore', status: 'completed', leads: 10, rate: '0.0%', progress: 100 },
                        { name: 'UK Hotels - Q2 Outreach', status: 'active', leads: 8, rate: '0.0%', progress: 75 },
                      ].map((c, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          style={{
                            background: '#fff', borderRadius: '10px', padding: '14px',
                            border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', fontFamily: 'Switzer, sans-serif', flex: 1, marginRight: '8px' }}>{c.name}</div>
                            <span style={{
                              background: c.status === 'active' ? '#dcfce7' : '#f1f5f9',
                              color: c.status === 'active' ? '#16a34a' : '#64748b',
                              fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '100px',
                              fontFamily: 'Switzer, sans-serif', whiteSpace: 'nowrap' as const,
                            }}>{c.status}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Leads found</div>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{c.leads}</div>
                            </div>
                            <div>
                              <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif' }}>Reply rate</div>
                              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{c.rate}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'Switzer, sans-serif', marginBottom: '4px' }}>Progress {c.progress}%</div>
                          <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '100px', marginBottom: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${c.progress}%`, height: '100%', background: '#4F46E5', borderRadius: '100px' }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>View Leads</span>
                            </div>
                            <div style={{ fontSize: '10px', color: '#4F46E5', fontFamily: 'Switzer, sans-serif', fontWeight: 600, display: 'flex', alignItems: 'center' }}>View Full Analytics ›</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated cursor with cyan click effect */}
              <motion.div
                animate={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: 50,
                  transformOrigin: 'top left',
                }}
              >
                {/* Cursor arrow */}
                <motion.div
                  animate={{ scale: clicking ? 0.82 : 1 }}
                  transition={{ duration: 0.1 }}
                >
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                    <path
                      d="M2 2L8 19L11 13L18 11L2 2Z"
                      fill="#1E1B4B"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                {/* Cyan radial burst on click */}
                {clicking && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0.8 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '-12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0.2) 50%, transparent 70%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 4.5, opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '-12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1.5px solid rgba(34,211,238,0.4)',
                        pointerEvents: 'none',
                      }}
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 0.3 }}
                      animate={{ scale: 6, opacity: 0 }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '-12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '1px solid rgba(6,182,212,0.3)',
                        pointerEvents: 'none',
                      }}
                    />
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

function SidebarLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: '9px', fontWeight: 600, color: '#94a3b8',
      padding: '8px 12px 4px', letterSpacing: '0.08em',
      fontFamily: 'Switzer, sans-serif',
    }}>{children}</div>
  )
}

function SidebarItem({ label, active, icon, badge }: { label: string; active: boolean; icon: React.ReactNode; badge?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 12px', borderRadius: '7px',
      background: active ? '#EEF2FF' : 'transparent',
      cursor: 'pointer', marginBottom: '1px',
      color: active ? '#4F46E5' : '#64748b',
    }}>
      {icon}
      <span style={{
        fontSize: '12px', fontWeight: active ? 600 : 400,
        color: active ? '#4F46E5' : '#475569',
        fontFamily: 'Switzer, sans-serif', flex: 1,
      }}>{label}</span>
      {badge && (
        <span style={{
          background: '#4F46E5', color: '#fff',
          fontSize: '9px', fontWeight: 700,
          padding: '1px 6px', borderRadius: '100px',
          fontFamily: 'Switzer, sans-serif',
        }}>{badge}</span>
      )}
    </div>
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
