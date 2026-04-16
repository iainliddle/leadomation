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
      <Footer />
    </div>
  )
}
