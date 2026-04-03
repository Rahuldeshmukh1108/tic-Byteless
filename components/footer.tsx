'use client'

import Link from 'next/link'
import { Linkedin, Twitter, Facebook, Github } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Security', href: '#' },
        { name: 'Blog', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '#' },
        { name: 'Terms', href: '#' },
        { name: 'Cookies', href: '#' },
        { name: 'Licenses', href: '#' },
      ],
    },
  ]

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Github, href: '#', label: 'GitHub' },
  ]

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg gradient-text mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-lg" />
              HydroSync
            </Link>
            <p className="text-sm text-foreground/70">
              Revolutionizing agriculture with AI-powered smart farming solutions.
            </p>
            <div className="flex gap-4 mt-4">
              {socials.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-cyan-500/20 flex items-center justify-center smooth-transition"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/70 hover:text-cyan-400 smooth-transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">
            &copy; {currentYear} HydroSync. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-foreground/60">
            <Link href="#" className="hover:text-cyan-400 smooth-transition">
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="#" className="hover:text-cyan-400 smooth-transition">
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link href="#" className="hover:text-cyan-400 smooth-transition">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
