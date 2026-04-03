'use client'

import { motion } from 'framer-motion'

export function MetricSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
          <div className="h-8 w-32 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-slate-800 rounded animate-pulse" />
      </div>

      <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-800 rounded animate-pulse" />
        <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
      </div>
    </motion.div>
  )
}
