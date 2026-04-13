import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '/blog' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isMobile, isTablet } = useBreakpoint()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when switching to desktop
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: isMobile ? '8px 12px' : '12px 24px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(255,255,255,0.92)'
          : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: isMobile ? '8px 12px 8px 16px' : '8px 8px 8px 20px',
        border: '1px solid rgba(226,232,240,0.8)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0,0,0,0.08)'
          : '0 2px 16px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
      }}>

        {/* Logo */}
        <a href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          flexShrink: 0,
        }}>
          <img
            src="/logo-full.png"
            alt="Leadomation"
            style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
            onError={(e) => {
              const t = e.target as HTMLImageElement
              t.style.display = 'none'
              const fallback = t.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '28px', height: '28px',
              borderRadius: '7px',
              background: 'linear-gradient(135deg, #4F46E5, #22D3EE)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 800, color: '#fff',
              fontFamily: 'Switzer, sans-serif',
            }}>L</div>
            <span style={{
              fontWeight: 700, fontSize: '17px', color: '#0f172a',
              fontFamily: 'Switzer, sans-serif',
            }}>Leadomation</span>
          </div>
        </a>

        {/* Centre nav links - hidden on mobile */}
        {!isMobile && (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
          }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: isTablet ? '6px 10px' : '8px 16px',
                  borderRadius: '10px',
                  fontSize: isTablet ? '13px' : '14px',
                  fontWeight: 500,
                  color: '#475569',
                  textDecoration: 'none',
                  fontFamily: 'Switzer, sans-serif',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap' as const,
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.color = '#0f172a'
                  ;(e.target as HTMLElement).style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.color = '#475569'
                  ;(e.target as HTMLElement).style.background = 'transparent'
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right CTAs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
        }}>
          {!isMobile && (
            <a
              href="/app/login"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                fontFamily: 'Switzer, sans-serif',
                borderRadius: '10px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.color = '#0f172a'
                ;(e.target as HTMLElement).style.background = 'rgba(0,0,0,0.04)'
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.color = '#475569'
                ;(e.target as HTMLElement).style.background = 'transparent'
              }}
            >
              Sign in
            </a>
          )}
          <a
            href="/app/signup"
            style={{
              padding: isMobile ? '8px 16px' : '10px 22px',
              fontSize: '14px',
              fontWeight: 600,
              background: '#1E1B4B',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '12px',
              fontFamily: 'Switzer, sans-serif',
              boxShadow: '0 2px 8px rgba(30,27,75,0.25)',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.opacity = '0.9'
              ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(30,27,75,0.30)'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.opacity = '1'
              ;(e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(30,27,75,0.25)'
            }}
          >
            Start free trial
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          {/* Hamburger - mobile only */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                marginLeft: '4px',
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                width: '20px', height: '2px', background: '#0f172a', borderRadius: '1px',
                transition: 'all 0.2s ease',
                transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none',
              }} />
              <span style={{
                width: '20px', height: '2px', background: '#0f172a', borderRadius: '1px',
                transition: 'all 0.2s ease',
                opacity: menuOpen ? 0 : 1,
              }} />
              <span style={{
                width: '20px', height: '2px', background: '#0f172a', borderRadius: '1px',
                transition: 'all 0.2s ease',
                transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none',
              }} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: isMobile ? '12px' : '24px',
              right: isMobile ? '12px' : '24px',
              marginTop: '8px',
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(226,232,240,0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#0f172a',
                  textDecoration: 'none',
                  fontFamily: 'Switzer, sans-serif',
                  borderRadius: '10px',
                }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 16px' }} />
            <a
              href="/app/login"
              onClick={() => setMenuOpen(false)}
              style={{
                padding: '14px 16px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#475569',
                textDecoration: 'none',
                fontFamily: 'Switzer, sans-serif',
                borderRadius: '10px',
              }}
            >
              Sign in
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
