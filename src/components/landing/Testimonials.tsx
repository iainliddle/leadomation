import React from 'react'

const testimonials = [
  {
    accent: 'bg-[#4F46E5]',
    avatarBg: 'bg-[#4F46E5]',
    initials: 'SM',
    quote: 'We booked 14 discovery calls in our first month. We had been trying to do this manually for two years and never got close to those numbers.',
    name: 'Sarah Mitchell',
    role: 'Director, Apex Digital Agency',
  },
  {
    accent: 'bg-[#22D3EE]',
    avatarBg: 'bg-[#06B6D4]',
    initials: 'JH',
    quote: 'The intent scoring alone is worth the subscription. We stopped wasting time on leads that were never going to buy and focused only on Hot prospects.',
    name: 'James Hartley',
    role: 'Partner, Hartley Commercial Solicitors',
  },
  {
    accent: 'bg-[#3B82F6]',
    avatarBg: 'bg-[#3B82F6]',
    initials: 'PA',
    quote: 'I set up one campaign on a Monday morning. By Wednesday my AI agent had already booked two calls. I have never seen anything work that fast.',
    name: 'Priya Anand',
    role: 'Founder, Anand Consulting',
  },
]

const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lp-fade grid grid-cols-1 lg:grid-cols-3 gap-8 lp-testimonial-grid">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="lp-testimonial-card rounded-[2rem] bg-white border border-black/5 shadow-sm overflow-hidden"
            >
              {/* Accent bar */}
              <div className={`h-1.5 ${t.accent}`} />
              <div className="p-10">
                {/* Quote mark */}
                <span className="text-6xl font-serif text-[#4F46E5]/8 leading-none">{'\u201C'}</span>
                <p className="mt-2 text-base italic text-gray-700 leading-relaxed">{t.quote}</p>
                <div className="mt-6 border-t border-gray-100 pt-6 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center`}>
                    <span className="text-xs font-bold text-white">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-950">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
