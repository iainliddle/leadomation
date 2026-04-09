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
          <span style={{
            background: 'linear-gradient(90deg, #4F46E5 0%, #06B6D4 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
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
            {/* Dashboard layout - matches real app */}
            <div style={{display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'540px'}}>

              {/* Sidebar - WHITE like real app, not indigo */}
              <div style={{
                background:'#ffffff',
                borderRight:'1px solid #e2e8f0',
                padding:'16px 12px',
                display:'flex',
                flexDirection:'column',
                gap:'2px',
              }}>
                {/* Logo area */}
                <div style={{
                  display:'flex',
                  alignItems:'center',
                  gap:'8px',
                  padding:'8px 12px',
                  marginBottom:'20px',
                }}>
                  <img
                    src="/src/assets/logo-full.png"
                    alt="Leadomation"
                    style={{height:'24px', width:'auto', objectFit:'contain'}}
                    onError={(e) => {
                      const t = e.target as HTMLImageElement
                      t.style.display = 'none'
                      const next = t.nextElementSibling as HTMLElement
                      if(next) next.style.display = 'flex'
                    }}
                  />
                  <div style={{display:'none', flexDirection:'column'}}>
                    <div style={{fontSize:'13px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>Leadomation</div>
                    <div style={{fontSize:'10px', color:'#94a3b8', fontFamily:'Switzer, sans-serif'}}>B2B Outreach Platform</div>
                  </div>
                </div>

                {/* MAIN */}
                <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', padding:'0 12px 6px', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>MAIN</div>

                {/* Dashboard - active */}
                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', background:'#EEF2FF', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                  <span style={{fontSize:'13px', fontWeight:600, color:'#4F46E5', fontFamily:'Switzer, sans-serif'}}>Dashboard</span>
                </div>

                {/* Global Demand */}
                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>Global Demand</span>
                </div>

                {/* CAMPAIGNS */}
                <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', padding:'10px 12px 6px', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>CAMPAIGNS</div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>New Campaign</span>
                </div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>Active Campaigns</span>
                </div>

                {/* LEADS */}
                <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', padding:'10px 12px 6px', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>LEADS</div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif', flex:1}}>Lead Database</span>
                  <span style={{background:'#4F46E5', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'100px', fontFamily:'Switzer, sans-serif'}}>271</span>
                </div>

                {/* CRM */}
                <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', padding:'10px 12px 6px', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>CRM</div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif', flex:1}}>Deal Pipeline</span>
                  <span style={{background:'#4F46E5', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'100px', fontFamily:'Switzer, sans-serif'}}>10</span>
                </div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>Calendar</span>
                </div>

                {/* OUTREACH */}
                <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', padding:'10px 12px 6px', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>OUTREACH</div>

                {[
                  {label:'Sequence Builder', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>},
                  {label:'Keyword Monitor', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>},
                  {label:'Call Agent', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.18 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.45-1.45a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>},
                ].map(item => (
                  <div key={item.label} style={{display:'flex', alignItems:'center', gap:'10px', padding:'7px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                    {item.icon}
                    <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>{item.label}</span>
                  </div>
                ))}

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'7px 12px', borderRadius:'8px', marginBottom:'2px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif', flex:1}}>Inbox</span>
                  <span style={{background:'#4F46E5', color:'#fff', fontSize:'10px', fontWeight:700, padding:'2px 7px', borderRadius:'100px', fontFamily:'Switzer, sans-serif'}}>12</span>
                </div>

                <div style={{display:'flex', alignItems:'center', gap:'10px', padding:'7px 12px', borderRadius:'8px', cursor:'pointer'}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <span style={{fontSize:'13px', color:'#475569', fontFamily:'Switzer, sans-serif'}}>Email Templates</span>
                </div>
              </div>

              {/* Main content area */}
              <div style={{background:'#f8f9fa', padding:'20px', display:'flex', flexDirection:'column', gap:'14px', overflow:'hidden'}}>

                {/* Top bar */}
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontSize:'20px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>Dashboard</div>
                    <div style={{fontSize:'12px', color:'#64748b', fontFamily:'Switzer, sans-serif'}}>Overview of your outreach performance</div>
                  </div>
                  <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <div style={{
                      background:'#fff', border:'1px solid #e2e8f0',
                      borderRadius:'8px', padding:'6px 12px',
                      fontSize:'12px', color:'#64748b',
                      fontFamily:'Switzer, sans-serif',
                      display:'flex', alignItems:'center', gap:'6px',
                    }}>
                      <span>📅</span> 4 Mar 2026 - 3 Apr 2026
                    </div>
                    <div style={{
                      background:'#4F46E5', color:'#fff',
                      borderRadius:'8px', padding:'8px 16px',
                      fontSize:'12px', fontWeight:600,
                      fontFamily:'Switzer, sans-serif', cursor:'pointer',
                    }}>+ New Campaign</div>
                  </div>
                </div>

                {/* Greeting */}
                <div>
                  <div style={{fontSize:'18px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>
                    Good morning, Iain 👋
                  </div>
                  <div style={{fontSize:'12px', color:'#64748b', fontFamily:'Switzer, sans-serif'}}>
                    Friday, 3 April 2026 · Let's make today count.
                  </div>
                </div>

                {/* Metric cards - 4 across + plan card */}
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr) 1.3fr', gap:'10px'}}>
                  {[
                    {
                      label:'Total Leads',
                      value:'271',
                      delta:'+12% in last 30 days',
                      color:'#06B6D4',
                      bars:[20,35,28,45,38,52,48,60,55,70,65,80],
                      type:'bar',
                    },
                    {
                      label:'Leads with Emails',
                      value:'31',
                      delta:'+8% verified emails',
                      color:'#22D3EE',
                      bars:[10,15,12,20,18,25,22,30,28,35,32,31],
                      type:'line',
                    },
                    {
                      label:'Leads Contacted',
                      value:'847',
                      delta:'+24% outreach initiated',
                      color:'#8B5CF6',
                      bars:[40,55,48,62,58,70,65,78,72,85,80,90],
                      type:'line',
                    },
                    {
                      label:'Total Deals',
                      value:'10',
                      delta:'+5% in pipeline',
                      color:'#F59E0B',
                      bars:[2,4,3,5,4,6,5,7,6,8,7,10],
                      type:'bar',
                    },
                  ].map(m => (
                    <div key={m.label} style={{
                      background:'#fff', borderRadius:'12px',
                      padding:'14px', border:'1px solid #e2e8f0',
                      boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                      <div style={{fontSize:'11px', color:'#64748b', fontFamily:'Switzer, sans-serif', marginBottom:'6px'}}>{m.label}</div>
                      <div style={{fontSize:'26px', fontWeight:800, color:'#0f172a', fontFamily:'Switzer, sans-serif', lineHeight:1}}>{m.value}</div>
                      <div style={{fontSize:'10px', color:'#22c55e', fontFamily:'Switzer, sans-serif', marginTop:'4px'}}>↑ {m.delta}</div>
                      {/* Sparkline */}
                      <div style={{marginTop:'10px', height:'32px'}}>
                        {m.type === 'bar' ? (
                          <div style={{display:'flex', alignItems:'flex-end', gap:'2px', height:'100%'}}>
                            {m.bars.map((h, i) => (
                              <div key={i} style={{
                                flex:1, borderRadius:'2px 2px 0 0',
                                height:`${(h / Math.max(...m.bars)) * 100}%`,
                                background: i === m.bars.length - 1 ? m.color : `${m.color}40`,
                              }}/>
                            ))}
                          </div>
                        ) : (
                          <svg viewBox={`0 0 ${m.bars.length * 10} 32`} style={{width:'100%', height:'100%', overflow:'visible'}}>
                            <defs>
                              <linearGradient id={`grad-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={m.color} stopOpacity={0.3}/>
                                <stop offset="100%" stopColor={m.color} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <polyline
                              points={m.bars.map((v, i) => `${i * 10},${32 - (v / Math.max(...m.bars)) * 28}`).join(' ')}
                              fill="none" stroke={m.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Plan card */}
                  <div style={{
                    background:'#EEF2FF', borderRadius:'12px',
                    padding:'14px', border:'1px solid #c7d2fe',
                    display:'flex', flexDirection:'column', justifyContent:'space-between',
                  }}>
                    <div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px'}}>
                        <div style={{fontSize:'10px', fontWeight:700, color:'#4F46E5', letterSpacing:'0.08em', fontFamily:'Switzer, sans-serif'}}>CURRENT PLAN</div>
                        <div style={{fontSize:'11px', fontWeight:700, color:'#4F46E5', fontFamily:'Switzer, sans-serif'}}>14%</div>
                      </div>
                      <div style={{fontSize:'10px', color:'#94a3b8', fontFamily:'Switzer, sans-serif', marginBottom:'8px'}}>Leads used</div>
                      <div style={{fontSize:'22px', fontWeight:800, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>Pro</div>
                      <div style={{fontSize:'11px', color:'#64748b', fontFamily:'Switzer, sans-serif', marginBottom:'12px'}}>Pro plan active</div>
                    </div>
                    <div style={{
                      background:'#4F46E5', color:'#fff',
                      borderRadius:'8px', padding:'8px',
                      fontSize:'12px', fontWeight:600,
                      fontFamily:'Switzer, sans-serif',
                      textAlign:'center' as const, cursor:'pointer',
                    }}>Manage plan</div>
                  </div>
                </div>

                {/* Campaign performance chart + Top campaigns */}
                <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'12px', flex:1}}>
                  {/* Campaign performance */}
                  <div style={{
                    background:'#fff', borderRadius:'12px',
                    border:'1px solid #e2e8f0', padding:'16px',
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                      <span style={{fontSize:'14px'}}>📊</span>
                      <div style={{fontSize:'14px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>Campaign Performance</div>
                    </div>
                    <div style={{fontSize:'11px', color:'#94a3b8', fontFamily:'Switzer, sans-serif', marginBottom:'16px'}}>Last 14 days</div>
                    {/* Chart area */}
                    <div style={{position:'relative', height:'100px'}}>
                      <svg viewBox="0 0 300 80" style={{width:'100%', height:'100%', overflow:'visible'}}>
                        {/* Grid lines */}
                        {[0,25,50,75].map(y => (
                          <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1"/>
                        ))}
                        {/* AI Calls line - purple */}
                        <polyline
                          points="0,60 40,55 80,45 120,50 160,30 200,40 240,35 280,45 300,42"
                          fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                        {/* Emails line - cyan */}
                        <polyline
                          points="0,70 40,65 80,60 120,40 160,20 200,35 240,50 280,55 300,52"
                          fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {/* New Leads area - green */}
                        <polyline
                          points="0,50 40,30 80,55 120,60 160,65 200,62 240,68 280,70 300,70"
                          fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {/* Legend */}
                    <div style={{display:'flex', gap:'16px', marginTop:'8px'}}>
                      {[
                        {label:'AI Calls', color:'#8B5CF6'},
                        {label:'Emails', color:'#22D3EE'},
                        {label:'New Leads', color:'#22c55e'},
                      ].map(l => (
                        <div key={l.label} style={{display:'flex', alignItems:'center', gap:'4px'}}>
                          <div style={{width:'8px', height:'8px', borderRadius:'50%', background:l.color}}/>
                          <span style={{fontSize:'10px', color:'#64748b', fontFamily:'Switzer, sans-serif'}}>{l.label}</span>
                        </div>
                      ))}
                    </div>
                    {/* Bottom stats bar - matches real app */}
                    <div style={{
                      display:'grid', gridTemplateColumns:'repeat(4,1fr)',
                      borderTop:'1px solid #f1f5f9', marginTop:'16px', paddingTop:'14px',
                      gap:'8px',
                    }}>
                      {[
                        {label:'TOTAL LEADS', value:'271'},
                        {label:'CONTACTED', value:'184'},
                        {label:'QUALIFIED', value:'47'},
                        {label:'DEALS', value:'10'},
                      ].map(s => (
                        <div key={s.label} style={{textAlign:'center' as const}}>
                          <div style={{fontSize:'20px', fontWeight:800, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>{s.value}</div>
                          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'4px', marginTop:'2px'}}>
                            <div style={{fontSize:'10px', fontWeight:600, color:'#94a3b8', letterSpacing:'0.06em', fontFamily:'Switzer, sans-serif'}}>{s.label}</div>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 18 15 12 9 6"/>
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top performing campaigns */}
                  <div style={{
                    background:'#fff', borderRadius:'12px',
                    border:'1px solid #e2e8f0', padding:'16px',
                  }}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
                      <span style={{fontSize:'14px'}}>🏆</span>
                      <div style={{fontSize:'14px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>Top Performing Campaigns</div>
                    </div>
                    {[
                      {name:'Dental Clinics - LinkedIn', type:'SPECIFIER', rate:'6.74%', color:'#8B5CF6', width:'35%'},
                      {name:'Law Firms - Full Pipeline', type:'DIRECT', rate:'11.22%', color:'#4F46E5', width:'75%'},
                      {name:'Plumbers in Edinburgh', type:'DIRECT', rate:'0%', color:'#4F46E5', width:'5%'},
                      {name:'Solicitors in Edinburgh', type:'DIRECT', rate:'0%', color:'#4F46E5', width:'5%'},
                    ].map((c,i) => (
                      <div key={i} style={{marginBottom:'14px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                          <div style={{fontSize:'12px', fontWeight:600, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>{c.name}</div>
                          <div style={{fontSize:'12px', fontWeight:700, color:'#0f172a', fontFamily:'Switzer, sans-serif'}}>{c.rate}</div>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                          <span style={{
                            fontSize:'9px', fontWeight:700,
                            color:c.color, background:`${c.color}15`,
                            padding:'2px 6px', borderRadius:'4px',
                            fontFamily:'Switzer, sans-serif',
                          }}>{c.type}</span>
                          <div style={{flex:1, height:'4px', background:'#f1f5f9', borderRadius:'100px', overflow:'hidden'}}>
                            <div style={{width:c.width, height:'100%', background:c.color, borderRadius:'100px'}}/>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{
                      fontSize:'12px', color:'#4F46E5', fontWeight:600,
                      fontFamily:'Switzer, sans-serif', cursor:'pointer',
                      textAlign:'center' as const, marginTop:'8px',
                    }}>VIEW ALL CAMPAIGNS</div>
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
