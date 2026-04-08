import '../components/landing/landing.css'

export default function LandingPage() {
  return (
    <div className="lp-body antialiased overflow-x-hidden">
      {/* Section 1: Sticky Navigation */}
      <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-20">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight text-slate-900">Leadomation</span>
            <div className="hidden md:flex items-center gap-6">
              <a className="font-['Switzer'] font-medium text-sm antialiased text-indigo-600 font-semibold transition-colors duration-200" href="#">Features</a>
              <a className="font-['Switzer'] font-medium text-sm antialiased text-slate-600 hover:text-indigo-600 transition-colors duration-200" href="#">How it works</a>
              <a className="font-['Switzer'] font-medium text-sm antialiased text-slate-600 hover:text-indigo-600 transition-colors duration-200" href="#">Pricing</a>
              <a className="font-['Switzer'] font-medium text-sm antialiased text-slate-600 hover:text-indigo-600 transition-colors duration-200" href="#">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 text-sm font-medium hover:text-indigo-600 active:scale-95 transition-all">Sign in</button>
            <button className="bg-navy text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-ambient hover:opacity-90 active:scale-95 transition-all">Start free trial</button>
          </div>
        </nav>
      </header>

      {/* Section 2: Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Ambient gradient blobs */}
        <div className="blob blob-1" style={{ top: '-20%', left: '30%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
        <div className="blob blob-2" style={{ top: '10%', right: '-10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(34,211,238,0.09) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: -1 }} />
        <div className="blob blob-3" style={{ bottom: '0%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-navy mb-8 max-w-5xl mx-auto">
            Your next 100 clients are already out there. Leadomation finds them automatically.
          </h1>
          <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Leadomation orchestrates multi-channel outreach that feels human, acts intelligently, and scales infinitely. Stop hunting, start closing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button className="bg-navy text-white px-10 py-5 rounded-xl text-lg font-bold shadow-ambient hover:translate-y-[-2px] transition-all">Get started for free</button>
            <button className="bg-white border border-outline-variant/30 text-navy px-10 py-5 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all">Book a demo</button>
          </div>

          {/* Dashboard UI Illustration */}
          <div className="relative max-w-5xl mx-auto mt-16" style={{ transform: 'perspective(1000px) rotateX(4deg) rotateY(-2deg) rotateZ(1deg)' }}>
            <div className="bg-white rounded-xl shadow-ambient p-6 border border-slate-100 min-h-[500px]">
              <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="flex-1" />
                <div className="h-8 w-48 bg-slate-50 rounded-lg" />
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3 space-y-4">
                  <div className="h-10 bg-indigo-50 rounded-lg w-full" />
                  <div className="h-10 bg-slate-50 rounded-lg w-full" />
                  <div className="h-10 bg-slate-50 rounded-lg w-full" />
                  <div className="h-10 bg-slate-50 rounded-lg w-full" />
                </div>
                <div className="col-span-9 space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-indigo-600 p-6 rounded-lg text-left text-white">
                      <span className="block text-sm opacity-80">Total Leads</span>
                      <span className="text-3xl font-bold">12,482</span>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-lg text-left">
                      <span className="block text-sm text-slate-500">Positive Replies</span>
                      <span className="text-3xl font-bold text-navy">842</span>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-lg text-left">
                      <span className="block text-sm text-slate-500">Meetings Set</span>
                      <span className="text-3xl font-bold text-navy">156</span>
                    </div>
                  </div>
                  <div className="h-64 bg-slate-50 rounded-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-indigo-100/50 to-transparent" />
                    <div className="absolute inset-0 flex items-end px-12 gap-8">
                      <div className="w-full bg-indigo-600 h-1/3 rounded-t-lg" />
                      <div className="w-full bg-indigo-600 h-2/3 rounded-t-lg" />
                      <div className="w-full bg-indigo-600 h-1/2 rounded-t-lg" />
                      <div className="w-full bg-indigo-600 h-5/6 rounded-t-lg" />
                      <div className="w-full bg-indigo-600 h-2/5 rounded-t-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stat Cards */}
            <div className="absolute -top-10 -right-10 bg-white p-4 rounded-lg shadow-ambient border border-slate-100 flex items-center gap-4 max-w-[200px] float-a">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500">Conversion</p>
                <p className="font-bold">+24%</p>
              </div>
            </div>
            <div className="absolute top-1/2 -left-12 bg-white p-4 rounded-lg shadow-ambient border border-slate-100 flex items-center gap-4 float-b">
              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-500">Campaigns</p>
                <p className="font-bold">Active Now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Integration Marquee */}
      <section className="bg-white py-12 overflow-hidden border-y border-slate-50">
        <div className="flex marquee-animation gap-24 whitespace-nowrap px-12">
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs">H</span> Hunter.io</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-xs">A</span> Apollo.io</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">In</span> LinkedIn</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white text-xs">V</span> Vapi.ai</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-violet-500 rounded flex items-center justify-center text-white text-xs">R</span> Resend</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs">Ap</span> Apify</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-white text-xs">U</span> Unipile</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center text-white text-xs">D</span> DataForSEO</div>
          {/* Duplicate set for seamless loop */}
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs">H</span> Hunter.io</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-xs">A</span> Apollo.io</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">In</span> LinkedIn</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white text-xs">V</span> Vapi.ai</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-violet-500 rounded flex items-center justify-center text-white text-xs">R</span> Resend</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs">Ap</span> Apify</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-white text-xs">U</span> Unipile</div>
          <div className="flex items-center gap-3 text-slate-400 font-bold text-xl"><span className="w-8 h-8 bg-sky-600 rounded flex items-center justify-center text-white text-xs">D</span> DataForSEO</div>
        </div>
      </section>

      {/* Section 4: Problem Section */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #f8faff 50%, #F0FFFE 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">Traditional outreach is broken.</h2>
            <p className="text-xl text-slate-600">Manual prospecting takes hours, and generic templates go straight to spam. There's a better way.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-10 bg-white rounded-xl shadow-ambient border border-slate-50">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">timer_off</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Manual Drudgery</h3>
              <p className="text-slate-600 leading-relaxed">Sourcing, verifying, and messaging prospects manually is a full-time job that yields inconsistent results.</p>
            </div>
            <div className="p-10 bg-white rounded-xl shadow-ambient border border-slate-50">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">mail_lock</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">The Spam Trap</h3>
              <p className="text-slate-600 leading-relaxed">Without proper deliverability management, your domain's reputation will sink, landing you in the junk folder.</p>
            </div>
            <div className="p-10 bg-white rounded-xl shadow-ambient border border-slate-50">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined">blur_off</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Fragmented Data</h3>
              <p className="text-slate-600 leading-relaxed">Juggling LinkedIn, Email, and cold calls leads to lost opportunities and double-contacted prospects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Solution Section */}
      <section className="py-32 px-6 bg-[#EEF2FF]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-navy mb-8">One source of truth for every lead.</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-indigo-600 mt-1">check_circle</span>
                <div>
                  <h4 className="text-lg font-bold">Consolidated Lead Database</h4>
                  <p className="text-slate-600">Access 250M+ verified professionals with advanced filtering.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-indigo-600 mt-1">check_circle</span>
                <div>
                  <h4 className="text-lg font-bold">Automated Verification</h4>
                  <p className="text-slate-600">Real-time SMTP checks to ensure 0% bounce rates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-indigo-600 mt-1">check_circle</span>
                <div>
                  <h4 className="text-lg font-bold">Omni-Channel Sync</h4>
                  <p className="text-slate-600">Know exactly where each prospect is in the funnel across all platforms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Database UI Illustration with ambient glow */}
          <div className="relative">
            <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', zIndex: 0 }} />
            <div className="bg-white rounded-xl shadow-ambient p-8 overflow-hidden border border-slate-100 relative z-[1]">
              <div className="flex justify-between mb-8">
                <div className="h-10 w-48 bg-slate-50 rounded-lg" />
                <div className="h-10 w-24 bg-indigo-600 rounded-lg" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                  <div className="w-16 h-6 bg-emerald-50 text-emerald-600 text-[10px] flex items-center justify-center font-bold rounded">VERIFIED</div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 bg-slate-200 rounded" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded" />
                  </div>
                  <div className="w-16 h-6 bg-emerald-50 text-emerald-600 text-[10px] flex items-center justify-center font-bold rounded">VERIFIED</div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
                  <div className="w-10 h-10 bg-indigo-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 bg-indigo-300 rounded" />
                    <div className="h-3 w-3/4 bg-indigo-100 rounded" />
                  </div>
                  <div className="w-16 h-6 bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold rounded">ACTIVE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6A: Email Sequences */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 60%, #f0fffe 100%)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 bg-slate-50 rounded-xl p-8 shadow-inner border border-slate-100">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 w-full h-8 bg-indigo-200 rounded-full" />
                <div className="w-1 w-full h-8 bg-indigo-600 rounded-full" />
                <div className="w-1 w-full h-8 bg-indigo-200 rounded-full" />
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <p className="text-xs text-indigo-600 font-bold mb-2">SEQUENCE STEP 2</p>
                <p className="text-sm font-semibold mb-2">Subject: Quick question about your growth strategy</p>
                <p className="text-sm text-slate-500">Hi {'{{first_name}}'}, loved your recent post about...</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-sm opacity-50">
                <p className="text-xs text-slate-400 font-bold mb-2">SEQUENCE STEP 3 (WAIT 3 DAYS)</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-navy mb-6">Smart Email Sequences</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">Build hyper-personalised email flows that adapt to user behaviour. If they click a link, trigger a different follow-up. If they visit your pricing page, notify your sales team instantly.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-700 font-medium"><span className="w-2 h-2 bg-indigo-600 rounded-full" /> Dynamic field injection</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><span className="w-2 h-2 bg-indigo-600 rounded-full" /> A/B testing on subject lines</li>
              <li className="flex items-center gap-3 text-slate-700 font-medium"><span className="w-2 h-2 bg-indigo-600 rounded-full" /> Automatic warm-up included</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6B: Intent Scoring */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(160deg, #F0FFFE 0%, #eef9ff 50%, #f8faff 100%)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold text-navy mb-6">Intent-Based Scoring</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">Don't guess who to call. Leadomation scores every lead based on their real-world engagement, ensuring your sales team focuses on the hottest prospects first.</p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white rounded-lg border border-slate-100 text-sm font-bold shadow-sm">8.4 / 10 Score</div>
              <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold shadow-sm">Hot Prospect</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-ambient border border-slate-100">
            <div className="flex items-end gap-2 h-48">
              <div className="w-full bg-slate-100 rounded-t-lg h-1/4" />
              <div className="w-full bg-slate-100 rounded-t-lg h-2/5" />
              <div className="w-full bg-indigo-600 rounded-t-lg h-4/5" />
              <div className="w-full bg-slate-100 rounded-t-lg h-1/2" />
              <div className="w-full bg-slate-100 rounded-t-lg h-2/3" />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 text-center">
              <p className="text-sm font-bold text-navy">High Engagement Window Detected</p>
              <p className="text-xs text-slate-500">Peak activity Tuesday, 10:00 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6C: LinkedIn Outreach */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 50%, #EEF2FF 100%)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1 bg-slate-50 rounded-xl p-8 shadow-inner">
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">in</div>
                <p className="text-sm font-medium">Connection Request Sent</p>
                <span className="ml-auto material-symbols-outlined text-emerald-500">done_all</span>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">in</div>
                <p className="text-sm font-medium">Profile View & Endorsement</p>
                <span className="ml-auto material-symbols-outlined text-emerald-500">done_all</span>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border-2 border-indigo-400">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-[10px] font-bold">in</div>
                <p className="text-sm font-medium">Sending InMail Sequence...</p>
                <span className="ml-auto animate-pulse w-2 h-2 bg-indigo-600 rounded-full" />
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl font-bold text-navy mb-6">LinkedIn Multi-Touch</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">Automate connection requests, profile views, and messaging while staying within LinkedIn's safety limits. Seamlessly transition to email if they don't accept.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-bold text-navy">92%</h5>
                <p className="text-xs text-slate-500">Response uplift</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-bold text-navy">100%</h5>
                <p className="text-xs text-slate-500">Cloud-based safety</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6D: AI Voice Calling */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(160deg, #EEF2FF 0%, #e8f0ff 50%, #F0FFFE 100%)' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold text-navy mb-6">AI Voice Calling</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">Revolutionise your cold calls with AI-assisted diallers. Leadomation can automatically place calls and leave personalised voicemails that sound completely natural.</p>
            <button className="bg-navy text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              Hear Sample Voice
            </button>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-ambient border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                <span className="material-symbols-outlined">record_voice_over</span>
              </div>
              <div>
                <p className="text-sm font-bold">Script: Initial Outreach</p>
                <p className="text-xs text-slate-400">Tone: Professional & Friendly</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-lg text-sm italic">"Hi, I noticed you're leading the marketing team at..."</div>
              <div className="bg-slate-50 p-4 rounded-lg text-sm italic">"We recently helped a similar company in your sector..."</div>
              <div className="flex gap-2 justify-center">
                <div className="h-1.5 w-16 bg-indigo-200 rounded-full" />
                <div className="h-1.5 w-16 bg-indigo-600 rounded-full" />
                <div className="h-1.5 w-16 bg-indigo-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Bento Feature Grid */}
      <section className="py-32 px-6 relative" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 50%, #fafbff 100%)' }}>
        {/* Ambient blob behind bento grid */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(79,70,229,0.05) 0%, rgba(34,211,238,0.04) 50%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        <div className="max-w-7xl mx-auto relative z-[1]">
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-16 text-center">Engineered for absolute scale.</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2 p-10 bg-slate-50 rounded-xl flex flex-col justify-between border border-slate-100">
              <div className="mb-8">
                <span className="material-symbols-outlined text-indigo-600 text-4xl mb-4">dataset</span>
                <h3 className="text-2xl font-bold mb-2">Bespoke Lead Lists</h3>
                <p className="text-slate-600">Tailored data collection specifically for your ICP (Ideal Customer Profile).</p>
              </div>
              <div className="h-24 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-cyan-100 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white" />
                  <div className="w-10 h-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+2k</div>
                </div>
              </div>
            </div>
            <div className="p-10 bg-white rounded-xl flex flex-col justify-between border border-slate-100">
              <span className="material-symbols-outlined text-indigo-600 text-4xl mb-4">shield</span>
              <h3 className="text-2xl font-bold text-navy">Safe Mode</h3>
              <p className="text-slate-600 text-sm">Protects your reputation by mimicking human limits and browser activity.</p>
            </div>
            <div className="p-10 bg-[#EEF2FF] rounded-xl flex flex-col justify-between border border-slate-100">
              <span className="material-symbols-outlined text-indigo-600 text-4xl mb-4">psychology</span>
              <h3 className="text-2xl font-bold text-navy">AI Cleaning</h3>
              <p className="text-slate-600 text-sm">Automatically cleans "LLC", "Inc.", and bad casing from company names.</p>
            </div>
            <div className="p-10 bg-white rounded-xl shadow-ambient border border-slate-100 flex flex-col justify-between md:col-span-1">
              <span className="material-symbols-outlined text-4xl mb-4 text-indigo-600">mail</span>
              <h3 className="text-xl font-bold">Infinite Inboxes</h3>
              <p className="text-slate-500 text-sm">Connect unlimited Gmail/Outlook accounts for massive scale.</p>
            </div>
            <div className="md:col-span-3 p-10 bg-[#F0FFFE] rounded-xl flex flex-col md:flex-row gap-8 items-center border border-cyan-50">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">Automated CRM Sync</h3>
                <p className="text-slate-600">Push leads directly to HubSpot, Salesforce, or Pipedrive the moment they show interest.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-orange-500">Hub</div>
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-blue-500">Sf</div>
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-800">Pd</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: UI Showcase Carousel */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <h2 className="text-4xl font-bold text-navy">Everything you need in one place.</h2>
        </div>
        <div className="flex gap-8 px-6 no-scrollbar overflow-x-auto pb-12">
          <div className="min-w-[400px] bg-white rounded-xl shadow-ambient p-6 border border-slate-100">
            <div className="h-4 w-32 bg-indigo-50 rounded mb-4" />
            <div className="h-48 bg-slate-50 rounded mb-4" />
            <p className="font-bold">Omni-Channel Inbox</p>
          </div>
          <div className="min-w-[400px] bg-white rounded-xl shadow-ambient p-6 border border-slate-100">
            <div className="h-4 w-32 bg-indigo-50 rounded mb-4" />
            <div className="h-48 bg-slate-50 rounded mb-4" />
            <p className="font-bold">Kanban CRM View</p>
          </div>
          <div className="min-w-[400px] bg-white rounded-xl shadow-ambient p-6 border border-slate-100">
            <div className="h-4 w-32 bg-indigo-50 rounded mb-4" />
            <div className="h-48 bg-slate-50 rounded mb-4" />
            <p className="font-bold">Real-time Analytics</p>
          </div>
          <div className="min-w-[400px] bg-white rounded-xl shadow-ambient p-6 border border-slate-100">
            <div className="h-4 w-32 bg-indigo-50 rounded mb-4" />
            <div className="h-48 bg-slate-50 rounded mb-4" />
            <p className="font-bold">Script Playground</p>
          </div>
          <div className="min-w-[400px] bg-white rounded-xl shadow-ambient p-6 border border-slate-100">
            <div className="h-4 w-32 bg-indigo-50 rounded mb-4" />
            <div className="h-48 bg-slate-50 rounded mb-4" />
            <p className="font-bold">Team Performance</p>
          </div>
        </div>
      </section>

      {/* Section 9: Stats Row */}
      <section className="py-24 border-y border-slate-50" style={{ background: 'linear-gradient(90deg, #ffffff 0%, #EEF2FF 25%, #F0FFFE 50%, #EEF2FF 75%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-5xl font-bold text-indigo-600 mb-2">500+</p>
            <p className="text-slate-500 font-medium">Leads found per campaign</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-indigo-600 mb-2">35 day</p>
            <p className="text-slate-500 font-medium">LinkedIn relationship funnel</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-indigo-600 mb-2">6hrs</p>
            <p className="text-slate-500 font-medium">Between performance report updates</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-indigo-600 mb-2">8 step</p>
            <p className="text-slate-500 font-medium">AI call script builder</p>
          </div>
        </div>
      </section>

      {/* Section 10: Testimonials */}
      <section className="py-32 px-6" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 40%, #F0FFFE 80%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-navy text-center mb-16">Trusted by growth-minded teams.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-xl shadow-ambient border border-slate-100">
              <div className="flex text-amber-400 mb-6">
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-700 italic mb-8">"Booked 14 discovery calls in our first month. The intent scoring alone saved us hours every week because we knew exactly who to contact first."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#4F46E5' }}>SM</div>
                <div>
                  <p className="font-bold">Sarah Mitchell</p>
                  <p className="text-xs text-slate-500">Director, Apex Digital Agency</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-ambient border border-slate-100">
              <div className="flex text-amber-400 mb-6">
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-700 italic mb-8">"The intent scoring is worth the subscription on its own. We stopped wasting time on cold leads and started closing the ones that were already warm."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#06B6D4' }}>JH</div>
                <div>
                  <p className="font-bold">James Hartley</p>
                  <p className="text-xs text-slate-500">Partner, Hartley Commercial Solicitors</p>
                </div>
              </div>
            </div>
            <div className="p-8 bg-white rounded-xl shadow-ambient border border-slate-100">
              <div className="flex text-amber-400 mb-6">
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
              </div>
              <p className="text-slate-700 italic mb-8">"I set up a campaign on Monday and had two calls booked by Wednesday. As a solo founder this is the closest thing to having a full sales team."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#3B82F6' }}>PA</div>
                <div>
                  <p className="font-bold">Priya Anand</p>
                  <p className="text-xs text-slate-500">Founder, Anand Consulting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 11: Pricing */}
      <section className="py-32 px-6 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-navy mb-4">Simple, transparent pricing.</h2>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="font-medium">Monthly</span>
              <div className="w-12 h-6 bg-indigo-600 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
              <span className="font-medium text-slate-400">Annual <span className="text-emerald-500 text-xs">(Save 20%)</span></span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-10 bg-white rounded-xl border border-slate-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-500 mb-8">Perfect for solo founders.</p>
              <div className="mb-8"><span className="text-4xl font-bold">&pound;59</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 500 leads/mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 30 emails/day</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 25 keyword searches</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 4 sequence steps</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Basic enrichment</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Lead scoring</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Email support</li>
              </ul>
              <button className="w-full py-4 rounded-lg font-bold border border-slate-200 hover:bg-slate-50 transition-all">Start free trial</button>
            </div>
            {/* Pro */}
            <div className="p-10 bg-white rounded-xl border-2 border-indigo-600 shadow-ambient relative flex flex-col scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-slate-500 mb-8">For growing sales teams.</p>
              <div className="mb-8"><span className="text-4xl font-bold">&pound;159</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 2,000 leads/mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 100 emails/day</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 75 keyword searches</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Unlimited steps</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> LinkedIn sequences</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> 50 voice calls/mo</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Campaign Performance Analyser</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Lead Intelligence 50/day</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> A/B testing</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Priority support</li>
              </ul>
              <button className="w-full py-4 rounded-lg font-bold bg-navy text-white hover:opacity-90 transition-all">Start free trial</button>
            </div>
            {/* Scale */}
            <div className="p-10 bg-white rounded-xl border border-slate-100 flex flex-col">
              <h3 className="text-xl font-bold mb-2">Scale</h3>
              <p className="text-slate-500 mb-8">Coming soon</p>
              <div className="mb-8"><span className="text-4xl font-bold">&pound;359</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Unlimited leads</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Dedicated account manager</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> Custom integrations</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-indigo-600 text-sm">check</span> SLA guarantee</li>
              </ul>
              <button className="w-full py-4 rounded-lg font-bold border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" disabled>Notify me</button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 12: FAQ */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-navy mb-16">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
            <div>
              <h4 className="text-lg font-bold mb-4">Is Leadomation safe for my LinkedIn account?</h4>
              <p className="text-slate-600">Yes. We use cloud-based, residential proxies and human-mimicry technology to stay well within LinkedIn's safety limits.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Can I connect multiple email accounts?</h4>
              <p className="text-slate-600">Absolutely. You can connect unlimited Gmail and Outlook accounts on all paid plans to distribute your sending volume.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">How accurate is the lead data?</h4>
              <p className="text-slate-600">Our database is updated in real-time. Every email is verified through a triple-check SMTP process before being sent.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Do you offer onboarding support?</h4>
              <p className="text-slate-600">Pro and Scale plans include a dedicated session to help you build your first high-converting outreach sequence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 13: CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50/30 -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-100/50 to-cyan-100/50 rounded-full blur-3xl -z-10" />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', zIndex: -1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: -1, pointerEvents: 'none' }} />
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-navy mb-8">Your pipeline won't fill itself.</h2>
          <p className="text-xl text-slate-600 mb-12">Start your free 7-day trial. No setup fees. Cancel anytime.</p>
          <button className="bg-navy text-white px-12 py-6 rounded-xl text-xl font-bold shadow-ambient hover:scale-105 transition-all">Start free trial &rarr;</button>
          <p className="mt-6 text-sm text-slate-400">7 day free trial. Cancel anytime.</p>
        </div>
      </section>

      {/* Section 14: Dark Navy Footer */}
      <footer className="bg-slate-900 w-full rounded-t-[3rem] mt-20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="col-span-2">
            <span className="text-2xl font-bold text-white mb-4 block">Leadomation</span>
            <p className="font-['Switzer'] text-slate-400 leading-relaxed max-w-sm">The world's most advanced AI-powered multi-channel outreach engine for modern sales teams.</p>
          </div>
          <div>
            <h5 className="text-white font-medium mb-6">Product</h5>
            <ul className="space-y-4 font-['Switzer'] text-slate-400">
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Features</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Integrations</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Pricing</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium mb-6">Company</h5>
            <ul className="space-y-4 font-['Switzer'] text-slate-400">
              <li><a className="hover:text-indigo-400 transition-colors" href="#">About</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Blog</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-medium mb-6">Legal</h5>
            <ul className="space-y-4 font-['Switzer'] text-slate-400">
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Privacy</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Terms</a></li>
              <li><a className="hover:text-indigo-400 transition-colors" href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 py-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-['Switzer'] text-slate-400 text-sm">&copy; 2026 Lumarr Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
            <a className="text-slate-400 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">rss_feed</span></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
