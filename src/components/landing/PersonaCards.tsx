import React from 'react'

const personas = [
  {
    gradient: 'from-[#4F46E5] to-[#22D3EE]',
    iconBg: 'bg-[#EEF2FF]',
    icon: '\u{1F3E2}',
    title: 'Agencies and consultants',
    pain: 'You need a steady flow of qualified prospects without hiring a sales team or spending hours on LinkedIn.',
    pillBg: 'bg-[#EEF2FF]',
    pillText: 'text-[#4F46E5]',
    outcome: 'Automate prospecting end to end',
  },
  {
    gradient: 'from-[#06B6D4] to-[#3B82F6]',
    iconBg: 'bg-[#F0FFFE]',
    icon: '\u{1F3EA}',
    title: 'Local B2B service businesses',
    pain: 'Plumbers, solicitors, accountants, dental practices. High value clients with long relationships. You need more of them consistently.',
    pillBg: 'bg-[#F0FFFE]',
    pillText: 'text-[#06B6D4]',
    outcome: 'Fill your diary with qualified calls',
  },
  {
    gradient: 'from-[#1E1B4B] to-[#4F46E5]',
    iconBg: 'bg-[#EEF2FF]',
    icon: '\u{1F464}',
    title: 'Founders doing their own sales',
    pain: 'You are closing deals yourself and every hour counts. You need outreach running in the background while you focus on closing.',
    pillBg: 'bg-[#EEF2FF]',
    pillText: 'text-[#4F46E5]',
    outcome: 'Let AI handle outreach while you close',
  },
]

const PersonaCards: React.FC = () => {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="lp-fade text-xs font-semibold tracking-widest text-[#06B6D4] uppercase mb-4">
            Who it's for
          </p>
          <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
            Built for B2B businesses that need a full pipeline, not just a list of names.
          </h2>
        </div>

        <div className="lp-fade grid grid-cols-1 sm:grid-cols-3 gap-6 lp-persona-cards">
          {personas.map((p) => (
            <div
              key={p.title}
              className="lp-persona-card rounded-[2rem] bg-white ring-1 ring-black/5 shadow-sm overflow-hidden"
            >
              {/* Gradient accent bar */}
              <div className={`h-1.5 bg-gradient-to-r ${p.gradient}`} />
              <div className="p-10">
                <div className={`w-12 h-12 rounded-full ${p.iconBg} flex items-center justify-center text-xl mb-6`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-950 mb-3">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{p.pain}</p>
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${p.pillBg} ${p.pillText}`}>
                  {p.outcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PersonaCards
