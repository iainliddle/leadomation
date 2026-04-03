import React from 'react'

interface HeroProps {
  onNavigate: (page: string) => void
  scrollTo: (id: string) => void
}

const Hero: React.FC<HeroProps> = ({ onNavigate, scrollTo }) => {
  return (
    <section className="relative overflow-hidden" id="hero">
      {/* Radial gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,70,229,0.2) 0%, rgba(34,211,238,0.1) 40%, rgba(207,250,254,0.05) 70%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-24 pb-16 sm:pt-32">
        {/* Gradient accent */}
        <div className="absolute inset-2 bottom-0 rounded-4xl bg-linear-115 from-[#CFFAFE] from-28% via-[#22D3EE] via-70% to-[#4F46E5] ring-1 ring-black/5 ring-inset opacity-[0.07]" />

        <div className="relative text-center max-w-4xl mx-auto">
          <h1 className="lp-fade font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            Your next 100 clients.<br />
            <span className="text-[#4F46E5]">Found automatically.</span>
          </h1>
          <p className="lp-fade mt-8 text-lg/7 font-medium text-gray-500 max-w-2xl mx-auto text-pretty">
            Leadomation finds and enriches B2B leads, writes personalised outreach, automates LinkedIn and calls prospects with an AI voice agent. Your pipeline fills while you focus on closing.
          </p>

          <div className="lp-fade mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('Register')}
              className="rounded-full bg-gray-950 px-8 py-4 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
            >
              Start free trial
            </button>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="rounded-full ring-1 ring-black/10 px-8 py-4 text-sm font-semibold text-gray-950 hover:bg-gray-50 transition-colors"
            >
              See how it works
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            7 day free trial. Secure with a card. Cancel anytime.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="lp-fade mt-16 sm:mt-24">
          <div className="rounded-[2rem] bg-[#1a1a2e] shadow-2xl overflow-hidden ring-1 ring-white/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-3 bg-[#12122a] border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-white/30 bg-white/5 rounded-full px-4 py-1">
                  app.leadomation.co.uk/dashboard
                </span>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="flex min-h-[380px] sm:min-h-[440px]">
              {/* Sidebar */}
              <div className="hidden sm:flex flex-col w-[180px] bg-white border-r border-gray-100 py-4">
                <div className="px-4 mb-4">
                  <span className="text-sm font-bold text-[#4F46E5]">Leadomation</span>
                </div>
                <nav className="flex flex-col gap-0.5 px-2">
                  {[
                    { label: 'Dashboard', active: true },
                    { label: 'Global Demand', active: false },
                    { label: 'New Campaign', active: false },
                    { label: 'Lead Database', active: false },
                    { label: 'Deal Pipeline', active: false },
                    { label: 'Sequence Builder', active: false },
                    { label: 'Inbox', active: false },
                    { label: 'Call Agent', active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                        item.active
                          ? 'bg-[#EEF2FF] text-[#4F46E5]'
                          : 'text-gray-500'
                      }`}
                    >
                      {item.label}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main area */}
              <div className="flex-1 bg-[#F8F9FA] p-4 sm:p-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Total Leads', value: '271', change: '+12%', up: true },
                    { label: 'Leads with Emails', value: '31', change: '+8%', up: true },
                    { label: 'Leads Contacted', value: '0', change: '', up: false },
                    { label: 'Total Deals', value: '10', change: '+3', up: true },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                      <p className="text-[10px] text-gray-400 mb-1">{stat.label}</p>
                      <div className="flex items-end gap-1.5">
                        <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                        {stat.change && (
                          <span className="text-[10px] font-medium text-emerald-500 mb-0.5">{stat.change}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Chart */}
                  <div className="sm:col-span-2 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-3">Campaign Performance</p>
                    <svg viewBox="0 0 400 120" className="w-full h-auto">
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,100 Q50,90 100,70 T200,50 T300,30 T400,20 L400,120 L0,120 Z" fill="url(#chartFill)" />
                      <path d="M0,100 Q50,90 100,70 T200,50 T300,30 T400,20" fill="none" stroke="#22D3EE" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Top Campaigns */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <p className="text-xs font-medium text-gray-700 mb-3">Top Campaigns</p>
                    <div className="space-y-3">
                      {[
                        { name: 'Dental Clinics UK', pct: 78 },
                        { name: 'Law Firms London', pct: 62 },
                        { name: 'Plumbers SE', pct: 45 },
                      ].map((c) => (
                        <div key={c.name}>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-gray-600">{c.name}</span>
                            <span className="text-gray-400">{c.pct}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4F46E5] rounded-full"
                              style={{ width: `${c.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
