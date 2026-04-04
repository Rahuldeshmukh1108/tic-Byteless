'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Home, Globe, Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

interface DashboardHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-slate-950/95 dark:via-slate-950/90 dark:to-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 smooth-transition shadow-sm">
      <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition hover:scale-105 transition-transform md:hidden"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3 font-bold text-xl gradient-text hover:scale-102 transition-transform cursor-pointer">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-shadow" />
            <span className="text-slate-900 dark:text-slate-100 hidden xs:block sm:hidden lg:block">HydroSync</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition hover:scale-105 transition-transform flex items-center gap-1.5"
            aria-label="Toggle language"
          >
            <Globe size={18} />
            <span className="text-sm font-medium hidden sm:inline">{language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          <Link
            href="/"
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition hover:scale-105 transition-transform"
            aria-label="Go to home"
          >
            <Home size={20} />
          </Link>

          <button className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 smooth-transition flex items-center gap-2 font-medium hover:scale-105 transition-transform">
            <LogOut size={18} />
            <span className="hidden sm:inline">{language === 'en' ? 'Logout' : 'लॉगआउट'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
