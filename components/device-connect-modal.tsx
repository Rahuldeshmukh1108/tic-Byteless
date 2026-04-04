'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Device } from '@/lib/firebase/firestore'
import { connectDevice, getDeviceConnectionStatus } from '@/lib/firebase/device-service'

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
  const [deviceId, setDeviceId] = useState('device001')
  const [wifiSsid, setWifiSsid] = useState('')
  const [wifiPassword, setWifiPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState<'form' | 'pairing'>('form')
  const [deviceStatus, setDeviceStatus] = useState<{
    existsInRealtimeDb: boolean
    isAlreadyLinked: boolean
  } | null>(null)
  const [isCheckingDeviceId, setIsCheckingDeviceId] = useState(false)

  useEffect(() => {
    const trimmedDeviceId = deviceId.trim()
    if (!trimmedDeviceId || !isOpen) {
      setDeviceStatus(null)
      return
    }

    let isCancelled = false
    setIsCheckingDeviceId(true)

    getDeviceConnectionStatus(trimmedDeviceId)
      .then((status) => {
        if (!isCancelled) {
          setDeviceStatus(status)
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setDeviceStatus(null)
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsCheckingDeviceId(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [deviceId, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!deviceName.trim()) {
      setError('Please enter a device name.')
      return
    }

    if (!deviceId.trim()) {
      setError('Please enter the hardware device ID from your ESP32 code, for example device001.')
      return
    }

    if (deviceStatus?.isAlreadyLinked) {
      setError('This hardware ID is already linked. Use a different device ID or unlink it first.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      setStep('pairing')

      await new Promise((resolve) => setTimeout(resolve, 1200))

      const newDeviceId = await connectDevice(
        userId,
        {
          userId,
          name: deviceName,
          type: deviceType,
          status: 'online',
          wifiCredentials: wifiSsid.trim()
            ? {
                ssid: wifiSsid,
                password: wifiPassword,
              }
            : undefined,
        },
        deviceId
      )

      setDeviceId(newDeviceId)
      setSuccess(true)

      const newDevice: Device = {
        id: newDeviceId,
        userId,
        name: deviceName,
        type: deviceType,
        status: 'online',
        wifiCredentials: wifiSsid.trim()
          ? {
              ssid: wifiSsid,
              password: wifiPassword,
            }
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setTimeout(() => {
        onDeviceConnected(newDeviceId, newDevice)
        handleReset()
        onClose()
      }, 1800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect device.')
      setStep('form')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setDeviceName('')
    setDeviceType('hydroponic')
    setDeviceId('device001')
    setWifiSsid('')
    setWifiPassword('')
    setError(null)
    setSuccess(false)
    setStep('form')
    setDeviceStatus(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full p-6"
      >
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
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg"
              >
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}

            <div className="rounded-lg border border-cyan-200 dark:border-cyan-500/20 bg-cyan-50 dark:bg-cyan-500/10 p-3 text-sm text-slate-700 dark:text-slate-300">
              Use the exact same `deviceID` that is hardcoded in your ESP32 sketch. If your sketch says `String deviceID = "device001";`, enter `device001` here.
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Device Name</label>
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="e.g., Main Greenhouse"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Hardware Device ID</label>
              <input
                type="text"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                placeholder="e.g., device001"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                This links the software to the real board publishing into Firebase.
              </p>
              {isCheckingDeviceId ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">Checking Firebase for this hardware ID...</p>
              ) : deviceStatus ? (
                <div
                  className={`rounded-md px-3 py-2 text-xs ${
                    deviceStatus.isAlreadyLinked
                      ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300'
                      : deviceStatus.existsInRealtimeDb
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300'
                      : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {deviceStatus.isAlreadyLinked
                    ? 'This hardware ID is already linked to a user account.'
                    : deviceStatus.existsInRealtimeDb
                    ? 'Hardware detected in Firebase. This is the ideal ID to link.'
                    : 'Not detected in Firebase yet. You can still link it now, but the board must later publish using this exact ID.'}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">System Type</label>
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

            <div className="rounded-lg border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 p-3 text-xs text-slate-700 dark:text-slate-300">
              WiFi fields below are only saved as reference inside the app. This form does not yet push WiFi credentials into the ESP32 automatically, so you still need to flash the board with the correct WiFi and Firebase values.
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">WiFi Network (Optional)</label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="e.g., MyHomeWiFi"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">WiFi Password (Optional)</label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                placeholder="Enter WiFi password"
                disabled={isLoading}
                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 disabled:opacity-50"
              />
            </div>

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
                disabled={isLoading || deviceStatus?.isAlreadyLinked === true}
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
              <p className="mt-4 text-slate-600 dark:text-slate-400">Linking your app to hardware ID `{deviceId}`...</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">Make sure the ESP32 is using the same device ID in code.</p>
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
                {deviceName} has been linked to your account.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">Device ID: {deviceId}</p>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  )
}
