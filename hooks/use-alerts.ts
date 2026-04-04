'use client'

import { useCallback, useEffect, useState } from 'react'
import { isConfigured } from '@/lib/firebase/config'
import { Alert } from '@/lib/firebase/firestore'
import { subscribeUserAlerts, subscribeUnreadAlerts } from '@/lib/firebase/realtime'
import { markAlertAsRead, deleteAlert } from '@/lib/firebase/firestore'

export function useAlerts(userId: string | null, authReady: boolean = true) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authReady) {
      setAlerts([])
      setIsLoading(true)
      return
    }

    if (!userId || !isConfigured) {
      setAlerts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeUserAlerts(userId, (alerts) => {
      setAlerts(alerts)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId, authReady])

  const readAlert = useCallback(
    async (alertId: string) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await markAlertAsRead(userId, alertId)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to mark alert as read'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const removeAlert = useCallback(
    async (alertId: string) => {
      if (!userId) throw new Error('User not authenticated')
      
      try {
        setError(null)
        await deleteAlert(userId, alertId)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete alert'
        setError(errorMessage)
        throw err
      }
    },
    [userId]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const unreadAlertCount = alerts.filter((a) => !a.read).length
  const recentAlerts = alerts.slice(-5).reverse()

  return {
    alerts,
    unreadCount: unreadAlertCount,
    recentAlerts,
    isLoading,
    error,
    readAlert,
    removeAlert,
    clearError,
  }
}

export function useUnreadAlerts(userId: string | null) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !isConfigured) {
      setAlerts([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const unsubscribe = subscribeUnreadAlerts(userId, (alerts) => {
      setAlerts(alerts)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    alerts,
    isLoading,
    error,
    clearError,
  }
}
