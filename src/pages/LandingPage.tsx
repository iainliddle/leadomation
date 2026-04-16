import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import IntegrationMarquee from '../components/landing/IntegrationMarquee'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import FeatureEmailSequences from '../components/landing/FeatureEmailSequences'
import FeatureGlobalDemand from '../components/landing/FeatureGlobalDemand'
import FeatureExpandingCards from '../components/landing/FeatureExpandingCards'
import FeatureBentoCard from '../components/landing/FeatureBentoCard'
import StatsAndTestimonials from '../components/landing/StatsAndTestimonials'
import PricingSection from '../components/landing/PricingSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
import '../components/landing/landing.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Nav />
      <div style={{ position: 'relative' }}>

        {/* ARCH 1 — Hero + IntegrationMarquee: purple blooms from top corners, white centre bottom */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '22%',
          background: `radial-gradient(ellipse 140% 100% at 50% 0%, rgba(180, 150, 255, 0.55) 0%, rgba(200, 175, 255, 0.30) 35%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* BOWL 1 — ProblemSection: white centre, purple blooms from bottom corners */}
        <div style={{
          position: 'absolute',
          top: '18%', left: 0, right: 0,
          height: '22%',
          background: `radial-gradient(ellipse 140% 100% at 50% 100%, rgba(180, 150, 255, 0.55) 0%, rgba(200, 175, 255, 0.30) 35%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* ARCH 2 — SolutionSection + GlobalDemand: purple blooms from top corners */}
        <div style={{
          position: 'absolute',
          top: '36%', left: 0, right: 0,
          height: '22%',
          background: `radial-gradient(ellipse 140% 100% at 50% 0%, rgba(180, 150, 255, 0.55) 0%, rgba(200, 175, 255, 0.30) 35%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* BOWL 2 — EmailSequences + ExpandingCards: white centre, purple blooms from bottom corners */}
        <div style={{
          position: 'absolute',
          top: '54%', left: 0, right: 0,
          height: '22%',
          background: `radial-gradient(ellipse 140% 100% at 50% 100%, rgba(180, 150, 255, 0.55) 0%, rgba(200, 175, 255, 0.30) 35%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* ARCH 3 — BentoCard + Stats: purple blooms from top corners */}
        <div style={{
          position: 'absolute',
          top: '70%', left: 0, right: 0,
          height: '22%',
          background: `radial-gradient(ellipse 140% 100% at 50% 0%, rgba(180, 150, 255, 0.55) 0%, rgba(200, 175, 255, 0.30) 35%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* BOWL 3 — Pricing + FAQ: white centre, purple blooms from bottom corners, transitions to cyan */}
        <div style={{
          position: 'absolute',
          top: '84%', left: 0, right: 0,
          height: '16%',
          background: `radial-gradient(ellipse 140% 100% at 50% 100%, rgba(103, 232, 249, 0.60) 0%, rgba(180, 150, 255, 0.25) 40%, rgba(255,255,255,0) 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        {/* Sections sit on top */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <IntegrationMarquee />
          <ProblemSection />
          <SolutionSection />
          <FeatureGlobalDemand />
          <FeatureEmailSequences />
          <FeatureExpandingCards />
          <FeatureBentoCard />
          <StatsAndTestimonials />
          <PricingSection />
          <FAQSection />
          <CTASection />
        </div>
      </div>
      <Footer />
    </div>
  )
}
