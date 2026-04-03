import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logoDark from '../assets/logo-full.png';

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
    }, pageRef);

    return () => ctx.revert();
  }, []);

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
    <div className="font-[Switzer,system-ui,sans-serif]" ref={pageRef}>

      {/* ========== 1. ANNOUNCEMENT BANNER ========== */}
      {!bannerDismissed && (
        <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-[#4F46E5] px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-white">
              <strong className="font-semibold">Leadomation is now live.</strong> Start your 7 day free trial today.
            </p>
            <button
              onClick={() => onNavigate('Register')}
              className="flex-none rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-[#4F46E5] hover:bg-gray-100"
            >
              Get started &rarr;
            </button>
          </div>
          <div className="flex flex-1 justify-end">
            <button onClick={() => setBannerDismissed(true)} className="-m-3 p-3">
              <span className="sr-only">Dismiss</span>
              <svg className="size-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ========== 2. NAV ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between">
          <a href="/" className="flex-shrink-0">
            <img src={logoDark} alt="Leadomation" className="h-9 w-auto" />
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {['How it works', 'Features', 'Pricing', 'FAQ'].map(link => (
              <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
                className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors">
                {link}
              </button>
            ))}
            <Link to="/blog" className="text-sm font-medium text-gray-500 hover:text-[#4F46E5]">Blog</Link>
          </div>
          <div className="hidden lg:flex items-center gap-4">
            <button onClick={() => onNavigate('Login')} className="text-sm font-medium text-gray-500 hover:text-[#4F46E5]">Sign in</button>
            <button onClick={() => onNavigate('Register')} className="rounded-full bg-[#1E1B4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d2a6e] transition-colors">Start free trial</button>
          </div>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 p-6 flex flex-col gap-4 lg:hidden">
          {['How it works', 'Features', 'Pricing', 'FAQ'].map(link => (
            <button key={link} onClick={() => scrollTo(link.toLowerCase().replace(' ', '-'))}
              className="text-sm font-medium text-gray-700 hover:text-[#4F46E5]">
              {link}
            </button>
          ))}
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700 hover:text-[#4F46E5]">Blog</Link>
          <button onClick={() => { setMobileOpen(false); onNavigate('Login'); }} className="text-sm font-medium text-gray-700">Sign in</button>
          <button onClick={() => { setMobileOpen(false); onNavigate('Register'); }} className="rounded-full bg-[#1E1B4B] px-5 py-2.5 text-sm font-semibold text-white">Start free trial</button>
        </div>
      )}

      {/* ========== 3. HERO ========== */}
      <section className="relative min-h-screen pt-16 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,70,229,0.2) 0%, rgba(34,211,238,0.1) 40%, rgba(207,250,254,0.05) 70%, transparent 100%)'}} />

        <div className="mx-auto max-w-4xl px-6 pt-28 pb-16 text-center">
          <div className="inline-flex items-center rounded-full bg-[#4F46E5]/8 border border-[#4F46E5]/15 px-4 py-1.5 mb-8">
            <span className="text-sm font-semibold text-[#4F46E5]">B2B lead generation on autopilot</span>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.85] text-gray-950 mb-8">
            Your next 100 clients<br />are already out there.<br />
            <span className="text-[#4F46E5]">Leadomation finds them.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed mb-10">
            Leadomation finds and enriches B2B leads, writes personalised outreach, automates LinkedIn and calls prospects with an AI voice agent. Your pipeline fills while you focus on closing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button onClick={() => onNavigate('Register')} className="rounded-full bg-[#1E1B4B] px-8 py-4 text-base font-semibold text-white hover:bg-[#2d2a6e] transition-all hover:-translate-y-0.5 shadow-lg">
              Start free trial
            </button>
            <button onClick={() => scrollTo('how')} className="rounded-full border-2 border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all">
              See how it works
            </button>
          </div>
          <p className="text-sm text-gray-400">7 day free trial. Secure with a card. Cancel anytime.</p>
        </div>

        {/* Dashboard mockup */}
        <div className="mx-auto max-w-6xl px-6 pb-0 lp-gsap-fade">
          <div className="rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-[#1a1a2e]">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#252540]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="flex-1 bg-white/8 rounded-md px-3 py-1 text-xs text-white/40">app.leadomation.co.uk/dashboard</div>
            </div>
            <div className="bg-[#F8F9FA] p-5 flex gap-4 min-h-[400px]">
              <div className="w-44 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-4 hidden md:block">
                <div className="text-sm font-bold text-[#4F46E5] mb-5">Leadomation</div>
                {['Dashboard', 'Global Demand', 'New Campaign', 'Lead Database', 'Deal Pipeline', 'Sequence Builder', 'Inbox', 'Call Agent'].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 text-xs font-medium ${i === 0 ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'text-gray-500'}`}>
                    <div className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-[#4F46E5]/30' : 'bg-gray-200'}`} />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-4 min-w-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {label: 'Total Leads', value: '271', trend: '+12%'},
                    {label: 'Leads with Emails', value: '31', trend: '+8%'},
                    {label: 'Leads Contacted', value: '0', trend: ''},
                    {label: 'Total Deals', value: '10', trend: '+3'},
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                      <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                      <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                      {s.trend && <div className="text-xs text-emerald-500 mt-0.5">{s.trend}</div>}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-1">
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-sm font-semibold text-gray-800 mb-3">Campaign Performance</div>
                    <svg viewBox="0 0 400 100" className="w-full h-24">
                      <defs>
                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,80 C40,75 80,65 120,50 C160,35 200,40 240,28 C280,16 320,20 360,12 L400,8 L400,100 L0,100 Z" fill="url(#cg)"/>
                      <path d="M0,80 C40,75 80,65 120,50 C160,35 200,40 240,28 C280,16 320,20 360,12 L400,8" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="w-52 bg-white rounded-xl border border-gray-200 p-4 hidden md:block">
                    <div className="text-sm font-semibold text-gray-800 mb-3">Top Campaigns</div>
                    {[
                      {name: 'Dental Clinics', rate: '6.74%', w: '30%'},
                      {name: 'Law Firms', rate: '11.22%', w: '55%'},
                      {name: 'Plumbers Edinburgh', rate: '0%', w: '3%'},
                    ].map((c, i) => (
                      <div key={i} className="mb-2.5">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-700">{c.name}</span>
                          <span className="text-xs font-bold text-[#4F46E5]">{c.rate}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#4F46E5] rounded-full" style={{width: c.w}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 4. LOGO BAR ========== */}
      <section className="py-16 overflow-hidden bg-white">
        <p className="text-center text-xs font-bold tracking-[2px] text-gray-400 uppercase mb-8">Powered by industry leaders</p>
        <div className="flex w-max animate-[marquee_30s_linear_infinite]">
          {[0,1].map(set => (
            <div key={set} className="flex items-center gap-14 px-7">
              {['Google Maps','Hunter.io','LinkedIn','Microsoft 365','Stripe','Supabase','Unipile','Vapi.ai','Apollo','Resend'].map((name, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-gray-400">
                  <div className="w-7 h-7 rounded-lg bg-[#4F46E5]/8 flex items-center justify-center text-xs font-bold text-[#4F46E5]">{name[0]}</div>
                  {name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ========== 5. THE PROBLEM ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F0FFFE]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[2px] text-[#06B6D4] uppercase mb-4">The problem</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mb-6">B2B lead generation is broken<br />for most businesses.</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Hours wasted finding leads manually. Generic outreach ignored. Follow-ups that never happen. Sound familiar?</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lp-problem-cards">
            {[
              {
                icon: '\u23F0',
                color: 'bg-red-50',
                title: "You're losing time finding leads",
                body: "Most businesses spend 3 to 5 hours a week manually searching for prospects. By the time you reach out, your competitor already has."
              },
              {
                icon: '\u{1F4E7}',
                color: 'bg-amber-50',
                title: "Generic outreach gets ignored",
                body: "Copy-paste cold emails have a 1% reply rate. Without personalisation at scale, you are invisible in every inbox you land in."
              },
              {
                icon: '\u{1F4DE}',
                color: 'bg-[#EEF2FF]',
                title: "Follow-ups fall through the cracks",
                body: "80% of sales require 5 or more follow-ups. Almost nobody does them consistently. Deals die in silence because no one called back."
              }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm lp-problem-card">
                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-2xl mb-6`}>{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-4">{card.title}</h3>
                <p className="text-base text-gray-500 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 6. SOLUTION STATEMENT ========== */}
      <section className="py-24 bg-[#1E1B4B]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <p className="text-sm font-bold tracking-[2px] text-[#22D3EE]/70 uppercase mb-6">The solution</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">
            One platform. Every step<br />of outreach. Completely automated.
          </h2>
          <p className="text-lg text-white/55 max-w-2xl mx-auto mb-16">
            Leadomation replaces your lead scraper, email tool, LinkedIn outreach software and sales dialler with a single AI powered system.
          </p>
          <div className="flex items-center justify-center max-w-3xl mx-auto flex-wrap gap-y-4">
            {['Find','Enrich','Contact','Follow up','Book'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-[#22D3EE]/30 flex items-center justify-center text-lg font-bold text-[#22D3EE]">{i+1}</div>
                  <span className="text-sm font-semibold text-white/65 whitespace-nowrap">{step}</span>
                </div>
                {i < arr.length - 1 && <div className="w-12 h-px bg-[#22D3EE]/20 mb-6 mx-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 7. FEATURE SCREENSHOT ========== */}
      <section className="py-24 bg-white" id="how">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-bold tracking-[2px] text-[#4F46E5] uppercase mb-4">Full pipeline view</p>
              <h2 className="text-4xl font-black tracking-tight text-gray-950 leading-tight mb-6">A complete picture of every lead, every campaign, every deal.</h2>
              <dl className="space-y-8">
                {[
                  {icon: '\u{1F3AF}', title: '271 enriched leads per campaign.', body: 'Every lead comes with verified email, phone number, decision maker name and intent score. No manual data entry.'},
                  {icon: '\u{1F4CA}', title: 'Campaign performance updates every 6 hours.', body: 'The Performance Analyser studies your data and sends personalised improvement reports automatically.'},
                  {icon: '\u26A1', title: 'Hot leads pushed to your pipeline instantly.', body: 'When a prospect replies as Interested, they move to your Deal Pipeline automatically. No manual sorting.'},
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                    <div>
                      <dt className="font-bold text-gray-900 mb-1">{f.title}</dt>
                      <dd className="text-gray-500 text-sm leading-relaxed">{f.body}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
            <div className="rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/5 bg-white">
              <div className="p-4 border-b border-gray-100 flex gap-3 items-center">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <span className="text-sm text-gray-400">Search leads...</span>
                </div>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600">Status</div>
                <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600">Sort</div>
              </div>
              <div className="px-4 py-3 flex gap-2 border-b border-gray-100">
                <span className="px-3 py-1 rounded-full bg-red-50 border border-red-100 text-xs font-semibold text-red-600">Hot (12)</span>
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-600">Warm (8)</span>
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600">Cool (5)</span>
                <span className="px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500">Unscored (3)</span>
              </div>
              <div className="grid grid-cols-4 px-4 py-2 bg-gray-50 border-b border-gray-100">
                {['Company','Status','Intent','Website'].map(h => (
                  <div key={h} className="text-xs font-bold text-[#4F46E5] uppercase tracking-wide">{h}</div>
                ))}
              </div>
              {[
                {company: 'Dunmore Dental Care', role: 'Practice Owner', status: 'CONTACTED', statusColor: 'bg-amber-50 text-amber-700', intent: 'Hot - 63', intentColor: 'bg-red-50 text-red-600', site: 'dunmoredental.co.uk'},
                {company: 'Smile Clinic Northwest', role: 'Clinical Director', status: 'REPLIED', statusColor: 'bg-emerald-50 text-emerald-700', intent: 'Hot - 95', intentColor: 'bg-red-50 text-red-600', site: 'smileclinicnw.co.uk'},
                {company: 'Bright Smile Kent', role: 'Practice Owner', status: 'CONTACTED', statusColor: 'bg-amber-50 text-amber-700', intent: 'Hot - 76', intentColor: 'bg-red-50 text-red-600', site: 'brightsmilekent.co.uk'},
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 items-center">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900">{row.company}</span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase">Enriched</span>
                    </div>
                    <div className="text-xs text-[#4F46E5] font-medium mt-0.5">{row.role}</div>
                  </div>
                  <div><span className={`px-2 py-1 rounded text-xs font-bold ${row.statusColor}`}>{row.status}</span></div>
                  <div><span className={`px-2 py-1 rounded-md text-xs font-bold ${row.intentColor}`}>{row.intent}</span></div>
                  <div className="text-xs text-[#4F46E5] font-medium truncate">{row.site}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 8. WHO IT'S FOR ========== */}
      <section className="py-24 bg-gray-50" id="features">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[2px] text-[#06B6D4] uppercase mb-4">Who it's for</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mb-6">Built for B2B businesses that need<br />a full pipeline, not just a list of names.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lp-persona-cards">
            {[
              {accent: 'from-[#4F46E5] to-[#22D3EE]', icon: '\u{1F3E2}', iconBg: 'bg-[#EEF2FF]', title: 'Agencies and consultants', pain: 'You need a steady flow of qualified prospects without hiring a sales team or spending hours on LinkedIn.', pill: 'Automate prospecting end to end', pillColor: 'bg-[#EEF2FF] text-[#4F46E5]'},
              {accent: 'from-[#06B6D4] to-[#3B82F6]', icon: '\u{1F3EA}', iconBg: 'bg-[#F0FFFE]', title: 'Local B2B service businesses', pain: 'Plumbers, solicitors, accountants, dental practices. High value clients with long relationships. You need more of them consistently.', pill: 'Fill your diary with qualified calls', pillColor: 'bg-[#F0FFFE] text-[#06B6D4]'},
              {accent: 'from-[#1E1B4B] to-[#4F46E5]', icon: '\u{1F464}', iconBg: 'bg-[#EEF2FF]', title: 'Founders doing their own sales', pain: 'You are closing deals yourself and every hour counts. You need outreach running in the background while you focus on closing.', pill: 'Let AI handle outreach while you close', pillColor: 'bg-[#EEF2FF] text-[#4F46E5]'},
            ].map((card, i) => (
              <div key={i} className="relative bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm overflow-hidden lp-persona-card">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`} />
                <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center text-xl mb-5`}>{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-sm">{card.pain}</p>
                <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${card.pillColor}`}>{card.pill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 9. LIGHT BENTO GRID ========== */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-bold tracking-[2px] text-[#4F46E5] uppercase mb-4">Features</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mb-4 max-w-3xl">Know more about your prospects than they expect.</h2>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl">One platform replaces your lead scraper, email tool, LinkedIn outreach and AI calling software.</p>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2 lp-bento">

            {/* Card 1: Lead Database */}
            <div className="relative lg:col-span-3 rounded-tl-[2rem] rounded-tr-[2rem] lg:rounded-tr-none rounded-bl-[2rem] rounded-br-[2rem] lg:rounded-bl-[2rem] lg:rounded-br-none overflow-hidden bg-white ring-1 ring-black/5 shadow-sm flex flex-col lp-bento-card">
              <div className="absolute inset-px rounded-tl-[2rem] lg:rounded-tr-none lg:rounded-bl-[2rem] bg-white" />
              <div className="relative h-80 flex-shrink-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Company','Status','Intent'].map(h => <th key={h} className="px-4 py-3 text-[10px] font-bold text-[#4F46E5] uppercase tracking-wide">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {company:'Dunmore Dental Care',role:'Practice Owner',status:'CONTACTED',sc:'bg-amber-50 text-amber-700',intent:'Hot - 63',ic:'bg-red-50 text-red-600'},
                      {company:'Smile Clinic Northwest',role:'Clinical Director',status:'REPLIED',sc:'bg-emerald-50 text-emerald-700',intent:'Hot - 95',ic:'bg-red-50 text-red-600'},
                      {company:'Bright Smile Kent',role:'Practice Owner',status:'CONTACTED',sc:'bg-amber-50 text-amber-700',intent:'Hot - 76',ic:'bg-red-50 text-red-600'},
                    ].map((row,i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">{row.company}</span>
                            <span className="px-1 py-0.5 bg-emerald-50 text-emerald-700 text-[8px] font-bold rounded">ENRICHED</span>
                          </div>
                          <div className="text-[10px] text-[#4F46E5] font-medium">{row.role}</div>
                        </td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.sc}`}>{row.status}</span></td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${row.ic}`}>{row.intent}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-50% pointer-events-none" />
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Lead database</p>
                <p className="text-2xl font-bold tracking-tight text-gray-950 mb-2">271 enriched leads ready to contact</p>
                <p className="text-sm text-gray-500 leading-relaxed">Verified emails, phone numbers, intent scores and decision maker contacts. Filter by Hot, Warm or Cool in one click.</p>
              </div>
            </div>

            {/* Card 2: Campaign Builder */}
            <div className="relative lg:col-span-3 rounded-[2rem] lg:rounded-tl-none lg:rounded-bl-none overflow-hidden bg-white ring-1 ring-black/5 shadow-sm flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 overflow-hidden p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {['1 Campaign details','2 Advanced targeting','3 Intent filters','4 Data enrichment','5 Outreach config'].map((step,i) => (
                    <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold ${i===0 ? 'bg-[#4F46E5] text-white' : 'bg-[#EEF2FF] text-[#4F46E5]'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${i===0 ? 'bg-white/20 text-white' : 'bg-[#4F46E5]/15 text-[#4F46E5]'}`}>{i+1}</span>
                      {step.slice(2)}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {['Local Businesses','B2B Services','Custom Search'].map((t,i) => (
                    <div key={i} className={`flex-1 py-3 px-3 rounded-xl border text-xs font-semibold text-center ${i===1 ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]' : 'border-gray-200 text-gray-500'}`}>{t}</div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-50% pointer-events-none" />
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Campaign builder</p>
                <p className="text-2xl font-bold tracking-tight text-gray-950 mb-2">Launch a campaign in 3 minutes</p>
                <p className="text-sm text-gray-500 leading-relaxed">5 step wizard. Pick industry, location, intent filters, enrichment and outreach strategy. Leadomation handles the rest.</p>
              </div>
            </div>

            {/* Card 3: Intent Scoring */}
            <div className="relative lg:col-span-2 rounded-[2rem] lg:rounded-tl-none lg:rounded-tr-none lg:rounded-br-none overflow-hidden bg-white ring-1 ring-black/5 shadow-sm flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <div className="flex flex-col gap-3">
                  {[
                    {label:'Hot',score:'95',bg:'bg-red-50',border:'border-red-100',color:'text-red-600',emoji:'\u{1F525}'},
                    {label:'Warm',score:'72',bg:'bg-amber-50',border:'border-amber-100',color:'text-amber-600',emoji:'\u26A1'},
                    {label:'Cool',score:'45',bg:'bg-blue-50',border:'border-blue-100',color:'text-blue-600',emoji:'\u{1F4A7}'},
                  ].map((pill,i) => (
                    <div key={i} className={`w-56 h-14 rounded-2xl ${pill.bg} border ${pill.border} flex items-center px-5 gap-3`}>
                      <span className="text-xl">{pill.emoji}</span>
                      <span className={`text-lg font-bold ${pill.color} flex-1`}>{pill.label}</span>
                      <span className={`text-lg font-bold ${pill.color}`}>{pill.score}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-50% pointer-events-none" />
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">Intent scoring</p>
                <p className="text-2xl font-bold tracking-tight text-gray-950 mb-2">Know who is ready to buy</p>
                <p className="text-sm text-gray-500 leading-relaxed">Every lead scored automatically based on buying signals, reviews and online presence.</p>
              </div>
            </div>

            {/* Card 4: AI Voice */}
            <div className="relative lg:col-span-2 rounded-[2rem] lg:rounded-none overflow-hidden bg-[#1E1B4B] ring-1 ring-white/10 shadow-sm flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full bg-[#22D3EE]/15 flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#22D3EE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <div className="absolute inset-[-8px] rounded-full border-2 border-[#22D3EE]/25 animate-ping" />
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">AI Call Agent</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B4B] to-transparent to-50% pointer-events-none" />
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-white/40 uppercase mb-1">AI voice calling</p>
                <p className="text-2xl font-bold tracking-tight text-white mb-2">Your AI agent calls prospects 24/7</p>
                <p className="text-sm text-white/60 leading-relaxed">Handles objections, answers questions and books meetings directly into your calendar.</p>
              </div>
            </div>

            {/* Card 5: LinkedIn */}
            <div className="relative lg:col-span-2 rounded-[2rem] lg:rounded-tl-none lg:rounded-tr-none lg:rounded-bl-none overflow-hidden bg-white ring-1 ring-black/5 shadow-sm flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 flex items-center justify-center overflow-hidden px-4">
                <div className="flex items-center gap-0">
                  {[
                    {n:'1',label:'Silent\nAwareness',active:true},
                    {n:'2',label:'Connection',active:false},
                    {n:'3',label:'Warm\nThanks',active:false},
                    {n:'4',label:'Advice\nAsk',active:false},
                    {n:'5',label:'Follow\nUp',active:false},
                    {n:'6',label:'Soft\nOffer',active:false},
                  ].map((p,i,arr) => (
                    <React.Fragment key={p.n}>
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${p.active ? 'bg-[#4F46E5]' : 'bg-gray-200'}`}>{p.n}</div>
                        <span className="text-[9px] text-gray-400 text-center whitespace-pre-line leading-tight max-w-[52px]">{p.label}</span>
                      </div>
                      {i < arr.length-1 && <div className="w-4 h-px bg-gray-200 mb-5 flex-shrink-0" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-50% pointer-events-none" />
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-1">LinkedIn sequencer</p>
                <p className="text-2xl font-bold tracking-tight text-gray-950 mb-2">35 day LinkedIn funnel on autopilot</p>
                <p className="text-sm text-gray-500 leading-relaxed">Silent Awareness through to Soft Offer. Runs automatically, builds trust before making any ask.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== 10. DARK BENTO GRID ========== */}
      <div className="mx-2 mt-2 rounded-[2rem] bg-[#0F172A] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-bold tracking-[2px] text-white/40 uppercase mb-4">Outreach</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-12 max-w-2xl">Close deals faster with AI.</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2 lp-bento">

            {/* Inbox */}
            <div className="relative lg:col-span-4 rounded-tl-[2rem] rounded-tr-[2rem] lg:rounded-tr-none rounded-bl-[2rem] lg:rounded-bl-[2rem] rounded-br-[2rem] lg:rounded-br-none overflow-hidden bg-[#1E293B] ring-1 ring-white/8 flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] to-transparent to-40% z-10 pointer-events-none" />
                <div className="flex h-full m-3 rounded-lg overflow-hidden bg-white/5">
                  <div className="w-[45%] border-r border-white/5">
                    {[
                      {name:'London Smile Studio',status:'Interested',sc:'text-emerald-400 bg-emerald-400/15',active:true},
                      {name:'Smile Clinic NW',status:'Interested',sc:'text-emerald-400 bg-emerald-400/15',active:false},
                      {name:'Blackwell Partners',status:'Interested',sc:'text-emerald-400 bg-emerald-400/15',active:false},
                      {name:'Forsyth Family Law',status:'Not interested',sc:'text-red-400 bg-red-400/15',active:false},
                    ].map((item,i) => (
                      <div key={i} className={`px-3 py-2.5 border-b border-white/5 ${item.active ? 'bg-[#4F46E5]/15' : ''}`}>
                        <div className="text-xs font-semibold text-white mb-1">{item.name}</div>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${item.sc}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-3 bg-white/2">
                    <div className="text-xs font-semibold text-white mb-2">From: London Smile Studio</div>
                    <p className="text-[11px] text-white/40 leading-relaxed">Hi, thanks for reaching out. We have been looking for exactly this kind of service. Could we schedule a call this week?</p>
                  </div>
                </div>
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-white/35 uppercase mb-1">Inbox</p>
                <p className="text-2xl font-bold text-white mb-2">Every reply classified automatically</p>
                <p className="text-sm text-white/50 leading-relaxed">AI reads every email and LinkedIn reply. Interested, Not Interested or Out of Office. Hot leads pushed to your pipeline instantly.</p>
              </div>
            </div>

            {/* Deal Pipeline */}
            <div className="relative lg:col-span-2 rounded-[2rem] lg:rounded-tl-none lg:rounded-bl-none overflow-hidden bg-[#1E293B] ring-1 ring-white/8 flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] to-transparent to-40% z-10 pointer-events-none" />
                <div className="flex gap-1.5 p-3 h-full">
                  {[
                    {title:'New Reply',color:'#22D3EE',card:'Owen Dental',val:'\u00A3850'},
                    {title:'Qualified',color:'#4F46E5',card:'Donovan Sol.',val:'\u00A3950'},
                    {title:'Proposal',color:'#3B82F6',card:'Carter Law',val:'\u00A31,200'},
                    {title:'Negotiating',color:'#F59E0B',card:'Apex Fin.',val:'\u00A32,100'},
                    {title:'Won',color:'#10B981',card:'Smile Clinic',val:'\u00A31,500'},
                    {title:'Lost',color:'#EF4444',card:'',val:''},
                  ].map((col,i) => (
                    <div key={i} className="flex-1 min-w-0">
                      <div className="text-[7px] font-bold uppercase tracking-wide pb-1 mb-1 truncate" style={{borderBottom: `2px solid ${col.color}`, color: col.color}}>{col.title}</div>
                      {col.card && (
                        <div className="bg-white/6 rounded p-1.5">
                          <div className="text-[8px] text-white/65">{col.card}</div>
                          <div className="text-[8px] font-bold text-[#22D3EE]">{col.val}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-white/35 uppercase mb-1">Deal pipeline</p>
                <p className="text-2xl font-bold text-white mb-2">Built in CRM</p>
                <p className="text-sm text-white/50 leading-relaxed">Kanban pipeline with 6 stages. \u00A315,600 total pipeline value tracked automatically.</p>
              </div>
            </div>

            {/* Keyword Monitor */}
            <div className="relative lg:col-span-2 rounded-[2rem] lg:rounded-tl-none lg:rounded-tr-none lg:rounded-br-none overflow-hidden bg-[#1E293B] ring-1 ring-white/8 flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 flex flex-col justify-center gap-3 p-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] to-transparent to-40% z-10 pointer-events-none" />
                {[
                  {header:'Active monitor 1', chips:['law firm marketing','legal SEO']},
                  {header:'Active monitor 2', chips:['solicitor client acquisition','law firm growth']},
                ].map((monitor,i) => (
                  <div key={i} className="bg-white/6 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-white/35 uppercase tracking-wide mb-2">{monitor.header}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {monitor.chips.map(chip => (
                        <span key={chip} className="px-2.5 py-1 bg-[#4F46E5]/20 border border-[#4F46E5]/30 rounded-full text-[11px] text-white/75">{chip}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-white/35 uppercase mb-1">Keyword monitor</p>
                <p className="text-2xl font-bold text-white mb-2">Catch buyers on LinkedIn</p>
                <p className="text-sm text-white/50 leading-relaxed">Monitor keywords every 2 hours. Prospects posting about your service get auto enrolled as hot leads.</p>
              </div>
            </div>

            {/* Performance Analyser */}
            <div className="relative lg:col-span-4 rounded-bl-[2rem] rounded-br-[2rem] lg:rounded-tl-none lg:rounded-bl-none overflow-hidden bg-[#1E293B] ring-1 ring-white/8 flex flex-col lp-bento-card">
              <div className="relative h-80 flex-shrink-0 flex items-center gap-8 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1E293B] to-transparent to-40% z-10 pointer-events-none" />
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#4F46E5" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="55.3" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">78</div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    {label:'Subject lines with questions',color:'bg-[#4F46E5]',w:'w-[82%]'},
                    {label:'Personalised openers',color:'bg-[#22D3EE]',w:'w-[65%]'},
                    {label:'Generic templates',color:'bg-[#3B82F6]',w:'w-[30%]'},
                  ].map((bar,i) => (
                    <div key={i}>
                      <div className="text-[10px] text-white/45 mb-1">{bar.label}</div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full ${bar.color} ${bar.w} rounded-full`} />
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-1">
                    {['Tuesday to Thursday best','More personalisation needed'].map(pill => (
                      <span key={pill} className="px-2.5 py-1 bg-[#4F46E5]/15 rounded-full text-[10px] text-white/60">{pill}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative p-8">
                <p className="text-xs font-bold tracking-wider text-white/35 uppercase mb-1">Performance analyser</p>
                <p className="text-2xl font-bold text-white mb-2">Gets smarter every campaign</p>
                <p className="text-sm text-white/50 leading-relaxed">Studies your email data every 6 hours. Sends personalised improvement reports. The longer you use it, the better your results.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========== 11. LEAD INTELLIGENCE ========== */}
      <section className="py-24 bg-gradient-to-br from-[#F8FAFF] via-[#EEF2FF] to-[#F0FFFE] lp-intel-section">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm font-bold tracking-[2px] text-[#4F46E5] uppercase mb-4">Lead intelligence</p>
              <h2 className="text-4xl font-black tracking-tight text-gray-950 leading-tight mb-6">Stop guessing what to say. Know everything before you reach out.</h2>
              <p className="text-gray-500 leading-relaxed mb-6">Before you send a single word, Leadomation already knows your prospect's pain point, their Google rating, their recent business expansion and exactly what subject line will get them to open. Lead Intelligence generates a full research report for every prospect in seconds.</p>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/25 text-sm font-semibold text-[#097B8F]">Pro feature</span>
            </div>
            <div className="bg-white rounded-[2rem] p-8 shadow-xl ring-1 ring-[#4F46E5]/8">
              <p className="text-xs font-bold tracking-[1.5px] text-gray-400 uppercase mb-5">Lead Intelligence Report</p>
              {[
                {label:'Opportunity rating', value: <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold">Hot</span>},
                {label:'Pain intensity', value: <div><div className="text-sm text-gray-800 mb-2">7 / 10</div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-[70%] bg-gradient-to-r from-[#4F46E5] to-[#22D3EE] rounded-full"/></div></div>},
                {label:'Pain point', value: 'No online booking system. Losing walk in customers to competitors with digital scheduling.'},
                {label:'Outreach angle', value: 'Position as a quick win digital upgrade. Reference their 4.8 star Google rating.'},
                {label:'Personalisation hook', value: 'Mention their recent expansion to a second location.'},
                {label:'Suggested subject line', value: <span className="text-[#06B6D4] font-semibold">Quick fix for your booking gap</span>},
                {label:'Suggested opening line', value: <span className="text-[#4F46E5] font-semibold">I noticed your second location just opened...</span>},
              ].map((row,i) => (
                <div key={i} className="mb-4 lp-intel-field">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">{row.label}</div>
                  <div className="text-sm text-gray-700 leading-relaxed">{row.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 12. STATS BAR ========== */}
      <section className="py-20 bg-gradient-to-r from-[#4F46E5] to-[#1E1B4B]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {value:'500+', label:'Leads found per campaign'},
              {value:'35', label:'Day LinkedIn relationship funnel'},
              {value:'6hrs', label:'Between performance report updates'},
              {value:'8', label:'Step AI call script builder'},
            ].map((stat,i) => (
              <div key={i} className="flex flex-col gap-2">
                <dd className="text-5xl sm:text-6xl font-black text-white tracking-tight">{stat.value}</dd>
                <dt className="text-sm text-white/60 leading-snug max-w-[160px] mx-auto">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ========== 13. TESTIMONIALS ========== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[2px] text-[#4F46E5] uppercase mb-4">What people are saying</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950">Real results from real businesses.</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lp-testimonial-grid">
            {[
              {accent:'bg-[#4F46E5]', quote:'We booked 14 discovery calls in our first month. We had been trying to do this manually for two years and never got close to those numbers.', name:'Sarah Mitchell', role:'Director, Apex Digital Agency', initials:'SM', avatarBg:'bg-[#4F46E5]'},
              {accent:'bg-[#22D3EE]', quote:'The intent scoring alone is worth the subscription. We stopped wasting time on leads that were never going to buy and focused only on Hot prospects.', name:'James Hartley', role:'Partner, Hartley Commercial Solicitors', initials:'JH', avatarBg:'bg-[#06B6D4]'},
              {accent:'bg-[#3B82F6]', quote:'I set up one campaign on a Monday morning. By Wednesday my AI agent had already booked two calls. I have never seen anything work that fast.', name:'Priya Anand', role:'Founder, Anand Consulting', initials:'PA', avatarBg:'bg-[#3B82F6]'},
            ].map((t,i) => (
              <div key={i} className="relative bg-white rounded-[2rem] border border-black/5 p-10 shadow-sm overflow-hidden lp-testimonial-card">
                <div className={`absolute top-0 left-0 right-0 h-1 ${t.accent}`} />
                <div className="absolute top-5 right-6 text-7xl leading-none text-[#4F46E5]/8 font-serif select-none">"</div>
                <p className="text-base text-gray-600 leading-relaxed italic mb-8">{t.quote}</p>
                <div className="border-t border-gray-100 pt-5 flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full ${t.avatarBg} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>{t.initials}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 14. SWIRL DIVIDER ========== */}
      <section className="relative h-64 overflow-hidden bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#097B8F] flex items-center justify-center">
        <div className="absolute w-96 h-96 rounded-full bg-[#4F46E5]/20 blur-3xl -top-20 left-[10%]" />
        <div className="absolute w-80 h-80 rounded-full bg-[#22D3EE]/15 blur-3xl -bottom-20 right-[20%]" />
        <div className="relative z-10 text-center px-6">
          <p className="text-xl sm:text-2xl font-bold italic text-white mb-3">"The longer you use Leadomation, the better your results get."</p>
          <p className="text-sm text-white/50">Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.</p>
        </div>
      </section>

      {/* ========== 15. PRICING ========== */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-bold tracking-[2px] text-[#4F46E5] uppercase mb-4 lp-gsap-fade">Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 mb-6 lp-gsap-fade">Simple, transparent pricing.</h2>
            <p className="text-lg text-gray-500 mb-8 lp-gsap-fade">Start free. Upgrade when you are ready. No lock in contracts.</p>
            <div className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 lp-gsap-fade">
              <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${!annual ? 'bg-[#4F46E5] text-white' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setAnnual(false)}>Monthly</button>
              <button className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${annual ? 'bg-[#4F46E5] text-white' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setAnnual(true)}>
                Annual <span className="text-xs ml-1 text-emerald-500 font-bold">20% off</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-[2rem] ring-1 ring-black/5 shadow-sm p-8 flex flex-col lp-gsap-fade">
              <p className="text-xs text-gray-500 mb-2">Perfect for individuals and small teams</p>
              <h3 className="text-xl font-bold text-gray-950 mb-4">Starter</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-medium text-gray-500">&pound;</span>
                <span className="text-5xl font-black text-gray-950 tracking-tight">{annual ? '47' : '59'}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">{annual ? 'Billed annually at \u00A3566' : 'Billed monthly'}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['500 leads per month', 'Email sequences', 'Basic enrichment', 'Lead scoring', 'Email support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#4F46E5] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => onNavigate('Register')}>Start free trial</button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-[2rem] ring-2 ring-[#4F46E5] shadow-sm p-8 flex flex-col relative lp-gsap-fade">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#4F46E5] text-xs font-bold text-white">Most popular</div>
              <p className="text-xs text-gray-500 mb-2">For growing businesses serious about outreach</p>
              <h3 className="text-xl font-bold text-gray-950 mb-4">Pro</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-medium text-gray-500">&pound;</span>
                <span className="text-5xl font-black text-gray-950 tracking-tight">{annual ? '127' : '159'}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">{annual ? 'Billed annually at \u00A31,526' : 'Billed monthly'}</p>
              <ul className="space-y-3 mb-8 flex-1">
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
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-[#4F46E5] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4338CA] transition-colors" onClick={() => onNavigate('Register')}>Start free trial</button>
            </div>

            {/* Scale */}
            <div className="bg-white rounded-[2rem] ring-1 ring-black/5 shadow-sm p-8 flex flex-col opacity-60 lp-gsap-fade">
              <p className="text-xs text-gray-500 mb-2">For agencies and high volume teams</p>
              <h3 className="text-xl font-bold text-gray-950 mb-4">Scale</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-sm font-medium text-gray-500">&pound;</span>
                <span className="text-5xl font-black text-gray-950 tracking-tight">{annual ? '287' : '359'}</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">Coming soon</p>
              <ul className="space-y-3 mb-8 flex-1">
                {['Unlimited leads', 'Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed">Join waitlist</button>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 16. FAQ ========== */}
      <section className="py-24 bg-white" id="faq">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-950 text-center mb-16 lp-gsap-fade">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-xl border border-gray-200 overflow-hidden lp-gsap-fade`}>
                <button className="w-full flex items-center justify-between px-6 py-4 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 17. FINAL CTA ========== */}
      <section className="px-2 pb-2">
        <div className="rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#4F46E5] to-[#1E1B4B] py-24 px-6 text-center">
          <p className="text-sm font-bold tracking-[2px] text-white/50 uppercase mb-6">Get started</p>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-6">Your pipeline<br />won't fill itself.</h2>
          <p className="text-lg text-white/65 max-w-md mx-auto mb-10">Start your 7 day free trial today. No credit card required for the first 7 days.</p>
          <button onClick={() => onNavigate('Register')} className="rounded-full bg-white px-10 py-4 text-base font-bold text-[#4F46E5] hover:bg-gray-50 transition-all hover:-translate-y-0.5 shadow-lg">
            Start your free trial
          </button>
          <p className="text-xs text-white/35 mt-5">No credit card required for first 7 days</p>
        </div>
      </section>

      {/* ========== 18. FOOTER ========== */}
      <footer className="bg-[#0F172A] py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <img src={logoDark} alt="Leadomation" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm text-white/40 leading-relaxed">
                B2B lead generation and outreach automation. Find leads, enrich contacts and close deals on autopilot.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/60 uppercase mb-4">Product</h4>
              <div className="flex flex-col gap-2.5">
                <button onClick={() => scrollTo('features')} className="text-sm text-white/40 hover:text-white transition-colors text-left">Features</button>
                <button onClick={() => scrollTo('pricing')} className="text-sm text-white/40 hover:text-white transition-colors text-left">Pricing</button>
                <button onClick={() => scrollTo('how')} className="text-sm text-white/40 hover:text-white transition-colors text-left">How it works</button>
                <Link to="/blog" className="text-sm text-white/40 hover:text-white transition-colors">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/60 uppercase mb-4">Company</h4>
              <div className="flex flex-col gap-2.5">
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/40 hover:text-white transition-colors">About</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/40 hover:text-white transition-colors">Contact</a>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/40 hover:text-white transition-colors">Careers</a>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-white/60 uppercase mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5">
                <button onClick={() => onNavigate('Privacy')} className="text-sm text-white/40 hover:text-white transition-colors text-left">Privacy Policy</button>
                <button onClick={() => onNavigate('Terms')} className="text-sm text-white/40 hover:text-white transition-colors text-left">Terms of Service</button>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-white/40 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-white/30">&copy; 2026 Leadomation by Lumarr Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
