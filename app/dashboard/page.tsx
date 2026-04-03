'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MetricCard } from '@/components/metric-card'
import { AlertsSection } from '@/components/alerts-section'
import { DeviceStatus } from '@/components/device-status'
import { MetricSkeleton } from '@/components/metric-skeleton'
import { getMockAlerts } from '@/lib/mock-data'
import type { Alert } from '@/lib/mock-data'
import { Activity, TrendingUp, Droplets, Thermometer } from 'lucide-react'
import { useDeviceContext } from '@/contexts/device-context'
import { useAuth } from '@/contexts/auth-context'
import { subscribeLiveData } from '@/lib/firebase/realtime'
import { LiveData } from '@/lib/firebase/firestore'

export default function DashboardPage() {
  const { user } = useAuth()
  const { devices, isLoading: devicesLoading } = useDeviceContext()
  const [metrics, setMetrics] = useState<any[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [deviceLiveData, setDeviceLiveData] = useState<Record<string, LiveData | null>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Subscribe to live data for all devices
    const unsubscribers: (() => void)[] = []

    devices.forEach(device => {
      const unsubscribe = subscribeLiveData(device.id, (data) => {
        setDeviceLiveData(prev => ({
          ...prev,
          [device.id]: data
        }))
      })
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [devices])

  useEffect(() => {
    // Initial load
    setAlerts(getMockAlerts())
    setIsLoading(false)

    // Create metrics from device live data
    const updateMetrics = () => {
      const newMetrics = devices.map(device => {
        const liveData = deviceLiveData[device.id]
        return {
          id: device.id,
          title: device.name,
          value: liveData ? `${liveData.temperature.toFixed(1)}°C` : '--',
          change: liveData ? '+0.2°C' : 'No data',
          trend: 'up' as const,
          icon: Thermometer,
          color: 'blue' as const,
          status: device.status,
        }
      })

      // Add aggregate metrics if we have data
      const allLiveData = Object.values(deviceLiveData).filter(data => data !== null) as LiveData[]
      if (allLiveData.length > 0) {
        const avgTemp = allLiveData.reduce((sum, data) => sum + data.temperature, 0) / allLiveData.length
        const avgTds = allLiveData.reduce((sum, data) => sum + data.tds, 0) / allLiveData.length
        const avgHumidity = allLiveData.reduce((sum, data) => sum + data.humidity, 0) / allLiveData.length

        newMetrics.unshift({
          id: 'system-overview',
          title: 'System Overview',
          value: `${avgTemp.toFixed(1)}°C`,
          change: `${allLiveData.length} devices`,
          trend: 'up' as const,
          icon: Activity,
          color: 'green' as const,
          status: 'online' as const,
        })
      }

      setMetrics(newMetrics)
    }

    updateMetrics()

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000)

    return () => clearInterval(interval)
  }, [devices, deviceLiveData])

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 relative min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(circle, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
          radial-gradient(circle, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px, 30px 30px',
        backgroundPosition: '0 0, 10px 10px',
      }}
    >
      {/* Page Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-linear-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 p-8 border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-200/30 to-blue-200/30 dark:from-cyan-500/10 dark:to-blue-500/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-br from-indigo-200/30 to-purple-200/30 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-linear-to-br from-cyan-500 to-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Real-time monitoring of your smart farm system
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6 mt-6"
          >
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              System Online
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp className="w-4 h-4" />
              Last updated: Just now
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {isLoading || devicesLoading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <MetricCard metric={metric} />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Alerts and Devices */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {isLoading || devicesLoading ? (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 p-6 h-64 animate-pulse"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 p-6 h-64 animate-pulse"
            />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AlertsSection alerts={alerts} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DeviceStatus devices={devices.map(device => ({
                id: device.id,
                name: device.name,
                status: device.status === 'online' ? 'connected' as const : 'offline' as const,
                lastSynced: deviceLiveData[device.id]?.timestamp ? 
                  new Date(deviceLiveData[device.id]!.timestamp).toLocaleString() : 
                  'Never'
              }))} />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* System Info */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 smooth-transition"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-cyan-100/50 to-blue-100/50 dark:from-cyan-500/5 dark:to-blue-500/5 rounded-full -translate-y-10 translate-x-10" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="p-2 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              System Information
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Uptime', value: '45 days 12 hrs', icon: Activity, color: 'text-green-600' },
              { label: 'Active Sensors', value: '8', icon: Thermometer, color: 'text-blue-600' },
              { label: 'Automation Rules', value: '12', icon: TrendingUp, color: 'text-purple-600' },
              { label: 'Data Points Today', value: '8,492', icon: Droplets, color: 'text-cyan-600' },
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
                  <div className={`inline-flex p-2 rounded-lg bg-slate-100 dark:bg-slate-800 mb-3`}>
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
