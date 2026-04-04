'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { Alert } from '@/lib/firebase/firestore'
import { useAlerts } from '@/hooks/use-alerts'
import { useAuth } from '@/contexts/auth-context'

interface AlertContextType {
  alerts: Alert[]
  unreadCount: number
  recentAlerts: Alert[]
  isLoading: boolean
  error: string | null
  readAlert: (alertId: string) => Promise<void>
  removeAlert: (alertId: string) => Promise<void>
  clearError: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const authReady = !loading
  const { alerts, unreadCount, recentAlerts, isLoading, error, readAlert, removeAlert, clearError } = useAlerts(user?.uid || null, authReady)

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        recentAlerts,
        isLoading,
        error,
        readAlert,
        removeAlert,
        clearError,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export function useAlertContext() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider')
  }
  return context
}
