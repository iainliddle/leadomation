import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoDark from '../assets/logo-full.png';
import './LandingPage.css';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // GSAP scroll animations
  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.lp-gsap-fade').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        });
      });

      gsap.utils.toArray<HTMLElement>('.lp-bento').forEach((grid) => {
        const cards = grid.querySelectorAll('.lp-bento-card');
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
          },
        });
      });

      gsap.from('.lp-intel-field', {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.lp-intel-section',
          start: 'top 70%',
        },
      });

      gsap.utils.toArray<HTMLElement>('.lp-swirl-blob').forEach((blob) => {
        gsap.fromTo(blob,
          { scale: 0.8 },
          {
            scale: 1.2,
            scrollTrigger: {
              trigger: '.lp-swirl-divider',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const logos = [
    'Google Maps', 'Hunter.io', 'LinkedIn', 'Microsoft 365',
    'Stripe', 'Supabase', 'Unipile', 'Vapi.ai', 'Apollo', 'Resend',
  ];

  const faqs = [
    {
      q: 'How does Leadomation find leads?',
      a: 'We scrape Google Maps for businesses matching your target industry and location, then enrich each lead with verified decision maker emails, phone numbers and LinkedIn profiles using Hunter.io and Apollo.',
    },
    {
      q: 'Is there a free trial?',
      a: 'Yes. 7 day free trial on all plans. Secure with a card, cancel anytime before day 7 and you will not be charged.',
    },
    {
      q: 'What outreach channels does Leadomation support?',
      a: 'Email sequences, LinkedIn connection requests and InMail, and AI voice calling via Vapi. The Full Pipeline plan combines all three.',
    },
    {
      q: 'How does the AI voice calling work?',
      a: 'You build an 8 step call script in the Call Agent. Leadomation\'s AI agent calls your leads, handles objections and books meetings directly into your calendar.',
    },
    {
      q: 'Is my data safe?',
      a: 'Yes. All data is encrypted at rest and in transit. We are GDPR compliant and store data on EU servers via Supabase.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. Cancel from your account settings at any time. No lock in contracts.',
    },
  ];

  return (
    <div className="lp-page" ref={pageRef}>
      {/* ========== 1. NAV ========== */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <a href="/" className="lp-nav-logo">
            <img src={logoDark} alt="Leadomation" />
          </a>
          <div className="lp-nav-links">
            <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('how'); }}>How it works</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
            <Link to="/blog">Blog</Link>
            <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
          </div>
          <div className="lp-nav-actions">
            <button className="lp-nav-signin" onClick={() => onNavigate('Login')}>Sign in</button>
            <button className="lp-btn-primary" onClick={() => onNavigate('Register')}>Start free trial</button>
          </div>
          <button
            className={`lp-hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`lp-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('how'); }}>How it works</a>
        <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
        <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
        <Link to="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
        <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
        <button onClick={() => { setMobileOpen(false); onNavigate('Login'); }}>Sign in</button>
        <button className="lp-btn-primary" onClick={() => { setMobileOpen(false); onNavigate('Register'); }}>Start free trial</button>
      </div>

      {/* ========== 2. HERO ========== */}
      <section className="lp-hero">
        <div className="lp-hero-gradient-bg" />
        <div className="lp-container">
          <div className="lp-hero-content">
            <h1>
              Turn cold leads<br />
              into booked calls.<br />
              Automatically.
            </h1>
            <p className="lp-hero-sub">
              Leadomation finds and enriches your leads, writes personalised outreach,
              automates LinkedIn and calls prospects with an AI voice agent.
            </p>
            <div className="lp-hero-buttons">
              <button className="lp-btn-primary" onClick={() => onNavigate('Register')}>
                Get started free
              </button>
              <button className="lp-btn-secondary" onClick={() => scrollTo('how')}>
                See how it works
              </button>
            </div>
            <p className="lp-hero-trust">Secure your trial with a card. Cancel anytime before day 7.</p>
          </div>

          {/* Dashboard mockup */}
          <div className="lp-dashboard-mockup lp-gsap-fade">
            <div className="lp-browser-bar">
              <div className="lp-browser-dots">
                <div className="lp-browser-dot red" />
                <div className="lp-browser-dot yellow" />
                <div className="lp-browser-dot green" />
              </div>
              <div className="lp-browser-url">app.leadomation.co.uk/dashboard</div>
            </div>
            <div className="lp-browser-content">
              <div className="lp-mock-sidebar">
                <div className="lp-mock-sidebar-brand">Leadomation</div>
                {['Dashboard', 'Global Demand', 'New Campaign', 'Lead Database', 'Deal Pipeline', 'Sequence Builder', 'Inbox'].map((item, i) => (
                  <div key={i} className={`lp-mock-nav-item ${i === 0 ? 'active' : ''}`}>
                    <div className="lp-mock-nav-icon" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="lp-mock-main">
                <div className="lp-mock-stats">
                  {[
                    { label: 'Total Leads', value: '271', trend: '+12%' },
                    { label: 'Leads with Emails', value: '31', trend: '+8%' },
                    { label: 'Leads Contacted', value: '0', trend: '' },
                    { label: 'Total Deals', value: '10', trend: '+3' },
                  ].map((s, i) => (
                    <div key={i} className="lp-mock-stat-card">
                      <div className="lp-mock-stat-label">{s.label}</div>
                      <div className="lp-mock-stat-value">{s.value}</div>
                      {s.trend && <div className="lp-mock-stat-trend">{s.trend}</div>}
                    </div>
                  ))}
                </div>
                <div className="lp-mock-bottom">
                  <div className="lp-mock-chart">
                    <div className="lp-mock-chart-title">Campaign Performance</div>
                    <div className="lp-mock-chart-area">
                      <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon
                          points="0,80 40,70 80,65 120,55 160,60 200,45 240,35 280,30 320,20 360,15 400,10 400,100 0,100"
                          fill="url(#chartGrad)"
                        />
                        <polyline
                          points="0,80 40,70 80,65 120,55 160,60 200,45 240,35 280,30 320,20 360,15 400,10"
                          fill="none"
                          stroke="#22D3EE"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="lp-mock-campaigns">
                    <div className="lp-mock-chart-title">Top Campaigns</div>
                    {[
                      { name: 'Dental Clinics', rate: '6.74%', width: '30%' },
                      { name: 'Law Firms', rate: '11.22%', width: '55%' },
                      { name: 'Plumbers Edinburgh', rate: '0%', width: '10%' },
                    ].map((c, i) => (
                      <div key={i} className="lp-mock-campaign-item">
                        <div className="lp-mock-campaign-name-row">
                          <span className="lp-mock-campaign-name">{c.name}</span>
                          <span className="lp-mock-campaign-rate">{c.rate}</span>
                        </div>
                        <div className="lp-mock-campaign-bar" style={{ width: c.width }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3. LOGO BAR ========== */}
      <section className="lp-logos">
        <div className="lp-logos-label lp-gsap-fade">Powered by industry leaders</div>
        <div className="lp-logos-track">
          {[0, 1].map((set) => (
            <div key={set} className="lp-logos-set">
              {logos.map((name, i) => (
                <div key={`${set}-${i}`} className="lp-logo-item">
                  <div className="lp-logo-icon" style={{ background: 'rgba(79,70,229,0.08)', color: '#4F46E5', fontSize: 12, fontWeight: 700 }}>
                    {name.charAt(0)}
                  </div>
                  {name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ========== 4. HOW IT WORKS ========== */}
      <section className="lp-how" id="how">
        <div className="lp-container">
          <div className="lp-section-eyebrow lp-gsap-fade">How it works</div>
          <h2 className="lp-section-heading lp-gsap-fade">From zero to booked calls in minutes</h2>
          <div className="lp-how-grid">
            {[
              {
                num: '1',
                title: 'Launch a campaign',
                desc: 'Choose your target industry and location. Leadomation scrapes Google Maps and enriches every lead with verified emails and decision maker data automatically.',
              },
              {
                num: '2',
                title: 'AI writes your outreach',
                desc: 'Personalised email sequences, LinkedIn connection requests and AI voice call scripts generated for each prospect based on their business profile.',
              },
              {
                num: '3',
                title: 'Replies land in your inbox',
                desc: 'AI classifies every reply as Interested, Not Interested or Out of Office. Hot leads get pushed straight to your Deal Pipeline.',
              },
            ].map((step, i) => (
              <div key={i} className="lp-how-step lp-gsap-fade">
                <div className="lp-how-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 5. LIGHT BENTO SECTION ========== */}
      <section className="lp-features-section" id="features">
        <div className="lp-container">
          <div className="lp-section-eyebrow lp-gsap-fade">Features</div>
          <h2 className="lp-section-heading lp-gsap-fade">Know more about your prospects than they expect</h2>
          <p className="lp-features-sub lp-gsap-fade">
            One platform replaces your lead scraper, email tool, LinkedIn outreach and AI calling software.
          </p>

          <div className="lp-bento">
            {/* Card 1 - Lead Database - col-span-3 */}
            <div className="lp-bento-card lp-bento-span-3 lp-bento-rtl">
              <div className="lp-bento-graphic" style={{ background: '#fff' }}>
                <table className="lp-lead-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Intent</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="company-name">Dunmore Dental Care</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <br /><span className="company-role">Practice Owner</span>
                      </td>
                      <td><span className="status-badge status-contacted">CONTACTED</span></td>
                      <td><span className="intent-badge intent-hot">Hot · 63</span></td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Smile Clinic Northwest</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <br /><span className="company-role">Clinical Director</span>
                      </td>
                      <td><span className="status-badge status-replied">REPLIED</span></td>
                      <td><span className="intent-badge intent-hot">Hot · 95</span></td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Bright Smile Kent</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <br /><span className="company-role">Practice Owner</span>
                      </td>
                      <td><span className="status-badge status-contacted">CONTACTED</span></td>
                      <td><span className="intent-badge intent-hot">Hot · 76</span></td>
                    </tr>
                  </tbody>
                </table>
                <div className="lp-bento-fade" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Lead database</div>
                <div className="lp-bento-title">271 enriched leads ready to contact</div>
                <p className="lp-bento-desc">Verified emails, phone numbers, intent scores and decision maker contacts. Filter by Hot, Warm or Cool in one click.</p>
              </div>
            </div>

            {/* Card 2 - Campaign Builder - col-span-3 */}
            <div className="lp-bento-card lp-bento-span-3 lp-bento-rtr">
              <div className="lp-bento-graphic">
                <div className="lp-wizard-graphic">
                  <div className="lp-wizard-steps">
                    {['Campaign details', 'Advanced targeting', 'Intent filters', 'Data enrichment', 'Outreach config'].map((step, i) => (
                      <div key={i} className={`lp-wizard-step ${i === 0 ? 'active' : ''}`}>
                        <span className="lp-wizard-step-num">{i + 1}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                  <div className="lp-campaign-types">
                    <div className="lp-campaign-type">Local Businesses</div>
                    <div className="lp-campaign-type selected">B2B Services</div>
                    <div className="lp-campaign-type">Custom Search</div>
                  </div>
                </div>
                <div className="lp-bento-fade" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Campaign builder</div>
                <div className="lp-bento-title">Launch a campaign in 3 minutes</div>
                <p className="lp-bento-desc">5 step wizard. Pick industry, location, intent filters, enrichment and outreach strategy. Leadomation handles the rest.</p>
              </div>
            </div>

            {/* Card 3 - Intent Scoring - col-span-2 */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rbl">
              <div className="lp-bento-graphic">
                <div className="lp-intent-graphic">
                  <div className="lp-intent-pill hot">
                    <span>🔥</span> Hot <span style={{ marginLeft: 'auto' }}>95</span>
                  </div>
                  <div className="lp-intent-pill warm">
                    <span>⚡</span> Warm <span style={{ marginLeft: 'auto' }}>72</span>
                  </div>
                  <div className="lp-intent-pill cool">
                    <span>💧</span> Cool <span style={{ marginLeft: 'auto' }}>45</span>
                  </div>
                </div>
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Intent scoring</div>
                <div className="lp-bento-title">Know who is ready to buy</div>
                <p className="lp-bento-desc">Every lead scored automatically based on buying signals, reviews and online presence.</p>
              </div>
            </div>

            {/* Card 4 - AI Voice Calling - col-span-2, navy */}
            <div className="lp-bento-card lp-bento-span-2 navy-card">
              <div className="lp-bento-graphic">
                <div className="lp-voice-graphic">
                  <div className="lp-voice-phone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="lp-voice-pulse" />
                  </div>
                  <div className="lp-voice-dot" />
                  <div className="lp-voice-label">AI Call Agent</div>
                </div>
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">AI voice calling</div>
                <div className="lp-bento-title">Your AI agent calls prospects 24/7</div>
                <p className="lp-bento-desc">Handles objections, answers questions and books meetings directly into your calendar.</p>
              </div>
            </div>

            {/* Card 5 - LinkedIn Sequencer - col-span-2 */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rbr">
              <div className="lp-bento-graphic">
                <div className="lp-phases-graphic">
                  {[
                    { n: '1', label: 'Silent Awareness', active: true },
                    { n: '2', label: 'Connection', active: false },
                    { n: '3', label: 'Warm Thanks', active: false },
                    { n: '4', label: 'Advice Ask', active: false },
                    { n: '5', label: 'Follow Up', active: false },
                    { n: '6', label: 'Soft Offer', active: false },
                  ].map((p, i, arr) => (
                    <React.Fragment key={i}>
                      <div className="lp-phase">
                        <div className={`lp-phase-dot ${p.active ? 'active' : 'inactive'}`}>{p.n}</div>
                        <span className="lp-phase-label">{p.label}</span>
                      </div>
                      {i < arr.length - 1 && <div className="lp-phase-connector" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">LinkedIn sequencer</div>
                <div className="lp-bento-title">35 day LinkedIn funnel on autopilot</div>
                <p className="lp-bento-desc">Silent Awareness through to Soft Offer. Runs automatically, builds trust before making any ask.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 6. DARK BENTO SECTION ========== */}
      <div className="lp-dark-section">
        <div className="lp-container">
          <div className="lp-section-eyebrow dark lp-gsap-fade">Outreach</div>
          <h2 className="lp-section-heading dark lp-gsap-fade">Close deals faster with AI</h2>

          <div className="lp-bento">
            {/* Dark Card 1 - Inbox - col-span-4 */}
            <div className="lp-bento-card lp-bento-span-4 dark-card lp-bento-rtl">
              <div className="lp-bento-graphic">
                <div className="lp-inbox-graphic">
                  <div className="lp-inbox-list">
                    {[
                      { name: 'London Smile Studio', status: 'interested' },
                      { name: 'Smile Clinic Northwest', status: 'interested' },
                      { name: 'Blackwell Partners', status: 'interested' },
                      { name: 'Forsyth Family Law', status: 'not-interested' },
                    ].map((item, i) => (
                      <div key={i} className="lp-inbox-item">
                        <div className="lp-inbox-item-name">{item.name}</div>
                        <span className={`lp-inbox-item-status ${item.status}`}>
                          {item.status === 'interested' ? 'Interested' : 'Not interested'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="lp-inbox-preview">
                    <div className="lp-inbox-preview-from">From: London Smile Studio</div>
                    <div className="lp-inbox-preview-text">
                      Hi, thanks for reaching out. We have been looking for exactly this kind of service. Could we schedule a call this week to discuss pricing?
                    </div>
                  </div>
                </div>
                <div className="lp-bento-fade-top" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Inbox</div>
                <div className="lp-bento-title">Every reply classified automatically</div>
                <p className="lp-bento-desc">AI reads every email and LinkedIn reply. Interested, Not Interested or Out of Office. Hot leads pushed to your pipeline instantly.</p>
              </div>
            </div>

            {/* Dark Card 2 - Deal Pipeline - col-span-2 */}
            <div className="lp-bento-card lp-bento-span-2 dark-card lp-bento-rtr">
              <div className="lp-bento-graphic">
                <div className="lp-dark-kanban">
                  {[
                    { title: 'New Reply', color: '#22D3EE', cards: [{ name: 'Owen Dental', value: '£850' }] },
                    { title: 'Qualified', color: '#4F46E5', cards: [{ name: 'Donovan Sol.', value: '£950' }] },
                    { title: 'Proposal', color: '#3B82F6', cards: [{ name: 'Carter Law', value: '£1,200' }] },
                    { title: 'Negotiating', color: '#F59E0B', cards: [{ name: 'Apex Fin.', value: '£2,100' }] },
                    { title: 'Won', color: '#10B981', cards: [{ name: 'Smile Clinic', value: '£1,500' }] },
                    { title: 'Lost', color: '#EF4444', cards: [] },
                  ].map((col, i) => (
                    <div key={i} className="lp-dark-kanban-col">
                      <div className="lp-dark-kanban-header" style={{ borderColor: col.color, color: col.color }}>{col.title}</div>
                      {col.cards.map((c, j) => (
                        <div key={j} className="lp-dark-kanban-card">
                          {c.name}
                          <div className="lp-dark-kanban-value">{c.value}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="lp-bento-fade-top" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Deal pipeline</div>
                <div className="lp-bento-title">Built in CRM</div>
                <p className="lp-bento-desc">Kanban pipeline with 6 stages. £15,600 total pipeline value tracked automatically.</p>
              </div>
            </div>

            {/* Dark Card 3 - Keyword Monitor - col-span-2 */}
            <div className="lp-bento-card lp-bento-span-2 dark-card lp-bento-rbl">
              <div className="lp-bento-graphic">
                <div className="lp-keyword-graphic">
                  <div className="lp-keyword-monitor">
                    <div className="lp-keyword-monitor-header">Active monitor 1</div>
                    <div className="lp-keyword-chips">
                      <span className="lp-keyword-chip">law firm marketing</span>
                      <span className="lp-keyword-chip">legal SEO</span>
                    </div>
                  </div>
                  <div className="lp-keyword-monitor">
                    <div className="lp-keyword-monitor-header">Active monitor 2</div>
                    <div className="lp-keyword-chips">
                      <span className="lp-keyword-chip">solicitor client acquisition</span>
                      <span className="lp-keyword-chip">law firm growth</span>
                    </div>
                  </div>
                </div>
                <div className="lp-bento-fade-top" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Keyword monitor</div>
                <div className="lp-bento-title">Catch buyers on LinkedIn</div>
                <p className="lp-bento-desc">Monitor keywords every 2 hours. Prospects posting about your service get auto enrolled as hot leads.</p>
              </div>
            </div>

            {/* Dark Card 4 - Performance Analyser - col-span-4 */}
            <div className="lp-bento-card lp-bento-span-4 dark-card lp-bento-rbr">
              <div className="lp-bento-graphic">
                <div className="lp-perf-graphic">
                  <div className="lp-perf-circle">
                    <div className="lp-perf-circle-inner">78</div>
                  </div>
                  <div className="lp-perf-bars-area">
                    <div className="lp-perf-bar-row">
                      <div className="lp-perf-bar-label">Subject lines with questions</div>
                      <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill indigo" style={{ width: '82%' }} /></div>
                    </div>
                    <div className="lp-perf-bar-row">
                      <div className="lp-perf-bar-label">Personalised openers</div>
                      <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill cyan" style={{ width: '65%' }} /></div>
                    </div>
                    <div className="lp-perf-bar-row">
                      <div className="lp-perf-bar-label">Generic templates</div>
                      <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill blue" style={{ width: '30%' }} /></div>
                    </div>
                    <div className="lp-perf-insight-pills">
                      <span className="lp-perf-insight-pill">Tuesday to Thursday best</span>
                      <span className="lp-perf-insight-pill">More personalisation needed</span>
                    </div>
                  </div>
                </div>
                <div className="lp-bento-fade-top" />
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Performance analyser</div>
                <div className="lp-bento-title">Gets smarter every campaign</div>
                <p className="lp-bento-desc">Studies your email data every 6 hours. Sends you personalised improvement reports. The longer you use it, the better your results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 7. LEAD INTELLIGENCE ========== */}
      <section className="lp-intel-section" id="intelligence">
        <div className="lp-container">
          <div className="lp-intel-grid">
            <div className="lp-intel-copy">
              <div className="lp-section-eyebrow lp-gsap-fade">Lead intelligence</div>
              <h2 className="lp-section-heading lp-gsap-fade">Know your lead before you contact them</h2>
              <p className="lp-intel-desc lp-gsap-fade">
                Lead Intelligence researches every prospect automatically. Pain points, buying signals, outreach angles and a personalised subject line. Generated in seconds.
              </p>
              <div className="lp-pro-badge lp-gsap-fade">Pro feature</div>
            </div>
            <div className="lp-intel-card">
              <div className="lp-intel-card-header lp-intel-field">Lead Intelligence Report</div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Opportunity Rating</div>
                <div className="lp-intel-row-value"><span className="lp-intel-hot-badge">Hot</span></div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Pain Intensity</div>
                <div className="lp-intel-row-value">7 / 10</div>
                <div className="lp-intel-progress-bar">
                  <div className="lp-intel-progress-fill" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Pain Point</div>
                <div className="lp-intel-row-value">No online booking system. Losing walk in customers to competitors with digital scheduling.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Outreach Angle</div>
                <div className="lp-intel-row-value">Position as a quick win digital upgrade. Reference their 4.8 star Google rating.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Personalisation Hook</div>
                <div className="lp-intel-row-value">Mention their recent expansion to a second location.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Suggested Subject Line</div>
                <div className="lp-intel-row-value lp-intel-subject">Quick fix for your booking gap</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">Suggested Opening Line</div>
                <div className="lp-intel-row-value lp-intel-opening">I noticed your second location just opened...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 8. SWIRL DIVIDER ========== */}
      <section className="lp-swirl-divider">
        <div className="lp-swirl-blob lp-swirl-blob-1" />
        <div className="lp-swirl-blob lp-swirl-blob-2" />
        <div className="lp-swirl-blob lp-swirl-blob-3" />
        <div className="lp-swirl-text">
          <p className="lp-swirl-quote">"The longer you use Leadomation, the better your results get."</p>
          <p className="lp-swirl-sub">Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.</p>
        </div>
      </section>

      {/* ========== 9. PRICING ========== */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-container">
          <div className="lp-pricing-header">
            <div className="lp-section-eyebrow lp-gsap-fade" style={{ textAlign: 'center' }}>Pricing</div>
            <h2 className="lp-section-heading lp-gsap-fade" style={{ textAlign: 'center', marginBottom: 0, maxWidth: 'none' }}>Simple, transparent pricing</h2>
            <div className="lp-pricing-toggle lp-gsap-fade">
              <button className={`lp-toggle-option ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`lp-toggle-option ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)}>
                Annual <span className="lp-toggle-save">20% off</span>
              </button>
            </div>
          </div>

          <div className="lp-pricing-grid">
            {/* Starter */}
            <div className="lp-price-card lp-gsap-fade">
              <div className="lp-price-name">Starter</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">&pound;</span>
                <span className="lp-price-value">{annual ? '47' : '59'}</span>
                <span className="lp-price-period">/mo</span>
              </div>
              <div className="lp-price-annual-note">{annual ? 'Billed annually at \u00A3566' : 'Billed monthly'}</div>
              <ul className="lp-price-features">
                {['500 leads per month', 'Email sequences', 'Basic enrichment', 'Lead scoring', 'Email support'].map((f, i) => (
                  <li key={i}><span className="lp-price-check">&#10003;</span> {f}</li>
                ))}
              </ul>
              <button className="lp-price-cta outline" onClick={() => onNavigate('Register')}>Start free trial</button>
            </div>

            {/* Pro */}
            <div className="lp-price-card popular lp-gsap-fade">
              <div className="lp-price-popular-badge">Most popular</div>
              <div className="lp-price-name">Pro</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">&pound;</span>
                <span className="lp-price-value">{annual ? '127' : '159'}</span>
                <span className="lp-price-period">/mo</span>
              </div>
              <div className="lp-price-annual-note">{annual ? 'Billed annually at \u00A31,526' : 'Billed monthly'}</div>
              <ul className="lp-price-features">
                {[
                  '2,000 leads per month',
                  'Everything in Starter',
                  'LinkedIn sequences',
                  'AI voice calling',
                  'Lead Intelligence (50/day)',
                  'A/B testing',
                  'Campaign Performance Analyser',
                  'Priority support',
                ].map((f, i) => (
                  <li key={i}><span className="lp-price-check">&#10003;</span> {f}</li>
                ))}
              </ul>
              <button className="lp-price-cta primary" onClick={() => onNavigate('Register')}>Start free trial</button>
            </div>

            {/* Scale */}
            <div className="lp-price-card greyed lp-gsap-fade">
              <div className="lp-price-name">Scale</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">&pound;</span>
                <span className="lp-price-value">{annual ? '287' : '359'}</span>
                <span className="lp-price-period">/mo</span>
              </div>
              <div className="lp-price-annual-note">Coming soon</div>
              <ul className="lp-price-features">
                {['Unlimited leads', 'Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'].map((f, i) => (
                  <li key={i}><span className="lp-price-check">&#10003;</span> {f}</li>
                ))}
              </ul>
              <button className="lp-price-cta waitlist">Join waitlist</button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 10. FAQ ========== */}
      <section className="lp-faq" id="faq">
        <div className="lp-container">
          <div className="lp-faq-header">
            <h2 className="lp-section-heading lp-gsap-fade" style={{ textAlign: 'center', maxWidth: 'none' }}>Frequently asked questions</h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`lp-faq-item lp-gsap-fade ${openFaq === i ? 'open' : ''}`}>
                <button className="lp-faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className="lp-faq-chevron">&#9662;</span>
                </button>
                <div className="lp-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 11. CTA ========== */}
      <section className="lp-cta">
        <div className="lp-container">
          <h2 className="lp-gsap-fade">Ready to fill your pipeline?</h2>
          <p className="lp-cta-sub lp-gsap-fade">
            Join hundreds of B2B teams using Leadomation to find leads and close deals automatically.
          </p>
          <button className="lp-cta-btn lp-gsap-fade" onClick={() => onNavigate('Register')}>
            Start your free trial
          </button>
          <p className="lp-cta-note lp-gsap-fade">No credit card required for first 7 days</p>
        </div>
      </section>

      {/* ========== 12. FOOTER ========== */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <img src={logoDark} alt="Leadomation" />
              <p className="lp-footer-tagline">
                B2B lead generation and outreach automation. Find leads, enrich contacts and close deals on autopilot.
              </p>
            </div>
            <div>
              <div className="lp-footer-col-title">Product</div>
              <div className="lp-footer-links">
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('features'); }}>Features</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('pricing'); }}>Pricing</a>
                <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('how'); }}>How it works</a>
                <Link to="/blog">Blog</Link>
              </div>
            </div>
            <div>
              <div className="lp-footer-col-title">Company</div>
              <div className="lp-footer-links">
                <a href="#" onClick={(e) => e.preventDefault()}>About</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Careers</a>
              </div>
            </div>
            <div>
              <div className="lp-footer-col-title">Legal</div>
              <div className="lp-footer-links">
                <button onClick={() => onNavigate('Privacy')}>Privacy Policy</button>
                <button onClick={() => onNavigate('Terms')}>Terms of Service</button>
                <a href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            &copy; 2026 Leadomation by Lumarr Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
