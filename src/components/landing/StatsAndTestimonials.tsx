import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useBreakpoint } from '../../hooks/useBreakpoint'

const STATS = [
  { value: 500, suffix: '+', label: 'Leads per campaign', color: '#4F46E5' },
  { value: 18, suffix: '%', label: 'Average reply rate', color: '#22D3EE' },
  { value: 6, suffix: 'hrs', label: 'Saved per week', color: '#4F46E5' },
  { value: 35, suffix: ' day', label: 'LinkedIn funnel', color: '#22D3EE' },
]

const TESTIMONIALS_ROW1 = [
  { name: 'Sarah Mitchell', handle: 'Practice Owner, Kent', quote: 'We booked 4 discovery calls in the first week. The intent scoring alone is worth the subscription.', avatar: 'SM', photo: '/testimonials/sarah-mitchell.jpg' },
  { name: 'James Hartley', handle: 'Managing Partner, London', quote: 'Pipeline went from empty to 45k in 6 weeks. The LinkedIn sequencer runs completely on its own.', avatar: 'JH', photo: '/testimonials/james-hartley.jpg' },
  { name: 'Priya Anand', handle: 'Consultant, Birmingham', quote: 'Saved 6 hours a week on prospecting. I just check the replies now and close deals.', avatar: 'PA', photo: '/testimonials/priya-anand.jpg' },
  { name: 'Tom Blackwell', handle: 'Director, Manchester', quote: 'The AI voice agent leaves better voicemails than my team did manually. Conversion is up 23%.', avatar: 'TB', photo: '/testimonials/tom-blackwell.jpg' },
  { name: 'Emma Fitzgerald', handle: 'Revenue Manager, Bristol', quote: 'Hot leads land in my inbox already warmed up. The keyword monitor is genuinely magic.', avatar: 'EF', photo: '/testimonials/emma-fitzgerald.jpg' },
  { name: 'Callum Reid', handle: 'General Manager, Edinburgh', quote: 'Set up a full campaign targeting hospitality in an afternoon. It ran itself for 5 weeks.', avatar: 'CR', photo: '/testimonials/callum-reid.jpg' },
]

const TESTIMONIALS_ROW2 = [
  { name: 'Natasha Byrne', handle: 'Operations Director, Leeds', quote: 'Finally a B2B tool that does the whole outreach cycle. Email, LinkedIn and calls in one place.', avatar: 'NB', photo: '/testimonials/natasha-byrne.jpg' },
  { name: 'Mark Okonkwo', handle: 'Business Dev, Birmingham', quote: 'The spam checker saved us. Our open rates went from 8% to 31% after using it on every sequence.', avatar: 'MO', photo: '/testimonials/mark-okonkwo.jpg' },
  { name: 'Victoria Marsh', handle: 'Partner, Glasgow', quote: 'I was sceptical about AI calling but the scripts are so natural. Three meetings booked last month.', avatar: 'VM', photo: '/testimonials/victoria-marsh.jpg' },
  { name: 'David Chen', handle: 'Founder, London', quote: 'Leadomation finds leads I would never have thought to look for. The Global Demand map is brilliant.', avatar: 'DC', photo: '/testimonials/david-chen.jpg' },
  { name: 'Anna Kowalski', handle: 'Sales Lead, Cardiff', quote: 'Our best reply rate ever was 18.4% on a dental campaign. Took 20 minutes to set up.', avatar: 'AK', photo: '/testimonials/anna-kowalski.jpg' },
  { name: 'Ryan Fletcher', handle: 'Director, Sheffield', quote: 'The 35-day LinkedIn funnel builds genuine relationships. We got 3 referrals from prospects who did not convert.', avatar: 'RF', photo: '/testimonials/ryan-fletcher.jpg' },
]

function useCountUp(target: number, isInView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, target])
  return count
}

