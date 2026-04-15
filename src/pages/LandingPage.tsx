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
        background: 'linear-gradient(180deg, #f0e8ff 0%, #e8e4ff 5%, #eef2ff 12%, #f8faff 30%, #ffffff 50%, #f8faff 65%, #eef2ff 80%, #f0f9ff 92%, #e0f7fa 100%)',
        overflow: 'hidden',
      }}>
        {/* Ambient blobs - absolute so they only affect hero/top area */}
        <div style={{ position: 'absolute', top: '-200px', left: '-300px', width: '900px', height: '900px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '-100px', right: '-200px', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 65%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '600px', left: '55%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        {/* Blob 4 - mid page indigo */}
        <div style={{ position: 'absolute', top: '1800px', right: '-200px', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 65%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
        {/* Blob 5 - lower page cyan */}
        <div style={{ position: 'absolute', top: '3200px', left: '-150px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
        {/* Blob 6 - bottom page indigo */}
        <div style={{ position: 'absolute', top: '4400px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

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
