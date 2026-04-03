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
  const [bannerDismissed, setBannerDismissed] = useState(false);
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

      // Problem cards stagger
      const problemCards = document.querySelectorAll('.lp-problem-card');
      if (problemCards.length) {
        gsap.from(problemCards, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.lp-problem-cards',
            start: 'top 80%',
          },
        });
      }

      // Persona cards stagger
      const personaCards = document.querySelectorAll('.lp-persona-card');
      if (personaCards.length) {
        gsap.from(personaCards, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.lp-persona-cards',
            start: 'top 80%',
          },
        });
      }

      // Testimonial cards stagger
      const testimonialCards = document.querySelectorAll('.lp-testimonial-card');
      if (testimonialCards.length) {
        gsap.from(testimonialCards, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.lp-testimonial-grid',
            start: 'top 80%',
          },
        });
      }

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
    {
      q: 'Is Leadomation GDPR compliant?',
      a: 'Yes. All data is processed and stored on EU servers via Supabase. We follow GDPR guidelines for data collection and outreach. You control your data and can delete it at any time from your account settings.',
    },
    {
      q: 'Does it work for my industry?',
      a: 'Leadomation works for any B2B business that sells to other businesses or professional services. Our 25 done for you email templates cover dental, legal, plumbing, financial services, marketing agencies, recruitment and more. If your industry is not listed, the campaign builder lets you create fully custom targeting.',
    },
  ];

  return (
    <div className="lp-page" ref={pageRef}>
      {/* ========== 1. ANNOUNCEMENT BANNER ========== */}
      {!bannerDismissed && (
        <div className="lp-banner">
          <span>Leadomation is now live. Start your 7 day free trial today.</span>
          <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('Register'); }}>
            Get started <span>&rarr;</span>
          </a>
          <button className="lp-banner-dismiss" onClick={() => setBannerDismissed(true)} aria-label="Dismiss">&times;</button>
        </div>
      )}

      {/* ========== 2. NAV ========== */}
      <nav className={`lp-nav ${!bannerDismissed ? 'has-banner' : ''}`}>
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
            <button className="lp-btn-nav-primary" onClick={() => onNavigate('Register')}>Start free trial</button>
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
        <button className="lp-btn-nav-primary" onClick={() => { setMobileOpen(false); onNavigate('Register'); }}>Start free trial</button>
      </div>

      {/* ========== 3. HERO ========== */}
      <section className="lp-hero">
        <div className="lp-hero-gradient-bg" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">B2B lead generation on autopilot</div>
          <h1>
            Your next 100 clients are already out there. Leadomation finds them
            <span className="lp-hero-accent">automatically.</span>
          </h1>
          <p className="lp-hero-sub">
            Leadomation finds and enriches B2B leads, writes personalised outreach, automates LinkedIn and calls prospects with an AI voice agent. Your pipeline fills while you focus on closing.
          </p>
          <div className="lp-hero-buttons">
            <button className="lp-btn-hero-primary" onClick={() => onNavigate('Register')}>Start free trial</button>
            <button className="lp-btn-hero-secondary" onClick={() => scrollTo('how')}>See how it works</button>
          </div>
          <p className="lp-hero-trust">7 day free trial. Secure with a card. Cancel anytime.</p>
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
              {['Dashboard', 'Global Demand', 'New Campaign', 'Lead Database', 'Deal Pipeline', 'Sequence Builder', 'Inbox', 'Call Agent'].map((item, i) => (
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
                    <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="30" x2="400" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="60" x2="400" y2="60" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="90" x2="400" y2="90" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="#E5E7EB" strokeWidth="1" />
                      <path
                        d="M0,90 C40,85 80,75 120,60 C160,45 200,50 240,35 C280,20 320,25 360,15 C380,12 400,10 400,10 L400,120 L0,120 Z"
                        fill="url(#chartGradient)"
                        opacity="0.3"
                      />
                      <path
                        d="M0,90 C40,85 80,75 120,60 C160,45 200,50 240,35 C280,20 320,25 360,15 C380,12 400,10 400,10"
                        fill="none"
                        stroke="#22D3EE"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className="lp-mock-campaigns">
                  <div className="lp-mock-chart-title">Top Campaigns</div>
                  {[
                    { name: 'Dental Clinics', rate: '6.74%', width: '30%' },
                    { name: 'Law Firms', rate: '11.22%', width: '55%' },
                    { name: 'Plumbers Edinburgh', rate: '0%', width: '5%' },
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
      </section>

      {/* ========== 4. LOGO BAR ========== */}
      <section className="lp-logos">
        <div className="lp-logos-label lp-gsap-fade">POWERED BY INDUSTRY LEADERS</div>
        <div className="lp-logos-track">
          {[0, 1].map((set) => (
            <div key={set} className="lp-logos-set">
              {logos.map((name, i) => (
                <div key={`${set}-${i}`} className="lp-logo-item">
                  <div className="lp-logo-icon">
                    {name.charAt(0)}
                  </div>
                  {name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ========== 5. THE PROBLEM ========== */}
      <section className="lp-problem" id="how">
        <div className="lp-container">
          <div className="lp-text-centre">
            <div className="lp-section-eyebrow teal lp-gsap-fade">THE PROBLEM</div>
            <h2 className="lp-section-heading lp-gsap-fade">B2B lead generation is broken for most businesses.</h2>
            <p className="lp-section-sub centred lp-gsap-fade">
              Hours wasted finding leads manually. Generic outreach ignored. Follow ups that never happen. Sound familiar?
            </p>
          </div>
          <div className="lp-problem-cards">
            <div className="lp-problem-card">
              <div className="lp-problem-icon red">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3>You're losing time finding leads</h3>
              <p>Most businesses spend 3 to 5 hours a week manually searching for prospects. By the time you reach out, your competitor already has.</p>
            </div>
            <div className="lp-problem-card">
              <div className="lp-problem-icon amber">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                  <line x1="12" y1="4" x2="12" y2="20" stroke="#F59E0B" strokeWidth="2" opacity="0.4" />
                  <line x1="8" y1="14" x2="16" y2="14" stroke="#F59E0B" strokeWidth="2" />
                </svg>
              </div>
              <h3>Generic outreach gets ignored</h3>
              <p>Copy paste cold emails have a 1% reply rate. Without personalisation at scale, you are invisible in every inbox you land in.</p>
            </div>
            <div className="lp-problem-card">
              <div className="lp-problem-icon indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72" />
                  <line x1="23" y1="1" x2="17" y2="7" />
                  <line x1="17" y1="1" x2="23" y2="7" />
                </svg>
              </div>
              <h3>Follow ups fall through the cracks</h3>
              <p>80% of sales require 5 or more follow ups. Almost nobody does them consistently. Deals die in silence because no one called back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 6. SOLUTION STATEMENT ========== */}
      <section className="lp-solution">
        <div className="lp-section-eyebrow lp-gsap-fade" style={{ color: 'rgba(34,211,238,0.7)', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '12px', fontWeight: 700, marginBottom: '24px' }}>THE SOLUTION</div>
        <h2 className="lp-solution-heading lp-gsap-fade">One platform. Every step of outreach. Completely automated.</h2>
        <p className="lp-solution-sub lp-gsap-fade">
          Leadomation replaces your lead scraper, email tool, LinkedIn outreach software and sales dialler with a single AI powered system.
        </p>
        <div className="lp-solution-steps lp-gsap-fade">
          {[
            { num: '1', label: 'Find' },
            { num: '2', label: 'Enrich' },
            { num: '3', label: 'Contact' },
            { num: '4', label: 'Follow up' },
            { num: '5', label: 'Book' },
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div className="lp-solution-step">
                <div className="lp-solution-step-circle">{step.num}</div>
                <div className="lp-solution-step-label">{step.label}</div>
              </div>
              {i < arr.length - 1 && <div className="lp-solution-connector" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ========== 7. FEATURE SCREENSHOT ========== */}
      <section className="lp-feature-screenshot">
        <div className="lp-container">
          <div className="lp-feature-grid">
            <div className="lp-feature-sticky">
              <div className="lp-section-eyebrow indigo lp-gsap-fade">FULL PIPELINE VIEW</div>
              <h2 className="lp-feature-heading lp-gsap-fade">A complete picture of every lead, every campaign, every deal.</h2>
              <div className="lp-feature-bullets">
                <div className="lp-feature-bullet lp-gsap-fade">
                  <div className="lp-feature-bullet-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <div>
                    <div className="lp-feature-bullet-title">271 enriched leads per campaign.</div>
                    <div className="lp-feature-bullet-body">Every lead comes with verified email, phone number, decision maker name and intent score. No manual data entry.</div>
                  </div>
                </div>
                <div className="lp-feature-bullet lp-gsap-fade">
                  <div className="lp-feature-bullet-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                  </div>
                  <div>
                    <div className="lp-feature-bullet-title">Campaign performance updates every 6 hours.</div>
                    <div className="lp-feature-bullet-body">The Performance Analyser studies your data and sends personalised improvement reports automatically.</div>
                  </div>
                </div>
                <div className="lp-feature-bullet lp-gsap-fade">
                  <div className="lp-feature-bullet-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                  <div>
                    <div className="lp-feature-bullet-title">Hot leads pushed to your pipeline instantly.</div>
                    <div className="lp-feature-bullet-body">When a prospect replies as Interested, they move to your Deal Pipeline automatically. No manual sorting.</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="lp-lead-mockup lp-gsap-fade">
                <div className="lp-lead-mockup-header">
                  <div className="lp-lead-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Search leads...</span>
                  </div>
                  <div className="lp-lead-filter-pill">Status</div>
                  <div className="lp-lead-filter-pill">Sort</div>
                </div>
                <div className="lp-lead-smart-filters">
                  <span className="lp-smart-pill hot">Hot (12)</span>
                  <span className="lp-smart-pill warm">Warm (8)</span>
                  <span className="lp-smart-pill cool">Cool (5)</span>
                  <span className="lp-smart-pill grey">Unscored (3)</span>
                </div>
                <table className="lp-lead-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Intent</th>
                      <th>Website</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="company-name">Dunmore Dental Care</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <span className="company-role">Practice Owner</span>
                      </td>
                      <td><span className="status-badge status-contacted">CONTACTED</span></td>
                      <td><span className="intent-badge intent-hot">Hot &middot; 63</span></td>
                      <td style={{ fontSize: '12px', color: '#6B7280' }}>dunmoredental.co.uk</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Smile Clinic Northwest</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <span className="company-role">Clinical Director</span>
                      </td>
                      <td><span className="status-badge status-replied">REPLIED</span></td>
                      <td><span className="intent-badge intent-hot">Hot &middot; 95</span></td>
                      <td style={{ fontSize: '12px', color: '#6B7280' }}>smileclinicnw.co.uk</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Bright Smile Kent</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <span className="company-role">Practice Owner</span>
                      </td>
                      <td><span className="status-badge status-contacted">CONTACTED</span></td>
                      <td><span className="intent-badge intent-hot">Hot &middot; 76</span></td>
                      <td style={{ fontSize: '12px', color: '#6B7280' }}>brightsmilekent.co.uk</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 8. WHO IT'S FOR ========== */}
      <section className="lp-persona">
        <div className="lp-container">
          <div className="lp-text-centre">
            <div className="lp-section-eyebrow teal lp-gsap-fade">WHO IT'S FOR</div>
            <h2 className="lp-section-heading lp-gsap-fade">Built for B2B businesses that need a full pipeline, not just a list of names.</h2>
            <p className="lp-section-sub centred lp-gsap-fade">&nbsp;</p>
          </div>
          <div className="lp-persona-cards">
            <div className="lp-persona-card">
              <div className="lp-persona-accent a1" />
              <div className="lp-persona-icon indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12" y2="18" />
                  <line x1="8" y1="6" x2="16" y2="6" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                </svg>
              </div>
              <h3>Agencies and consultants</h3>
              <p>You need a steady flow of qualified prospects without hiring a sales team or spending hours on LinkedIn.</p>
              <div className="lp-persona-outcome indigo">Automate prospecting end to end</div>
            </div>
            <div className="lp-persona-card">
              <div className="lp-persona-accent a2" />
              <div className="lp-persona-icon teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>Local B2B service businesses</h3>
              <p>Plumbers, solicitors, accountants, dental practices. High value clients with long relationships. You need more of them consistently.</p>
              <div className="lp-persona-outcome teal">Fill your diary with qualified calls</div>
            </div>
            <div className="lp-persona-card">
              <div className="lp-persona-accent a3" />
              <div className="lp-persona-icon indigo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Founders doing their own sales</h3>
              <p>You are closing deals yourself and every hour counts. You need outreach running in the background while you focus on closing.</p>
              <div className="lp-persona-outcome indigo">Let AI handle outreach while you close</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 9. LIGHT BENTO GRID ========== */}
      <section className="lp-features-section" id="features">
        <div className="lp-container">
          <div className="lp-section-eyebrow indigo lp-gsap-fade">FEATURES</div>
          <h2 className="lp-section-heading lp-gsap-fade">Know more about your prospects than they expect.</h2>
          <p className="lp-features-sub lp-gsap-fade">
            One platform replaces your lead scraper, email tool, LinkedIn outreach and AI calling software.
          </p>

          <div className="lp-bento">
            {/* Card 1 - Lead Database */}
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
                      <td><span className="intent-badge intent-hot">Hot &middot; 63</span></td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Smile Clinic Northwest</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <br /><span className="company-role">Clinical Director</span>
                      </td>
                      <td><span className="status-badge status-replied">REPLIED</span></td>
                      <td><span className="intent-badge intent-hot">Hot &middot; 95</span></td>
                    </tr>
                    <tr>
                      <td>
                        <span className="company-name">Bright Smile Kent</span>
                        <span className="enriched-badge">ENRICHED</span>
                        <br /><span className="company-role">Practice Owner</span>
                      </td>
                      <td><span className="status-badge status-contacted">CONTACTED</span></td>
                      <td><span className="intent-badge intent-hot">Hot &middot; 76</span></td>
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

            {/* Card 2 - Campaign Builder */}
            <div className="lp-bento-card lp-bento-span-3 lp-bento-rtr">
              <div className="lp-bento-graphic" style={{ background: '#fff' }}>
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

            {/* Card 3 - Intent Scoring */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rbl">
              <div className="lp-bento-graphic" style={{ background: '#fff' }}>
                <div className="lp-intent-graphic">
                  <div className="lp-intent-pill hot">
                    <span className="lp-intent-emoji">🔥</span> Hot <span className="lp-intent-score">95</span>
                  </div>
                  <div className="lp-intent-pill warm">
                    <span className="lp-intent-emoji">⚡</span> Warm <span className="lp-intent-score">72</span>
                  </div>
                  <div className="lp-intent-pill cool">
                    <span className="lp-intent-emoji">💧</span> Cool <span className="lp-intent-score">45</span>
                  </div>
                </div>
              </div>
              <div className="lp-bento-content">
                <div className="lp-bento-eyebrow">Intent scoring</div>
                <div className="lp-bento-title">Know who is ready to buy</div>
                <p className="lp-bento-desc">Every lead scored automatically based on buying signals, reviews and online presence.</p>
              </div>
            </div>

            {/* Card 4 - AI Voice Calling */}
            <div className="lp-bento-card lp-bento-span-2 navy-card">
              <div className="lp-bento-graphic">
                <div className="lp-voice-graphic">
                  <div className="lp-voice-phone-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div className="lp-voice-pulse" />
                    <div className="lp-voice-pulse-2" />
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

            {/* Card 5 - LinkedIn Sequencer */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rbr">
              <div className="lp-bento-graphic" style={{ background: '#fff' }}>
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

      {/* ========== 10. DARK BENTO SECTION ========== */}
      <div className="lp-dark-section">
        <div className="lp-container">
          <div className="lp-section-eyebrow dark lp-gsap-fade">OUTREACH</div>
          <h2 className="lp-section-heading white lp-gsap-fade">Close deals faster with AI.</h2>

          <div className="lp-bento">
            {/* Dark Card 1 - Inbox */}
            <div className="lp-bento-card lp-bento-span-4 lp-bento-rtl">
              <div className="lp-bento-graphic">
                <div className="lp-inbox-graphic">
                  <div className="lp-inbox-list">
                    {[
                      { name: 'London Smile Studio', status: 'interested' },
                      { name: 'Smile Clinic NW', status: 'interested' },
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
                      Hi, thanks for reaching out. We have been looking for exactly this kind of service. Could we schedule a call this week?
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

            {/* Dark Card 2 - Deal Pipeline */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rtr">
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

            {/* Dark Card 3 - Keyword Monitor */}
            <div className="lp-bento-card lp-bento-span-2 lp-bento-rbl">
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

            {/* Dark Card 4 - Performance Analyser */}
            <div className="lp-bento-card lp-bento-span-4 lp-bento-rbr">
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
                <p className="lp-bento-desc">Studies your email data every 6 hours. Sends personalised improvement reports. The longer you use it, the better your results.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 11. LEAD INTELLIGENCE ========== */}
      <section className="lp-intel-section" id="intelligence">
        <div className="lp-container">
          <div className="lp-intel-grid">
            <div className="lp-intel-copy">
              <div className="lp-section-eyebrow indigo lp-gsap-fade">LEAD INTELLIGENCE</div>
              <h2 className="lp-intel-heading lp-gsap-fade">Stop guessing what to say. Know everything before you reach out.</h2>
              <p className="lp-intel-desc lp-gsap-fade">
                Before you send a single word, Leadomation already knows your prospect's pain point, their Google rating, their recent business expansion and exactly what subject line will get them to open. Lead Intelligence generates a full research report for every prospect in seconds.
              </p>
              <div className="lp-pro-badge lp-gsap-fade">Pro feature</div>
            </div>
            <div className="lp-intel-card">
              <div className="lp-intel-card-header lp-intel-field">LEAD INTELLIGENCE REPORT</div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">OPPORTUNITY RATING</div>
                <div className="lp-intel-row-value"><span className="lp-intel-hot-badge">Hot</span></div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">PAIN INTENSITY</div>
                <div className="lp-intel-row-value">7 / 10</div>
                <div className="lp-intel-progress-bar">
                  <div className="lp-intel-progress-fill" style={{ width: '70%' }} />
                </div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">PAIN POINT</div>
                <div className="lp-intel-row-value">No online booking system. Losing walk in customers to competitors with digital scheduling.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">OUTREACH ANGLE</div>
                <div className="lp-intel-row-value">Position as a quick win digital upgrade. Reference their 4.8 star Google rating.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">PERSONALISATION HOOK</div>
                <div className="lp-intel-row-value">Mention their recent expansion to a second location.</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">SUGGESTED SUBJECT LINE</div>
                <div className="lp-intel-row-value lp-intel-subject">Quick fix for your booking gap</div>
              </div>
              <div className="lp-intel-row lp-intel-field">
                <div className="lp-intel-row-label">SUGGESTED OPENING LINE</div>
                <div className="lp-intel-row-value lp-intel-opening">I noticed your second location just opened...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 12. STATS BAR ========== */}
      <section className="lp-stats-bar">
        <div className="lp-container">
          <div className="lp-stats-grid lp-gsap-fade">
            {[
              { value: '500+', label: 'Leads found per campaign' },
              { value: '35', label: 'Day LinkedIn relationship funnel' },
              { value: '6hrs', label: 'Between performance report updates' },
              { value: '8', label: 'Step AI call script builder' },
            ].map((stat, i) => (
              <div key={i} className="lp-stat-item">
                <div className="lp-stat-value">{stat.value}</div>
                <div className="lp-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 13. TESTIMONIALS ========== */}
      <section className="lp-testimonials">
        <div className="lp-container">
          <div className="lp-text-centre" style={{ marginBottom: '60px' }}>
            <div className="lp-section-eyebrow indigo lp-gsap-fade">WHAT PEOPLE ARE SAYING</div>
            <h2 className="lp-section-heading lp-gsap-fade">Real results from real businesses.</h2>
          </div>
          <div className="lp-testimonial-grid">
            {[
              {
                accent: 'indigo',
                text: 'We booked 14 discovery calls in our first month. We had been trying to do this manually for two years and never got close to those numbers.',
                initials: 'SM',
                avatarClass: 'indigo',
                name: 'Sarah Mitchell',
                role: 'Director, Apex Digital Agency',
              },
              {
                accent: 'cyan',
                text: 'The intent scoring alone is worth the subscription. We stopped wasting time on leads that were never going to buy and focused only on Hot prospects.',
                initials: 'JH',
                avatarClass: 'teal',
                name: 'James Hartley',
                role: 'Partner, Hartley Commercial Solicitors',
              },
              {
                accent: 'teal',
                text: 'I set up one campaign on a Monday morning. By Wednesday my AI agent had already booked two calls. I have never seen anything work that fast.',
                initials: 'PA',
                avatarClass: 'blue',
                name: 'Priya Anand',
                role: 'Founder, Anand Consulting',
              },
            ].map((t, i) => (
              <div key={i} className="lp-testimonial-card">
                <div className={`lp-testimonial-accent ${t.accent}`} />
                <div className="lp-testimonial-quote-mark">&ldquo;</div>
                <p className="lp-testimonial-text">{t.text}</p>
                <div className="lp-testimonial-divider" />
                <div className="lp-testimonial-author">
                  <div className={`lp-testimonial-avatar ${t.avatarClass}`}>{t.initials}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 14. SWIRL DIVIDER ========== */}
      <section className="lp-swirl-divider">
        <div className="lp-swirl-blob lp-swirl-blob-1" />
        <div className="lp-swirl-blob lp-swirl-blob-2" />
        <div className="lp-swirl-blob lp-swirl-blob-3" />
        <div className="lp-swirl-text">
          <p className="lp-swirl-quote">"The longer you use Leadomation, the better your results get."</p>
          <p className="lp-swirl-sub">Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.</p>
        </div>
      </section>

      {/* ========== 15. PRICING ========== */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-container">
          <div className="lp-pricing-header">
            <div className="lp-section-eyebrow indigo lp-gsap-fade" style={{ textAlign: 'center' }}>PRICING</div>
            <h2 className="lp-section-heading lp-gsap-fade" style={{ textAlign: 'center', maxWidth: 'none' }}>Simple, transparent pricing.</h2>
            <p className="lp-pricing-sub lp-gsap-fade">Start free. Upgrade when you are ready. No lock in contracts.</p>
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
              <div className="lp-price-who">Perfect for individuals and small teams</div>
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
              <div className="lp-price-who">For growing businesses serious about outreach</div>
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
              <div className="lp-price-who">For agencies and high volume teams</div>
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

      {/* ========== 16. FAQ ========== */}
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

      {/* ========== 17. FINAL CTA ========== */}
      <div className="lp-cta-wrapper">
        <section className="lp-cta">
          <div className="lp-cta-eyebrow lp-gsap-fade">GET STARTED</div>
          <h2 className="lp-gsap-fade">Your pipeline won't fill itself.</h2>
          <p className="lp-cta-sub lp-gsap-fade">
            Start your 7 day free trial today. No credit card required for the first 7 days.
          </p>
          <button className="lp-cta-btn lp-gsap-fade" onClick={() => onNavigate('Register')}>
            Start your free trial
          </button>
          <p className="lp-cta-note lp-gsap-fade">No credit card required for first 7 days</p>
        </section>
      </div>

      {/* ========== 18. FOOTER ========== */}
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
