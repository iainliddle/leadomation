import React from 'react'

const stats = [
  { value: '500+', label: 'Leads found per campaign' },
  { value: '35', label: 'Day LinkedIn relationship funnel' },
  { value: '6hrs', label: 'Between performance report updates' },
  { value: '8', label: 'Step AI call script builder' },
]

const StatsBar: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-[#4F46E5] to-[#1E1B4B] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lp-fade grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-5xl sm:text-6xl font-black text-white tracking-tight">{stat.value}</p>
              <p className="mt-2 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
