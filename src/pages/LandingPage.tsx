import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
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
    </div>
  )
}
