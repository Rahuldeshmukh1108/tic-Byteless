'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, AlertTriangle, Lightbulb } from 'lucide-react'
import { useDeviceContext } from '@/contexts/device-context'
import { useAuth } from '@/contexts/auth-context'
import { subscribeLiveData } from '@/lib/firebase/realtime'
import { getReadingAnalytics, LiveData } from '@/lib/firebase/firestore'

interface InsightIssue {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning'
  time: string
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { devices } = useDeviceContext()
  const [timeFilter, setTimeFilter] = useState('24')
  const [deviceLiveData, setDeviceLiveData] = useState<Record<string, LiveData | null>>({})
  const [stats, setStats] = useState([
    { label: 'Avg Temperature', value: '--', change: 'Live', positive: true },
    { label: 'Avg TDS', value: '--', change: 'Live', positive: true },
    { label: 'Avg Light', value: '--', change: 'Live', positive: true },
    { label: 'Avg Humidity', value: '--', change: 'Live', positive: true },
  ])

  useEffect(() => {
    const unsubscribers = devices.map((device) =>
      subscribeLiveData(device.id, (data) => {
        setDeviceLiveData((prev) => ({
          ...prev,
          [device.id]: data,
        }))
      })
    )

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe())
    }
  }, [devices])

  useEffect(() => {
    if (!user) return

    const days = timeFilter === '1' ? 1 : timeFilter === '24' ? 1 : 7
    getReadingAnalytics(user.uid, days).then((analytics) => {
      const liveValues = Object.values(deviceLiveData).filter(Boolean) as LiveData[]
      const avgLight = liveValues.length
        ? liveValues.reduce((sum, item) => sum + item.ldr, 0) / liveValues.length
        : 0

      setStats([
        { label: 'Avg Temperature', value: `${analytics.avgTemperature.toFixed(1)} C`, change: `${devices.length} devices`, positive: true },
        { label: 'Avg TDS', value: `${analytics.avgTds.toFixed(0)} ppm`, change: `${analytics.totalReadings} samples`, positive: true },
        { label: 'Avg Light', value: `${avgLight.toFixed(0)}`, change: 'Current feed', positive: true },
        { label: 'Avg Humidity', value: `${analytics.avgHumidity.toFixed(1)}%`, change: 'Current feed', positive: true },
      ])
    })
  }, [user, timeFilter, deviceLiveData, devices.length])

  const insights = useMemo(() => {
    const liveValues = Object.values(deviceLiveData).filter(Boolean) as LiveData[]

    const issues: InsightIssue[] = []
    const solutions: { id: string; title: string; description: string; action: string }[] = []
    const recommendations: { id: string; title: string; description: string }[] = []

    liveValues.forEach((liveData) => {
      const device = devices.find((item) => item.id === liveData.deviceId)
      const deviceName = device?.name || liveData.deviceId

      issues.push({
        id: `${liveData.deviceId}-status`,
        title: `${deviceName} telemetry received`,
        description: `Temp ${liveData.temperature.toFixed(1)} C, TDS ${liveData.tds} ppm, Light ${liveData.ldr}, Humidity ${liveData.humidity.toFixed(1)}%.`,
        severity: liveData.tds < 500 || liveData.temperature > 30 ? 'critical' : 'warning',
        time: new Date(liveData.timestamp).toLocaleString(),
      })

      solutions.push({
        id: `${liveData.deviceId}-solution`,
        title: `Tune ${deviceName} thresholds`,
        description: `Review config values so the ESP32 reacts earlier when temp or TDS drift from target.`,
        action: 'Review config',
      })

      recommendations.push({
        id: `${liveData.deviceId}-rec`,
        title: `Watch ${deviceName} irrigation cycle`,
        description: liveData.pump1Status || liveData.pump3Status
          ? 'A pump is active right now, so this is a good moment to verify flow and drain timing.'
          : 'Pump outputs are idle, which is a good time to verify threshold tuning and next cycle timing.',
      })
    })

    if (issues.length === 0) {
      issues.push({
        id: 'no-data',
        title: 'Waiting for live telemetry',
        description: 'Connect a device or let the ESP32 publish fresh readings to populate analytics.',
        severity: 'warning',
        time: 'Pending',
      })
    }

    if (solutions.length === 0) {
      solutions.push({
        id: 'default-solution',
        title: 'Connect your ESP32 device',
        description: 'Once telemetry starts flowing into Firebase, this screen will generate live operational guidance.',
        action: 'Open devices',
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        id: 'default-rec',
        title: 'Bring one device online',
        description: 'The analytics page becomes fully dynamic as soon as the first device starts updating `/devices/{deviceId}`.',
      })
    }

    return { issues: issues.slice(0, 4), solutions: solutions.slice(0, 2), recommendations: recommendations.slice(0, 4) }
  }, [deviceLiveData, devices])

  return (
    <div
      className="space-y-8"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '20px 20px, 20px 20px',
        backgroundPosition: '0 0, 10px 10px',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Analytics & AI Insights</h1>
          <p className="text-foreground/60 dark:text-slate-400">Track performance and get intelligent recommendations</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-foreground/60 dark:text-slate-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 smooth-transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="1">Last 1 hour</option>
            <option value="24">Last 24 hours</option>
            <option value="7">Last 7 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition hover:border-slate-300 dark:hover:border-slate-600"
          >
            <p className="text-sm text-foreground/60 dark:text-slate-400 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                <TrendingUp size={16} />
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
          Issues Detected
        </h2>
        <div className="space-y-3">
          {insights.issues.map((issue) => (
            <div
              key={issue.id}
              className={`rounded-lg p-4 border-l-4 ${issue.severity === 'critical' ? 'border-l-red-500 bg-red-50 dark:bg-red-500/10' : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{issue.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{issue.description}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${issue.severity === 'critical' ? 'bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-300' : 'bg-yellow-200 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300'}`}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{issue.time}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-blue-500 dark:text-blue-400" />
          Suggested Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.solutions.map((solution) => (
            <div key={solution.id} className="rounded-lg p-4 border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{solution.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{solution.description}</p>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-3 hover:underline">{solution.action}</button>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Future Recommendations</h2>
        <div className="space-y-3">
          {insights.recommendations.map((rec, index) => (
            <div key={rec.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{rec.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
