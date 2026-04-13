import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CobeGlobe } from '../ui/cobe-globe'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const GLOBE_MARKERS = [
  { location: [40.7128, -74.006] as [number, number], size: 0.08 },
  { location: [37.7749, -122.4194] as [number, number], size: 0.06 },
  { location: [51.5074, -0.1278] as [number, number], size: 0.06 },
  { location: [52.52, 13.405] as [number, number], size: 0.05 },
  { location: [48.8566, 2.3522] as [number, number], size: 0.05 },
  { location: [25.2048, 55.2708] as [number, number], size: 0.04 },
  { location: [19.076, 72.8777] as [number, number], size: 0.06 },
  { location: [-33.8688, 151.2093] as [number, number], size: 0.04 },
  { location: [43.6532, -79.3832] as [number, number], size: 0.05 },
]

export default function FeatureGlobalDemand() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const ease = [0.21, 0.47, 0.32, 0.98] as any
  const { isMobile } = useBreakpoint()

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'linear-gradient(180deg, transparent 0%, #ffffff 120px, #ffffff 100%)',
        position: 'relative',
        paddingTop: isMobile ? '60px' : '120px',
        paddingBottom: isMobile ? '60px' : '120px',
        fontFamily: 'Switzer, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: isMobile ? '16px' : '48px',
        paddingRight: isMobile ? '16px' : '48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? '40px' : '80px',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* LEFT - text */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div style={{
            display: 'inline-block',
            background: '#EEF2FF',
            color: '#4F46E5',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            borderRadius: '100px',
            padding: '6px 14px',
            marginBottom: '24px',
          }}>
            GLOBAL DEMAND
          </div>

          <div style={{
            fontWeight: 800,
            fontSize: 'clamp(28px, 5vw, 44px)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            marginBottom: '16px',
          }}>
            Find high-intent prospects anywhere in the world.
          </div>

          <p style={{ color: '#475569', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px' }}>
            Leadomation scrapes business data across 20 regions worldwide. Search by industry, location and intent signals to find prospects ready to buy, wherever they are.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
            {[
              { number: '7,454,700', label: 'businesses indexed across 20 regions', color: '#0f172a' },
              { number: '20', label: 'countries and regions covered', color: '#4F46E5' },
              { number: '1,029,458', label: 'businesses in the hottest market alone', color: '#06B6D4' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.number}</span>
                <div style={{ width: '1px', height: '28px', background: '#e2e8f0', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: '#64748b' }}>{stat.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              background: '#1E1B4B', color: 'white', borderRadius: '10px',
              padding: isMobile ? '12px 20px' : '14px 28px', fontWeight: 600, fontSize: '15px',
              border: 'none', cursor: 'pointer', fontFamily: 'Switzer, sans-serif',
            }}>Start free trial →</button>
            <button style={{
              background: '#ECFEFF', color: '#06B6D4', border: '1px solid #22D3EE',
              borderRadius: '10px', padding: isMobile ? '12px 20px' : '14px 28px', fontWeight: 600,
              fontSize: '15px', cursor: 'pointer', fontFamily: 'Switzer, sans-serif',
            }}>Explore regions</button>
          </div>
        </motion.div>

        {/* RIGHT - 3D cobe globe */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
            <CobeGlobe
              markers={GLOBE_MARKERS}
              size={isMobile ? 300 : 480}
              speed={0.004}
            />

            {/* Floating card - US East Coast */}
            {!isMobile && (
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', top: '2%', right: '-8%',
                background: 'white', borderRadius: '12px', padding: '10px 16px',
                border: '1px solid rgba(226,232,240,0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', whiteSpace: 'nowrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>US East Coast</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>1,029,458 businesses</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4', borderRadius: '4px', padding: '2px 6px' }}>Very High</span>
              </div>
            </motion.div>
            )}

            {/* Floating card - United Kingdom */}
            {!isMobile && (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{
                position: 'absolute', top: '35%', left: '-10%',
                background: 'white', borderRadius: '12px', padding: '10px 16px',
                border: '1px solid rgba(226,232,240,0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', whiteSpace: 'nowrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22D3EE', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>United Kingdom</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>440,200 businesses</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', borderRadius: '4px', padding: '2px 6px' }}>High</span>
              </div>
            </motion.div>
            )}

            {/* Floating card - Dubai */}
            {!isMobile && (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{
                position: 'absolute', bottom: '5%', right: '-5%',
                background: 'white', borderRadius: '12px', padding: '10px 16px',
                border: '1px solid rgba(226,232,240,0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', whiteSpace: 'nowrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>Dubai</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>97,400 businesses</span>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#d97706', background: '#fffbeb', borderRadius: '4px', padding: '2px 6px' }}>Emerging</span>
              </div>
            </motion.div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
