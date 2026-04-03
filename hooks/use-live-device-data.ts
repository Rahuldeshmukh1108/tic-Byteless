import { useCallback, useEffect, useState } from 'react'
import { isConfigured } from '@/lib/firebase/config'
import { LiveData } from '@/lib/firebase/firestore'
import { subscribeLiveData, subscribeMultipleLiveData } from '@/lib/firebase/realtime'

export function useLiveDeviceData(deviceId: string | null) {
  const [data, setData] = useState<LiveData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId || !isConfigured) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeLiveData(deviceId, (liveData) => {
      setData(liveData)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [deviceId])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    isLoading,
    error,
    clearError,
  }
}

export function useMultipleLiveDeviceData(deviceIds: string[]) {
  const [dataMap, setDataMap] = useState<Record<string, LiveData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (deviceIds.length === 0 || !isConfigured) {
      setDataMap({})
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribers = subscribeMultipleLiveData(deviceIds, (data) => {
      setDataMap(data)
      setIsLoading(false)
    })

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [deviceIds.join(',')])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    dataMap,
    isLoading,
    error,
    clearError,
  }
}
