import React from 'react'

const cards = [
  {
    emoji: '\u{1F551}',
    bg: 'bg-red-50',
    title: "You're losing time finding leads",
    body: 'Most businesses spend 3 to 5 hours a week manually searching for prospects. By the time you reach out, your competitor already has.',
  },
  {
    emoji: '\u{1F4E7}',
    bg: 'bg-amber-50',
    title: 'Generic outreach gets ignored',
    body: 'Copy-paste cold emails have a 1% reply rate. Without personalisation at scale, you are invisible in every inbox you land in.',
  },
  {
    emoji: '\u{1F4DE}',
    bg: 'bg-[#EEF2FF]',
    title: 'Follow-ups fall through the cracks',
    body: '80% of sales require 5 or more follow-ups. Almost nobody does them consistently. Deals die in silence because no one called back.',
  },
]

const ProblemSection: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#F0FFFE]" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="lp-fade text-xs font-semibold tracking-widest text-[#06B6D4] uppercase mb-4">
            The problem
          </p>
          <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
            B2B lead generation is broken for most businesses.
          </h2>
          <p className="lp-fade mt-6 text-lg text-gray-500">
            Hours wasted finding leads manually. Generic outreach ignored. Follow-ups that never happen. Sound familiar?
          </p>
        </div>

        <div className="lp-fade grid grid-cols-1 sm:grid-cols-3 gap-6 lp-problem-cards">
          {cards.map((card) => (
            <div
              key={card.title}
              className="lp-problem-card rounded-[2rem] bg-white ring-1 ring-black/5 shadow-sm p-10"
            >
              <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center text-xl mb-6`}>
                {card.emoji}
              </div>
              <h3 className="text-lg font-semibold text-gray-950 mb-3">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
