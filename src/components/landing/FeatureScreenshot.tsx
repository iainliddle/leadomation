import React from 'react'

const features = [
  {
    title: '271 enriched leads per campaign.',
    desc: 'Every lead comes with verified email, phone number, decision maker name and intent score. No manual data entry.',
  },
  {
    title: 'Campaign performance updates every 6 hours.',
    desc: 'The Performance Analyser studies your data and sends personalised improvement reports automatically.',
  },
  {
    title: 'Hot leads pushed to your pipeline instantly.',
    desc: 'When a prospect replies as Interested, they move to your Deal Pipeline automatically. No manual sorting.',
  },
]

const FeatureScreenshot: React.FC = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* SVG grid pattern background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="featureGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#featureGrid)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left copy */}
          <div className="lg:sticky lg:top-24">
            <p className="lp-fade text-xs font-semibold tracking-widest text-[#4F46E5] uppercase mb-4">
              Full pipeline view
            </p>
            <h2 className="lp-fade text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 text-pretty">
              A complete picture of every lead, every campaign, every deal.
            </h2>
            <dl className="mt-10 space-y-8">
              {features.map((f) => (
                <div key={f.title} className="lp-fade">
                  <dt className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center shrink-0">
                      <svg
                        className="w-4 h-4 text-[#4F46E5]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-semibold text-gray-950">
                      {f.title}
                    </span>
                  </dt>
                  <dd className="mt-2 ml-11 text-sm text-gray-500 leading-relaxed">
                    {f.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right - Lead Database mockup */}
          <div className="mt-12 lg:mt-0">
            <div className="rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
              <div className="p-6">
                {/* Search bar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center px-3">
                    <svg
                      className="w-4 h-4 text-gray-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <span className="text-xs text-gray-400">
                      Search leads...
                    </span>
                  </div>
                </div>

                {/* Intent filter pills */}
                <div className="flex gap-2 mb-4">
                  {[
                    {
                      label: 'Hot',
                      bg: 'bg-red-50',
                      text: 'text-red-600',
                      border: 'border-red-100',
                    },
                    {
                      label: 'Warm',
                      bg: 'bg-amber-50',
                      text: 'text-amber-600',
                      border: 'border-amber-100',
                    },
                    {
                      label: 'Cool',
                      bg: 'bg-blue-50',
                      text: 'text-blue-600',
                      border: 'border-blue-100',
                    },
                    {
                      label: 'Unscored',
                      bg: 'bg-gray-50',
                      text: 'text-gray-500',
                      border: 'border-gray-100',
                    },
                  ].map((pill) => (
                    <span
                      key={pill.label}
                      className={`px-3 py-1 rounded-full text-[10px] font-semibold ${pill.bg} ${pill.text} border ${pill.border}`}
                    >
                      {pill.label}
                    </span>
                  ))}
                </div>

                {/* Table */}
                <div className="space-y-0 divide-y divide-gray-100">
                  {[
                    {
                      name: 'Dunmore Dental Care',
                      status: 'ENRICHED',
                      action: 'CONTACTED',
                      intent: 'Hot',
                      score: 63,
                    },
                    {
                      name: 'Smile Clinic Northwest',
                      status: 'ENRICHED',
                      action: 'REPLIED',
                      intent: 'Hot',
                      score: 95,
                    },
                    {
                      name: 'Bright Smile Kent',
                      status: 'ENRICHED',
                      action: 'CONTACTED',
                      intent: 'Hot',
                      score: 76,
                    },
                  ].map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {row.name}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {row.status}
                          </span>
                          <span className="text-[10px] font-medium text-[#4F46E5] bg-[#EEF2FF] px-2 py-0.5 rounded">
                            {row.action}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-red-600">
                          {row.intent}
                        </span>
                        <span className="text-xs text-gray-400">&#183;</span>
                        <span className="text-xs font-bold text-gray-700">
                          {row.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureScreenshot
