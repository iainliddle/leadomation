import React from 'react'
import { motion } from 'framer-motion'

const LightBento: React.FC = () => {
  return (
    <section className="py-24" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
            Features
          </p>
          <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
            Know more about your prospects than they expect.
          </h2>
          <p className="lp-fade mt-6 text-lg text-gray-500">
            One platform replaces your lead scraper, email tool, LinkedIn outreach and AI calling software.
          </p>
        </div>

        <div className="lp-fade grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2 lp-bento">
          {/* Card 1: Lead Database - col-span-3, rounded-tl-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            className="group relative rounded-lg rounded-tl-4xl bg-white shadow-xs ring-1 ring-black/5 lg:col-span-3 lp-bento-card"
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg rounded-tl-4xl">
              <div className="p-6">
                {/* Table header */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <span className="text-[10px] font-bold text-[#4F46E5] tracking-wider">COMPANY</span>
                  <span className="text-[10px] font-bold text-[#4F46E5] tracking-wider">STATUS</span>
                  <span className="text-[10px] font-bold text-[#4F46E5] tracking-wider text-right">INTENT</span>
                </div>
                {[
                  { name: 'Dunmore Dental Care', role: 'Practice Owner', status: 'ENRICHED', action: 'CONTACTED', intent: 'Hot', score: 63 },
                  { name: 'Smile Clinic Northwest', role: 'Clinical Director', status: 'ENRICHED', action: 'REPLIED', intent: 'Hot', score: 95 },
                  { name: 'Bright Smile Kent', role: 'Practice Owner', status: 'ENRICHED', action: 'CONTACTED', intent: 'Hot', score: 76 },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{row.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{row.role}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{row.status}</span>
                      <span className="text-[9px] font-medium text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded">{row.action}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold text-red-600">{row.intent}</span>
                      <span className="text-xs text-gray-400 mx-1">&#183;</span>
                      <span className="text-xs font-bold text-gray-700">{row.score}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
            </div>
            <div className="p-10">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Lead database</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">271 enriched leads ready to contact</h3>
              <p className="mt-2 text-sm text-gray-500">Verified emails, phone numbers, intent scores and decision maker contacts. Filter by Hot, Warm or Cool in one click.</p>
            </div>
          </motion.div>

          {/* Card 2: Campaign Builder - col-span-3, rounded-tr-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            className="group relative rounded-lg rounded-tr-4xl bg-white shadow-xs ring-1 ring-black/5 lg:col-span-3 lp-bento-card"
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg rounded-tr-4xl">
              <div className="p-6">
                {/* Wizard steps */}
                <div className="flex gap-2 mb-6">
                  {[
                    { label: 'Campaign details', active: true },
                    { label: 'Advanced targeting', active: false },
                    { label: 'Intent filters', active: false },
                    { label: 'Data enrichment', active: false },
                    { label: 'Outreach config', active: false },
                  ].map((step) => (
                    <span
                      key={step.label}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                        step.active
                          ? 'bg-[#4F46E5] text-white'
                          : 'bg-[#EEF2FF] text-[#4F46E5]'
                      }`}
                    >
                      {step.label}
                    </span>
                  ))}
                </div>
                {/* Campaign types */}
                <div className="space-y-2">
                  {[
                    { label: 'Local Businesses', selected: false },
                    { label: 'B2B Services', selected: true },
                    { label: 'Custom Search', selected: false },
                  ].map((type) => (
                    <div
                      key={type.label}
                      className={`px-4 py-3 rounded-xl border text-sm font-medium ${
                        type.selected
                          ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {type.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
            </div>
            <div className="p-10">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Campaign builder</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">Launch a campaign in 3 minutes</h3>
              <p className="mt-2 text-sm text-gray-500">5 step wizard. Pick industry, location, intent filters, enrichment and outreach strategy. Leadomation handles the rest.</p>
            </div>
          </motion.div>

          {/* Card 3: Intent Scoring - col-span-2, rounded-bl-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            className="group relative rounded-lg rounded-bl-4xl bg-white shadow-xs ring-1 ring-black/5 lg:col-span-2 lp-bento-card"
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg flex items-center justify-center">
              <div className="flex flex-col gap-4 items-center">
                {[
                  { label: 'Hot', emoji: '\u{1F525}', score: 95, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
                  { label: 'Warm', emoji: '\u{26A1}', score: 72, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
                  { label: 'Cool', emoji: '\u{1F4A7}', score: 45, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' },
                ].map((intent) => (
                  <div
                    key={intent.label}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full ${intent.bg} border ${intent.border}`}
                  >
                    <span className="text-lg">{intent.emoji}</span>
                    <span className={`text-sm font-semibold ${intent.text}`}>{intent.label}</span>
                    <span className={`text-lg font-bold ${intent.text}`}>{intent.score}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
            </div>
            <div className="p-10">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Intent scoring</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">Know who is ready to buy</h3>
              <p className="mt-2 text-sm text-gray-500">Every lead scored automatically based on buying signals, reviews and online presence.</p>
            </div>
          </motion.div>

          {/* Card 4: AI Voice Calling - col-span-2, dark bg */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            className="group relative rounded-lg bg-[#1E1B4B] shadow-xs ring-1 ring-white/15 lg:col-span-2 lp-bento-card"
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg bg-[#1E1B4B] flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                {/* Pulse ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-2 border-[#22D3EE]/25 animate-ping" />
                </div>
                {/* Phone icon */}
                <div className="relative w-20 h-20 rounded-full bg-[#22D3EE]/15 flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {/* Green dot */}
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 animate-pulse border-2 border-[#1E1B4B]" />
                </div>
                <span className="mt-4 text-sm font-medium text-white">AI Call Agent</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#1E1B4B] to-transparent" />
            </div>
            <div className="p-10">
              <p className="text-xs font-semibold tracking-widest text-white/40 uppercase">AI voice calling</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Your AI agent calls prospects 24/7</h3>
              <p className="mt-2 text-sm text-white/60">Handles objections, answers questions and books meetings directly into your calendar.</p>
            </div>
          </motion.div>

          {/* Card 5: LinkedIn Sequencer - col-span-2, rounded-br-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{ idle: {}, active: {} }}
            className="group relative rounded-lg rounded-br-4xl bg-white shadow-xs ring-1 ring-black/5 lg:col-span-2 lp-bento-card"
          >
            <div className="relative h-80 overflow-hidden rounded-t-lg flex items-center justify-center px-4">
              <div className="flex items-center gap-0 w-full overflow-x-auto">
                {[
                  { label: 'Silent Awareness', active: true },
                  { label: 'Connection', active: false },
                  { label: 'Warm Thanks', active: false },
                  { label: 'Advice Ask', active: false },
                  { label: 'Follow Up', active: false },
                  { label: 'Soft Offer', active: false },
                ].map((phase, i) => (
                  <React.Fragment key={phase.label}>
                    {i > 0 && <div className="w-4 h-0.5 bg-gray-200 shrink-0" />}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          phase.active ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-[9px] text-gray-500 whitespace-nowrap">{phase.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-white to-transparent" />
            </div>
            <div className="p-10">
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">LinkedIn sequencer</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">35 day LinkedIn funnel on autopilot</h3>
              <p className="mt-2 text-sm text-gray-500">Silent Awareness through to Soft Offer. Runs automatically, builds trust before making any ask.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default LightBento
