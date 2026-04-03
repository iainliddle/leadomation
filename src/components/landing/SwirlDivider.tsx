import React from 'react'

const SwirlDivider: React.FC = () => {
  return (
    <section
      className="relative bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] overflow-hidden"
      style={{ height: 280 }}
    >
      {/* Subtle light overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
        }}
      />

      <div className="relative flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-2xl sm:text-3xl font-medium text-white italic max-w-2xl text-pretty">
          "The longer you use Leadomation, the better your results get."
        </p>
        <p className="mt-4 text-sm text-white/70 max-w-lg">
          Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.
        </p>
      </div>
    </section>
  )
}

export default SwirlDivider
