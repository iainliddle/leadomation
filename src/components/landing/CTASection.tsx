import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { isMobile } = useBreakpoint()
  const ease = [0.21, 0.47, 0.32, 0.98] as any

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'transparent',
        position: 'relative',
        paddingTop: isMobile ? '60px' : '120px',
        paddingBottom: isMobile ? '60px' : '120px',
        fontFamily: 'Switzer, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(79,70,229,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', paddingLeft: isMobile ? '16px' : '48px', paddingRight: isMobile ? '16px' : '48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '6px 14px', marginBottom: '32px' }}>
            • START TODAY
          </div>

          {/* Headline */}
          <div style={{ fontWeight: 800, fontSize: isMobile ? 'clamp(32px, 8vw, 64px)' : '64px', letterSpacing: '-0.03em', lineHeight: 1.05, background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block', marginBottom: '24px' }}>
            Your pipeline won't fill itself.
          </div>

          {/* Subtext */}
          <p style={{ fontSize: isMobile ? '16px' : '20px', color: '#475569', lineHeight: 1.6, marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Join hundreds of B2B teams using Leadomation to find leads, run outreach and book meetings - automatically.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button style={{ background: '#1E1B4B', color: 'white', borderRadius: '12px', padding: isMobile ? '14px 28px' : '16px 36px', fontWeight: 700, fontSize: isMobile ? '15px' : '16px', border: 'none', cursor: 'pointer', fontFamily: 'Switzer, sans-serif', boxShadow: '0 8px 32px rgba(30,27,75,0.25)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(30,27,75,0.35)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'translateY(0)'; (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(30,27,75,0.25)' }}
            >
              Start free trial →
            </button>
            <button style={{ background: 'transparent', color: '#4F46E5', border: '1px solid rgba(79,70,229,0.3)', borderRadius: '12px', padding: isMobile ? '14px 28px' : '16px 36px', fontWeight: 600, fontSize: isMobile ? '15px' : '16px', cursor: 'pointer', fontFamily: 'Switzer, sans-serif', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = '#EEF2FF' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent' }}
            >
              View pricing
            </button>
          </div>

          {/* Trust line */}
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            7-day free trial. Card required. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
