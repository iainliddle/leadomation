import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import '../components/landing/landing.css'

export default function LandingPage() {
  // Coming soon redirect - remove this block when landing page is ready to go live
  if (typeof window !== 'undefined') {
    window.location.replace('/coming-soon.html')
    return null
  }

  return (
    <div className="landing-page">
      <Nav />
      <Hero />
    </div>
  )
}
