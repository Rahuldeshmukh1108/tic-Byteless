'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DeviceProvider } from '@/contexts/device-context'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-lg font-semibold">Checking your session…</p>
          <p className="text-sm text-slate-400 mt-2">Redirecting to login if necessary.</p>
        </div>
      </div>
    )
  }

  return (
    <DeviceProvider>
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

      <main className={`pt-20 pb-8 smooth-transition ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} min-h-screen`}>
        <div className="px-4 sm:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
    </DeviceProvider>
  )
}

