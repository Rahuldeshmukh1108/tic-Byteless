'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MetricCard, type MetricCardData } from '@/components/metric-card'
import { AlertsSection } from '@/components/alerts-section'
import { DeviceStatus } from '@/components/device-status'
import { MetricSkeleton } from '@/components/metric-skeleton'
import { Activity, TrendingUp, Droplets, Thermometer } from 'lucide-react'
import { useDeviceContext } from '@/contexts/device-context'
import { useAuth } from '@/contexts/auth-context'
import { subscribeLiveData, subscribeRecentAlerts, subscribeSystemMetrics } from '@/lib/firebase/realtime'
import { updateSystemMetrics, getDeviceStats, getReadingAnalytics, LiveData, Alert, SystemMetrics } from '@/lib/firebase/firestore'

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m ${seconds % 60}s`
}

function getRuntimeStatus(liveData: LiveData | null | undefined): 'online' | 'offline' {
  if (!liveData) return 'offline'
  return Date.now() - new Date(liveData.timestamp).getTime() < 2 * 60 * 1000 ? 'online' : 'offline'
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { devices, isLoading: devicesLoading } = useDeviceContext()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [deviceLiveData, setDeviceLiveData] = useState<Record<string, LiveData | null>>({})
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uptime, setUptime] = useState(0)

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user || authLoading) return

    const unsubscribers: (() => void)[] = []
    devices.forEach((device) => {
      const unsubscribe = subscribeLiveData(device.id, (data) => {
        setDeviceLiveData((prev) => ({
          ...prev,
          [device.id]: data,
        }))
      })
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [devices, user, authLoading])

  useEffect(() => {
    if (!user || authLoading) return

    const unsubscribeAlerts = subscribeRecentAlerts(user.uid, 10, setAlerts)
    const unsubscribeMetrics = subscribeSystemMetrics(user.uid, setSystemMetrics)
    const startTime = Date.now()
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    const loadInitialData = async () => {
      try {
        const deviceStats = await getDeviceStats(user.uid)
        const readingAnalytics = await getReadingAnalytics(user.uid, 7)
        await updateSystemMetrics(user.uid, {
          uptime,
          totalDevices: deviceStats.total,
          activeDevices: deviceStats.online,
          totalReadings: readingAnalytics.totalReadings,
          alertsToday: alerts.filter((alert) => alert.timestamp.toDateString() === new Date().toDateString()).length,
          automationRules: devices.length,
        })
      } catch (error) {
        if ((error as { code?: string })?.code !== 'permission-denied') {
          console.error('Error loading dashboard metrics:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()

    return () => {
      unsubscribeAlerts()
      unsubscribeMetrics()
      clearInterval(uptimeInterval)
    }
  }, [user, authLoading, devices.length, alerts, uptime])

  const metrics = useMemo<MetricCardData[]>(() => {
    const deviceMetrics: MetricCardData[] = devices.map((device) => {
      const liveData = deviceLiveData[device.id]
      const status = getRuntimeStatus(liveData)
      return {
        id: device.id,
        title: device.name,
        value: liveData ? `${liveData.temperature.toFixed(1)} C` : '--',
        change: liveData ? `${liveData.tds} ppm TDS` : 'No data',
        trend: 'neutral',
        icon: Thermometer,
        color: 'blue',
        status,
        lastUpdated: liveData ? new Date(liveData.timestamp).toLocaleTimeString() : 'Waiting for data',
      }
    })

    const allLiveData = Object.values(deviceLiveData).filter(Boolean) as LiveData[]
    if (allLiveData.length > 0) {
      const avgTemp = allLiveData.reduce((sum, data) => sum + data.temperature, 0) / allLiveData.length
      deviceMetrics.unshift({
        id: 'system-overview',
        title: 'System Overview',
        value: `${avgTemp.toFixed(1)} C`,
        change: `${allLiveData.length} active feeds`,
        trend: 'up',
        icon: Activity,
        color: 'green',
        status: 'online',
        lastUpdated: 'Live overview',
      })
    }

    return deviceMetrics
  }, [devices, deviceLiveData])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  const deviceStatusItems = devices.map((device) => {
    const liveData = deviceLiveData[device.id]
    return {
      id: device.id,
      name: device.name,
      status: getRuntimeStatus(liveData) === 'online' ? ('connected' as const) : ('offline' as const),
      lastSynced: liveData?.timestamp ? new Date(liveData.timestamp).toLocaleString() : 'Never',
    }
  })

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative min-h-screen"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px, 20px 20px',
        backgroundPosition: '0 0, 10px 10px',
      }}
    >
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-8 border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-200/30 to-blue-200/30 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time monitoring of your smart farm system</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              {deviceStatusItems.some((item) => item.status === 'connected') ? 'System Online' : 'Awaiting device data'}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4" />
              Last updated: {Object.values(deviceLiveData).find(Boolean)?.timestamp ? new Date((Object.values(deviceLiveData).find(Boolean) as LiveData).timestamp).toLocaleTimeString() : 'Pending'}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isLoading || devicesLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          metrics.map((metric, index) => (
            <motion.div key={metric.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }}>
              <MetricCard metric={metric} />
            </motion.div>
          ))
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading || devicesLoading ? (
          <>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 p-6 h-64 animate-pulse" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 p-6 h-64 animate-pulse" />
          </>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <AlertsSection alerts={alerts} />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <DeviceStatus devices={deviceStatusItems} />
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 smooth-transition">
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-cyan-100/50 to-blue-100/50 dark:from-cyan-500/5 dark:to-blue-500/5 rounded-full -translate-y-10 translate-x-10" />

        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">System Information</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Uptime', value: formatUptime(uptime), icon: Activity, color: 'text-green-600' },
              { label: 'Active Sensors', value: systemMetrics?.activeDevices?.toString() || '0', icon: Thermometer, color: 'text-blue-600' },
              { label: 'Automation Rules', value: systemMetrics?.automationRules?.toString() || '0', icon: TrendingUp, color: 'text-purple-600' },
              { label: 'Data Points Today', value: systemMetrics?.totalReadings?.toString() || '0', icon: Droplets, color: 'text-cyan-600' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-linear-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 smooth-transition hover:shadow-lg"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-linear-to-br from-slate-100/50 to-slate-200/50 dark:from-slate-700/30 dark:to-slate-600/30 rounded-full -translate-y-6 translate-x-6 group-hover:scale-110 transition-transform" />

                <div className="relative z-10">
                  <div className="inline-flex p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mb-3">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-500 mb-1 font-medium">{item.label}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
