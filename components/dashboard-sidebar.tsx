'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, BarChart3, Settings, Cpu, X, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface DashboardSidebarProps {
  isOpen: boolean
  onToggle?: () => void
}

const sidebarItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'Devices', href: '/dashboard/devices', icon: <Cpu size={20} /> },
  { label: 'Automation', href: '/dashboard/automation', icon: <Zap size={20} /> },
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
  { label: 'HydroChat', href: '/dashboard/hydrochat', icon: <Lightbulb size={20} /> },
]

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          exit={{ x: -256 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-full md:w-64 bg-gradient-to-b from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-700/60 smooth-transition z-30 shadow-xl overflow-hidden flex flex-col backdrop-blur-sm"
        >
          {/* Close Button - Mobile */}
          <div className="flex justify-end mb-6 pt-4 md:hidden">
            <motion.button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition hover:scale-110 transition-transform"
              aria-label="Close sidebar"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Close Button - Desktop */}
          <div className="hidden md:flex justify-end mb-6 pt-4">
            <motion.button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition hover:scale-110 transition-transform"
              aria-label="Close sidebar"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 pb-6 px-2 overflow-y-auto">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl smooth-transition ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 shadow-sm backdrop-blur-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 rounded-lg'
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        {item.icon}
                      </motion.div>
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full ml-auto"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="px-2">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-200/60 dark:via-slate-700/60 to-transparent mb-4" />
              <div className="flex items-center justify-center">
                <div className="px-3 py-1 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-full border border-cyan-200/50 dark:border-cyan-500/30">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    HydroSync v1.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
