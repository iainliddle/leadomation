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
        position: 'relative',
        background: `linear-gradient(
          180deg,
          rgba(196, 181, 253, 0.55) 0%,
          rgba(216, 202, 255, 0.40) 5%,
          rgba(237, 228, 255, 0.20) 10%,
          rgba(255, 255, 255, 1) 18%,
          rgba(255, 255, 255, 1) 25%,
          rgba(255, 255, 255, 1) 30%,
          rgba(237, 228, 255, 0.20) 35%,
          rgba(216, 202, 255, 0.40) 40%,
          rgba(196, 181, 253, 0.55) 45%,
          rgba(216, 202, 255, 0.40) 50%,
          rgba(237, 228, 255, 0.20) 55%,
          rgba(255, 255, 255, 1) 62%,
          rgba(255, 255, 255, 1) 68%,
          rgba(237, 228, 255, 0.20) 73%,
          rgba(216, 202, 255, 0.40) 78%,
          rgba(196, 181, 253, 0.55) 83%,
          rgba(216, 202, 255, 0.35) 87%,
          rgba(200, 240, 250, 0.40) 91%,
          rgba(150, 235, 245, 0.60) 95%,
          rgba(34, 211, 238, 1) 100%
        )`,
      }}>
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
      <Footer />
    </div>
  )
}
