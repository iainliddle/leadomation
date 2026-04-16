import { useState } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint'

type Logo = { src: string; name: string }

const logos: Logo[] = [
  { src: '/logos/Apify.svg', name: 'Apify' },
  { src: '/logos/Apollo.svg', name: 'Apollo' },
  { src: '/logos/Claude.svg', name: 'Claude' },
  { src: '/logos/cloudflare.svg', name: 'Cloudflare' },
  { src: '/logos/DataforSeo.png', name: 'DataForSEO' },
  { src: '/logos/github.png', name: 'GitHub' },
  { src: '/logos/Google Antigravity.svg', name: 'Antigravity' },
  { src: '/logos/google maps.png', name: 'Google Maps' },
  { src: '/logos/Google.svg', name: 'Google' },
  { src: '/logos/Hunter.io.svg', name: 'Hunter.io' },
  { src: '/logos/Linkedin.svg', name: 'LinkedIn' },
  { src: '/logos/N8N.svg', name: 'N8N' },
  { src: '/logos/Remotion.svg', name: 'Remotion' },
  { src: '/logos/Resend.svg', name: 'Resend' },
  { src: '/logos/Stripe.svg', name: 'Stripe' },
  { src: '/logos/supabase.svg', name: 'Supabase' },
  { src: '/logos/unipile.svg', name: 'Unipile' },
  { src: '/logos/Vapi.svg', name: 'Vapi' },
  { src: '/logos/vercel.svg', name: 'Vercel' },
  { src: '/logos/Twilio.svg', name: 'Twilio' },
]

const loop = [...logos, ...logos]

const logoSizeOverrides: Record<string, string> = {
  'Hunter.io': '36px',
  'Apify': '36px',
  'Cloudflare': '36px',
  'Stripe': '36px',
  'Antigravity': '36px',
  'Remotion': '36px',
  'Vapi': '36px',
}

export default function IntegrationMarquee() {
  const [hovered, setHovered] = useState<number | null>(null)
  const { isMobile } = useBreakpoint()

  return (
    <section
      style={{
        position: 'relative',
        background: 'transparent',
        padding: isMobile ? '20px 0' : '48px 0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'rgba(100,116,139,0.7)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: '16px',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        Trusted integrations
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(90deg, #ffffff 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '120px',
            background: 'linear-gradient(270deg, #ffffff 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        <div
          style={{
            display: 'flex',
            width: 'max-content',
            animation: 'marqueeScroll 35s linear infinite',
          }}
        >
          {loop.map((logo, index) => {
            const isHovered = hovered === index
            const isVapi = logo.name === 'Vapi'
            const iconOnly = ['Apify', 'Google Maps', 'GitHub', 'Vapi', 'N8N', 'Unipile']
            const wideText = ['Apollo', 'Cloudflare', 'DataForSEO', 'Vercel', 'Stripe', 'Supabase', 'Hunter.io', 'Remotion', 'Antigravity', 'LinkedIn', 'Claude']
            const height =
              logoSizeOverrides[logo.name] ||
              (iconOnly.includes(logo.name)
                ? '24px'
                : wideText.includes(logo.name)
                  ? '20px'
                  : '28px')
            const baseFilter = isVapi ? 'opacity(0.85)' : 'opacity(0.85)'
            const hoverFilter = 'opacity(1)'
            return (
              <div
                key={`${logo.name}-${index}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 40px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  style={{
                    height,
                    width: 'auto',
                    maxWidth: '120px',
                    minWidth: '40px',
                    objectFit: 'contain',
                    display: 'block',
                    filter: isHovered ? hoverFilter : baseFilter,
                    transition: 'filter 0.2s ease',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
