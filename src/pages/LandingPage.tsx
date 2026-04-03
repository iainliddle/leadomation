import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnnouncementBanner from '../components/landing/AnnouncementBanner'
import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import LogoCloud from '../components/landing/LogoCloud'
import ProblemSection from '../components/landing/ProblemSection'
import SolutionStatement from '../components/landing/SolutionStatement'
import FeatureScreenshot from '../components/landing/FeatureScreenshot'
import PersonaCards from '../components/landing/PersonaCards'
import LightBento from '../components/landing/LightBento'
import DarkBento from '../components/landing/DarkBento'
import LeadIntelligence from '../components/landing/LeadIntelligence'
import StatsBar from '../components/landing/StatsBar'
import Testimonials from '../components/landing/Testimonials'
import SwirlDivider from '../components/landing/SwirlDivider'
import PricingSection from '../components/landing/PricingSection'
import FAQSection from '../components/landing/FAQSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

gsap.registerPlugin(ScrollTrigger)

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const pageRef = useRef<HTMLDivElement>(null)

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    if (!pageRef.current) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.lp-fade').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
    }, pageRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} className="font-[Switzer,system-ui,sans-serif] bg-white overflow-x-hidden">
      <AnnouncementBanner onNavigate={onNavigate} />
      <Nav onNavigate={onNavigate} scrollTo={scrollTo} />
      <main className="pt-16">
        <Hero onNavigate={onNavigate} scrollTo={scrollTo} />
        <LogoCloud />
        <ProblemSection />
        <SolutionStatement />
        <FeatureScreenshot />
        <PersonaCards />
        <LightBento />
        <DarkBento />
        <LeadIntelligence />
        <StatsBar />
        <Testimonials />
        <SwirlDivider />
        <PricingSection onNavigate={onNavigate} />
        <FAQSection />
        <CTASection onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}

export default LandingPage