function StatItem({ stat, isInView, index, isMobile }: { stat: typeof STATS[0]; isInView: boolean; index: number; isMobile: boolean }) {
  const count = useCountUp(stat.value, isInView)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={{ textAlign: 'center', flex: 1 }}
    >
      <div style={{
        fontSize: isMobile ? '40px' : '64px',
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        marginBottom: '8px',
        background: `linear-gradient(135deg, #020617 0%, ${stat.color} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: 'Switzer, sans-serif',
      }}>
        {count}{stat.suffix}
      </div>
      <div style={{ fontSize: isMobile ? '13px' : '15px', color: '#475569', fontWeight: 500, fontFamily: 'Switzer, sans-serif' }}>
        {stat.label}
      </div>
    </motion.div>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS_ROW1[0] }) {
  return (
    <div style={{
      flexShrink: 0,
      width: '300px',
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      marginRight: '16px',
      border: '1px solid rgba(226,232,240,0.8)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
        <img
          src={t.photo}
          alt={t.name}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: '2px solid rgba(79,70,229,0.15)',
          }}
          onError={(e) => {
            const el = e.target as HTMLImageElement
            el.style.display = 'none'
            const next = el.nextElementSibling as HTMLElement
            if (next) next.style.display = 'flex'
          }}
        />
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5, #22D3EE)',
          display: 'none', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0,
        }}>
          {t.avatar}
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', fontFamily: 'Switzer, sans-serif' }}>{t.name}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'Switzer, sans-serif' }}>{t.handle}</div>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: 0, fontFamily: 'Switzer, sans-serif' }}>
        "{t.quote}"
      </p>
    </div>
  )
}

function MarqueeRow({ items, reverse = false, isMobile }: { items: typeof TESTIMONIALS_ROW1; reverse?: boolean; isMobile: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: isMobile ? '60px' : '120px', background: 'linear-gradient(90deg, #ffffff 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: isMobile ? '60px' : '120px', background: 'linear-gradient(270deg, #ffffff 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
      <div
        style={{
          display: 'flex',
          animation: `${reverse ? 'marqueeReverse' : 'marqueeForward'} 40s linear infinite`,
          width: 'max-content',
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function StatsAndTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })
  const { isMobile } = useBreakpoint()

  return (
    <>
      <style>{`
        @keyframes marqueeForward {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <div
        ref={sectionRef}
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.95) 10%, #ffffff 30%, #ffffff 100%)',
          position: 'relative',
          paddingTop: isMobile ? '60px' : '120px',
          paddingBottom: isMobile ? '40px' : '80px',
          fontFamily: 'Switzer, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Stats row */}
        <div
          ref={statsRef}
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            paddingLeft: isMobile ? '16px' : '48px',
            paddingRight: isMobile ? '16px' : '48px',
            marginBottom: isMobile ? '48px' : '80px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '56px' }}
          >
            <div style={{ display: 'inline-block', background: '#EEF2FF', color: '#4F46E5', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', borderRadius: '100px', padding: '6px 14px', marginBottom: '20px' }}>
              BY THE NUMBERS
            </div>
            <h2 style={{ fontWeight: 800, fontSize: isMobile ? '32px' : '42px', letterSpacing: '-0.03em', lineHeight: 1.15, background: 'linear-gradient(135deg, #020617 0%, #1e1b4b 30%, #4F46E5 60%, #0891b2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'block', margin: 0 }}>
              Results that speak for themselves.
            </h2>
          </motion.div>

          <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ flex: isMobile ? '0 0 50%' : '1', display: 'flex', alignItems: 'stretch', marginBottom: isMobile ? '24px' : '0', justifyContent: 'center' }}>
                <StatItem stat={stat} isInView={statsInView} index={i} isMobile={isMobile} />
                {!isMobile && i < STATS.length - 1 && (
                  <div style={{ width: '1px', background: 'linear-gradient(180deg, transparent 0%, #e2e8f0 30%, #e2e8f0 70%, transparent 100%)', margin: '0 8px', alignSelf: 'stretch', minHeight: '80px' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ textAlign: 'center', marginBottom: '40px', paddingLeft: '24px', paddingRight: '24px' }}
        >
          <div style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>
            Trusted by B2B teams across the UK and beyond
          </div>
        </motion.div>

        {/* Marquee rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <MarqueeRow items={TESTIMONIALS_ROW1} reverse={false} isMobile={isMobile} />
          <MarqueeRow items={TESTIMONIALS_ROW2} reverse={true} isMobile={isMobile} />
        </div>
      </div>
    </>
  )
}
