import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logoDark from '../../assets/logo-full.png'

interface NavProps {
  onNavigate: (page: string) => void
  scrollTo: (id: string) => void
}

const navLinks = [
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'FAQ', id: 'faq' },
]

const Nav: React.FC<NavProps> = ({ onNavigate, scrollTo }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between">
        <a href="/" className="flex-shrink-0">
          <img src={logoDark} alt="Leadomation" className="h-9 w-auto" />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Link to="/blog" className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors">
            Blog
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => onNavigate('Login')}
            className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate('Register')}
            className="rounded-full bg-[#1E1B4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d2a6e] transition-colors"
          >
            Start free trial
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => { scrollTo(link.id); setMobileOpen(false) }}
                  className="block w-full text-left text-sm font-medium text-gray-700 hover:text-[#4F46E5]"
                >
                  {link.label}
                </motion.button>
              ))}
              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-[#4F46E5]"
              >
                Blog
              </Link>
              <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
                <button
                  onClick={() => { onNavigate('Login'); setMobileOpen(false) }}
                  className="text-sm font-medium text-gray-500 hover:text-[#4F46E5]"
                >
                  Sign in
                </button>
                <button
                  onClick={() => { onNavigate('Register'); setMobileOpen(false) }}
                  className="rounded-full bg-[#1E1B4B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2d2a6e]"
                >
                  Start free trial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Nav
