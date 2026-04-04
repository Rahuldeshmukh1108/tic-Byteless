'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Home, Globe } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { useAuthState } from '@/hooks/use-auth-state'
import { useAuth } from '@/contexts/auth-context'

interface DashboardHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function DashboardHeader({ sidebarOpen, setSidebarOpen }: DashboardHeaderProps) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const { handleLogout } = useAuthState()
  const { user } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleLanguage = () => setLanguage(language === 'en' ? 'hi' : 'en')

  const onLogout = async () => {
    setIsLoggingOut(true)
    const success = await handleLogout()
    if (success) {
      // Add a small delay to show the logout animation
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-slate-950/95 dark:via-slate-950/90 dark:to-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 smooth-transition shadow-sm">
      <div className="h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 font-bold text-xl gradient-text hover:scale-102 transition-transform cursor-pointer">
            <img
              src="/logo.png"
              alt="HydroSync Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-shadow"
            />
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

          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 smooth-transition flex items-center gap-2 font-medium hover:scale-105 transition-transform"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">{language === 'en' ? 'Logout' : 'लॉगआउट'}</span>
          </button>
        </div>
      </div>

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-b-2xl">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-slate-700/20 max-w-sm mx-4">
            <div className="text-center space-y-6">
              {/* Animated logout icon */}
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse" />
                <div className="relative flex items-center justify-center w-full h-full">
                  <LogOut size={32} className="text-white animate-bounce" />
                </div>
                {/* Rotating ring */}
                <div className="absolute inset-0 border-4 border-red-400/30 rounded-full animate-spin border-t-red-500" />
              </div>

              {/* Logout message */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {language === 'en' ? 'Signing Out...' : 'साइन आउट हो रहा है...'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {language === 'en' ? 'Please wait while we securely log you out' : 'कृपया प्रतीक्षा करें, हम आपको सुरक्षित रूप से लॉग आउट कर रहे हैं'}
                </p>
              </div>

              {/* Hydroponic-themed animation */}
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
