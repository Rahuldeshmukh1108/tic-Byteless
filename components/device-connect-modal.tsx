'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Device } from '@/lib/firebase/firestore'
import { connectDevice } from '@/lib/firebase/device-service'

interface DeviceConnectModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onDeviceConnected: (deviceId: string, device: Device) => void
}

const DEVICE_TYPES: { value: Device['type']; label: string }[] = [
  { value: 'hydroponic', label: 'Hydroponic System' },
  { value: 'aquaponic', label: 'Aquaponic System' },
  { value: 'aeroponic', label: 'Aeroponic System' },
]

export function DeviceConnectModal({
  isOpen,
  onClose,
  userId,
  onDeviceConnected,
}: DeviceConnectModalProps) {
  const [deviceName, setDeviceName] = useState('')
  const [deviceType, setDeviceType] = useState<Device['type']>('hydroponic')
  const [deviceId, setDeviceId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'form' | 'pairing'>('form')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!deviceName.trim()) {
      setError('Please enter a device name')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      setStep('pairing')
      
      // Simulate device pairing process
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Connect device to user
      const newDeviceId = await connectDevice(userId, {
        userId,
        name: deviceName,
        type: deviceType,
        status: 'online',
      })

      setDeviceId(newDeviceId)
      setSuccess(true)

      // Create device object for callback
      const newDevice: Device = {
        id: newDeviceId,
        userId,
        name: deviceName,
        type: deviceType,
        status: 'online',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Notify parent component
      setTimeout(() => {
        onDeviceConnected(newDeviceId, newDevice)
        handleReset()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect device')
      setStep('form')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDeviceName('')
    setDeviceType('hydroponic')
    setDeviceId('')
    setError(null)
    setSuccess(false)
    setStep('form')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {step === 'form' ? 'Connect New Device' : 'Pairing Device'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'form' && !success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg"
              >
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            {/* Device Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Device Name
              </label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., Main Greenhouse"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>

            {/* Device Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">
                System Type
              </label>
              <select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value as Device['type'])}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:opacity-50"
              >
                {DEVICE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 size={18} className="animate-spin" />}
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </form>
        ) : null}

        {step === 'pairing' && !success ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <div className="w-16 h-16 rounded-full border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-600 dark:border-t-cyan-400" />
              </motion.div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Searching for your device...</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">This may take a few moments</p>
            </div>
          </div>
        ) : null}

        {success ? (
          <div className="space-y-4">
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.5 }}
              >
                <CheckCircle size={48} className="text-green-500 mx-auto" />
              </motion.div>
              <p className="mt-4 text-slate-900 dark:text-slate-100 font-semibold">Device Connected!</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {deviceName} has been successfully connected to your account.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                Device ID: {deviceId}
              </p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
