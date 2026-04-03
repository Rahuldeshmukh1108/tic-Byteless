'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Zap, BarChart3, Settings, Cpu, Menu, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

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
  { label: 'HydroChat', href: '/dashboard/hydrochat', icon: <Lightbulb size={20} /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
]

export function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      {/* Expanded Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-full md:w-64 bg-gradient-to-b from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-700/60 smooth-transition z-30 shadow-xl overflow-hidden flex flex-col backdrop-blur-sm"
          >
            {/* Toggle Button */}
            <div className="flex justify-start pt-4 px-2 mb-4">
              <motion.button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition"
                aria-label="Toggle sidebar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu size={20} />
              </motion.button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 pb-6 px-2 overflow-y-auto">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href

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
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Collapsed Icon Strip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.aside
            initial={{ x: -80 }}
            animate={{ x: 0 }}
            exit={{ x: -80 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-20 h-[calc(100vh-5rem)] w-20 bg-gradient-to-b from-white via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-r border-slate-200/60 dark:border-slate-700/60 smooth-transition z-30 shadow-xl overflow-hidden flex flex-col items-center backdrop-blur-sm hidden md:flex"
          >
            {/* Toggle Button */}
            <div className="flex justify-center pt-4 mb-4">
              <motion.button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 smooth-transition"
                aria-label="Toggle sidebar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu size={20} />
              </motion.button>
            </div>

            {/* Icon Navigation */}
            <nav className="flex-1 flex flex-col items-center space-y-3 pb-6 overflow-y-auto">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    onMouseEnter={() => setHoveredItem(item.href)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="relative"
                  >
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-lg smooth-transition flex items-center justify-center relative ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-400 shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <motion.div
                          whileHover={{ rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                          {item.icon}
                        </motion.div>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicatorStrip"
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredItem === item.href && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs rounded whitespace-nowrap z-50 pointer-events-none"
                        >
                          {item.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
