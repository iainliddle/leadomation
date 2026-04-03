import React from 'react'
import { Link } from 'react-router-dom'
import logoDark from '../../assets/logo-full.png'

interface FooterProps {
  onNavigate: (page: string) => void
}

const footerLinks = {
  Product: [
    { label: 'Features', action: 'scroll', target: 'features' },
    { label: 'Pricing', action: 'scroll', target: 'pricing' },
    { label: 'How it works', action: 'scroll', target: 'how-it-works' },
    { label: 'Blog', action: 'link', target: '/blog' },
  ],
  Company: [
    { label: 'About', action: 'link', target: '#' },
    { label: 'Contact', action: 'link', target: '#' },
    { label: 'Careers', action: 'link', target: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', action: 'link', target: '#' },
    { label: 'Terms of Service', action: 'link', target: '#' },
    { label: 'Cookie Policy', action: 'link', target: '#' },
  ],
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleClick = (action: string, target: string) => {
    if (action === 'scroll') {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <img
              src={logoDark}
              alt="Leadomation"
              className="h-8 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm text-white/40 max-w-xs">
              Automated B2B lead generation, enrichment and multi-channel outreach. Find, contact and convert prospects on autopilot.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.action === 'link' && link.target.startsWith('/') ? (
                      <Link to={link.target} className="text-sm text-white/40 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    ) : link.action === 'scroll' ? (
                      <button
                        onClick={() => handleClick(link.action, link.target)}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <span className="text-sm text-white/40">{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-xs text-white/30 text-center">
            {'\u00A9'} 2026 Leadomation by Lumarr Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
