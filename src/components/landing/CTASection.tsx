import React from 'react'

interface CTASectionProps {
  onNavigate: (page: string) => void
}

const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  return (
    <div className="px-2 pb-2">
      <div className="rounded-[2rem] bg-gradient-to-br from-[#4F46E5] to-[#1E1B4B] py-24 px-6 text-center">
        <p className="lp-fade text-xs font-semibold tracking-widest text-white/50 uppercase mb-4">
          Get started
        </p>
        <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-white max-w-2xl mx-auto">
          Your pipeline won't fill itself.
        </h2>
        <p className="lp-fade mt-6 text-lg text-white/65 max-w-xl mx-auto">
          Start your 7 day free trial today. No credit card required for the first 7 days.
        </p>
        <div className="mt-10">
          <button
            onClick={() => onNavigate('Register')}
            className="rounded-full bg-white text-[#4F46E5] px-10 py-4 font-bold text-sm hover:bg-gray-100 transition-colors"
          >
            Start your free trial
          </button>
        </div>
        <p className="mt-6 text-xs text-white/35">
          No credit card required for first 7 days
        </p>
      </div>
    </div>
  )
}

export default CTASection
