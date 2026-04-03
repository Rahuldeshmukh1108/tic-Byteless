'use client'

import { motion } from 'framer-motion'
import { Activity, Wifi, WifiOff } from 'lucide-react'
import type { DeviceStatus } from '@/lib/mock-data'

interface DeviceStatusProps {
  devices: DeviceStatus[]
}

export function DeviceStatus({ devices }: DeviceStatusProps) {
  const connectedCount = devices.filter((d) => d.status === 'connected').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Device Status</h2>
        <div className="text-sm text-cyan-600 dark:text-cyan-400">
          <Activity size={16} className="inline mr-1" />
          {connectedCount}/{devices.length} Connected
        </div>
      </div>

      <div className="space-y-2">
        {devices.map((device) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 smooth-transition"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {device.status === 'connected' ? (
                  <Wifi size={18} className="text-green-600 dark:text-green-400" />
                ) : (
                  <WifiOff size={18} className="text-red-600 dark:text-red-400" />
                )}
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                    device.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  } animate-pulse`}
                />
              </div>
              
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{device.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-500">Last synced: {device.lastSynced}</p>
              </div>
            </div>

            <span className={`text-xs font-semibold px-2 py-1 rounded ${
              device.status === 'connected'
                ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
            }`}>
              {device.status === 'connected' ? 'Connected' : 'Offline'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
