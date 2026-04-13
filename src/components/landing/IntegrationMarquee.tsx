import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import { useBreakpoint } from '../../hooks/useBreakpoint'

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="6" fill="#635BFF"/>
          <path d="M13.5 13c0-.8.7-1.1 1.8-1.1 1.6 0 3.6.5 5.2 1.4V9.2C18.8 8.4 17 8 15.3 8c-3.7 0-6.3 2-6.3 5.2 0 5.1 6.5 4.3 6.5 6.5 0 .9-.8 1.2-1.9 1.2-1.7 0-3.8-.7-5.5-1.7v4.4c1.9.8 3.7 1.1 5.5 1.1 3.8 0 6.4-1.9 6.4-5.1C20 14.2 13.5 15.2 13.5 13z" fill="white"/>
        </svg>
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#635BFF', fontFamily: 'system-ui, sans-serif', letterSpacing: '-0.01em' }}>Stripe</span>
      </div>
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
  const { isMobile } = useBreakpoint()

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
        width: isMobile ? '60px' : '140px',
        background: 'linear-gradient(to right, rgba(255,255,255,0.95), transparent)',
        zIndex: 3, pointerEvents: 'none',
      }} />
      {/* Right fade mask */}
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: isMobile ? '60px' : '140px',
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
                padding: isMobile ? '10px 16px' : '12px 32px',
                opacity: 0.9,
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}
            >
              {integration.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
