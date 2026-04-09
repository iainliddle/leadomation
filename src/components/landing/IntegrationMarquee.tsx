import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'

const integrations = [
  {
    id: 'hunter',
    name: 'Hunter.io',
    logo: (
      <svg height="20" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="24" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="#F97316">Hunter</text>
        <text x="72" y="24" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="22" fill="#94a3b8">.io</text>
      </svg>
    ),
  },
  {
    id: 'apollo',
    name: 'Apollo.io',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#4F46E5"/>
          <path d="M16 6L20 14H12L16 6Z" fill="white" opacity="0.9"/>
          <circle cx="16" cy="20" r="5" fill="white" opacity="0.7"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E1B4B', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Apollo.io</span>
      </div>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0A66C2', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>LinkedIn</span>
      </div>
    ),
  },
  {
    id: 'vapi',
    name: 'Vapi',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#7C3AED"/>
          <path d="M8 12l8 10 8-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E1B4B', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Vapi</span>
      </div>
    ),
  },
  {
    id: 'stripe',
    name: 'Stripe',
    logo: (
      <svg height="22" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.45 10.18c0-.76.62-1.06 1.65-1.06 1.48 0 3.35.45 4.83 1.24V6.54C10.42 5.88 8.85 5.6 7.1 5.6 3.07 5.6.5 7.7.5 10.38c0 4.16 5.73 3.5 5.73 5.3 0 .9-.78 1.19-1.87 1.19-1.62 0-3.69-.67-5.32-1.57v3.87c1.81.78 3.64 1.1 5.32 1.1 4.05 0 6.83-2 6.83-4.72-.02-4.49-5.74-3.7-5.74-5.37zm13.6-4.2l-3.9.83V9.6l3.9-.84V5.98zm-3.9 3.98H19v9.9h-3.85V9.96zm8.56 1.04l-.25-1.04H20.3v9.9h3.85v-6.7c.9-1.18 2.44-.96 2.92-.8V9.96c-.5-.17-2.35-.49-3.36 1.04zm7.22-3.78l-3.87.82v2.88l3.87-.83V7.22zM26.93 9.96h3.88v9.9h-3.88v-9.9zm12.4-.27c-1.5 0-2.47.7-3.08 1.19l-.2-1.04h-3.46v13.5l3.88-.82.01-3.28c.57.42 1.42.99 2.82.99 2.85 0 5.44-2.29 5.44-7.34-.02-4.61-2.64-7.2-5.41-7.2zm-.95 11.08c-.94 0-1.49-.33-1.87-.74l-.02-5.85c.41-.46.98-.77 1.89-.77 1.45 0 2.44 1.62 2.44 3.67 0 2.1-.97 3.69-2.44 3.69zm14.09-3.88c0-3.97-1.92-7.2-5.6-7.2-3.7 0-5.94 3.23-5.94 7.17 0 4.73 2.67 7.12 6.45 7.12 1.85 0 3.25-.42 4.3-1.01v-3.13c-1.05.53-2.26.84-3.78.84-1.5 0-2.82-.53-2.99-2.35h7.52c.02-.2.04-.98.04-1.44zm-7.57-1.5c0-1.75.99-3.12 2.38-3.12 1.36 0 2.26 1.37 2.26 3.12h-4.64z" fill="#635BFF"/>
      </svg>
    ),
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="#EA4335"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>Google Maps</span>
      </div>
    ),
  },
  {
    id: 'resend',
    name: 'Resend',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="8" fill="#000"/>
          <path d="M12 12h10c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4l8 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Resend</span>
      </div>
    ),
  },
  {
    id: 'datafor',
    name: 'DataForSEO',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#4F46E5"/>
          <path d="M8 24V8l6 8-6 8zm10-8l6-8v16l-6-8z" fill="white"/>
        </svg>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif' }}>DataForSEO</span>
      </div>
    ),
  },
  {
    id: 'apify',
    name: 'Apify',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#22C55E"/>
          <path d="M16 6l8 14H8L16 6z" fill="white"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Apify</span>
      </div>
    ),
  },
  {
    id: 'unipile',
    name: 'Unipile',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#06B6D4"/>
          <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="2.5" fill="none"/>
          <circle cx="16" cy="16" r="3" fill="white"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Unipile</span>
      </div>
    ),
  },
]

const allIntegrations = [...integrations, ...integrations, ...integrations]

export default function IntegrationMarquee() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ playOnInit: true, speed: 0.9, stopOnInteraction: false })]
  )

  return (
    <section style={{
      position: 'relative',
      background: 'transparent',
      paddingTop: '8px',
      paddingBottom: '40px',
      overflow: 'hidden',
    }}>
      {/* Left fade mask */}
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: '140px',
        background: 'linear-gradient(to right, rgba(255,255,255,0.95), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Right fade mask */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '140px',
        background: 'linear-gradient(to left, rgba(255,255,255,0.95), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />

      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {allIntegrations.map((integration, index) => (
            <div
              key={`${integration.id}-${index}`}
              style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 32px',
                opacity: 0.75,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.75')}
            >
              {integration.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
