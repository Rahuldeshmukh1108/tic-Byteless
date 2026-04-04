'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { Device, DeviceConfig } from '@/lib/firebase/firestore'
import { getDeviceAutomationConfig, updateDeviceAutomationConfig } from '@/lib/firebase/device-service'

interface DeviceSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  device: Device
}

const DEFAULT_CONFIG: DeviceConfig = {
  deviceId: '',
  tdsThreshold: 500,
  tempMin: 25,
  tempMax: 30,
  ldrThreshold: 2500,
  pump1Duration: 30000,
  pump2Duration: 5000,
  pump3Duration: 15000,
  dryDuration: 10000,
  absorbDuration: 10000,
  updatedAt: new Date(),
}

export function DeviceSettingsModal({ isOpen, onClose, device }: DeviceSettingsModalProps) {
  const [config, setConfig] = useState<DeviceConfig>({ ...DEFAULT_CONFIG, deviceId: device.id })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    setIsFetching(true)
    setError(null)
    setSuccess(false)

    getDeviceAutomationConfig(device.id)
      .then((nextConfig) => setConfig(nextConfig))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load settings'))
      .finally(() => setIsFetching(false))
  }, [isOpen, device.id])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateDeviceAutomationConfig(device.id, config)
      setSuccess(true)
      setTimeout(() => onClose(), 1200)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (field: keyof DeviceConfig, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Device Settings - {device.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              These values map directly to your ESP32 `fetchConfig()` keys.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
              Settings saved successfully.
            </div>
          )}

          {isFetching ? (
            <div className="py-10 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <Loader2 size={20} className="animate-spin mr-2" />
              Loading device config...
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Thresholds</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="TDS Threshold (ppm)" value={config.tdsThreshold} onChange={(value) => updateConfig('tdsThreshold', value)} />
                  <Field label="LDR Threshold" value={config.ldrThreshold} onChange={(value) => updateConfig('ldrThreshold', value)} />
                  <Field label="Min Temperature (C)" value={config.tempMin} onChange={(value) => updateConfig('tempMin', value)} step="0.1" />
                  <Field label="Max Temperature (C)" value={config.tempMax} onChange={(value) => updateConfig('tempMax', value)} step="0.1" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Durations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Pump 1 Duration (ms)" value={config.pump1Duration} onChange={(value) => updateConfig('pump1Duration', value)} />
                  <Field label="Pump 2 Duration (ms)" value={config.pump2Duration} onChange={(value) => updateConfig('pump2Duration', value)} />
                  <Field label="Pump 3 Duration (ms)" value={config.pump3Duration} onChange={(value) => updateConfig('pump3Duration', value)} />
                  <Field label="Dry Duration (ms)" value={config.dryDuration} onChange={(value) => updateConfig('dryDuration', value)} />
                  <Field label="Absorb Duration (ms)" value={config.absorbDuration} onChange={(value) => updateConfig('absorbDuration', value)} />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 size={18} className="animate-spin" />}
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  step = '1',
}: {
  label: string
  value: number
  onChange: (value: number) => void
  step?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
      />
    </div>
  )
}
