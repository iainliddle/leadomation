import React from 'react'

const SwirlDivider: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-[#1E1B4B] via-[#0F172A] to-[#097B8F] overflow-hidden" style={{ height: 280 }}>
      {/* Blurred blobs */}
      <div className="absolute top-[-40%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#4F46E5]/20 blur-[100px]" />
      <div className="absolute bottom-[-30%] right-[20%] w-[250px] h-[250px] rounded-full bg-[#22D3EE]/15 blur-[80px]" />
      <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] rounded-full bg-[#097B8F]/20 blur-[90px]" />

      <div className="relative flex flex-col items-center justify-center h-full px-6 text-center">
        <p className="text-2xl sm:text-3xl font-medium text-white italic max-w-2xl text-pretty">
          "The longer you use Leadomation, the better your results get."
        </p>
        <p className="mt-4 text-sm text-white/50 max-w-lg">
          Campaign Performance Analyser studies your data every 6 hours and sends personalised improvement reports.
        </p>
      </div>
    </section>
  )
}

export default SwirlDivider
