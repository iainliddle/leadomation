import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function ProblemSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10px' })
  const { isMobile } = useBreakpoint()

  return (
    <section className="bg-bowl" style={{
      position: 'relative',
      padding: isMobile ? '40px 16px 48px' : '80px 24px 100px',
      overflow: 'hidden',
      fontFamily: 'Switzer, sans-serif',
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '64px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '100px', padding: '4px 14px',
            fontSize: '12px', fontWeight: 600, color: '#dc2626',
            fontFamily: 'Switzer, sans-serif', marginBottom: '20px',
            letterSpacing: '0.02em',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#dc2626', display: 'inline-block' }} />
            The problem
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
            fontFamily: 'Switzer, sans-serif', letterSpacing: '-0.03em',
            lineHeight: 1.1, margin: '0 auto 16px', maxWidth: '720px',
            background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            You're spending more time finding leads than closing them.
          </h2>

          <p style={{
            fontSize: '17px', color: '#64748b', fontFamily: 'Switzer, sans-serif',
            lineHeight: 1.7, maxWidth: '520px', margin: '0 auto',
          }}>
            Manual prospecting, generic templates and zero visibility on what's working. Sound familiar?
          </p>
        </motion.div>

        {/* Three portrait image cards */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '20px',
          alignItems: 'stretch',
        }}>

          {[
            {
              image: '/images/problem-prospecting.png',
              metric: '3.5 hrs lost per day',
              metricColor: '#ef4444',
              metricBg: 'rgba(239,68,68,0.15)',
              metricBorder: 'rgba(239,68,68,0.3)',
              title: 'Hours lost to manual prospecting',
              description: 'Finding leads one by one, verifying contact details by hand and building lists manually takes hours every single day. Time you should be spending on closing.',
              gradientFrom: 'rgba(15,23,42,0.15)',
              gradientTo: 'rgba(15,23,42,0.92)',
              delay: 0.1,
            },
            {
              image: '/images/problem-emails.png',
              metric: '2.1% avg open rate',
              metricColor: '#f59e0b',
              metricBg: 'rgba(245,158,11,0.15)',
              metricBorder: 'rgba(245,158,11,0.3)',
              title: 'Generic emails that never get replies',
              description: 'Copy-paste templates with no personalisation go straight to spam. Without real intent signals and proper deliverability, your outreach is invisible.',
              gradientFrom: 'rgba(15,23,42,0.05)',
              gradientTo: 'rgba(15,23,42,0.92)',
              delay: 0.2,
            },
            {
              image: '/images/problem-analytics.png',
              metric: 'Zero actionable data',
              metricColor: '#6366f1',
              metricBg: 'rgba(99,102,241,0.15)',
              metricBorder: 'rgba(99,102,241,0.3)',
              title: 'No visibility on what is actually working',
              description: 'Without proper analytics you are guessing. Which campaigns, sequences and messages are driving replies? You have no way to know what to fix or double down on.',
              gradientFrom: 'rgba(15,23,42,0.1)',
              gradientTo: 'rgba(15,23,42,0.92)',
              delay: 0.3,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: card.delay, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              style={{
                flex: 1,
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                height: isMobile ? '380px' : '460px',
                cursor: 'default',
                boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.12)',
              }}
            >
              {/* Background image */}
              <div style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
              }}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: '130%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    transform: 'translateY(-20%)',
                    display: 'block',
                  }}
                />
              </div>

              {/* Dark gradient overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${card.gradientFrom} 0%, rgba(15,23,42,0.5) 50%, ${card.gradientTo} 100%)`,
              }} />

              {/* Metric pill */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: card.metricBg,
                border: `1px solid ${card.metricBorder}`,
                backdropFilter: 'blur(8px)',
                borderRadius: '100px',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: card.metricColor,
                fontFamily: 'Switzer, sans-serif',
                letterSpacing: '0.01em',
              }}>
                {card.metric}
              </div>

              {/* Text content */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '28px 24px',
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  fontFamily: 'Switzer, sans-serif',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  marginBottom: '10px',
                  textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}>
                  {card.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.78)',
                  fontFamily: 'Switzer, sans-serif',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
