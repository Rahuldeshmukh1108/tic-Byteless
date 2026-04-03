'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Power, Settings, Trash2, Wifi, WifiOff } from 'lucide-react'
import { getMockDevices } from '@/lib/mock-data'

interface Device {
  id: string
  name: string
  status: 'connected' | 'offline'
  lastSynced: string
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(getMockDevices())
  const [showModal, setShowModal] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleAddDevice = () => {
    if (deviceId.trim()) {
      const newDevice: Device = {
        id: deviceId,
        name: `Device ${deviceId}`,
        status: 'connected',
        lastSynced: 'Just now',
      }
      setDevices([...devices, newDevice])
      setDeviceId('')
      setShowModal(false)
      setSuccessMessage(`Device ${deviceId} connected successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleRemoveDevice = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id))
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

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400"
        >
          {successMessage}
        </motion.div>
      )}

      <div className="grid gap-4">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition hover:border-slate-300 dark:hover:border-slate-600"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center smooth-transition ${
                  device.status === 'connected'
                    ? 'bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/50'
                    : 'bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50'
                }`}>
                  {device.status === 'connected' ? (
                    <Wifi size={24} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <WifiOff size={24} className="text-red-600 dark:text-red-400" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{device.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">ID: {device.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Last active: {device.lastSynced}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium smooth-transition ${
                  device.status === 'connected'
                    ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                }`}>
                  {device.status === 'connected' ? 'Online' : 'Offline'}
                </span>
                <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 smooth-transition">
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
          </motion.div>
        ))}
      </div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Connect Device</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Device ID</label>
                <input
                  type="text"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value)}
                  placeholder="e.g., DHT-001"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 smooth-transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDevice}
                  className="flex-1 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 smooth-transition font-medium"
                >
                  Connect
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
