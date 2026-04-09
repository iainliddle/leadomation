import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import IntegrationMarquee from '../components/landing/IntegrationMarquee'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionSection from '../components/landing/SolutionSection'
import FeatureEmailSequences from '../components/landing/FeatureEmailSequences'
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
    <div style={{
      background: 'linear-gradient(180deg, #f0e8ff 0%, #e8e4ff 8%, #eef2ff 20%, #f8faff 45%, #ffffff 70%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed',
        top: '-200px',
        left: '-300px',
        width: '900px',
        height: '900px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.20) 0%, transparent 65%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'fixed',
        top: '-100px',
        right: '-200px',
        width: '700px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 65%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'fixed',
        top: '30%',
        left: '60%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 65%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Hero />
        <IntegrationMarquee />
        <ProblemSection />
        <SolutionSection />
        <FeatureEmailSequences />
      </div>
    </div>
  )
}
