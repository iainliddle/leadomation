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
import '../components/landing/landing.css'

export default function LandingPage() {
  // Coming soon redirect - disabled for preview
  /*
  if (typeof window !== 'undefined') {
    window.location.replace('/coming-soon.html')
    return null
  }
  */

  return (
    <div className="landing-page">
      <Nav />
      <Hero />
      <IntegrationMarquee />
      <ProblemSection />
      <SolutionSection />
      <FeatureEmailSequences />
      <FeatureGlobalDemand />
      <FeatureExpandingCards />
      <FeatureBentoCard />
      <StatsAndTestimonials />
    </div>
  )
}
