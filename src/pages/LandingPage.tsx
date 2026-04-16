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
      <div style={{
        background: `linear-gradient(
          180deg,
          rgba(196, 181, 253, 0.18) 0%,
          rgba(167, 139, 250, 0.12) 4%,
          rgba(255, 255, 255, 0.95) 14%,
          rgba(255, 255, 255, 1) 22%,
          rgba(255, 255, 255, 1) 30%,
          rgba(196, 181, 253, 0.10) 38%,
          rgba(167, 139, 250, 0.14) 44%,
          rgba(199, 210, 254, 0.12) 50%,
          rgba(255, 255, 255, 0.98) 58%,
          rgba(255, 255, 255, 1) 64%,
          rgba(196, 181, 253, 0.08) 70%,
          rgba(167, 139, 250, 0.10) 75%,
          rgba(255, 255, 255, 0.96) 82%,
          rgba(224, 242, 254, 0.20) 88%,
          rgba(186, 230, 253, 0.35) 93%,
          rgba(103, 232, 249, 0.55) 97%,
          rgba(34, 211, 238, 1) 100%
        )`,
        position: 'relative',
        minHeight: '100vh',
      }}>
        {/* Ambient background blobs */}
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}>
          <div className="landingBlob landingBlob1" />
          <div className="landingBlob landingBlob2" />
          <div className="landingBlob landingBlob3" />
          <div className="landingBlob landingBlob4" />
        </div>

        {/* All sections */}
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
