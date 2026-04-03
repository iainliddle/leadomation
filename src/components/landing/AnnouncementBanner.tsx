import React, { useState } from 'react'

interface AnnouncementBannerProps {
  onNavigate: (page: string) => void
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ onNavigate }) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-[#4F46E5] px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-white">
          <strong className="font-semibold">Leadomation is now live.</strong> Start your 7 day free trial today.
        </p>
        <button
          onClick={() => onNavigate('Register')}
          className="flex-none rounded-full bg-white px-3.5 py-1 text-sm font-semibold text-[#4F46E5] hover:bg-gray-100 transition-colors"
        >
          Get started <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
      <div className="flex flex-1 justify-end">
        <button onClick={() => setDismissed(true)} className="-m-3 p-3">
          <span className="sr-only">Dismiss</span>
          <svg className="size-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default AnnouncementBanner
