'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { ThemeToggle } from './theme-toggle'

// Navbar component with hydration-safe theme toggle
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en')

  const navLinks = [
    { name: language === 'en' ? 'Features' : 'विशेषताएं', href: '#features' },
    { name: language === 'en' ? 'Benefits' : 'लाभ', href: '#benefits' },
    { name: language === 'en' ? 'Pricing' : 'मूल्य निर्धारण', href: '#pricing' },
  ]

  return (
    <nav className="sticky top-0 z-50 glassmorphism-light shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl gradient-text hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="HydroSync Logo"
              className="w-9 h-9"
            />
            <span className="text-slate-900 dark:text-slate-100">HydroSync</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-cyan-500 smooth-transition relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 smooth-transition hover:scale-105 transition-transform flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe size={18} />
              <span className="text-sm font-medium hidden sm:inline">{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-foreground hover:bg-white/10 dark:hover:bg-white/5 rounded-xl smooth-transition hover:scale-105 transition-transform"
              >
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 smooth-transition hover:scale-105 transition-transform"
              >
                {language === 'en' ? 'Get Started' : 'शुरु करो'}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/10 dark:hover:bg-white/5 smooth-transition hover:scale-105 transition-transform"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 py-6 space-y-4"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="block px-4 py-3 text-foreground hover:bg-white/10 dark:hover:bg-white/5 rounded-xl smooth-transition hover:translate-x-2 transition-transform"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            <div className="border-t border-white/10 pt-4 space-y-3">
              <Link
                href="/login"
                className="block px-4 py-3 text-foreground hover:bg-white/10 dark:hover:bg-white/5 rounded-xl smooth-transition hover:translate-x-2 transition-transform"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-cyan-500/50 smooth-transition hover:scale-105 transition-transform"
                onClick={() => setIsOpen(false)}
              >
                {language === 'en' ? 'Get Started' : 'शुरु करो'}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
