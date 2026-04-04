'use client'

import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Alert } from '@/lib/firebase/firestore'

interface AlertsSectionProps {
  alerts: Alert[]
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  const formatTimestamp = (timestamp: Alert['timestamp']) => {
    if (timestamp instanceof Date) {
      return timestamp.toLocaleString()
    }

    return new Date(timestamp).toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition"
    >
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Smart Alerts</h2>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-3 p-3 rounded-lg border smooth-transition ${
              !alert.read
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
            }`}
          >
            {!alert.read ? (
              <AlertCircle size={18} className="mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {alert.message}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">{formatTimestamp(alert.timestamp)}</p>
            </div>

            <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
              !alert.read
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
            }`}>
              {!alert.read ? 'Active' : 'Resolved'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
