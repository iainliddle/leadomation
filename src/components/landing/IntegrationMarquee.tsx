import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'

const integrations = [
  {
    id: 'hunter',
    name: 'Hunter.io',
    color: '#F97316',
    bg: '#FFF7ED',
    letter: 'H',
  },
  {
    id: 'apollo',
    name: 'Apollo.io',
    color: '#4F46E5',
    bg: '#EEF2FF',
    letter: 'A',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    color: '#0A66C2',
    bg: '#EFF6FF',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'vapi',
    name: 'Vapi.ai',
    color: '#7C3AED',
    bg: '#F5F3FF',
    letter: 'V',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    color: '#635BFF',
    bg: '#F0F0FF',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#635BFF">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
      </svg>
    ),
  },
  {
    id: 'googlemaps',
    name: 'Google Maps',
    color: '#EA4335',
    bg: '#FEF2F2',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#EA4335">
        <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      </svg>
    ),
  },
  {
    id: 'resend',
    name: 'Resend',
    color: '#000000',
    bg: '#F8FAFC',
    letter: 'R',
  },
  {
    id: 'datafor',
    name: 'DataForSEO',
    color: '#4F46E5',
    bg: '#EEF2FF',
    letter: 'D',
  },
  {
    id: 'apify',
    name: 'Apify',
    color: '#22C55E',
    bg: '#F0FDF4',
    letter: 'Ap',
  },
  {
    id: 'unipile',
    name: 'Unipile',
    color: '#06B6D4',
    bg: '#F0FFFE',
    letter: 'U',
  },
]

// Duplicate for seamless loop
const allIntegrations = [...integrations, ...integrations]

export default function IntegrationMarquee() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, align: 'start' },
    [AutoScroll({ playOnInit: true, speed: 1.2, stopOnInteraction: false })]
  )

  return (
    <section style={{
      position: 'relative',
      background: 'transparent',
      paddingBottom: '48px',
      paddingTop: '24px',
      overflow: 'hidden',
    }}>

      {/* Carousel */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Left fade mask */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: '120px',
          background: 'linear-gradient(to right, #ffffff, transparent)',
          zIndex: 3, pointerEvents: 'none',
        }} />
        {/* Right fade mask */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, #ffffff, transparent)',
          zIndex: 3, pointerEvents: 'none',
        }} />

        <div ref={emblaRef} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '0px' }}>
            {allIntegrations.map((integration, index) => (
              <div
                key={`${integration.id}-${index}`}
                style={{
                  flexShrink: 0,
                  width: '160px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0 16px',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {/* Logo mark */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: integration.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {integration.icon ? (
                      integration.icon
                    ) : (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        color: integration.color,
                        fontFamily: 'Switzer, sans-serif',
                        lineHeight: 1,
                      }}>
                        {integration.letter}
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#64748b',
                    fontFamily: 'Switzer, sans-serif',
                  }}>
                    {integration.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
