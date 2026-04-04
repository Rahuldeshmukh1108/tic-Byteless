import { useCallback, useState, useEffect } from 'react'
import { isConfigured } from '@/lib/firebase/config'
import { getUserDevices, createDevice, updateDevice, deleteDevice, Device } from '@/lib/firebase/firestore'
import { subscribeUserDevices } from '@/lib/firebase/realtime'

export function useDevices(userId: string | null, authReady: boolean = true) {
  const [devices, setDevices] = useState<Device[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Subscribe to real-time device updates
  useEffect(() => {
    if (!authReady) {
      setDevices([])
      setIsLoading(true)
      return
    }

    if (!userId || !isConfigured) {
      setDevices([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeUserDevices(userId, (devices) => {
      setDevices(devices)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId, authReady])

  const addDevice = useCallback(
    async (deviceData: Omit<Device, 'id'>) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        const deviceId = await createDevice(userId, deviceData)
        return deviceId
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add device'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const updateDeviceInfo = useCallback(
    async (deviceId: string, updates: Partial<Device>) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await updateDevice(userId, deviceId, updates)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update device'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const removeDevice = useCallback(
    async (deviceId: string) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await deleteDevice(userId, deviceId)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete device'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    devices,
    isLoading,
    error,
    addDevice,
    updateDeviceInfo,
    removeDevice,
    clearError,
  }
}
