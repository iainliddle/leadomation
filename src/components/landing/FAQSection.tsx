import React, { useState } from 'react'

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
    a: "You build an 8 step call script in the Call Agent. Leadomation's AI agent calls your leads, handles objections and books meetings directly into your calendar.",
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
]

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white" id="faq">
      <div className="mx-auto max-w-[720px] px-6">
        <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-center mb-16">
          Frequently asked questions
        </h2>

        <div className="lp-fade space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
