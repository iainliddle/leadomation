import { useBreakpoint } from '../../hooks/useBreakpoint'

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#22d3ee"/>
  </svg>
)

const SOCIAL_LINKS = [
  { icon: <LinkedInIcon />, label: 'LinkedIn', href: 'https://linkedin.com/company/leadomation' },
  { icon: <TwitterIcon />, label: 'X', href: 'https://x.com/leadomation' },
  { icon: <InstagramIcon />, label: 'Instagram', href: 'https://instagram.com/leadomation' },
  { icon: <YoutubeIcon />, label: 'YouTube', href: 'https://youtube.com/@leadomation' },
]

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    heading: 'Use cases',
    links: [
      { label: 'Email outreach', href: '#' },
      { label: 'LinkedIn automation', href: '#' },
      { label: 'AI voice calling', href: '#' },
      { label: 'Lead enrichment', href: '#' },
      { label: 'Keyword monitoring', href: '#' },
      { label: 'Global demand', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: 'mailto:hello@leadomation.co.uk' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Terms of service', href: '/terms' },
      { label: 'Cookie policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
]

export default function Footer() {
  const { isMobile } = useBreakpoint()

  return (
    <footer style={{
      fontFamily: 'Switzer, sans-serif',
      position: 'relative',
      isolation: 'isolate',
      zIndex: 2,
    }}>

      {/* Gradient fade from CTA ambient into cyan footer */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(180deg, rgba(103,232,249,0) 0%, rgba(103,232,249,0.4) 8%, rgba(34,211,238,0.85) 20%, rgba(34,211,238,1) 35%, rgba(34,211,238,1) 100%)',
      }} />

      {/* Main footer content */}
      <div style={{ background: '#22d3ee' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: isMobile ? '20px' : '48px',
        paddingRight: isMobile ? '20px' : '48px',
        paddingTop: '48px',
        paddingBottom: '48px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.8fr 1fr 1fr 1fr',
          gap: isMobile ? '32px' : '48px',
          marginBottom: isMobile ? '40px' : '64px',
        }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <img src="/logo-full.png" alt="Leadomation" style={{ height: '28px', filter: 'brightness(0)' }} />
            </div>

            <p style={{ fontSize: '14px', color: '#0e7490', lineHeight: 1.7, marginBottom: '28px', maxWidth: '280px' }}>
              B2B lead generation and outreach automation. Find leads, run sequences and book meetings - on autopilot.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {SOCIAL_LINKS.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.3)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0c4a6e',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.5)'
                    el.style.borderColor = 'rgba(255,255,255,0.6)'
                    el.style.color = '#0c4a6e'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.3)'
                    el.style.borderColor = 'rgba(255,255,255,0.4)'
                    el.style.color = '#0c4a6e'
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col, i) => (
            <div key={i}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0891b2', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
                {col.heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {col.links.map((link, j) => (
                  <a
                    key={j}
                    href={link.href}
                    style={{
                      fontSize: '14px',
                      color: '#0c4a6e',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      width: 'fit-content',
                    }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = '#0e7490'}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = '#0c4a6e'}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(8,145,178,0.3)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          flexDirection: isMobile ? 'column' : 'row',
        }}>
          <p style={{ fontSize: '13px', color: '#0891b2', margin: 0 }}>
            © {new Date().getFullYear()} Leadomation. All rights reserved. A product of Lumarr Ltd.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy policy', 'Terms of service', 'Cookie policy'].map((link, i) => (
              <a
                key={i}
                href="#"
                style={{ fontSize: '13px', color: '#0891b2', textDecoration: 'none', transition: 'color 0.2s ease' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#0e7490'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#0891b2'}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
      </div>
    </footer>
  )
}
