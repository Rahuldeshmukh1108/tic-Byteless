'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

export interface MetricCardData {
  id: string
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color: 'blue' | 'green'
  status: 'online' | 'offline' | 'error'
  lastUpdated?: string
}

interface MetricCardProps {
  metric: MetricCardData
}

export function MetricCard({ metric }: MetricCardProps) {
  const toneColors = {
    blue: 'border-cyan-200 dark:border-cyan-500/30 bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10',
    green: 'border-emerald-200 dark:border-emerald-500/30 bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10',
  }

  const statusDotColors = {
    online: 'bg-green-500',
    offline: 'bg-slate-400',
    error: 'bg-red-500',
  }

  const statusTextColors = {
    online: 'text-green-700 dark:text-green-400',
    offline: 'text-slate-700 dark:text-slate-400',
    error: 'text-red-700 dark:text-red-400',
  }

  const trendColors = {
    up: 'text-green-700 dark:text-green-400',
    down: 'text-red-700 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  }

  const Icon = metric.icon

  const statusLabel = {
    online: 'Online',
    offline: 'Offline',
    error: 'Error',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-6 backdrop-blur-sm smooth-transition hover:shadow-lg ${toneColors[metric.color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{metric.title}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {metric.value}
            </span>
            <span className={`text-sm font-medium ${trendColors[metric.trend]}`}>{metric.change}</span>
          </div>
        </div>
        <div className="rounded-lg bg-white/70 dark:bg-slate-900/40 p-3">
          <Icon className="h-6 w-6 text-slate-700 dark:text-slate-200" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusDotColors[metric.status]} animate-pulse`} />
          <span className={`text-xs font-medium ${statusTextColors[metric.status]}`}>
            {statusLabel[metric.status]}
          </span>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-500">{metric.lastUpdated ?? 'Live'}</span>
      </div>
    </motion.div>
  )
}
