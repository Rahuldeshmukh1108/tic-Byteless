'use client'

import { motion } from 'framer-motion'
import { Activity, Droplet, Sun, AlertCircle, Loader2 } from 'lucide-react'
import { useLiveDeviceData } from '@/hooks/use-live-device-data'
import { useAlerts } from '@/hooks/use-alerts'
import { useAuth } from '@/contexts/auth-context'

interface AnimatedDashboardProps {
  deviceId?: string | null
}

export function AnimatedDashboard({ deviceId = null }: AnimatedDashboardProps) {
  const { user } = useAuth()
  const { data: liveData, isLoading: isLoadingData } = useLiveDeviceData(deviceId)
  const { unreadCount: alertCount, isLoading: isLoadingAlerts } = useAlerts(user?.uid || null)

  // Use live data if available, otherwise use placeholder values
  const temperature = liveData?.temperature ?? 22
  const tds = liveData?.tds ?? 1200
  const ldr = liveData?.ldr ?? 78
  const humidity = liveData?.humidity ?? 65

  const metrics = [
    { 
      icon: Activity, 
      label: 'Temperature', 
      value: temperature.toFixed(1), 
      unit: '°C',
      color: 'from-red-400 to-red-600' 
    },
    { 
      icon: Droplet, 
      label: 'TDS Level', 
      value: tds.toFixed(0), 
      unit: 'ppm',
      color: 'from-blue-400 to-blue-600' 
    },
    { 
      icon: Sun, 
      label: 'Light Level', 
      value: ldr.toFixed(0), 
      unit: '%',
      color: 'from-yellow-400 to-orange-600' 
    },
    { 
      icon: AlertCircle, 
      label: 'Alerts', 
      value: alertCount.toString(), 
      unit: '',
      color: alertCount > 0 ? 'from-red-400 to-red-600' : 'from-green-400 to-green-600'
    },
  ]

  const isLoading = isLoadingData || isLoadingAlerts

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
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full"
    >
      {/* Main Dashboard Card */}
      <motion.div className="glassmorphism-light p-6 sm:p-8 space-y-6">
        {/* Dashboard Header */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Farm Status</h3>
          <p className="text-sm text-foreground/60">Real-time monitoring and control</p>
        </div>

        {/* Metrics Grid */}
        {isLoading && deviceId ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-cyan-500" size={24} />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <motion.div
                  key={metric.label}
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${metric.color} p-4 rounded-xl opacity-20 group`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={20} className="text-white/60" />
                  </div>
                  <div className="text-2xl font-bold text-white/80 mb-1">
                    {metric.value}{metric.unit && <span className="text-sm">{metric.unit}</span>}
                  </div>
                  <div className="text-xs text-white/60">{metric.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Chart Simulation */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Water Usage (24h)</span>
              <span className="text-xs text-foreground/60">Peak: 3,200L</span>
            </div>
            <div className="h-16 flex items-end gap-1 opacity-60">
              {[40, 50, 65, 58, 72, 68, 55, 60].map((height, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(height / 100) * 64}px` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Status Footer */}
        <motion.div
          variants={itemVariants}
          className="border-t border-white/10 pt-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              deviceId && liveData ? 'bg-green-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-foreground/70">
              {deviceId && liveData ? 'Live Data' : deviceId ? 'Connecting...' : 'No Device Selected'}
            </span>
          </div>
          <span className="text-xs text-foreground/60">
            {liveData?.timestamp 
              ? `Last update: ${new Date(liveData.timestamp instanceof Date ? liveData.timestamp : liveData.timestamp).toLocaleTimeString()}`
              : 'Waiting for data...'}
          </span>
        </motion.div>
      </motion.div>

      {/* Decorative Glow Elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </motion.div>
  )
}
