'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Save, Loader2 } from 'lucide-react'
import { Device } from '@/lib/firebase/firestore'
import { updateDeviceAutomationConfig } from '@/lib/firebase/device-service'

interface DeviceSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  device: Device
}

interface AutomationConfig {
  deviceId: string
  enabled: boolean
  temperatureMin: number
  temperatureMax: number
  tdsMin: number
  tdsMax: number
  humidityMin: number
  humidityMax: number
  pump1Duration: number
  pump2Duration: number
  fanThreshold: number
  lightSchedule: {
    start: string
    end: string
  }
}

export function DeviceSettingsModal({ isOpen, onClose, device }: DeviceSettingsModalProps) {
  const [config, setConfig] = useState<AutomationConfig>({
    deviceId: device.id,
    enabled: true,
    temperatureMin: 18,
    temperatureMax: 28,
    tdsMin: 800,
    tdsMax: 1500,
    humidityMin: 40,
    humidityMax: 80,
    pump1Duration: 300,
    pump2Duration: 600,
    fanThreshold: 26,
    lightSchedule: {
      start: '06:00',
      end: '18:00'
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Load existing config when modal opens
  useEffect(() => {
    if (isOpen) {
      // In a real implementation, you would fetch the current config from Firebase
      // For now, we'll use default values
      setConfig({
        deviceId: device.id,
        enabled: true,
        temperatureMin: 18,
        temperatureMax: 28,
        tdsMin: 800,
        tdsMax: 1500,
        humidityMin: 40,
        humidityMax: 80,
        pump1Duration: 300,
        pump2Duration: 600,
        fanThreshold: 26,
        lightSchedule: {
          start: '06:00',
          end: '18:00'
        }
      })
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, device.id])

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await updateDeviceAutomationConfig(device.id, config)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (field: keyof AutomationConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateLightSchedule = (field: 'start' | 'end', value: string) => {
    setConfig(prev => ({
      ...prev,
      lightSchedule: {
        ...prev.lightSchedule,
        [field]: value
      }
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Device Settings - {device.name}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Configure automation thresholds and pump durations
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
          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg"
            >
              <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg"
            >
              <div className="text-green-600 dark:text-green-400 text-sm">Settings saved successfully!</div>
            </motion.div>
          )}

          {/* Automation Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Enable Automation</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Allow automatic control of pumps and systems</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateConfig('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Sensor Thresholds */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sensor Thresholds</h3>

            {/* Temperature */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min Temperature (°C)
                </label>
                <input
                  type="number"
                  value={config.temperatureMin}
                  onChange={(e) => updateConfig('temperatureMin', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max Temperature (°C)
                </label>
                <input
                  type="number"
                  value={config.temperatureMax}
                  onChange={(e) => updateConfig('temperatureMax', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  step="0.1"
                />
              </div>
            </div>

            {/* TDS */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min TDS (ppm)
                </label>
                <input
                  type="number"
                  value={config.tdsMin}
                  onChange={(e) => updateConfig('tdsMin', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max TDS (ppm)
                </label>
                <input
                  type="number"
                  value={config.tdsMax}
                  onChange={(e) => updateConfig('tdsMax', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Humidity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min Humidity (%)
                </label>
                <input
                  type="number"
                  value={config.humidityMin}
                  onChange={(e) => updateConfig('humidityMin', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Max Humidity (%)
                </label>
                <input
                  type="number"
                  value={config.humidityMax}
                  onChange={(e) => updateConfig('humidityMax', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Pump Durations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pump Durations</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pump 1 Duration (seconds)
                </label>
                <input
                  type="number"
                  value={config.pump1Duration}
                  onChange={(e) => updateConfig('pump1Duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Pump 2 Duration (seconds)
                </label>
                <input
                  type="number"
                  value={config.pump2Duration}
                  onChange={(e) => updateConfig('pump2Duration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Fan Threshold */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Fan Activation Temperature (°C)
            </label>
            <input
              type="number"
              value={config.fanThreshold}
              onChange={(e) => updateConfig('fanThreshold', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              step="0.1"
            />
          </div>

          {/* Light Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Grow Light Schedule</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={config.lightSchedule.start}
                  onChange={(e) => updateLightSchedule('start', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={config.lightSchedule.end}
                  onChange={(e) => updateLightSchedule('end', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
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
        </div>
      </motion.div>
    </div>
  )
}