'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Power, Settings, Trash2, Wifi, WifiOff, Thermometer, Droplets, Sun, Wind, Zap, Activity, AlertTriangle, Play, Square } from 'lucide-react'
import { useDeviceContext } from '@/contexts/device-context'
import { DeviceConnectModal } from '@/components/device-connect-modal'
import { DeviceSettingsModal } from '@/components/device-settings-modal'
import { startDataSimulation, stopDataSimulation } from '@/lib/esp32-simulator'
import { subscribeLiveData } from '@/lib/firebase/realtime'
import { LiveData, Device } from '@/lib/firebase/firestore'
import { useAuth } from '@/contexts/auth-context'

export const dynamic = 'force-dynamic'

interface DeviceWithLiveData {
  id: string
  name: string
  type: string
  status: 'online' | 'offline' | 'error'
  createdAt: Date
  updatedAt: Date
  liveData?: LiveData | null
}

export default function DevicesPage() {
  const { user } = useAuth()
  const { devices, isLoading, error, addDevice, removeDevice } = useDeviceContext()
  const [showModal, setShowModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [deviceLiveData, setDeviceLiveData] = useState<Record<string, LiveData | null>>({})
  const [simulatingDevices, setSimulatingDevices] = useState<Set<string>>(new Set())
  const [successMessage, setSuccessMessage] = useState('')

  // Subscribe to live data for all devices
  useEffect(() => {
    const unsubscribers: (() => void)[] = []

    devices.forEach(device => {
      const unsubscribe = subscribeLiveData(device.id, (data) => {
        setDeviceLiveData(prev => ({
          ...prev,
          [device.id]: data
        }))
      })
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [devices])

  const handleDeviceConnected = (deviceId: string, device: Device) => {
    setSuccessMessage(`${device.name} connected successfully!`)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleOpenSettings = (device: Device) => {
    setSelectedDevice(device)
    setShowSettingsModal(true)
  }

  const handleStartSimulation = (deviceId: string) => {
    startDataSimulation(deviceId, 5000, 30000)
    setSimulatingDevices(prev => new Set(prev).add(deviceId))
    setSuccessMessage('Data simulation started!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleStopSimulation = (deviceId: string) => {
    stopDataSimulation(deviceId)
    setSimulatingDevices(prev => {
      const newSet = new Set(prev)
      newSet.delete(deviceId)
      return newSet
    })
    setSuccessMessage('Data simulation stopped!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      await removeDevice(deviceId)
      setSuccessMessage('Device removed successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Failed to remove device:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 dark:text-green-400'
      case 'offline': return 'text-red-600 dark:text-red-400'
      case 'error': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/50'
      case 'offline': return 'bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-500/50'
      case 'error': return 'bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500/50'
      default: return 'bg-gray-100 dark:bg-gray-500/20 border-gray-300 dark:border-gray-500/50'
    }
  }

  const formatLastSync = (timestamp: Date | undefined) => {
    if (!timestamp) return 'Never'
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Devices</h1>
            <p className="text-foreground/60 dark:text-slate-400">Loading your devices...</p>
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Devices</h1>
          <p className="text-foreground/60 dark:text-slate-400">Manage and monitor your connected IoT devices</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-500/20 dark:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 dark:hover:bg-cyan-500/30 smooth-transition flex items-center gap-2"
        >
          <Plus size={18} />
          Connect Device
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 flex items-center gap-2"
        >
          <AlertTriangle size={20} />
          {error}
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="grid gap-6">
        {devices.map((device, index) => {
          const liveData = deviceLiveData[device.id]

          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition hover:border-slate-300 dark:hover:border-slate-600"
            >
              {/* Device Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center smooth-transition ${getStatusBg(device.status)}`}>
                    {device.status === 'online' ? (
                      <Wifi size={24} className={getStatusColor(device.status)} />
                    ) : (
                      <WifiOff size={24} className={getStatusColor(device.status)} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{device.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">ID: {device.id.slice(-8)}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Last active: {formatLastSync(liveData?.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                    device.status === 'online'
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                      : device.status === 'offline'
                      ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                      : 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {device.status === 'online' ? 'Online' : device.status === 'offline' ? 'Offline' : 'Error'}
                  </span>
                  {simulatingDevices.has(device.id) ? (
                    <button
                      onClick={() => handleStopSimulation(device.id)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 smooth-transition"
                      title="Stop simulation"
                    >
                      <Square size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartSimulation(device.id)}
                      className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/30 smooth-transition"
                      title="Start simulation"
                    >
                      <Play size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenSettings(device)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 smooth-transition"
                  >
                    <Settings size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveDevice(device.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-400 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 smooth-transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Sensor Data Grid */}
              {liveData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer size={16} className="text-red-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Temperature</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {liveData.temperature.toFixed(1)}°C
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets size={16} className="text-blue-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">TDS</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {liveData.tds} ppm
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sun size={16} className="text-yellow-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Light</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {liveData.ldr}%
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind size={16} className="text-green-500" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Humidity</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {liveData.humidity.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Device Controls */}
              {liveData && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Device Controls</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${liveData.pump1Status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Pump 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${liveData.pump2Status ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Pump 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${liveData.fanStatus ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Fan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${liveData.growLightStatus ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">Grow Light</span>
                    </div>
                  </div>
                </div>
              )}

              {!liveData && device.status === 'online' && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Activity size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Waiting for sensor data...</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {devices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No devices connected</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Connect your first ESP32 device to start monitoring your hydroponic system.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-cyan-500/20 dark:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 dark:hover:bg-cyan-500/30 smooth-transition"
          >
            Connect Device
          </button>
        </div>
      )}

      <DeviceConnectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userId={user?.uid || ''}
        onDeviceConnected={handleDeviceConnected}
      />

      {selectedDevice && (
        <DeviceSettingsModal
          isOpen={showSettingsModal}
          onClose={() => {
            setShowSettingsModal(false)
            setSelectedDevice(null)
          }}
          device={selectedDevice}
        />
      )}
    </div>
  )
}
