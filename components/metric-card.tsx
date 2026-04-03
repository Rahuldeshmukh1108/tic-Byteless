'use client'

import { motion } from 'framer-motion'
import type { MetricCard as MetricCardType } from '@/lib/mock-data'

interface MetricCardProps {
  metric: MetricCardType
}

export function MetricCard({ metric }: MetricCardProps) {
  const statusColors = {
    normal: 'border-green-300 dark:border-green-500/50 bg-green-50 dark:bg-green-500/10',
    warning: 'border-yellow-300 dark:border-yellow-500/50 bg-yellow-50 dark:bg-yellow-500/10',
    critical: 'border-red-300 dark:border-red-500/50 bg-red-50 dark:bg-red-500/10',
  }

  const statusDotColors = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  }

  const statusTextColors = {
    normal: 'text-green-700 dark:text-green-400',
    warning: 'text-yellow-700 dark:text-yellow-400',
    critical: 'text-red-700 dark:text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border p-6 backdrop-blur-sm smooth-transition hover:shadow-lg ${statusColors[metric.status]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{metric.title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-lg text-slate-600 dark:text-slate-400">{metric.unit}</span>
            )}
          </div>
        </div>
        <span className="text-3xl">{metric.icon}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusDotColors[metric.status]} animate-pulse`} />
          <span className={`text-xs font-medium ${statusTextColors[metric.status]}`}>
            {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
          </span>
        </div>
        <span className="text-xs text-slate-600 dark:text-slate-500">{metric.lastUpdated}</span>
      </div>
    </motion.div>
  )
}
