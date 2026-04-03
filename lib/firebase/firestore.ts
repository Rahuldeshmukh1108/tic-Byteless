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
