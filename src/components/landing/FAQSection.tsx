import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'How does the 7-day free trial work?',
    a: 'You sign up, add a card to secure your trial and get full access to your chosen plan for 7 days. You will not be charged until the trial ends. Cancel any time before then and you pay nothing.',
  },
  {
    q: 'Do I need technical skills to set up Leadomation?',
    a: 'None at all. The campaign builder walks you through every step. You pick an industry, a location and a sequence type, and Leadomation handles the scraping, enrichment and outreach automatically. Most users launch their first campaign within 20 minutes.',
  },
  {
    q: 'What is the difference between Starter and Pro?',
    a: 'Starter is email outreach only with up to 300 leads per month and 4 sequence steps. Pro adds LinkedIn outreach via the 35-day sequencer, 50 AI voice calls per month, intent scoring, the full campaign performance analyser and 2,000 leads per month. If LinkedIn and voice calling matter to your pipeline, Pro is the right choice.',
  },
  {
    q: 'How does the AI voice calling work?',
    a: 'You build an 8-step call script inside Leadomation covering your objective, opening line, qualifying questions, objection responses and voicemail. Leadomation then calls your leads automatically via Vapi.ai and uses your script to hold the conversation. If a lead does not answer, it leaves a personalised voicemail.',
  },
  {
    q: 'Is my data safe and GDPR compliant?',
    a: 'Yes. Leadomation only scrapes publicly available business data from Google Maps and LinkedIn. All data is stored securely in Supabase with encryption at rest. You can export or delete your data at any time from the settings page. We do not sell your data to third parties.',
  },
  {
    q: 'Can I cancel my subscription at any time?',
    a: 'Yes, you can cancel from your account settings with one click. Your access continues until the end of your current billing period. There are no cancellation fees and no contracts. If you cancel during your free trial you will not be charged at all.',
  },
]

function FAQItem({ faq }: { faq: typeof FAQS[0] }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(226,232,240,0.7)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '16px',
          fontFamily: 'Switzer, sans-serif',
        }}
      >
        <span style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#0f172a',
          lineHeight: 1.4,
          flex: 1,
        }}>
          {faq.q}
        </span>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: open ? '#4F46E5' : '#EEF2FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            style={{
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path
              d="M2 4L6 8L10 4"
              stroke={open ? 'white' : '#4F46E5'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.7,
              paddingBottom: '20px',
              margin: 0,
              fontFamily: 'Switzer, sans-serif',
            }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const ease = [0.21, 0.47, 0.32, 0.98] as any

  const left = FAQS.slice(0, 3)
  const right = FAQS.slice(3, 6)

  return (
    <div
      ref={sectionRef}
      style={{
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '120px',
        paddingBottom: '120px',
        fontFamily: 'Switzer, sans-serif',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '48px',
        paddingRight: '48px',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
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
            • FAQ
          </div>
          <div style={{
            fontWeight: 800,
            fontSize: '48px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #0f172a 0%, #4F46E5 50%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'block',
            marginBottom: '16px',
          }}>
            Questions worth asking.
          </div>
          <p style={{
            color: '#475569',
            fontSize: '18px',
            lineHeight: 1.7,
            margin: '0 auto',
            maxWidth: '480px',
          }}>
            If your question is not here, email us at hello@leadomation.co.uk and we will get back to you within 24 hours.
          </p>
        </motion.div>

        {/* Two column FAQ grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 80px',
        }}>
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            {left.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            {right.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  )
}
