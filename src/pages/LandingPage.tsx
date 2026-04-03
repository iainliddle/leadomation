import React, { useEffect, useRef, useState, useCallback } from 'react';
import logoDark from '../assets/logo-full.png';
import heroSwirl from '../assets/hero-swirl.png';
import './LandingPage.css';

// ---- IntersectionObserver hook ----
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lp-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    const targets = el.querySelectorAll('.lp-animate');
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [annual, setAnnual] = useState(false);
  const revealRef = useScrollReveal();

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="lp-page" ref={revealRef}>
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
            <a href="/blog">Blog</a>
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
        <a href="/blog">Blog</a>
        <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
        <button onClick={() => { setMobileOpen(false); onNavigate('Login'); }}>Sign in</button>
        <button className="lp-btn-primary" onClick={() => { setMobileOpen(false); onNavigate('Register'); }}>Start free trial</button>
      </div>

      {/* ========== 2. HERO ========== */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-grid">
            <div className="lp-hero-content">
              <div className="lp-hero-badge">B2B Lead Generation on Autopilot</div>
              <h1>
                Turn Cold Leads into<br />Booked Calls.<br />
                <span className="lp-hero-gradient">Automatically.</span>
              </h1>
              <p className="lp-hero-sub">
                Leadomation finds and enriches your leads, writes personalised outreach,
                automates LinkedIn and calls prospects with an AI Voice Agent.
              </p>
              <div className="lp-hero-buttons">
                <button className="lp-btn-primary" onClick={() => onNavigate('Register')}>
                  Get started free &rarr;
                </button>
                <button className="lp-btn-outline" onClick={() => scrollTo('how')}>
                  See how it works
                </button>
              </div>
              <p className="lp-hero-trust">Secure your trial with a card. Cancel anytime before day 7.</p>
            </div>
            <div className="lp-hero-visual">
              <img src={heroSwirl} alt="" className="lp-hero-swirl" />
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="lp-dashboard-mockup lp-animate">
            <div className="lp-browser-frame">
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
                        <div className="lp-mock-chart-line" />
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
        </div>
      </section>

      {/* ========== 3. LOGO BAR ========== */}
      <section className="lp-logos">
        <div className="lp-logos-label">Powered by industry leaders</div>
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
          <div className="lp-section-label lp-animate">HOW IT WORKS</div>
          <h2 className="lp-section-title lp-animate">From zero to booked calls in minutes</h2>
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
              <div key={i} className={`lp-how-step lp-animate lp-animate-delay-${i + 1}`}>
                <div className="lp-how-number">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 5. BENTO FEATURES ========== */}
      <section className="lp-features" id="features">
        <div className="lp-container">
          <div className="lp-section-label lp-animate">FEATURES</div>
          <h2 className="lp-section-title lp-animate">Everything you need to close more deals</h2>
          <p className="lp-features-sub lp-animate">
            One platform replaces your lead scraper, email tool, LinkedIn outreach and AI calling software.
          </p>

          <div className="lp-bento">
            {/* Lead Database - LARGE */}
            <div className="lp-bento-card lp-bento-lg lp-animate">
              <h3>Lead Database</h3>
              <p>271 enriched leads with verified emails, phone numbers, intent scores and decision maker contacts. Filter by Hot, Warm or Cool intent in one click.</p>
              <table className="lp-bento-table">
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
                      <span className="company-name">Dunmore Dental Care</span>{' '}
                      <span className="enriched-badge">ENRICHED</span>
                      <br /><span className="company-role">Practice Owner</span>
                    </td>
                    <td><span className="status-badge status-contacted">CONTACTED</span></td>
                    <td><span className="intent-badge intent-warm">Warm 63</span></td>
                  </tr>
                  <tr>
                    <td>
                      <span className="company-name">Smile Clinic Northwest</span>{' '}
                      <span className="enriched-badge">ENRICHED</span>
                      <br /><span className="company-role">Clinical Director</span>
                    </td>
                    <td><span className="status-badge status-replied">REPLIED</span></td>
                    <td><span className="intent-badge intent-hot">Hot 95</span></td>
                  </tr>
                  <tr>
                    <td>
                      <span className="company-name">Bright Smile Kent</span>{' '}
                      <span className="enriched-badge">ENRICHED</span>
                      <br /><span className="company-role">Practice Owner</span>
                    </td>
                    <td><span className="status-badge status-contacted">CONTACTED</span></td>
                    <td><span className="intent-badge intent-hot">Hot 76</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Intent Scoring - SMALL */}
            <div className="lp-bento-card lp-bento-sm dark-indigo lp-animate lp-animate-delay-1">
              <h3>Intent Scoring</h3>
              <p>Every lead scored Hot, Warm, Cool or Cold based on buying signals, reviews and online presence.</p>
              <div className="lp-intent-pills">
                <div className="lp-intent-pill hot">Hot</div>
                <div className="lp-intent-pill warm">Warm</div>
                <div className="lp-intent-pill cool">Cool</div>
              </div>
            </div>

            {/* AI Voice - SMALL */}
            <div className="lp-bento-card lp-bento-sm dark-navy lp-animate lp-animate-delay-2" style={{ gridColumn: 'span 2' }}>
              <h3>AI Voice Calling</h3>
              <p>Your AI agent calls prospects, handles objections and books meetings. 24/7.</p>
              <div className="lp-voice-visual">
                <div className="lp-phone-icon">
                  <span role="img" aria-label="phone">📞</span>
                  <div className="lp-phone-pulse" />
                </div>
                <div className="lp-pulse-dot" />
              </div>
            </div>

            {/* Campaign Builder - LARGE */}
            <div className="lp-bento-card lp-bento-lg lp-animate lp-animate-delay-1">
              <h3>Campaign Builder</h3>
              <p>5 step campaign wizard. Pick your industry, location, intent filters, enrichment options and outreach strategy. Launch in under 3 minutes.</p>
              <div className="lp-wizard-steps">
                {['Campaign details', 'Advanced targeting', 'Intent filters', 'Data enrichment', 'Outreach config'].map((step, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="lp-wizard-arrow">&rarr;</span>}
                    <div className={`lp-wizard-step ${i === 0 ? 'active' : ''}`}>{step}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* LinkedIn Sequencer - SMALL (but span 2) */}
            <div className="lp-bento-card lp-animate lp-animate-delay-2" style={{ gridColumn: 'span 2' }}>
              <h3>LinkedIn Sequencer</h3>
              <p>35 day LinkedIn funnel. Silent Awareness, Connection, Warm Thanks, Advice Ask, Soft Offer. Runs automatically.</p>
              <div className="lp-phases">
                {[
                  { n: '1', label: 'Silent Awareness', active: true },
                  { n: '2', label: 'Connection', active: false },
                  { n: '3', label: 'Warm Thanks', active: false },
                  { n: '4', label: 'Advice Ask', active: false },
                  { n: '5', label: 'Follow Up', active: false },
                  { n: '6', label: 'Soft Offer', active: false },
                ].map((p, i) => (
                  <div key={i} className="lp-phase">
                    <div className={`lp-phase-dot ${p.active ? 'active' : 'inactive'}`}>{p.n}</div>
                    <span className="lp-phase-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deal Pipeline - MEDIUM */}
            <div className="lp-bento-card lp-bento-md lp-animate lp-animate-delay-3">
              <h3>Deal Pipeline</h3>
              <p>Kanban CRM built in. Track deals from New Reply to Won.</p>
              <div className="lp-mini-kanban">
                {[
                  { title: 'New Reply', color: '#4F46E5', cards: [{ name: 'Owen Dental', amount: '850' }] },
                  { title: 'Qualified', color: '#F59E0B', cards: [{ name: 'Donovan Sol.', amount: '950' }] },
                  { title: 'Won', color: '#10B981', cards: [{ name: 'Smile Clinic', amount: '1,200' }, { name: 'Rivington', amount: '1,800' }] },
                ].map((col, i) => (
                  <div key={i} className="lp-kanban-col">
                    <div className="lp-kanban-col-header" style={{ borderColor: col.color, color: col.color }}>{col.title}</div>
                    {col.cards.map((c, j) => (
                      <div key={j} className="lp-kanban-card-mini">
                        {c.name}
                        <div className="lp-kanban-amount">&pound;{c.amount}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Email Templates - SMALL */}
            <div className="lp-bento-card lp-bento-sm light-indigo lp-animate lp-animate-delay-4" style={{ gridColumn: 'span 2' }}>
              <h3>Email Templates</h3>
              <p>25 done for you templates across 8 industries. Ready to personalise and send.</p>
            </div>

            {/* Global Demand - SMALL */}
            <div className="lp-bento-card lp-bento-sm light-cyan lp-animate lp-animate-delay-5" style={{ gridColumn: 'span 1' }}>
              <h3>Global Demand Map</h3>
              <p>See business density by region and industry before you launch.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 6. LEAD INTELLIGENCE ========== */}
      <section className="lp-intelligence" id="intelligence">
        <div className="lp-container">
          <div className="lp-intel-grid">
            <div className="lp-intel-copy">
              <div className="lp-section-label lp-animate">LEAD INTELLIGENCE</div>
              <h2 className="lp-section-title lp-animate">Know your lead before you contact them</h2>
              <p className="lp-intel-desc lp-animate">
                Lead Intelligence researches every prospect automatically. Pain points, buying signals, outreach angles and a personalised subject line. Generated in seconds.
              </p>
              <div className="lp-pro-badge lp-animate lp-animate-delay-1">Pro feature</div>
            </div>
            <div className="lp-intel-card lp-animate lp-animate-delay-2">
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

      {/* ========== 7. SWIRL DIVIDER ========== */}
      <section className="lp-swirl-divider">
        <div className="lp-swirl-blob lp-swirl-blob-1" />
        <div className="lp-swirl-blob lp-swirl-blob-2" />
        <div className="lp-swirl-blob lp-swirl-blob-3" />
        <div className="lp-swirl-text">
          <p className="lp-swirl-quote">"The longer you use Leadomation, the better your results get."</p>
          <p className="lp-swirl-sub">Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.</p>
        </div>
      </section>

      {/* ========== 8. CAMPAIGN PERFORMANCE ========== */}
      <section className="lp-performance" id="performance">
        <div className="lp-container">
          <div className="lp-perf-grid">
            <div className="lp-perf-card lp-animate">
              <div className="lp-perf-score">
                <div className="lp-perf-circle">
                  <div className="lp-perf-circle-inner">78</div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>Performance Score</div>
                  <div className="lp-perf-meta">Based on 1,247 emails analysed</div>
                </div>
              </div>
              <div className="lp-perf-bars">
                <div>
                  <div className="lp-perf-bar-label">Subject lines with questions</div>
                  <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill indigo" style={{ width: '82%' }} /></div>
                </div>
                <div>
                  <div className="lp-perf-bar-label">Personalised openers</div>
                  <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill cyan" style={{ width: '65%' }} /></div>
                </div>
                <div>
                  <div className="lp-perf-bar-label">Generic templates</div>
                  <div className="lp-perf-bar-track"><div className="lp-perf-bar-fill blue" style={{ width: '30%' }} /></div>
                </div>
              </div>
              <div className="lp-perf-insights">
                <div className="lp-perf-insight">
                  <span>💡</span> Emails sent Tuesday to Thursday perform 34% better
                </div>
                <div className="lp-perf-insight">
                  <span>📝</span> Add more personalisation to follow up #2
                </div>
              </div>
            </div>
            <div className="lp-intel-copy">
              <div className="lp-section-label lp-animate">PERFORMANCE INSIGHTS</div>
              <h2 className="lp-section-title lp-animate">Personalised insights. Delivered automatically.</h2>
              <p className="lp-intel-desc lp-animate">
                Every campaign teaches the system what converts for your audience. Your performance profile compounds over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 9. PRICING ========== */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-container">
          <div className="lp-pricing-header">
            <div className="lp-section-label lp-animate">PRICING</div>
            <h2 className="lp-section-title lp-animate" style={{ marginBottom: 0 }}>Simple, transparent pricing</h2>
            <div className="lp-pricing-toggle lp-animate lp-animate-delay-1">
              <button className={`lp-toggle-option ${!annual ? 'active' : ''}`} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`lp-toggle-option ${annual ? 'active' : ''}`} onClick={() => setAnnual(true)}>
                Annual <span className="lp-toggle-save">20% off</span>
              </button>
            </div>
          </div>

          <div className="lp-pricing-grid">
            {/* Starter */}
            <div className="lp-price-card lp-animate">
              <div className="lp-price-name">Starter</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">&pound;</span>
                <span className="lp-price-value">{annual ? '47' : '59'}</span>
                <span className="lp-price-period">/mo</span>
              </div>
              <div className="lp-price-annual-note">{annual ? 'Billed annually at £566' : 'Billed monthly'}</div>
              <ul className="lp-price-features">
                {['500 leads per month', 'Email sequences', 'Basic enrichment', 'Lead scoring', 'Email support'].map((f, i) => (
                  <li key={i}><span className="lp-price-check">&#10003;</span> {f}</li>
                ))}
              </ul>
              <button className="lp-price-cta outline" onClick={() => onNavigate('Register')}>Start free trial</button>
            </div>

            {/* Pro */}
            <div className="lp-price-card popular lp-animate lp-animate-delay-1">
              <div className="lp-price-popular-badge">Most popular</div>
              <div className="lp-price-name">Pro</div>
              <div className="lp-price-amount">
                <span className="lp-price-currency">&pound;</span>
                <span className="lp-price-value">{annual ? '127' : '159'}</span>
                <span className="lp-price-period">/mo</span>
              </div>
              <div className="lp-price-annual-note">{annual ? 'Billed annually at £1,526' : 'Billed monthly'}</div>
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
            <div className="lp-price-card greyed lp-animate lp-animate-delay-2">
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
            <h2 className="lp-section-title lp-animate">Frequently asked questions</h2>
          </div>
          <div className="lp-faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`lp-faq-item lp-animate lp-animate-delay-${Math.min(i + 1, 6)} ${openFaq === i ? 'open' : ''}`}>
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
          <h2 className="lp-animate">Ready to fill your pipeline?</h2>
          <p className="lp-cta-sub lp-animate lp-animate-delay-1">
            Join hundreds of B2B teams using Leadomation to find leads and close deals automatically.
          </p>
          <button className="lp-cta-btn lp-animate lp-animate-delay-2" onClick={() => onNavigate('Register')}>
            Start your free trial &rarr;
          </button>
          <p className="lp-cta-note lp-animate lp-animate-delay-3">No credit card required for first 7 days</p>
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
                <a href="/blog">Blog</a>
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
