import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { db } from './config'

// Device Types
export interface Device {
  id: string
  userId: string
  name: string
  type: 'hydroponic' | 'aquaponic' | 'aeroponic'
  status: 'online' | 'offline' | 'error'
  wifiCredentials?: {
    ssid: string
    password: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface LiveData {
  deviceId: string
  temperature: number
  tds: number // Total Dissolved Solids
  ldr: number // Light Dependent Resistor
  humidity: number
  timestamp: Date
  pump1Status: boolean
  pump2Status: boolean
  fanStatus: boolean
  growLightStatus: boolean
}

export interface Reading {
  id: string
  deviceId: string
  temperature: number
  tds: number
  ldr: number
  humidity: number
  timestamp: Date
}

export interface Alert {
  id: string
  userId: string
  message: string
  type: 'warning' | 'error' | 'info'
  deviceId: string
  timestamp: Date
  read: boolean
}

export interface AutomationRule {
  id: string
  userId: string
  deviceId: string
  tempMax: number
  tempMin: number
  tdsMin: number
  tdsMax: number
  ldrMin: number
  humidityMax: number
  humidityMin: number
  enabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserSettings {
  userId: string
  notifications: {
    criticalAlerts: boolean
    warningAlerts: boolean
    dailySummary: boolean
    emailNotifications: boolean
  }
  preferences: {
    language: 'en' | 'hi'
    theme: 'light' | 'dark' | 'system'
    timezone: string
  }
  profile: {
    fullName: string
    phone?: string
    location?: string
    farmSize?: number
    cropTypes?: string[]
  }
  createdAt: Date
  updatedAt: Date
}

export interface SystemMetrics {
  userId: string
  uptime: number // in seconds
  totalDevices: number
  activeDevices: number
  totalReadings: number
  alertsToday: number
  automationRules: number
  lastUpdated: Date
}

// Device operations
export async function createDevice(userId: string, deviceData: Omit<Device, 'id'>): Promise<string> {
  try {
    const docRef = doc(collection(db, 'users', userId, 'devices'))
    await setDoc(docRef, {
      ...deviceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export async function getDevice(userId: string, deviceId: string): Promise<Device | null> {
  try {
    const docRef = doc(db, 'users', userId, 'devices', deviceId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Device
    }
    return null
  } catch (error) {
    throw error
  }
}

export async function getUserDevices(userId: string): Promise<Device[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'devices'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Device[]
  } catch (error) {
    throw error
  }
}

export async function updateDevice(userId: string, deviceId: string, updates: Partial<Device>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'devices', deviceId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

export async function deleteDevice(userId: string, deviceId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'devices', deviceId)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

// Live data operations
export async function updateLiveData(deviceId: string, liveData: Omit<LiveData, 'deviceId'>): Promise<void> {
  try {
    const docRef = doc(db, 'devices', deviceId, 'live', 'current')
    await setDoc(docRef, {
      deviceId,
      ...liveData,
      timestamp: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

export async function getLiveData(deviceId: string): Promise<LiveData | null> {
  try {
    const docRef = doc(db, 'devices', deviceId, 'live', 'current')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as LiveData
    }
    return null
  } catch (error) {
    throw error
  }
}

// Reading operations
export async function createReading(deviceId: string, readingData: Omit<Reading, 'id'>): Promise<string> {
  try {
    const docRef = doc(collection(db, 'devices', deviceId, 'readings'))
    await setDoc(docRef, {
      ...readingData,
      timestamp: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export async function getDeviceReadings(deviceId: string, limit: number = 100): Promise<Reading[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'devices', deviceId, 'readings'))
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .slice(-limit) as Reading[]
  } catch (error) {
    throw error
  }
}

// Alert operations
export async function createAlert(userId: string, alertData: Omit<Alert, 'id'>): Promise<string> {
  try {
    const docRef = doc(collection(db, 'users', userId, 'alerts'))
    await setDoc(docRef, {
      ...alertData,
      timestamp: Timestamp.now(),
      read: false,
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'alerts'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[]
  } catch (error) {
    throw error
  }
}

export async function markAlertAsRead(userId: string, alertId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'alerts', alertId)
    await updateDoc(docRef, { read: true })
  } catch (error) {
    throw error
  }
}

export async function deleteAlert(userId: string, alertId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'alerts', alertId)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

// Automation rule operations
export async function createAutomationRule(userId: string, ruleData: Omit<AutomationRule, 'id'>): Promise<string> {
  try {
    const docRef = doc(collection(db, 'users', userId, 'automation'))
    await setDoc(docRef, {
      ...ruleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    throw error
  }
}

export async function getUserAutomationRules(userId: string): Promise<AutomationRule[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'automation'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AutomationRule[]
  } catch (error) {
    throw error
  }
}

export async function updateAutomationRule(userId: string, ruleId: string, updates: Partial<AutomationRule>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'automation', ruleId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

export async function deleteAutomationRule(userId: string, ruleId: string): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'automation', ruleId)
    await deleteDoc(docRef)
  } catch (error) {
    throw error
  }
}

// User settings operations
export async function createUserSettings(userId: string, settingsData: Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'preferences')
    await setDoc(docRef, {
      userId,
      ...settingsData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'preferences')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as UserSettings
    }
    return null
  } catch (error) {
    throw error
  }
}

export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'settings', 'preferences')
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

// System metrics operations
export async function updateSystemMetrics(userId: string, metrics: Omit<SystemMetrics, 'userId' | 'lastUpdated'>): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId, 'metrics', 'system')
    await setDoc(docRef, {
      userId,
      ...metrics,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    throw error
  }
}

export async function getSystemMetrics(userId: string): Promise<SystemMetrics | null> {
  try {
    const docRef = doc(db, 'users', userId, 'metrics', 'system')
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as SystemMetrics
    }
    return null
  } catch (error) {
    throw error
  }
}

// Enhanced alert operations with filtering
export async function getUnreadAlerts(userId: string): Promise<Alert[]> {
  try {
    const q = query(
      collection(db, 'users', userId, 'alerts'),
      where('read', '==', false)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[]
  } catch (error) {
    throw error
  }
}

export async function getAlertsByType(userId: string, type: Alert['type']): Promise<Alert[]> {
  try {
    const q = query(
      collection(db, 'users', userId, 'alerts'),
      where('type', '==', type)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[]
  } catch (error) {
    throw error
  }
}

export async function getRecentAlerts(userId: string, limit: number = 10): Promise<Alert[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'users', userId, 'alerts'))
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => (b as Alert).timestamp.getTime() - (a as Alert).timestamp.getTime())
      .slice(0, limit) as Alert[]
  } catch (error) {
    throw error
  }
}

// Device statistics
export async function getDeviceStats(userId: string): Promise<{
  total: number
  online: number
  offline: number
  error: number
}> {
  try {
    const devices = await getUserDevices(userId)
    return {
      total: devices.length,
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      error: devices.filter(d => d.status === 'error').length,
    }
  } catch (error) {
    throw error
  }
}

// Reading analytics
export async function getReadingAnalytics(userId: string, days: number = 7): Promise<{
  totalReadings: number
  avgTemperature: number
  avgTds: number
  avgHumidity: number
  dateRange: { start: Date; end: Date }
}> {
  try {
    const devices = await getUserDevices(userId)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    let totalReadings = 0
    let totalTemp = 0
    let totalTds = 0
    let totalHumidity = 0

    for (const device of devices) {
      const readings = await getDeviceReadings(device.id)
      const recentReadings = readings.filter(r => r.timestamp >= startDate)

      totalReadings += recentReadings.length
      totalTemp += recentReadings.reduce((sum, r) => sum + r.temperature, 0)
      totalTds += recentReadings.reduce((sum, r) => sum + r.tds, 0)
      totalHumidity += recentReadings.reduce((sum, r) => sum + r.humidity, 0)
    }

    return {
      totalReadings,
      avgTemperature: totalReadings > 0 ? totalTemp / totalReadings : 0,
      avgTds: totalReadings > 0 ? totalTds / totalReadings : 0,
      avgHumidity: totalReadings > 0 ? totalHumidity / totalReadings : 0,
      dateRange: { start: startDate, end: new Date() }
    }
  } catch (error) {
    throw error
  }
}
