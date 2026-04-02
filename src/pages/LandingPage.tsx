import React, { useEffect, useRef, useState } from 'react';
import logoDark from '../assets/logo-full.png';
import './LandingPage.css';

// ---- Counter hook ----
function useCountUp(end: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return count;
}

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const signInRef = useRef<HTMLButtonElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // ===== HERO DEMO STATE =====
  const [demoScreen, setDemoScreen] = useState(0); // 0=Dashboard, 1=Campaign, 2=Inbox, 3=Pipeline, 4=Intelligence
  const [cursorStyle, setCursorStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [typingText, setTypingText] = useState('');
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Refs for pixel-perfect cursor positioning
  const dashboardRef = useRef<HTMLDivElement>(null);
  const campaignRef = useRef<HTMLDivElement>(null);
  const inboxRef = useRef<HTMLDivElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const intelligenceRef = useRef<HTMLDivElement>(null);
  const heroBodyRef = useRef<HTMLDivElement>(null);

  const getCursorPosition = (targetRef: React.RefObject<HTMLDivElement | null>) => {
    if (!targetRef.current || !heroBodyRef.current) return { top: 0, left: 0 };
    const bodyRect = heroBodyRef.current.getBoundingClientRect();
    const targetRect = targetRef.current.getBoundingClientRect();
    return {
      top: targetRect.top - bodyRect.top + targetRect.height / 2 - 4,
      left: targetRect.left - bodyRect.left + targetRect.width / 2,
    };
  };

  const demoUrlMap: Record<number, string> = {
    0: 'app.leadomation.com/dashboard',
    1: 'app.leadomation.com/new-campaign',
    2: 'app.leadomation.com/inbox',
    3: 'app.leadomation.com/deal-pipeline',
    4: 'app.leadomation.com/lead-database',
  };

  const statsRef = useRef<HTMLDivElement>(null);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('lp-visible'); }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.lp-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stats counter trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Floating CTA on scroll
  useEffect(() => {
    const handleScroll = () => setShowFloatingCta(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sign in handler
  useEffect(() => {
    const btn = signInRef.current;
    if (btn) {
      const handler = () => onNavigate('Login');
      btn.addEventListener('click', handler);
      return () => btn.removeEventListener('click', handler);
    }
  }, [onNavigate]);

  // Carousel auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => setActiveSlide((p) => (p + 1) % 8), 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // ===== HERO DEMO ANIMATION LOOP =====
  useEffect(() => {
    // Small delay to let refs mount
    const initDelay = setTimeout(() => {
      const pos = getCursorPosition(dashboardRef);
      setCursorStyle(pos);
    }, 100);

    const click = () => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 300);
    };

    const runDemo = () => {
      setDemoScreen(0);
      setActiveNavItem('dashboard');
      setTypingText('');
      setCursorStyle(getCursorPosition(dashboardRef));

      // Move to New Campaign
      setTimeout(() => setCursorStyle(getCursorPosition(campaignRef)), 3500);
      setTimeout(() => click(), 4000);
      setTimeout(() => setActiveNavItem('campaign'), 4300);
      setTimeout(() => setDemoScreen(1), 4500);

      // Move to Inbox
      setTimeout(() => setCursorStyle(getCursorPosition(inboxRef)), 10000);
      setTimeout(() => click(), 10500);
      setTimeout(() => setActiveNavItem('inbox'), 10800);
      setTimeout(() => setDemoScreen(2), 11000);

      // Move to Deal Pipeline
      setTimeout(() => setCursorStyle(getCursorPosition(pipelineRef)), 16000);
      setTimeout(() => click(), 16500);
      setTimeout(() => setActiveNavItem('pipeline'), 16800);
      setTimeout(() => setDemoScreen(3), 17000);

      // Move to Lead Intelligence
      setTimeout(() => setCursorStyle(getCursorPosition(intelligenceRef)), 21000);
      setTimeout(() => click(), 21500);
      setTimeout(() => setActiveNavItem('intelligence'), 21800);
      setTimeout(() => setDemoScreen(4), 22000);

      // Back to Dashboard
      setTimeout(() => setCursorStyle(getCursorPosition(dashboardRef)), 26000);
      setTimeout(() => click(), 26500);
      setTimeout(() => setActiveNavItem('dashboard'), 26800);
      setTimeout(() => setDemoScreen(0), 27000);
    };

    const startDelay = setTimeout(() => {
      runDemo();
    }, 200);

    const interval = setInterval(runDemo, 28000);

    return () => {
      clearTimeout(initDelay);
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, []);

  // Typing effect for campaign name
  useEffect(() => {
    if (demoScreen === 1) {
      const fullText = 'UK Luxury Hotels Q1';
      let i = 0;
      setTypingText('');
      const timer = setInterval(() => {
        if (i < fullText.length) {
          setTypingText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(timer);
        }
      }, 80);
      return () => clearInterval(timer);
    }
  }, [demoScreen]);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleSlideClick = (i: number) => {
    setActiveSlide(i);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 15000);
  };

  // Counter values
  const stat1 = useCountUp(10000, 2000, statsVisible);
  const stat2 = useCountUp(500, 2000, statsVisible);
  const stat3 = useCountUp(20, 1500, statsVisible);
  const stat4 = useCountUp(98, 1800, statsVisible);



  // Carousel slides
  const slides = [
    { id: 'scraping', tab: 'Lead Scraping', icon: '🔍', bg: 'lp-slide-indigo', headline: 'Scrape Verified Leads from Google Maps', sub: 'One click. Thousands of real businesses with names, emails, phone numbers, and ratings.' },
    { id: 'demand', tab: 'Global Demand', icon: '🌍', bg: 'lp-slide-emerald', headline: 'Find High-Demand Markets Before Competitors', sub: 'See keyword search volume by location. Spot untapped opportunities on a live heatmap.' },
    { id: 'intelligence', tab: 'Lead Intelligence', icon: '🧠', bg: 'lp-slide-navy', headline: 'AI-Powered Lead Research in Seconds', sub: 'Pain points, buying signals, outreach angles and a personalised subject line. All generated automatically for every lead.' },
    { id: 'email', tab: 'AI Emails', icon: '✉️', bg: 'lp-slide-violet', headline: 'AI Writes Personalised Emails at Scale', sub: "Every message references the prospect's business. Spintax for natural variation." },
    { id: 'voice', tab: 'AI Voice Agent', icon: '📞', bg: 'lp-slide-navy', headline: 'An AI That Actually Calls Your Prospects', sub: 'Handles objections, answers questions, and books meetings in your Calendly.' },
    { id: 'sequences', tab: 'Sequences', icon: '🔀', bg: 'lp-slide-orange', headline: '35-Day LinkedIn + Email Sequences', sub: 'Multi-channel sequences across email, LinkedIn and AI voice calls. Set the flow, set the delays, let it run.' },
    { id: 'pipeline', tab: 'Deal Pipeline', icon: '📊', bg: 'lp-slide-cyan', headline: 'Drag-and-Drop Deal Pipeline', sub: 'Kanban CRM built in. Track every deal from first contact to closed-won.' },
    { id: 'inbox', tab: 'Unified Inbox', icon: '📥', bg: 'lp-slide-rose', headline: 'Every Reply. One Inbox.', sub: 'Email and LinkedIn replies in one place. Never miss a hot lead.' },
  ];

  // FAQ data
  const faqs = [
    { q: 'Is there a free trial?', a: 'Yes! Both Starter and Pro plans come with a free trial. Secure your trial with a card. Cancel anytime before day 7.' },
    { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription at any time from your account settings. No cancellation fees, no questions asked.' },
    { q: 'Do I need technical skills?', a: "Not at all. Leadomation is designed for business owners and sales teams. If you can use email, you can use Leadomation. Everything is point-and-click." },
    { q: 'How does the AI Voice Agent work?', a: 'The AI Voice Agent (Pro plan) makes real phone calls to your leads using natural-sounding AI. You configure the call script with your objectives, questions, and objection responses. The AI handles the conversation and books meetings directly into your Calendly.' },
    { q: 'What email providers do you support?', a: 'Leadomation works with Microsoft 365 (Outlook), Gmail, and any email provider that supports SMTP. We also support inbox rotation across multiple accounts.' },
    { q: 'How are leads sourced?', a: 'Leads are scraped from Google Maps based on your target criteria (industry, location, company size). Email addresses are found and verified through Hunter.io. All data is fresh and verified at the time of scraping.' },
  ];

  // Testimonials data (6 total)
  const testimonials = [
    { text: "Leadomation replaced three separate tools for us. The AI emails actually sound human, and lead scraping from Google Maps is incredibly fast.", name: 'James D.', role: 'Founder, Digital Agency' },
    { text: "The AI Voice Agent is a game-changer. It books meetings while I sleep. Nothing else at this price point comes close.", name: 'Sarah P.', role: 'Sales Director, SaaS Company' },
    { text: "We went from manually researching leads to a full pipeline in under a week. The sequence builder with LinkedIn + email is exactly what we needed.", name: 'Marcus K.', role: 'Business Development, Consulting' },
    { text: "The Global Demand Map alone is worth the subscription. We found three untapped markets in our first week and doubled our outreach.", name: 'Lisa T.', role: 'CEO, Marketing Agency' },
    { text: "I was sceptical about AI cold calling but the Voice Agent is shockingly good. Two meetings booked in the first day without me lifting a finger.", name: 'David R.', role: 'Sales Manager, IT Services' },
    { text: "Finally, one platform that does everything. Lead scraping, email sequences, LinkedIn, and CRM pipeline, all in one place. Absolute no-brainer.", name: 'Priya M.', role: 'Co-Founder, B2B Consultancy' },
  ];




  return (
    <div className="landing-page">

      {/* ===== FLOATING CTA ===== */}
      <button
        className={`lp-floating-cta ${showFloatingCta ? 'lp-floating-visible' : ''}`}
        onClick={() => onNavigate('Register')}
      >
        Get Started Free →
      </button>

      {/* ===== NAV ===== */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <img src={logoDark} alt="Leadomation" className="lp-logo-img" />
          <div className="lp-nav-links">
            <button onClick={() => scrollTo('how-it-works')}>How It Works</button>
            <button onClick={() => scrollTo('features')}>Features</button>
            <button onClick={() => scrollTo('pricing')}>Pricing</button>
            <button onClick={() => scrollTo('faq')}>FAQ</button>
          </div>
          <div className="lp-nav-right">
            <button ref={signInRef} className="lp-btn lp-btn-ghost">Sign In</button>
            <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-primary">Start Free Trial</button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-swirl-left"></div>
        <div className="lp-hero-swirl-right"></div>
        <div className="lp-container">
          <div className="lp-hero-badge">🚀 B2B Lead Generation on Autopilot</div>
          <h1 className="lp-hero-title">
            Turn Cold Leads into Booked Calls.<br />
            <span className="lp-gradient-text">Automatically.</span>
          </h1>
          <p className="lp-hero-sub">
            Leadomation finds, enriches and scores your leads, writes personalised outreach, automates LinkedIn, and even calls prospects with an AI Voice Agent.
          </p>
          <div className="lp-hero-buttons">
            <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-primary lp-btn-lg">Get Started Free →</button>
            <button onClick={() => scrollTo('how-it-works')} className="lp-btn lp-btn-outline lp-btn-lg">See How It Works</button>
          </div>
          <p className="lp-hero-note">Secure your trial with a card. Cancel anytime before day 7.</p>
        </div>
      </section>

      {/* ===== HERO VISUAL - Interactive Dashboard Demo ===== */}
      {/* ===== INTERACTIVE HERO DEMO ===== */}
      <div className="lp-hero-demo">
        {/* Browser Chrome Bar */}
        <div className="lp-hero-chrome">
          <div className="lp-chrome-dots">
            <span style={{ background: '#FF5F57' }}></span>
            <span style={{ background: '#FEBC2E' }}></span>
            <span style={{ background: '#28C840' }}></span>
          </div>
          <div className="lp-chrome-url">{demoUrlMap[demoScreen]}</div>
          <div className="lp-chrome-live">
            <span className="lp-chrome-live-dot"></span>
            LIVE DEMO
          </div>
        </div>

        {/* App Body */}
        <div ref={heroBodyRef} className="lp-hero-body">
          {/* ---- SIDEBAR ---- */}
          <div className="lp-demo-sidebar">
            <div className="lp-demo-sidebar-logo">
              <img src={logoDark} alt="Leadomation" style={{ height: '20px' }} />
            </div>

            <div className="lp-demo-section-label">MAIN</div>
            <div ref={dashboardRef} className={`lp-demo-nav-item ${activeNavItem === 'dashboard' ? 'active' : ''}`}>
              <span className="lp-nav-icon">📊</span> Dashboard
            </div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">🌍</span> Global Demand
            </div>

            <div className="lp-demo-section-label">CAMPAIGNS</div>
            <div ref={campaignRef} className={`lp-demo-nav-item ${activeNavItem === 'campaign' ? 'active' : ''}`}>
              <span className="lp-nav-icon">➕</span> New Campaign
            </div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">📋</span> Active Campaigns
            </div>

            <div className="lp-demo-section-label">LEADS</div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">👥</span> Lead Database
              <span className="lp-demo-badge lp-badge-purple">21</span>
            </div>
            <div ref={intelligenceRef} className={`lp-demo-nav-item ${activeNavItem === 'intelligence' ? 'active' : ''}`}>
              <span className="lp-nav-icon">🧠</span> Lead Intelligence
              <span className="lp-demo-badge lp-badge-purple">NEW</span>
            </div>

            <div className="lp-demo-section-label">CRM</div>
            <div ref={pipelineRef} className={`lp-demo-nav-item ${activeNavItem === 'pipeline' ? 'active' : ''}`}>
              <span className="lp-nav-icon">💰</span> Deal Pipeline
              <span className="lp-demo-badge lp-badge-red">1</span>
            </div>

            <div className="lp-demo-section-label">OUTREACH</div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">⚡</span> Sequence Builder
            </div>
            <div ref={inboxRef} className={`lp-demo-nav-item ${activeNavItem === 'inbox' ? 'active' : ''}`}>
              <span className="lp-nav-icon">📨</span> Inbox
            </div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">📝</span> Email Templates
            </div>

            <div className="lp-demo-section-label">SETTINGS</div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">👤</span> My Profile
            </div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">🔗</span> Integrations
            </div>
            <div className="lp-demo-nav-item">
              <span className="lp-nav-icon">⚙️</span> Email Config
            </div>
          </div>

          {/* ---- MAIN CONTENT AREA ---- */}
          <div className="lp-demo-content">

            {/* ====== SCREEN 0: DASHBOARD ====== */}
            {demoScreen === 0 && (
              <div className="lp-demo-screen" key="dashboard">
                {/* Dashboard Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#111827' }}>Dashboard</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span className="lp-demo-chip">Jan 1, 2024 - Feb 1, 2024 ▾</span>
                    <span className="lp-demo-chip">+ Export</span>
                    <span className="lp-demo-btn-indigo">+ New Campaign</span>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="lp-demo-stats-grid">
                  <div className="lp-demo-stat-card">
                    <div className="lp-demo-stat-icon" style={{ background: '#EEF2FF' }}>👥</div>
                    <div className="lp-demo-stat-badge">↑ +12%</div>
                    <div className="lp-demo-stat-label">Total Leads</div>
                    <div className="lp-demo-stat-number">2,847</div>
                    <div className="lp-demo-stat-sub">from total database</div>
                  </div>
                  <div className="lp-demo-stat-card">
                    <div className="lp-demo-stat-icon" style={{ background: '#F3E8FF' }}>✉️</div>
                    <div className="lp-demo-stat-badge">↑ +18%</div>
                    <div className="lp-demo-stat-label">Leads with Emails</div>
                    <div className="lp-demo-stat-number">1,203</div>
                    <div className="lp-demo-stat-sub">verified emails found</div>
                  </div>
                  <div className="lp-demo-stat-card">
                    <div className="lp-demo-stat-icon" style={{ background: '#ECFDF5' }}>📞</div>
                    <div className="lp-demo-stat-badge">↑ +8%</div>
                    <div className="lp-demo-stat-label">Leads Contacted</div>
                    <div className="lp-demo-stat-number">847</div>
                    <div className="lp-demo-stat-sub">outreach initiated</div>
                  </div>
                  <div className="lp-demo-stat-card">
                    <div className="lp-demo-stat-icon" style={{ background: '#FEF3C7' }}>📊</div>
                    <div className="lp-demo-stat-badge">↑ +31%</div>
                    <div className="lp-demo-stat-label">Total Deals</div>
                    <div className="lp-demo-stat-number">24</div>
                    <div className="lp-demo-stat-sub">current pipeline</div>
                  </div>
                  <div className="lp-demo-stat-card lp-demo-plan-card">
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>⚡</div>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Current Plan</div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#4F46E5' }}>PRO TIER</div>
                  </div>
                </div>

                {/* Chart + Top Campaigns Row */}
                <div className="lp-demo-row" style={{ marginBottom: '10px' }}>
                  <div className="lp-demo-card" style={{ flex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#111827' }}>Campaign Performance</span>
                        <span style={{ fontSize: '8px', color: '#94A3B8', marginLeft: '6px' }}>Weekly interaction overview</span>
                      </div>
                      <span className="lp-demo-chip">Last 7 days ▾</span>
                    </div>
                    <svg width="100%" height="100" viewBox="0 0 500 100" preserveAspectRatio="none" style={{ display: 'block' }}>
                      <defs>
                        <linearGradient id="lpChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <polygon points="0,75 70,60 140,65 210,40 280,50 350,25 420,35 500,22 500,100 0,100" fill="url(#lpChartGrad)" />
                      <polyline points="0,75 70,60 140,65 210,40 280,50 350,25 420,35 500,22" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="0" cy="75" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="70" cy="60" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="140" cy="65" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="210" cy="40" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="280" cy="50" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="350" cy="25" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="420" cy="35" r="3" fill="white" stroke="#4F46E5" strokeWidth="1.5" />
                      <circle cx="500" cy="22" r="3" fill="#4F46E5" stroke="#4F46E5" strokeWidth="1.5" />
                    </svg>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '7px', color: '#94A3B8', fontWeight: 700, marginTop: '4px', padding: '0 2px' }}>
                      <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                    </div>
                  </div>
                  <div className="lp-demo-card" style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>Top Performing Campaigns</div>
                    {[
                      { name: 'UK Expansion', rate: '34% open', color: '#8B5CF6' },
                      { name: 'DACH Hotels', rate: '28% open', color: '#3B82F6' },
                      { name: 'Manchester Plumbers', rate: '41% open', color: '#6366F1' },
                    ].map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid #F3F4F6' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color, display: 'inline-block' }}></span>
                          <span style={{ fontSize: '9px', fontWeight: 600, color: '#374151' }}>{c.name}</span>
                        </div>
                        <span style={{ fontSize: '9px', fontWeight: 800, color: '#10B981' }}>{c.rate}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '8px', fontSize: '8px', fontWeight: 800, color: '#4F46E5', cursor: 'pointer' }}>VIEW ALL CAMPAIGNS</div>
                  </div>
                </div>

                {/* Activity + Recent Leads Row */}
                <div className="lp-demo-row">
                  <div className="lp-demo-card" style={{ flex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#111827' }}>Recent Activity</span>
                      <span style={{ fontSize: '7px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <span style={{ width: '4px', height: '4px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }}></span>
                        Live Feed
                      </span>
                    </div>
                    {[
                      { text: 'Email opened by Wellness Spa Berlin', time: '2 minutes ago', badge: 'OPENED', badgeColor: '#F59E0B', badgeBg: '#FEF3C7' },
                      { text: 'New lead scraped: Luxury Hotel Dubai', time: '15 minutes ago', badge: 'NEW', badgeColor: '#10B981', badgeBg: '#ECFDF5' },
                      { text: 'LinkedIn Connection accepted: Sarah J.', time: '45 minutes ago', badge: 'SENT', badgeColor: '#3B82F6', badgeBg: '#EFF6FF' },
                      { text: 'Reply received: TechFlow Solutions', time: '1 hour ago', badge: 'REPLIED', badgeColor: '#8B5CF6', badgeBg: '#F3E8FF' },
                      { text: 'Campaign "UK Expansion" started', time: '3 hours ago', badge: 'SENT', badgeColor: '#3B82F6', badgeBg: '#EFF6FF' },
                    ].map((item, i) => (
                      <div key={i} className="lp-demo-activity-row">
                        <div className="lp-demo-avatar"></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '9px', fontWeight: 600, color: '#374151' }}>{item.text}</div>
                          <div style={{ fontSize: '7px', color: '#94A3B8' }}>{item.time}</div>
                        </div>
                        <span className="lp-demo-status-pill" style={{ color: item.badgeColor, background: item.badgeBg }}>{item.badge}</span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-demo-card" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#111827' }}>Recent Leads</span>
                      <span style={{ fontSize: '8px', fontWeight: 800, color: '#4F46E5' }}>VIEW ALL</span>
                    </div>
                    {[
                      { initial: 'A', name: 'Alexander House & Utopia Spa', type: 'Hotel' },
                      { initial: 'B', name: 'Barton Manor Hotel & Spa', type: 'Hotel' },
                      { initial: 'T', name: 'Trump Turnberry', type: 'Hotel' },
                      { initial: 'M', name: 'Mount Stewart Hotel', type: 'Hotel' },
                      { initial: 'F', name: 'Fairlawns Hotel and Spa', type: 'Hotel' },
                    ].map((lead, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', borderBottom: i < 4 ? '1px solid #F3F4F6' : 'none' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#6B7280', flexShrink: 0 }}>{lead.initial}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '9px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</div>
                          <div style={{ fontSize: '7px', color: '#94A3B8' }}>{lead.type}</div>
                        </div>
                        <span style={{ fontSize: '7px', color: '#94A3B8', whiteSpace: 'nowrap' }}>1d ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ====== SCREEN 1: NEW CAMPAIGN ====== */}
            {demoScreen === 1 && (
              <div className="lp-demo-screen" key="campaign">
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#111827', marginBottom: '12px' }}>New Campaign</div>

                {/* Campaign Details Card */}
                <div className="lp-demo-card" style={{ marginBottom: '8px' }}>
                  <div className="lp-demo-card-title">CAMPAIGN DETAILS</div>
                  <div style={{ fontSize: '8px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Campaign Name</div>
                  <div className="lp-demo-input">
                    {typingText}<span className="lp-typing-cursor"></span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '10px' }}>
                    <div className="lp-demo-track-card lp-demo-track-selected">
                      <span>🏢</span>
                      <span style={{ fontSize: '8px', fontWeight: 800 }}>Direct to Venue</span>
                      <span style={{ fontSize: '8px', color: '#4F46E5' }}>✓</span>
                    </div>
                    <div className="lp-demo-track-card">
                      <span>🖊️</span>
                      <span style={{ fontSize: '8px', fontWeight: 600, color: '#6B7280' }}>Specifiers</span>
                    </div>
                    <div className="lp-demo-track-card">
                      <span>📈</span>
                      <span style={{ fontSize: '8px', fontWeight: 600, color: '#6B7280' }}>Warm Leads</span>
                    </div>
                  </div>
                </div>

                {/* Targeting Card */}
                <div className="lp-demo-card" style={{ marginBottom: '8px' }}>
                  <div className="lp-demo-card-title">TARGETING</div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span className="lp-demo-tag">Gym</span>
                    <span className="lp-demo-tag">CrossFit Box</span>
                    <span className="lp-demo-tag">Wellness Centre</span>
                    <span className="lp-demo-tag-add">+ Add Custom</span>
                  </div>
                </div>

                {/* Geographic Targeting Card */}
                <div className="lp-demo-card" style={{ marginBottom: '8px' }}>
                  <div className="lp-demo-card-title">GEOGRAPHIC TARGETING</div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span className="lp-demo-country-chip">🇬🇧 United Kingdom ✕</span>
                    <span className="lp-demo-country-chip">🇦🇪 UAE ✕</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>City / Area</div>
                      <div className="lp-demo-input" style={{ fontSize: '8px' }}>Dubai Marina</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>Radius</div>
                      <div className="lp-demo-input" style={{ fontSize: '8px' }}>25 miles ▾</div>
                    </div>
                  </div>
                </div>

                {/* Outreach Config Card */}
                <div className="lp-demo-card" style={{ marginBottom: '8px' }}>
                  <div className="lp-demo-card-title">OUTREACH CONFIGURATION</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>Email Sequence</div>
                      <div className="lp-demo-input" style={{ fontSize: '8px' }}>Direct: Gym/Wellness ▾</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>Follow-ups</div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span className="lp-demo-num-btn">2</span>
                        <span className="lp-demo-num-btn lp-demo-num-active">3</span>
                        <span className="lp-demo-num-btn">4</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '7px', fontWeight: 700, color: '#6B7280', marginBottom: '3px' }}>Number of Leads: <strong style={{ color: '#4F46E5' }}>150</strong></div>
                    <div className="lp-demo-slider">
                      <div className="lp-demo-slider-fill" style={{ width: '30%' }}></div>
                      <div className="lp-demo-slider-thumb" style={{ left: '30%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E2E4ED' }}>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: '#6B7280' }}>Save as Draft</span>
                  <span className="lp-demo-btn-indigo">🚀 Launch Campaign</span>
                </div>
              </div>
            )}

            {/* ====== SCREEN 2: INBOX ====== */}
            {demoScreen === 2 && (
              <div className="lp-demo-screen lp-demo-screen-inbox" key="inbox">
                <div className="lp-demo-inbox-left">
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span className="lp-demo-btn-indigo" style={{ fontSize: '8px', padding: '4px 8px' }}>✏️ COMPOSE</span>
                    <div className="lp-demo-input" style={{ flex: 1, fontSize: '8px' }}>🔍 Search emails...</div>
                  </div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
                    {['All (12)', 'Sent (8)', 'Opened (5)', 'Replied (3)'].map((tab, i) => (
                      <span key={i} className={`lp-demo-tab ${i === 0 ? 'lp-demo-tab-active' : ''}`}>{tab}</span>
                    ))}
                  </div>
                  <div className="lp-demo-email-list">
                    {[
                      { subject: 'Partnership Opportunity', status: 'REPLIED', statusColor: '#10B981', statusBg: '#ECFDF5', time: '10:32am', selected: true },
                      { subject: 'Follow-up: Spa Proposal', status: 'OPENED', statusColor: '#F59E0B', statusBg: '#FEF3C7', time: '9:15am', selected: false },
                      { subject: 'Meeting Request', status: 'SENT', statusColor: '#3B82F6', statusBg: '#EFF6FF', time: '8:44am', selected: false },
                      { subject: 'Cold Plunge Equipment', status: 'REPLIED', statusColor: '#10B981', statusBg: '#ECFDF5', time: 'Yesterday', selected: false },
                      { subject: 'Dubai Marina Spa Intro', status: 'SENT', statusColor: '#3B82F6', statusBg: '#EFF6FF', time: 'Yesterday', selected: false },
                    ].map((email, i) => (
                      <div key={i} className={`lp-demo-email-row ${email.selected ? 'lp-demo-email-selected' : ''}`}>
                        <div style={{ fontSize: '9px', fontWeight: 800, color: '#111827', marginBottom: '3px' }}>{email.subject}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="lp-demo-status-pill" style={{ color: email.statusColor, background: email.statusBg }}>{email.status}</span>
                          <span style={{ fontSize: '7px', color: '#94A3B8' }}>{email.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="lp-demo-inbox-right">
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827', marginBottom: '4px' }}>Partnership Opportunity</div>
                  <span className="lp-demo-status-pill" style={{ color: '#10B981', background: '#ECFDF5', marginBottom: '12px', display: 'inline-block' }}>REPLIED</span>
                  <div className="lp-demo-card" style={{ marginBottom: '10px' }}>
                    <p style={{ fontSize: '9px', color: '#4B5563', lineHeight: 1.7, margin: 0 }}>
                      Hi Sarah,<br /><br />
                      I came across your wellness centre and was really impressed by your 4.8★ Google rating and the range of recovery services you offer.<br /><br />
                      I'd love to explore how we could help you attract more high-value clients through targeted B2B outreach. Would you be open to a quick 15-minute call this week?<br /><br />
                      Best regards,<br />
                      Iain Liddle<br />
                      Leadomation
                    </p>
                  </div>
                  <div className="lp-demo-card" style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Sent</div>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#111827' }}>14 Feb 2026</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Opened</div>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#111827' }}>15 Feb 2026</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '7px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Replied</div>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#111827' }}>16 Feb 2026</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ====== SCREEN 3: DEAL PIPELINE ====== */}
            {demoScreen === 3 && (
              <div className="lp-demo-screen" key="pipeline">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#111827' }}>Deal Pipeline</div>
                    <div style={{ fontSize: '8px', color: '#6B7280' }}>Manage your revenue pipeline</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '7px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Total Pipeline Value</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#4F46E5' }}>£47,200</div>
                    </div>
                    <span className="lp-demo-btn-indigo">+ ADD DEAL</span>
                  </div>
                </div>

                <div className="lp-demo-pipeline-board">
                  {[
                    { name: 'New Reply', color: '#3B82F6', deals: [{ n: 'Luxury Spa Dubai', v: '£12,000' }, { n: 'Wellness Centre', v: '£5,400' }, { n: 'Elite PT Studio', v: '£3,500' }] },
                    { name: 'Qualified', color: '#8B5CF6', deals: [{ n: 'FitLife Gym', v: '£3,800' }] },
                    { name: 'Proposal Sent', color: '#F59E0B', deals: [{ n: 'Grand Hotel DXB', v: '£9,000' }, { n: 'Zen Wellness', v: '£4,200' }] },
                    { name: 'Negotiating', color: '#F97316', deals: [{ n: 'Modern Spa London', v: '£6,500' }] },
                    { name: 'Won', color: '#10B981', deals: [{ n: 'Beauty & Recovery', v: '£12,000' }] },
                    { name: 'Lost', color: '#EF4444', deals: [] },
                  ].map((stage, si) => (
                    <div key={si} className="lp-demo-pipeline-col" style={{ animationDelay: `${si * 0.05}s`, borderTopColor: stage.color }}>
                      <div className="lp-demo-pipeline-header">
                        <span style={{ fontSize: '8px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stage.name}</span>
                        <span style={{ fontSize: '7px', fontWeight: 800, color: '#4F46E5', background: '#EEF2FF', padding: '1px 5px', borderRadius: '8px' }}>{stage.deals.length}</span>
                      </div>
                      <div className="lp-demo-pipeline-cards">
                        {stage.deals.length === 0 ? (
                          <div style={{ fontSize: '7px', color: '#D1D5DB', textAlign: 'center', padding: '12px 0', fontStyle: 'italic' }}>No deals yet</div>
                        ) : (
                          stage.deals.map((deal, di) => (
                            <div key={di} className="lp-demo-deal-card">
                              <div style={{ fontSize: '8px', fontWeight: 800, color: '#111827' }}>{deal.n}</div>
                              <div style={{ fontSize: '11px', fontWeight: 900, color: '#4F46E5', marginTop: '2px' }}>{deal.v}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ====== SCREEN 4: LEAD INTELLIGENCE ====== */}
            {demoScreen === 4 && (
              <div className="lp-demo-screen" key="intelligence">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#111827' }}>Lead Intelligence</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '4px 10px', borderRadius: '8px' }}>Pro Feature</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="lp-demo-card">
                    <div className="lp-demo-card-title">Opportunity Rating</div>
                    <span style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontWeight: 800, fontSize: '11px', padding: '4px 10px', borderRadius: '6px' }}>🔥 Hot</span>
                  </div>
                  <div className="lp-demo-card">
                    <div className="lp-demo-card-title">Pain Intensity</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#111827' }}>7/10</div>
                    <div style={{ height: '4px', background: '#E2E4ED', borderRadius: '2px', marginTop: '4px' }}><div style={{ height: '100%', width: '70%', background: 'linear-gradient(90deg, #4F46E5, #22D3EE)', borderRadius: '2px' }}></div></div>
                  </div>
                </div>
                <div className="lp-demo-card" style={{ marginTop: '8px' }}>
                  <div className="lp-demo-card-title">Pain Point</div>
                  <div style={{ fontSize: '9px', color: '#374151', lineHeight: 1.6 }}>No online booking system. Losing walk-in customers to competitors with digital scheduling.</div>
                </div>
                <div className="lp-demo-card" style={{ marginTop: '8px' }}>
                  <div className="lp-demo-card-title">Suggested Subject Line</div>
                  <div style={{ fontSize: '9px', color: '#4F46E5', fontWeight: 600 }}>Quick fix for your booking gap</div>
                </div>
                <div className="lp-demo-card" style={{ marginTop: '8px' }}>
                  <div className="lp-demo-card-title">Suggested Opening Line</div>
                  <div style={{ fontSize: '9px', color: '#4F46E5', fontWeight: 600 }}>I noticed your second location just opened, congrats! I had an idea that could help both sites run smoother.</div>
                </div>
              </div>
            )}
          </div>

          {/* ---- CURSOR ---- */}
          <svg
            className={`lp-demo-cursor ${isClicking ? 'lp-cursor-clicking' : ''}`}
            style={{
              top: `${cursorStyle.top}px`,
              left: `${cursorStyle.left}px`,
            }}
            width="18" height="22" viewBox="0 0 18 22" fill="none"
          >
            <path d="M1 1L1 17.5L5.5 13L10 21L13 19.5L8.5 11.5L14.5 11.5L1 1Z"
              fill="white" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ===== TRUST BAR - Auto-scrolling marquee ===== */}
      <section className="lp-trust">
        <div className="lp-container">
          <p className="lp-trust-label">Powered by Industry Leaders</p>
        </div>
        <div className="lp-marquee-wrapper">
          <div className="lp-marquee">
            <div className="lp-marquee-track">
              {[...Array(3)].map((_, setIdx) => (
                <React.Fragment key={setIdx}>
                  <div className="lp-trust-logo">
                    <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google Maps" className="lp-trust-logo-img" style={{ height: '22px' }} />
                    <span>Maps</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#F06529" height="22" width="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                    <span>Hunter.io</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#0A66C2" height="22" width="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    <span>LinkedIn</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#00A4EF" height="22" width="22"><path d="M0 0h11.5v11.5H0zM12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zM12.5 12.5H24V24H12.5z" /></svg>
                    <span>Microsoft 365</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#635BFF" height="22" width="22"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" /></svg>
                    <span>Stripe</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#3ECF8E" height="22" width="22"><path d="M21.362 9.354H12V.396a.396.396 0 0 0-.745-.188L2.203 11.511a.792.792 0 0 0 .663 1.235H12v8.958a.396.396 0 0 0 .745.188l9.052-11.303a.792.792 0 0 0-.663-1.235z" /></svg>
                    <span>Supabase</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 100 100" fill="#4F46E5" height="22" width="22"><circle cx="50" cy="50" r="45" fill="none" stroke="#4F46E5" strokeWidth="8" /><path d="M30 50 L45 35 L60 50 L45 65 Z" fill="#4F46E5" /><path d="M50 50 L65 35 L80 50 L65 65 Z" fill="#4F46E5" opacity="0.6" /></svg>
                    <span>Unipile</span>
                  </div>
                  <div className="lp-trust-logo">
                    <svg className="lp-trust-logo-svg" viewBox="0 0 24 24" fill="#4F46E5" height="22" width="22"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.5 14.5L7 13l1.4-1.4 2.1 2.1 5.1-5.1L17 10l-6.5 6.5z" /></svg>
                    <span>Vapi.ai</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="lp-how" id="how-it-works">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">How It Works</span>
            <h2>Three Steps to a Full Pipeline</h2>
          </div>
          <div className="lp-flow lp-reveal">
            <div className="lp-flow-step">
              <div className="lp-flow-icon-wrap"><div className="lp-flow-icon">🎯</div><div className="lp-flow-number">1</div></div>
              <h3>Define Targets</h3>
              <p>Pick industry, location &amp; size. Use the Global Demand Map to find hot markets.</p>
              <div className="lp-mini-mockup">
                <div className="lp-mock-search-bar"><span>🔍</span><span>Plumbers in Manchester, UK</span></div>
                <div className="lp-mock-tags"><span>📍 Manchester</span><span>🔧 Plumbing</span><span>🏢 1-50</span></div>
              </div>
            </div>
            <div className="lp-flow-connector"><div className="lp-connector-arrow">→</div></div>
            <div className="lp-flow-step">
              <div className="lp-flow-icon-wrap"><div className="lp-flow-icon">⚡</div><div className="lp-flow-number">2</div></div>
              <h3>We Find &amp; Verify</h3>
              <p>Auto-scrape Google Maps. Verify emails via Hunter.io. Enrich with decision-maker data.</p>
              <div className="lp-mini-mockup">
                <div className="lp-mock-lead-row"><span className="lp-mock-avatar">JM</span><div><strong>J. Mitchell Plumbing</strong><small>j.mitchell@jmplumbing.co.uk ✓</small></div></div>
                <div className="lp-mock-lead-row"><span className="lp-mock-avatar">SP</span><div><strong>Smith &amp; Partners</strong><small>info@smithpartners.com ✓</small></div></div>
                <div className="lp-mock-lead-row lp-mock-loading"><span className="lp-mock-avatar lp-av-loading">...</span><div><div className="lp-skeleton"></div><div className="lp-skeleton lp-skeleton-sm"></div></div></div>
              </div>
            </div>
            <div className="lp-flow-connector"><div className="lp-connector-arrow">→</div></div>
            <div className="lp-flow-step">
              <div className="lp-flow-icon-wrap"><div className="lp-flow-icon">🤖</div><div className="lp-flow-number">3</div></div>
              <h3>AI Sends Outreach</h3>
              <p>Personalised emails, LinkedIn messages, and AI voice calls, all on autopilot.</p>
              <div className="lp-mini-mockup">
                <div className="lp-mock-seq-step lp-mock-seq-active"><span>📧</span> Email Sent <span className="lp-mock-status">✓ Delivered</span></div>
                <div className="lp-mock-seq-arrow">↓</div>
                <div className="lp-mock-seq-step"><span>💼</span> LinkedIn <span className="lp-mock-status">Day 2</span></div>
                <div className="lp-mock-seq-arrow">↓</div>
                <div className="lp-mock-seq-step"><span>📞</span> AI Call <span className="lp-mock-status">Day 4</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANIMATED STATS ===== */}
      <section className="lp-stats" ref={statsRef}>
        <div className="lp-container">
          <div className="lp-stats-grid">
            <div className="lp-stat-item"><span className="lp-stat-number">{stat1.toLocaleString()}+</span><span className="lp-stat-label">Leads Generated</span></div>
            <div className="lp-stat-item"><span className="lp-stat-number">{stat2}+</span><span className="lp-stat-label">Businesses Served</span></div>
            <div className="lp-stat-item"><span className="lp-stat-number">{stat3}+</span><span className="lp-stat-label">Countries</span></div>
            <div className="lp-stat-item"><span className="lp-stat-number">{stat4}%</span><span className="lp-stat-label">Email Delivery Rate</span></div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE CAROUSEL ===== */}
      <section className="lp-carousel-section" id="features">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">Features</span>
            <h2>See What <img src={logoDark} alt="Leadomation" className="lp-inline-logo" /> Can Do</h2>
          </div>
          <div className="lp-carousel-tabs lp-reveal">
            {slides.map((s, i) => (
              <button key={s.id} className={`lp-carousel-tab ${activeSlide === i ? 'lp-tab-active' : ''}`} onClick={() => handleSlideClick(i)}>
                <span className="lp-tab-icon">{s.icon}</span><span className="lp-tab-label">{s.tab}</span>
              </button>
            ))}
          </div>
          <div className="lp-carousel-viewport lp-reveal">
            {slides.map((s, i) => (
              <div key={s.id} className={`lp-carousel-slide ${s.bg} ${activeSlide === i ? 'lp-slide-active' : ''}`}>
                <div className="lp-slide-content">
                  <div className="lp-slide-text">
                    <h3>{s.headline}</h3>
                    <p>{s.sub}</p>
                    <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-light">Try It Free →</button>
                  </div>
                  <div className="lp-slide-visual">
                    {s.id === 'scraping' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">Google Maps Results</div>
                        <div className="lp-mockup-row"><span className="lp-mockup-pin">📍</span><div><strong>ABC Electrical Ltd</strong><br /><span>4.8 ★ · Manchester · abc-electrical.co.uk</span></div><span className="lp-mockup-check">✓</span></div>
                        <div className="lp-mockup-row"><span className="lp-mockup-pin">📍</span><div><strong>Northern Power Co</strong><br /><span>4.6 ★ · Leeds · northernpower.com</span></div><span className="lp-mockup-check">✓</span></div>
                        <div className="lp-mockup-row"><span className="lp-mockup-pin">📍</span><div><strong>BrightSpark Installs</strong><br /><span>4.9 ★ · Liverpool · brightspark.io</span></div><span className="lp-mockup-check">✓</span></div>
                        <div className="lp-mockup-footer">⚡ Scraping... 247 leads found</div>
                      </div>
                    )}
                    {s.id === 'demand' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">Global Demand Map</div>
                        <div className="lp-demand-grid">
                          <div className="lp-demand-cell lp-demand-hot">Manchester<br /><small>12,400</small></div>
                          <div className="lp-demand-cell lp-demand-warm">Birmingham<br /><small>8,200</small></div>
                          <div className="lp-demand-cell lp-demand-hot">London<br /><small>22,100</small></div>
                          <div className="lp-demand-cell lp-demand-cool">Edinburgh<br /><small>3,400</small></div>
                          <div className="lp-demand-cell lp-demand-warm">Leeds<br /><small>6,800</small></div>
                          <div className="lp-demand-cell lp-demand-hot">Bristol<br /><small>9,600</small></div>
                        </div>
                      </div>
                    )}
                    {s.id === 'intelligence' && (
                      <div className="lp-mockup">
                        <div className="lp-mockup-header">Lead Intelligence Report</div>
                        <div style={{ padding: '8px 0', borderBottom: '1px solid #E2E4ED' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Opportunity rating</div>
                          <span style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', fontWeight: 800, fontSize: '0.8rem', padding: '3px 10px', borderRadius: '6px' }}>Hot</span>
                        </div>
                        <div style={{ padding: '8px 0', borderBottom: '1px solid #E2E4ED' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Pain point</div>
                          <div style={{ fontSize: '0.8rem', color: '#374151', lineHeight: 1.5 }}>No online booking system. Losing walk-in customers to competitors with digital scheduling.</div>
                        </div>
                        <div style={{ padding: '8px 0', borderBottom: '1px solid #E2E4ED' }}>
                          <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Suggested subject line</div>
                          <div style={{ fontSize: '0.8rem', color: '#4F46E5', fontWeight: 600 }}>Quick fix for [Business Name]'s booking gap</div>
                        </div>
                        <div className="lp-email-ai-badge">🧠 AI Generated - Pro Feature</div>
                      </div>
                    )}
                    {s.id === 'email' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">AI Email Composer</div>
                        <div className="lp-email-field"><span>To:</span> j.mitchell@jmplumbing.co.uk</div>
                        <div className="lp-email-field"><span>Subject:</span> Quick question about JM Plumbing</div>
                        <div className="lp-email-body"><p>Hi James,</p><p>I noticed JM Plumbing has a stellar 4.8★ rating in Manchester, which is impressive.</p><p className="lp-email-typing">I wanted to reach out because we help plumbing companies<span className="lp-cursor">|</span></p></div>
                        <div className="lp-email-ai-badge">✨ AI Generated · Personalised</div>
                      </div>
                    )}
                    {s.id === 'voice' && (
                      <div className="lp-voice-screen">
                        <div className="lp-voice-status">AI CALLING...</div>
                        <div className="lp-voice-name">Sarah Mitchell</div>
                        <div className="lp-voice-company">CEO, TechFlow Solutions</div>
                        <div className="lp-voice-waves">{[...Array(7)].map((_, idx) => <span key={idx}></span>)}</div>
                        <div className="lp-voice-timer">02:34</div>
                        <div className="lp-transcript-line lp-transcript-ai">"I'd love to schedule a demo. Does Thursday at 2pm work?"</div>
                        <div className="lp-transcript-line lp-transcript-prospect">"That works perfectly. Send me a calendar invite."</div>
                        <div className="lp-voice-booked">✅ Meeting Booked: Thu 2:00 PM</div>
                      </div>
                    )}
                    {s.id === 'sequences' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">Sequence Builder</div>
                        <div className="lp-seq-flow">
                          <div className="lp-seq-node lp-seq-email">📧 Email #1<small>Day 0</small></div><div className="lp-seq-line"></div>
                          <div className="lp-seq-node lp-seq-wait">⏱ Wait 2 days</div><div className="lp-seq-line"></div>
                          <div className="lp-seq-node lp-seq-linkedin">💼 LinkedIn Connect<small>Day 2</small></div><div className="lp-seq-line"></div>
                          <div className="lp-seq-node lp-seq-wait">⏱ Wait 2 days</div><div className="lp-seq-line"></div>
                          <div className="lp-seq-node lp-seq-phone">📞 AI Voice Call<small>Day 4</small></div><div className="lp-seq-line"></div>
                          <div className="lp-seq-node lp-seq-email">📧 Follow-up<small>Day 6</small></div>
                        </div>
                      </div>
                    )}
                    {s.id === 'pipeline' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">Deal Pipeline</div>
                        <div className="lp-kanban">
                          <div className="lp-kanban-col"><div className="lp-kanban-title">New</div><div className="lp-kanban-card">TechFlow<br /><small>£12K</small></div><div className="lp-kanban-card">BrightSpark<br /><small>£8.5K</small></div></div>
                          <div className="lp-kanban-col"><div className="lp-kanban-title">Meeting</div><div className="lp-kanban-card lp-kanban-highlight">Northern Power<br /><small>£15K</small></div></div>
                          <div className="lp-kanban-col"><div className="lp-kanban-title">Proposal</div><div className="lp-kanban-card">ABC Electrical<br /><small>£22K</small></div></div>
                          <div className="lp-kanban-col"><div className="lp-kanban-title">Won 🎉</div><div className="lp-kanban-card lp-kanban-won">SmartBuild<br /><small>£18K</small></div></div>
                        </div>
                      </div>
                    )}
                    {s.id === 'inbox' && (
                      <div className="lp-mockup"><div className="lp-mockup-header">Unified Inbox</div>
                        <div className="lp-inbox-list">
                          <div className="lp-inbox-item lp-inbox-unread"><span>📧</span><div><strong>Sarah Mitchell</strong><small>That sounds great! Let's schedule...</small></div><span className="lp-inbox-time">2m</span></div>
                          <div className="lp-inbox-item lp-inbox-unread"><span>💼</span><div><strong>James Patterson</strong><small>Thanks for connecting! I'd be interested...</small></div><span className="lp-inbox-time">15m</span></div>
                          <div className="lp-inbox-item"><span>📞</span><div><strong>Emma Williams</strong><small>AI Call. Meeting booked Thu 3pm</small></div><span className="lp-inbox-time">1h</span></div>
                          <div className="lp-inbox-item"><span>📧</span><div><strong>David Chen</strong><small>Could you send more details about...</small></div><span className="lp-inbox-time">2h</span></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-carousel-dots">{slides.map((_, i) => (<button key={i} className={`lp-dot ${activeSlide === i ? 'lp-dot-active' : ''}`} onClick={() => handleSlideClick(i)} />))}</div>
        </div>
      </section>

      {/* ===== EXTRAS STRIP ===== */}
      <section className="lp-extras lp-reveal">
        <div className="lp-container">
          <h3 className="lp-extras-title">Plus Everything Else You Need</h3>
          <div className="lp-extras-grid">
            {['🧠 Lead Intelligence', '🎯 Intent Scoring', '📊 Performance Analyser', '🔗 3-Layer Enrichment', '🔥 Inbox Warm-Up', '🔄 Inbox Rotation', '🧠 Decision Maker Enrichment', '✍️ Email Signatures', '🛡️ Compliance Tools', '📈 Advanced Analytics', '📤 CSV Export', '🔗 Integrations', '📝 Email Templates', '🔤 Spintax Support'].map((chip) => (
              <div key={chip} className="lp-extra-chip">{chip}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEAD INTELLIGENCE ===== */}
      <section className="lp-intelligence">
        <div className="lp-container">
          <div className="lp-intel-layout">
            <div className="lp-intel-text lp-reveal">
              <span className="lp-section-tag">Lead Intelligence</span>
              <h3>Know your lead before you contact them</h3>
              <p>Lead Intelligence researches every prospect automatically. Pain points, buying signals, outreach angles and a personalised subject line. Generated in seconds.</p>
              <span className="lp-intel-pro-badge">Pro feature</span>
            </div>
            <div className="lp-intel-card lp-reveal">
              <div className="lp-intel-card-header">Lead Intelligence Report</div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Opportunity rating</div>
                <span className="lp-intel-rating">Hot</span>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Pain intensity</div>
                <div className="lp-intel-value">7/10</div>
                <div className="lp-intel-progress"><div className="lp-intel-progress-fill" style={{ width: '70%' }}></div></div>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Pain point</div>
                <div className="lp-intel-value">No online booking system. Losing walk-in customers to competitors with digital scheduling. Website has no clear call to action.</div>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Outreach angle</div>
                <div className="lp-intel-value">Position as a quick-win digital upgrade. Reference their 4.8-star Google rating as social proof they already deliver great service.</div>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Personalisation hook</div>
                <div className="lp-intel-value">Mention their recent expansion to a second location and how online booking could streamline both sites.</div>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Suggested subject line</div>
                <div className="lp-intel-value" style={{ color: '#4F46E5', fontWeight: 600 }}>Quick fix for your booking gap</div>
              </div>
              <div className="lp-intel-field">
                <div className="lp-intel-label">Suggested opening line</div>
                <div className="lp-intel-value" style={{ color: '#4F46E5', fontWeight: 600 }}>I noticed your second location just opened - congrats! I had an idea that could help both sites run smoother.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTENT SCORING ===== */}
      <section className="lp-intent">
        <div className="lp-container">
          <div className="lp-intent-layout">
            <div className="lp-intent-badges lp-reveal">
              <div className="lp-intent-badge lp-intent-hot">
                <span style={{ fontSize: '1.5rem' }}>🔥</span>
                <div><strong>Hot</strong><br /><span style={{ fontSize: '0.8rem', fontWeight: 400 }}>High buying signals detected</span></div>
                <span className="lp-intent-score">76-100</span>
              </div>
              <div className="lp-intent-badge lp-intent-warm">
                <span style={{ fontSize: '1.5rem' }}>🌡️</span>
                <div><strong>Warm</strong><br /><span style={{ fontSize: '0.8rem', fontWeight: 400 }}>Some interest indicators</span></div>
                <span className="lp-intent-score">51-75</span>
              </div>
              <div className="lp-intent-badge lp-intent-cool">
                <span style={{ fontSize: '1.5rem' }}>❄️</span>
                <div><strong>Cool</strong><br /><span style={{ fontSize: '0.8rem', fontWeight: 400 }}>Low engagement signals</span></div>
                <span className="lp-intent-score">26-50</span>
              </div>
              <div className="lp-intent-badge lp-intent-unscored">
                <span style={{ fontSize: '1.5rem' }}>❓</span>
                <div><strong>Unscored</strong><br /><span style={{ fontSize: '0.8rem', fontWeight: 400 }}>Awaiting enrichment data</span></div>
                <span className="lp-intent-score">-</span>
              </div>
            </div>
            <div className="lp-intent-text lp-reveal">
              <span className="lp-section-tag">Intent scoring</span>
              <h3>Know who's ready to buy</h3>
              <p>Every lead is automatically scored based on enrichment signals. Hot leads get priority. You spend time on the ones most likely to convert.</p>
              <ul className="lp-intent-bullets">
                <li>Scored at enrichment time</li>
                <li>Filter and sort by intent</li>
                <li>Prioritise outreach automatically</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAMPAIGN PERFORMANCE ANALYSER ===== */}
      <section className="lp-performance">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">Performance analyser</span>
            <h2>The longer you use Leadomation, the better your results get</h2>
            <p>The Campaign Performance Analyser studies your email data every 6 hours and sends you a personalised report. Subject line suggestions, timing improvements, follow-up coaching. All automated.</p>
          </div>
          <div className="lp-perf-layout lp-reveal">
            <div className="lp-perf-text">
              <h3>Personalised insights. Delivered automatically.</h3>
              <p>Every campaign teaches the system what converts for your audience. Your performance profile compounds over time, making every outreach more effective than the last.</p>
            </div>
            <div className="lp-perf-card">
              <div className="lp-perf-score">
                <div className="lp-perf-score-circle">78</div>
                <div>
                  <div className="lp-perf-score-label">Overall performance score</div>
                  <div className="lp-perf-score-sub">Based on 1,247 emails analysed</div>
                </div>
              </div>
              <div className="lp-perf-bars">
                <div className="lp-perf-bar-label">Subject lines with questions</div>
                <div className="lp-perf-bar"><div className="lp-perf-bar-fill" style={{ width: '78%' }}></div></div>
                <div className="lp-perf-bar-label">Personalised openers</div>
                <div className="lp-perf-bar"><div className="lp-perf-bar-fill" style={{ width: '62%' }}></div></div>
                <div className="lp-perf-bar-label">Generic templates</div>
                <div className="lp-perf-bar"><div className="lp-perf-bar-fill" style={{ width: '34%' }}></div></div>
              </div>
              <div className="lp-perf-insight">
                <span className="lp-perf-insight-icon">💡</span>
                <span>Emails sent Tuesday to Thursday perform 34% better than weekend sends</span>
              </div>
              <div className="lp-perf-insight">
                <span className="lp-perf-insight-icon">🎯</span>
                <span>Add more personalisation to follow-up #2 for higher reply rates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ENRICHMENT PIPELINE ===== */}
      <section className="lp-enrichment">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">Enrichment</span>
            <h2>Three layers of enrichment. Zero manual work.</h2>
          </div>
          <div className="lp-enrich-grid lp-reveal">
            <div className="lp-enrich-card lp-reveal">
              <div className="lp-enrich-icon">🗺️</div>
              <h4>Google Maps</h4>
              <p>Name, phone, address, rating, category</p>
              <span className="lp-enrich-stat">271 leads</span>
            </div>
            <div className="lp-enrich-arrow">→</div>
            <div className="lp-enrich-card lp-reveal">
              <div className="lp-enrich-icon">📧</div>
              <h4>Hunter.io</h4>
              <p>Verified email, decision maker name</p>
              <span className="lp-enrich-stat">1,203 emails verified</span>
            </div>
            <div className="lp-enrich-arrow">→</div>
            <div className="lp-enrich-card lp-reveal">
              <div className="lp-enrich-icon">🏢</div>
              <h4>Apollo.io</h4>
              <p>Job title, LinkedIn URL, company size, industry</p>
              <span className="lp-enrich-stat">847 decision makers found</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WORKFLOW DIAGRAM ===== */}
      <section className="lp-workflow" id="workflow">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">The <img src={logoDark} alt="Leadomation" className="lp-inline-logo" style={{ height: '1em' }} /> Workflow</span>
            <h2>Your Entire Outbound Engine, Automated</h2>
            <p>From market research to closed deal, with every step handled.</p>
          </div>
          <div className="lp-wf-container lp-reveal">
            {/* ROW 1 */}
            <div className="lp-wf-row">
              <div className="lp-wf-node lp-wf-n1">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">🎯</div>
                  <div className="lp-wf-node-label">Define Targets</div>
                  <div className="lp-wf-node-detail">Industry, location, size</div>
                  <div className="lp-wf-node-stat">∞ possibilities</div>
                </div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-1"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n2">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">🔍</div>
                  <div className="lp-wf-node-label">Scrape Leads</div>
                  <div className="lp-wf-node-detail">Google Maps extraction</div>
                  <div className="lp-wf-node-stat">2,847 leads found</div>
                </div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-2"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n3">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">✅</div>
                  <div className="lp-wf-node-label">Verify Emails</div>
                  <div className="lp-wf-node-detail">Hunter.io verification</div>
                  <div className="lp-wf-node-stat">98% deliverable</div>
                </div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-3"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n4">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">🧠</div>
                  <div className="lp-wf-node-label">Enrich Data</div>
                  <div className="lp-wf-node-detail">Decision-maker lookup</div>
                  <div className="lp-wf-node-stat">AI powered</div>
                </div>
              </div>
            </div>

            {/* VERTICAL CONNECTOR */}
            <div className="lp-wf-vertical">
              <svg className="lp-wf-svg-vline" viewBox="0 0 20 50"><line x1="10" y1="0" x2="10" y2="50" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-v"><animateMotion dur="1.5s" repeatCount="indefinite" path="M10,0 L10,50" /></circle></svg>
            </div>

            {/* ROW 2 */}
            <div className="lp-wf-row">
              <div className="lp-wf-node lp-wf-n5">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">✉️</div>
                  <div className="lp-wf-node-label">AI Writes Emails</div>
                  <div className="lp-wf-node-detail">Personalised per lead</div>
                  <div className="lp-wf-node-stat">34% open rate</div>
                </div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-4"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n6">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">💼</div>
                  <div className="lp-wf-node-label">LinkedIn Outreach</div>
                  <div className="lp-wf-node-detail">Connect + message</div>
                  <div className="lp-wf-node-stat">Auto-sequenced</div>
                </div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-5"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n7">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">📞</div>
                  <div className="lp-wf-node-label">AI Voice Call</div>
                  <div className="lp-wf-node-detail">Books meetings for you</div>
                  <div className="lp-wf-node-stat">Calendly integrated</div>
                </div>
                <div className="lp-wf-badge">PRO</div>
              </div>
              <div className="lp-wf-connector">
                <svg className="lp-wf-svg-line" viewBox="0 0 80 20"><line x1="0" y1="10" x2="80" y2="10" className="lp-wf-dash-line" /><circle r="4" className="lp-wf-travel-dot lp-td-6"><animateMotion dur="2s" repeatCount="indefinite" path="M0,10 L80,10" /></circle></svg>
              </div>
              <div className="lp-wf-node lp-wf-n8">
                <div className="lp-wf-glow"></div>
                <div className="lp-wf-node-inner">
                  <div className="lp-wf-node-icon">🎉</div>
                  <div className="lp-wf-node-label">Deal Closed</div>
                  <div className="lp-wf-node-detail">Pipeline → Won</div>
                  <div className="lp-wf-node-stat">£47K pipeline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VIDEO CTA ===== */}
      <section className="lp-video-section lp-reveal">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">See It In Action</span>
            <h2>Watch <img src={logoDark} alt="Leadomation" className="lp-inline-logo" /> Work</h2>
            <p>See how the full system works from first search to booked meeting.</p>
          </div>
          <div className="lp-video-wrapper" onClick={() => onNavigate('Register')}>
            <div className="lp-video-placeholder">
              <div className="lp-video-play">▶</div>
              <div className="lp-video-text">Product Demo Coming Soon: Get Early Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">Pricing</span>
            <h2>Simple Pricing. No Hidden Fees.</h2>
          </div>
          <div className="lp-pricing-grid lp-pricing-grid-3 lp-reveal">

            {/* STARTER */}
            <div className="lp-price-card">
              <div className="lp-price-header"><h3>Starter</h3>
                <div className="lp-price-amount"><span className="lp-price-currency">£</span><span className="lp-price-value">59</span><span className="lp-price-period">/month</span></div>
                <p className="lp-price-annual">or £566/year (save 20%)</p>
              </div>
              <ul className="lp-price-features">
                <li>Unlimited campaigns</li><li>300 leads per month</li><li>30 emails per day</li>
                <li>Email sequences up to 4 steps</li><li>25 keyword searches/month</li>
                <li>Lead database with search &amp; filters</li><li>6 pre-built email templates</li>
                <li>Email signature builder</li><li>Basic dashboard &amp; analytics</li>
                <li>CSV export</li><li>Spam checker</li><li>Intent scoring (basic)</li>
                <li>Integrations panel</li><li>Email config &amp; compliance tools</li>
              </ul>
              <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-outline lp-btn-full">Start Free Trial</button>
            </div>

            {/* PRO */}
            <div className="lp-price-card lp-price-featured">
              <div className="lp-price-badge">Most Popular</div>
              <div className="lp-price-header"><h3>Pro</h3>
                <div className="lp-price-amount"><span className="lp-price-currency">£</span><span className="lp-price-value">159</span><span className="lp-price-period">/month</span></div>
                <p className="lp-price-annual">or £1,526/year (save 20%)</p>
              </div>
              <p className="lp-price-includes">Everything in Starter, plus:</p>
              <ul className="lp-price-features">
                <li>Unlimited campaigns</li><li>2,000 leads per month</li><li>100 emails per day</li>
                <li>Unlimited sequence steps</li><li>75 keyword searches/month</li>
                <li><strong>🤖 50 AI voice calls/month</strong></li><li>LinkedIn Relationship Sequencer</li>
                <li>Global Demand Intelligence</li><li>Deal Pipeline / Kanban CRM</li><li>Unified Inbox</li>
                <li>AI email generation</li><li>A/B testing</li><li>Full intent scoring &amp; smart filters</li>
                <li>All 25 email templates</li><li>Advanced campaign analytics</li>
                <li>Multi-channel sequences</li><li>Spintax support</li><li>Priority support</li>
              </ul>
              <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-primary lp-btn-full">Start Free Trial</button>
            </div>

            {/* SCALE - COMING SOON */}
            <div className="lp-price-card lp-price-scale">
              <div className="lp-price-coming-soon-ribbon">Coming Soon</div>
              <div className="lp-price-header">
                <h3>Scale <span className="lp-scale-icon">✦</span></h3>
                <div className="lp-price-amount"><span className="lp-price-currency">£</span><span className="lp-price-value">359</span><span className="lp-price-period">/month</span></div>
                <p className="lp-price-annual">or £3,446/year (save 20%)</p>
              </div>
              <p className="lp-price-includes">Everything in Pro, plus:</p>
              <ul className="lp-price-features">
                <li>3,000 leads per month</li>
                <li>250 emails per day</li>
                <li>150 AI voice calls/month</li>
                <li>150 keyword searches/month</li>
                <li>💬 SMS Outreach (Twilio)</li>
                <li>📱 WhatsApp Outreach</li>
                <li>🔗 LinkedIn Sequencer</li>
                <li><strong>🎥 AI Video Prospecting</strong> <span className="lp-scale-new-badge">NEW</span></li>
                <li>30 AI-generated videos/month</li>
              </ul>
              <button onClick={() => setShowWaitlistModal(true)} className="lp-btn lp-btn-scale-notify lp-btn-full">
                🔔 Notify Me When Available
              </button>
            </div>

          </div>
          <p className="lp-pricing-scale-note lp-reveal">Scale tier launching soon. Join the waitlist above to be first in line.</p>
        </div>

        {/* WAITLIST MODAL */}
        {showWaitlistModal && (
          <div className="lp-modal-overlay" onClick={() => { setShowWaitlistModal(false); setWaitlistSubmitted(false); setWaitlistEmail(''); }}>
            <div className="lp-modal" onClick={(e) => e.stopPropagation()}>
              <button className="lp-modal-close" onClick={() => { setShowWaitlistModal(false); setWaitlistSubmitted(false); setWaitlistEmail(''); }}>✕</button>
              {!waitlistSubmitted ? (
                <>
                  <div className="lp-modal-icon">✦</div>
                  <h3>Join the Scale Waitlist</h3>
                  <p>Be the first to know when AI Video Prospecting, SMS &amp; WhatsApp outreach go live.</p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="lp-modal-input"
                  />
                  <button
                    className="lp-btn lp-btn-primary lp-btn-full"
                    onClick={() => { if (waitlistEmail) setWaitlistSubmitted(true); }}
                  >
                    Notify Me →
                  </button>
                </>
              ) : (
                <>
                  <div className="lp-modal-icon">🎉</div>
                  <h3>You're on the list!</h3>
                  <p>We'll notify you the moment Scale launches. Expect something special.</p>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {/* ===== TESTIMONIALS - Auto-scrolling carousel ===== */}
      <section className="lp-testimonials lp-reveal">
        <div className="lp-container">
          <div className="lp-section-header">
            <span className="lp-section-tag">Testimonials</span>
            <h2>What Early Users Say</h2>
          </div>
        </div>
        <div className="lp-testimonial-marquee">
          <div className="lp-testimonial-track">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="lp-testimonial-card">
                <div className="lp-stars">★★★★★</div>
                <p>"{t.text}"</p>
                <div className="lp-testimonial-author"><strong>{t.name}</strong><span>{t.role}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="lp-faq" id="faq">
        <div className="lp-container">
          <div className="lp-section-header lp-reveal">
            <span className="lp-section-tag">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="lp-faq-list lp-reveal">
            {faqs.map((faq, i) => (
              <div key={i} className={`lp-faq-item ${openFaq === i ? 'lp-faq-open' : ''}`}>
                <button className="lp-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span className="lp-faq-toggle">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="lp-faq-answer"><p>{faq.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="lp-cta">
        <div className="lp-container">
          <div className="lp-cta-inner lp-reveal">
            <h2>Ready to Automate Your Lead Generation?</h2>
            <p>Join hundreds of businesses using Leadomation to find, reach, and close B2B leads on autopilot.</p>
            <button onClick={() => onNavigate('Register')} className="lp-btn lp-btn-light lp-btn-lg">Get Started Free →</button>
            <p className="lp-cta-note">Secure your trial with a card. Cancel anytime before day 7.</p>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-left">
              <img src={logoDark} alt="Leadomation" className="lp-footer-logo" />
              <p>B2B lead generation on autopilot.</p>
              <div className="lp-social-icons">
                <a href="#" aria-label="LinkedIn" className="lp-social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="#" aria-label="X / Twitter" className="lp-social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" aria-label="Instagram" className="lp-social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="#" aria-label="Facebook" className="lp-social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" aria-label="YouTube" className="lp-social-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
            <div className="lp-footer-right">
              <div className="lp-footer-col">
                <h4>Product</h4>
                <button onClick={() => scrollTo('features')}>Features</button>
                <button onClick={() => scrollTo('pricing')}>Pricing</button>
                <button onClick={() => scrollTo('faq')}>FAQ</button>
              </div>
              <div className="lp-footer-col">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
              <div className="lp-footer-col">
                <h4>Support</h4>
                <a href="#">Contact</a>
                <a href="#">Help Centre</a>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <p>© 2026 Leadomation by Lumarr Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
