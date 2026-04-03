import React from 'react'

const LeadIntelligence: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#F8FAFF] via-[#EEF2FF] to-[#F0FFFE] lp-intel-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left copy */}
          <div className="lg:sticky lg:top-24">
            <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
              Lead intelligence
            </p>
            <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
              Stop guessing what to say. Know everything before you reach out.
            </h2>
            <p className="lp-fade mt-6 text-base text-gray-500 leading-relaxed">
              Before you send a single word, Leadomation already knows your prospect's pain point, their Google rating, their recent business expansion and exactly what subject line will get them to open. Lead Intelligence generates a full research report for every prospect in seconds.
            </p>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#22D3EE]/10 border border-[#22D3EE]/25 text-[#097B8F]">
                Pro feature
              </span>
            </div>
          </div>

          {/* Right - Intelligence card */}
          <div className="mt-12 lg:mt-0">
            <div className="rounded-[2rem] bg-white shadow-xl ring-1 ring-[#4F46E5]/8 p-8">
              <div className="space-y-5">
                {/* Opportunity Rating */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Opportunity Rating</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                    {'\u{1F525}'} Hot
                  </span>
                </div>

                {/* Pain Intensity */}
                <div className="lp-intel-field">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Pain Intensity</p>
                    <span className="text-xs font-bold text-gray-700">7/10</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#4F46E5] to-[#22D3EE]" />
                  </div>
                </div>

                {/* Pain Point */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pain Point</p>
                  <p className="text-sm text-gray-700">Reliant on word of mouth referrals. No structured outreach to attract new patients beyond their local area.</p>
                </div>

                {/* Outreach Angle */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Outreach Angle</p>
                  <p className="text-sm text-gray-700">Highlight automated patient acquisition with zero cold calling required.</p>
                </div>

                {/* Personalisation Hook */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Personalisation Hook</p>
                  <p className="text-sm text-gray-700">Recently expanded to a second location. Growing fast but marketing has not kept up.</p>
                </div>

                {/* Subject Line */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Suggested Subject Line</p>
                  <p className="text-sm font-medium text-[#06B6D4]">"Quick question about your second location"</p>
                </div>

                {/* Opening Line */}
                <div className="lp-intel-field">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Suggested Opening Line</p>
                  <p className="text-sm font-medium text-[#4F46E5]">"Congrats on the expansion - I noticed you opened in Sevenoaks last month."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LeadIntelligence
