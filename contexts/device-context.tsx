'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { Device } from '@/lib/firebase/firestore'
import { useDevices } from '@/hooks/use-devices'
import { useAuth } from '@/contexts/auth-context'

interface DeviceContextType {
  devices: Device[]
  isLoading: boolean
  error: string | null
  addDevice: (deviceData: Omit<Device, 'id'>) => Promise<string>
  updateDevice: (deviceId: string, updates: Partial<Device>) => Promise<void>
  removeDevice: (deviceId: string) => Promise<void>
  clearError: () => void
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined)

export function DeviceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { devices, isLoading, error, addDevice, updateDeviceInfo, removeDevice, clearError } = useDevices(user?.uid || null)

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isLoading,
        error,
        addDevice,
        updateDevice: updateDeviceInfo,
        removeDevice,
        clearError,
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}

export function useDeviceContext() {
  const context = useContext(DeviceContext)
  if (context === undefined) {
    throw new Error('useDeviceContext must be used within a DeviceProvider')
  }
  return context
}
