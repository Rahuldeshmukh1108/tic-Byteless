'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 smooth-transition">
      <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <DashboardSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <main className={`pt-20 pb-8 smooth-transition ${sidebarOpen ? 'md:ml-64' : 'ml-0'} min-h-screen`}>
        <div className="px-4 sm:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
