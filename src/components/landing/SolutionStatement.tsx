import React from 'react'

const steps = [
  { num: 1, label: 'Find' },
  { num: 2, label: 'Enrich' },
  { num: 3, label: 'Contact' },
  { num: 4, label: 'Follow up' },
  { num: 5, label: 'Book' },
]

const SolutionStatement: React.FC = () => {
  return (
    <section className="bg-[#EEF2FF] py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
          The solution
        </p>
        <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-[#1E1B4B] text-pretty max-w-3xl mx-auto">
          One platform. Every step of outreach. Completely automated.
        </h2>
        <p className="lp-fade mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Leadomation replaces your lead scraper, email tool, LinkedIn outreach software and sales dialler with a single AI powered system.
        </p>

        <div className="lp-fade mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              {i > 0 && (
                <div className="hidden sm:block w-12 h-0.5 bg-[#22D3EE]/30" />
              )}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-md">
                  <span className="text-lg font-semibold text-white">{step.num}</span>
                </div>
                <span className="text-sm font-medium text-[#1E1B4B]/70">{step.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SolutionStatement
