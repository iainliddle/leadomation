import React from 'react'
import { motion } from 'framer-motion'

const DarkBento: React.FC = () => {
  return (
    <div className="mx-2 mt-2 rounded-4xl bg-[#EEF2FF] py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
            Outreach
          </p>
          <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
            Close deals faster with AI.
          </h2>
        </div>

        <div className="lp-fade grid grid-cols-1 gap-4 lg:grid-cols-6 lg:grid-rows-2">
          {/* Card 1: Inbox - col-span-4, rounded-tl-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{
              idle: {},
              active: { y: -4, transition: { duration: 0.2 } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-lg max-lg:rounded-t-4xl lg:col-span-4 lg:rounded-tl-4xl bg-white shadow-xs ring-1 ring-black/5"
          >
            <div className="relative h-80 shrink-0 overflow-hidden max-lg:rounded-t-4xl lg:rounded-tl-4xl">
              <div className="flex gap-0 h-full">
                {/* Email list */}
                <div className="w-[45%] border-r border-gray-100 space-y-0">
                  {[
                    { name: 'London Smile Studio', status: 'Interested', highlight: true },
                    { name: 'Smile Clinic NW', status: 'Interested', highlight: false },
                    { name: 'Blackwell Partners', status: 'Interested', highlight: false },
                    { name: 'Forsyth Family Law', status: 'Not interested', highlight: false },
                  ].map((email) => (
                    <div
                      key={email.name}
                      className={`px-4 py-3 border-b border-gray-50 ${
                        email.highlight ? 'bg-[#EEF2FF]' : ''
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-900">
                        {email.name}
                      </p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          email.status === 'Interested'
                            ? 'text-emerald-600'
                            : 'text-red-500'
                        }`}
                      >
                        {email.status}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Preview */}
                <div className="flex-1 p-4">
                  <p className="text-xs text-gray-400 mb-2">
                    From: London Smile Studio
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Hi, thanks for reaching out. We have been looking at
                    improving our patient acquisition and your service sounds
                    like exactly what we need. Can we schedule a call this week
                    to discuss?
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-white to-50%" />
            </div>
            <div className="relative p-10">
              <p className="text-xs font-semibold tracking-widest text-[#4F46E5] uppercase">
                Inbox
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">
                Every reply classified automatically
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                AI reads every email and LinkedIn reply. Interested, Not
                Interested or Out of Office. Hot leads pushed to your pipeline
                instantly.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Deal Pipeline - col-span-2, rounded-tr-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{
              idle: {},
              active: { y: -4, transition: { duration: 0.2 } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-lg lg:col-span-2 lg:rounded-tr-4xl bg-white shadow-xs ring-1 ring-black/5"
          >
            <div className="relative h-80 shrink-0 overflow-hidden lg:rounded-tr-4xl">
              <div className="p-4 overflow-x-auto h-full">
                <div className="flex gap-2 min-w-[500px]">
                  {[
                    {
                      stage: 'New Reply',
                      color: '#22D3EE',
                      cards: [{ name: 'Owen Dental', value: '850' }],
                    },
                    {
                      stage: 'Qualified',
                      color: '#4F46E5',
                      cards: [{ name: 'Donovan Sol.', value: '950' }],
                    },
                    {
                      stage: 'Proposal',
                      color: '#3B82F6',
                      cards: [{ name: 'Carter Law', value: '1,200' }],
                    },
                    {
                      stage: 'Negotiating',
                      color: '#F59E0B',
                      cards: [{ name: 'Apex Fin.', value: '2,100' }],
                    },
                    {
                      stage: 'Won',
                      color: '#10B981',
                      cards: [{ name: 'Smile Clinic', value: '1,500' }],
                    },
                    { stage: 'Lost', color: '#EF4444', cards: [] },
                  ].map((col) => (
                    <div key={col.stage} className="flex-1 min-w-[80px]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: col.color }}
                        />
                        <span className="text-[9px] font-medium text-gray-400 whitespace-nowrap">
                          {col.stage}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {col.cards.map((card) => (
                          <div
                            key={card.name}
                            className="bg-gray-50 rounded-lg p-2 border border-gray-100"
                          >
                            <p className="text-[9px] font-medium text-gray-700">
                              {card.name}
                            </p>
                            <p className="text-[10px] font-bold text-[#4F46E5] mt-0.5">
                              {'\u00A3'}
                              {card.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-white to-50%" />
            </div>
            <div className="relative p-10">
              <p className="text-xs font-semibold tracking-widest text-[#4F46E5] uppercase">
                Deal pipeline
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">
                Built in CRM
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Kanban pipeline with 6 stages. {'\u00A3'}15,600 total pipeline
                value tracked automatically.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Keyword Monitor - col-span-2, rounded-bl-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{
              idle: {},
              active: { y: -4, transition: { duration: 0.2 } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-lg lg:col-span-2 lg:rounded-bl-4xl bg-white shadow-xs ring-1 ring-black/5"
          >
            <div className="relative h-80 shrink-0 overflow-hidden lg:rounded-bl-4xl flex flex-col items-center justify-center px-6">
              <div className="space-y-4 w-full max-w-[220px]">
                <div>
                  <p className="text-[10px] text-gray-400 mb-2">
                    Active monitor 1
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#EEF2FF] border border-[#4F46E5]/20 text-[#4F46E5]">
                      law firm marketing
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#EEF2FF] border border-[#4F46E5]/20 text-[#4F46E5]">
                      legal SEO
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-2">
                    Active monitor 2
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#EEF2FF] border border-[#4F46E5]/20 text-[#4F46E5]">
                      solicitor client acquisition
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-[#EEF2FF] border border-[#4F46E5]/20 text-[#4F46E5]">
                      law firm growth
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-white to-50%" />
            </div>
            <div className="relative p-10">
              <p className="text-xs font-semibold tracking-widest text-[#4F46E5] uppercase">
                Keyword monitor
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">
                Catch buyers on LinkedIn
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Monitor keywords every 2 hours. Prospects posting about your
                service get auto enrolled as hot leads.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Performance Analyser - col-span-4, rounded-br-4xl */}
          <motion.div
            initial="idle"
            whileHover="active"
            variants={{
              idle: {},
              active: { y: -4, transition: { duration: 0.2 } },
            }}
            className="group relative flex flex-col overflow-hidden rounded-lg lg:col-span-4 lg:rounded-br-4xl bg-white shadow-xs ring-1 ring-black/5"
          >
            <div className="relative h-80 shrink-0 overflow-hidden lg:rounded-br-4xl">
              <div className="p-6 flex gap-8 items-start">
                {/* Score circle */}
                <div className="shrink-0 flex flex-col items-center">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    className="mb-2"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#EEF2FF"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#4F46E5"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 42 * 0.78} ${2 * Math.PI * 42 * 0.22}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text
                      x="50"
                      y="46"
                      textAnchor="middle"
                      className="text-2xl font-bold fill-gray-900"
                    >
                      78
                    </text>
                    <text
                      x="50"
                      y="62"
                      textAnchor="middle"
                      className="text-[10px] fill-gray-400"
                    >
                      /100
                    </text>
                  </svg>
                </div>

                {/* Bars and insights */}
                <div className="flex-1 space-y-4">
                  {[
                    {
                      label: 'Subject lines questions',
                      color: 'bg-[#4F46E5]',
                      pct: 82,
                    },
                    {
                      label: 'Personalised openers',
                      color: 'bg-[#22D3EE]',
                      pct: 65,
                    },
                    {
                      label: 'Generic templates',
                      color: 'bg-[#3B82F6]',
                      pct: 30,
                    },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-gray-600">{bar.label}</span>
                        <span className="text-gray-400">{bar.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 mt-4">
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-medium bg-[#EEF2FF] text-[#4F46E5] border border-[#4F46E5]/20">
                      Tuesday to Thursday best
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-medium bg-cyan-50 text-[#06B6D4] border border-[#22D3EE]/20">
                      More personalisation needed
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-white to-50%" />
            </div>
            <div className="relative p-10">
              <p className="text-xs font-semibold tracking-widest text-[#4F46E5] uppercase">
                Performance analyser
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-950">
                Gets smarter every campaign
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Studies your email data every 6 hours. Sends personalised
                improvement reports. The longer you use it, the better your
                results.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DarkBento
