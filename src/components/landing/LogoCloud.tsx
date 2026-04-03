import React from 'react'

const partners = [
  { name: 'Google Maps', letter: 'G' },
  { name: 'Hunter.io', letter: 'H' },
  { name: 'LinkedIn', letter: 'L' },
  { name: 'Microsoft 365', letter: 'M' },
  { name: 'Stripe', letter: 'S' },
  { name: 'Supabase', letter: 'S' },
  { name: 'Unipile', letter: 'U' },
  { name: 'Vapi.ai', letter: 'V' },
  { name: 'Apollo', letter: 'A' },
  { name: 'Resend', letter: 'R' },
]

const LogoCloud: React.FC = () => {
  const items = [...partners, ...partners]

  return (
    <section className="py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="lp-fade text-center text-xs font-semibold tracking-widest text-gray-400 uppercase mb-10">
          Powered by industry leaders
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-[marquee_30s_linear_infinite] w-max gap-10">
          {items.map((partner, i) => (
            <div key={`${partner.name}-${i}`} className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-[#4F46E5]/8 flex items-center justify-center">
                <span className="text-sm font-bold text-[#4F46E5]">{partner.letter}</span>
              </div>
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LogoCloud
