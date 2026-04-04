import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  Timestamp,
} from 'firebase/firestore'
import { child, get, push, ref, remove, set, update } from 'firebase/database'
import { db, rtdb } from './config'

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
  tds: number
  ldr: number
  humidity: number
  timestamp: Date
  pump1Status: boolean
  pump2Status: boolean
  pump3Status: boolean
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

export interface DeviceConfig {
  deviceId: string
  tdsThreshold: number
  tempMax: number
  tempMin: number
  ldrThreshold: number
  pump1Duration: number
  pump2Duration: number
  pump3Duration: number
  dryDuration: number
  absorbDuration: number
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
  uptime: number
  totalDevices: number
  activeDevices: number
  totalReadings: number
  alertsToday: number
  automationRules: number
  lastUpdated: Date
}

const DEFAULT_DEVICE_CONFIG: Omit<DeviceConfig, 'deviceId' | 'updatedAt'> = {
  tdsThreshold: 500,
  tempMax: 30,
  tempMin: 25,
  ldrThreshold: 2500,
  pump1Duration: 30000,
  pump2Duration: 5000,
  pump3Duration: 15000,
  dryDuration: 10000,
  absorbDuration: 10000,
}

const DEFAULT_USER_SETTINGS: Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'> = {
  notifications: {
    criticalAlerts: true,
    warningAlerts: true,
    dailySummary: false,
    emailNotifications: true,
  },
  preferences: {
    language: 'en',
    theme: 'system',
    timezone: 'UTC',
  },
  profile: {
    fullName: '',
    phone: '',
    location: '',
    cropTypes: [],
  },
}

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as T
  }

  if (value && typeof value === 'object' && !(value instanceof Date) && !(value instanceof Timestamp)) {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, stripUndefinedDeep(entryValue)])

    return Object.fromEntries(entries) as T
  }

  return value
}

function normalizeDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string') return new Date(value)
  if (value && typeof value === 'object' && 'seconds' in value) {
    const seconds = Number((value as { seconds: number }).seconds)
    return new Date(seconds * 1000)
  }
  return new Date()
}

function createLiveData(deviceId: string, raw: any): LiveData {
  const sensors = raw?.sensors ?? {}
  const status = raw?.status ?? {}

  return {
    deviceId,
    temperature: Number(sensors.temperature ?? 0),
    tds: Number(sensors.tds ?? 0),
    ldr: Number(sensors.light ?? sensors.ldr ?? 0),
    humidity: Number(sensors.humidity ?? 0),
    timestamp: normalizeDate(raw?.lastUpdated ?? raw?.timestamp ?? Date.now()),
    pump1Status: Boolean(status.pump1),
    pump2Status: Boolean(status.pump2),
    pump3Status: Boolean(status.pump3),
    fanStatus: Boolean(status.fan),
    growLightStatus: Boolean(status.light),
  }
}

function createDeviceConfig(deviceId: string, raw: any): DeviceConfig {
  return {
    deviceId,
    tdsThreshold: Number(raw?.tdsThreshold ?? DEFAULT_DEVICE_CONFIG.tdsThreshold),
    tempMax: Number(raw?.tempMax ?? DEFAULT_DEVICE_CONFIG.tempMax),
    tempMin: Number(raw?.tempMin ?? DEFAULT_DEVICE_CONFIG.tempMin),
    ldrThreshold: Number(raw?.ldrThreshold ?? DEFAULT_DEVICE_CONFIG.ldrThreshold),
    pump1Duration: Number(raw?.pump1Duration ?? DEFAULT_DEVICE_CONFIG.pump1Duration),
    pump2Duration: Number(raw?.pump2Duration ?? DEFAULT_DEVICE_CONFIG.pump2Duration),
    pump3Duration: Number(raw?.pump3Duration ?? DEFAULT_DEVICE_CONFIG.pump3Duration),
    dryDuration: Number(raw?.dryDuration ?? DEFAULT_DEVICE_CONFIG.dryDuration),
    absorbDuration: Number(raw?.absorbDuration ?? DEFAULT_DEVICE_CONFIG.absorbDuration),
    updatedAt: normalizeDate(raw?.updatedAt ?? Date.now()),
  }
}

function normalizeUserSettings(userId: string, raw: any): UserSettings {
  return {
    userId,
    notifications: {
      ...DEFAULT_USER_SETTINGS.notifications,
      ...(raw?.notifications ?? {}),
    },
    preferences: {
      ...DEFAULT_USER_SETTINGS.preferences,
      ...(raw?.preferences ?? {}),
    },
    profile: {
      ...DEFAULT_USER_SETTINGS.profile,
      ...(raw?.profile ?? {}),
    },
    createdAt: normalizeDate(raw?.createdAt),
    updatedAt: normalizeDate(raw?.updatedAt),
  }
}

function createReadingFromLive(deviceId: string, liveData: LiveData, id: string): Reading {
  return {
    id,
    deviceId,
    temperature: liveData.temperature,
    tds: liveData.tds,
    ldr: liveData.ldr,
    humidity: liveData.humidity,
    timestamp: liveData.timestamp,
  }
}

function isDeviceOnline(timestamp?: Date): boolean {
  if (!timestamp) return false
  return Date.now() - timestamp.getTime() < 2 * 60 * 1000
}

export async function createDevice(userId: string, deviceData: Omit<Device, 'id'>): Promise<string> {
  const docRef = doc(collection(db, 'users', userId, 'devices'))
  await setDoc(docRef, {
    ...deviceData,
    status: deviceData.status ?? 'offline',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  await ensureDeviceRealtimeStructure(docRef.id)
  return docRef.id
}

export async function getDevice(userId: string, deviceId: string): Promise<Device | null> {
  const docRef = doc(db, 'users', userId, 'devices', deviceId)
  const docSnap = await getDoc(docRef)
  if (!docSnap.exists()) return null

  return {
    id: docSnap.id,
    ...(docSnap.data() as Omit<Device, 'id'>),
    createdAt: normalizeDate(docSnap.data().createdAt),
    updatedAt: normalizeDate(docSnap.data().updatedAt),
  }
}

export async function getUserDevices(userId: string): Promise<Device[]> {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'devices'))
  const liveDataEntries = await Promise.all(
    querySnapshot.docs.map(async (snapshot) => {
      const live = await getLiveData(snapshot.id)
      return [snapshot.id, live] as const
    })
  )
  const liveDataMap = Object.fromEntries(liveDataEntries)

  return querySnapshot.docs.map((snapshot) => {
    const data = snapshot.data() as Omit<Device, 'id'>
    const live = liveDataMap[snapshot.id]
    return {
      id: snapshot.id,
      ...data,
      status: live ? (isDeviceOnline(live.timestamp) ? 'online' : 'offline') : data.status ?? 'offline',
      createdAt: normalizeDate(data.createdAt),
      updatedAt: normalizeDate(data.updatedAt),
    }
  })
}

export async function updateDevice(userId: string, deviceId: string, updates: Partial<Device>): Promise<void> {
  const docRef = doc(db, 'users', userId, 'devices', deviceId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteDevice(userId: string, deviceId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'devices', deviceId))
}

export async function ensureDeviceRealtimeStructure(deviceId: string): Promise<void> {
  const deviceRef = ref(rtdb, `devices/${deviceId}`)
  const snapshot = await get(deviceRef)

  if (!snapshot.exists()) {
    await set(deviceRef, {
      sensors: {
        temperature: 0,
        light: 0,
        tds: 0,
        humidity: 0,
      },
      status: {
        pump1: false,
        pump2: false,
        pump3: false,
        fan: false,
        light: false,
      },
      config: DEFAULT_DEVICE_CONFIG,
      lastUpdated: Date.now(),
    })
    return
  }

  const current = snapshot.val()
  await update(deviceRef, {
    sensors: {
      temperature: Number(current?.sensors?.temperature ?? 0),
      light: Number(current?.sensors?.light ?? current?.sensors?.ldr ?? 0),
      tds: Number(current?.sensors?.tds ?? 0),
      humidity: Number(current?.sensors?.humidity ?? 0),
    },
    status: {
      pump1: Boolean(current?.status?.pump1),
      pump2: Boolean(current?.status?.pump2),
      pump3: Boolean(current?.status?.pump3),
      fan: Boolean(current?.status?.fan),
      light: Boolean(current?.status?.light),
    },
    config: {
      ...DEFAULT_DEVICE_CONFIG,
      ...(current?.config ?? {}),
    },
  })
}

export async function updateLiveData(deviceId: string, liveData: Omit<LiveData, 'deviceId'>): Promise<void> {
  const deviceRef = ref(rtdb, `devices/${deviceId}`)
  const timestamp = liveData.timestamp instanceof Date ? liveData.timestamp.getTime() : Date.now()

  await update(deviceRef, {
    sensors: {
      temperature: liveData.temperature,
      light: liveData.ldr,
      tds: liveData.tds,
      humidity: liveData.humidity,
    },
    status: {
      pump1: liveData.pump1Status,
      pump2: liveData.pump2Status,
      pump3: liveData.pump3Status,
      fan: liveData.fanStatus,
      light: liveData.growLightStatus,
    },
    lastUpdated: timestamp,
  })
}

export async function getLiveData(deviceId: string): Promise<LiveData | null> {
  const snapshot = await get(ref(rtdb, `devices/${deviceId}`))
  if (!snapshot.exists()) return null
  return createLiveData(deviceId, snapshot.val())
}

export async function createReading(deviceId: string, readingData: Omit<Reading, 'id'>): Promise<string> {
  const readingsRef = ref(rtdb, `devices/${deviceId}/history`)
  const newRef = push(readingsRef)
  const timestamp = readingData.timestamp instanceof Date ? readingData.timestamp.getTime() : Date.now()

  await set(newRef, {
    deviceId,
    temperature: readingData.temperature,
    tds: readingData.tds,
    ldr: readingData.ldr,
    humidity: readingData.humidity,
    timestamp,
  })

  return newRef.key || `${Date.now()}`
}

export async function getDeviceReadings(deviceId: string, limit: number = 100): Promise<Reading[]> {
  const snapshot = await get(ref(rtdb, `devices/${deviceId}/history`))
  if (!snapshot.exists()) {
    const live = await getLiveData(deviceId)
    return live ? [createReadingFromLive(deviceId, live, 'current')] : []
  }

  const entries = Object.entries(snapshot.val() as Record<string, any>)
    .map(([id, value]) => ({
      id,
      deviceId,
      temperature: Number(value.temperature ?? 0),
      tds: Number(value.tds ?? 0),
      ldr: Number(value.ldr ?? value.light ?? 0),
      humidity: Number(value.humidity ?? 0),
      timestamp: normalizeDate(value.timestamp),
    }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  return entries.slice(-limit)
}

export async function getDeviceConfig(deviceId: string): Promise<DeviceConfig> {
  const snapshot = await get(ref(rtdb, `devices/${deviceId}/config`))
  return createDeviceConfig(deviceId, snapshot.exists() ? snapshot.val() : undefined)
}

export async function updateDeviceConfig(deviceId: string, updates: Partial<DeviceConfig>): Promise<void> {
  await update(ref(rtdb, `devices/${deviceId}/config`), {
    ...updates,
    updatedAt: Date.now(),
  })
}

export async function createAlert(userId: string, alertData: Omit<Alert, 'id'>): Promise<string> {
  const docRef = doc(collection(db, 'users', userId, 'alerts'))
  await setDoc(docRef, {
    ...alertData,
    timestamp: Timestamp.now(),
    read: alertData.read ?? false,
  })
  return docRef.id
}

export async function getUserAlerts(userId: string): Promise<Alert[]> {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'alerts'))
  return querySnapshot.docs.map((snapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...(data as Omit<Alert, 'id'>),
      timestamp: normalizeDate(data.timestamp),
    }
  })
}

export async function markAlertAsRead(userId: string, alertId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'alerts', alertId), { read: true })
}

export async function deleteAlert(userId: string, alertId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'alerts', alertId))
}

export async function createAutomationRule(userId: string, ruleData: Omit<AutomationRule, 'id'>): Promise<string> {
  const docRef = doc(collection(db, 'users', userId, 'automation'))
  await setDoc(docRef, {
    ...ruleData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return docRef.id
}

export async function getUserAutomationRules(userId: string): Promise<AutomationRule[]> {
  const querySnapshot = await getDocs(collection(db, 'users', userId, 'automation'))
  return querySnapshot.docs.map((snapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...(data as Omit<AutomationRule, 'id'>),
      createdAt: normalizeDate(data.createdAt),
      updatedAt: normalizeDate(data.updatedAt),
    }
  })
}

export async function updateAutomationRule(userId: string, ruleId: string, updates: Partial<AutomationRule>): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'automation', ruleId), {
    ...updates,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteAutomationRule(userId: string, ruleId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'automation', ruleId))
}

export async function createUserSettings(
  userId: string,
  settingsData: Omit<UserSettings, 'userId' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'settings', 'preferences'), {
    userId,
    ...stripUndefinedDeep(settingsData),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
}

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const docSnap = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'))
  if (!docSnap.exists()) return null
  const data = docSnap.data()
  return normalizeUserSettings(userId, data)
}

export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<void> {
  await updateDoc(doc(db, 'users', userId, 'settings', 'preferences'), {
    ...stripUndefinedDeep(updates),
    updatedAt: Timestamp.now(),
  })
}

export async function updateSystemMetrics(userId: string, metrics: Omit<SystemMetrics, 'userId' | 'lastUpdated'>): Promise<void> {
  await setDoc(doc(db, 'users', userId, 'metrics', 'system'), {
    userId,
    ...metrics,
    lastUpdated: Timestamp.now(),
  })
}

export async function getSystemMetrics(userId: string): Promise<SystemMetrics | null> {
  const docSnap = await getDoc(doc(db, 'users', userId, 'metrics', 'system'))
  if (!docSnap.exists()) return null
  const data = docSnap.data()
  return {
    ...(data as SystemMetrics),
    lastUpdated: normalizeDate(data.lastUpdated),
  }
}

export async function getUnreadAlerts(userId: string): Promise<Alert[]> {
  const q = query(collection(db, 'users', userId, 'alerts'), where('read', '==', false))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((snapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...(data as Omit<Alert, 'id'>),
      timestamp: normalizeDate(data.timestamp),
    }
  })
}

export async function getAlertsByType(userId: string, type: Alert['type']): Promise<Alert[]> {
  const q = query(collection(db, 'users', userId, 'alerts'), where('type', '==', type))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((snapshot) => {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      ...(data as Omit<Alert, 'id'>),
      timestamp: normalizeDate(data.timestamp),
    }
  })
}

export async function getRecentAlerts(userId: string, limit: number = 10): Promise<Alert[]> {
  const alerts = await getUserAlerts(userId)
  return alerts
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit)
}

export async function getDeviceStats(userId: string): Promise<{
  total: number
  online: number
  offline: number
  error: number
}> {
  const devices = await getUserDevices(userId)
  return {
    total: devices.length,
    online: devices.filter((device) => device.status === 'online').length,
    offline: devices.filter((device) => device.status === 'offline').length,
    error: devices.filter((device) => device.status === 'error').length,
  }
}

export async function getReadingAnalytics(userId: string, days: number = 7): Promise<{
  totalReadings: number
  avgTemperature: number
  avgTds: number
  avgHumidity: number
  dateRange: { start: Date; end: Date }
}> {
  const devices = await getUserDevices(userId)
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  let totalReadings = 0
  let totalTemp = 0
  let totalTds = 0
  let totalHumidity = 0

  for (const device of devices) {
    const readings = await getDeviceReadings(device.id, 500)
    const recentReadings = readings.filter((reading) => reading.timestamp >= startDate)

    totalReadings += recentReadings.length
    totalTemp += recentReadings.reduce((sum, reading) => sum + reading.temperature, 0)
    totalTds += recentReadings.reduce((sum, reading) => sum + reading.tds, 0)
    totalHumidity += recentReadings.reduce((sum, reading) => sum + reading.humidity, 0)
  }

  return {
    totalReadings,
    avgTemperature: totalReadings > 0 ? totalTemp / totalReadings : 0,
    avgTds: totalReadings > 0 ? totalTds / totalReadings : 0,
    avgHumidity: totalReadings > 0 ? totalHumidity / totalReadings : 0,
    dateRange: { start: startDate, end: new Date() },
  }
}

export async function removeDeviceHistory(deviceId: string): Promise<void> {
  await remove(ref(rtdb, `devices/${deviceId}/history`))
}

export async function getRealtimeDeviceIds(): Promise<string[]> {
  const snapshot = await get(ref(rtdb, 'devices'))
  if (!snapshot.exists()) return []
  return Object.keys(snapshot.val() as Record<string, unknown>)
}

export async function isDeviceClaimed(deviceId: string): Promise<boolean> {
  const deviceSnapshots = await collectionGroupDevices()
  return deviceSnapshots.some((snapshot) => snapshot.id === deviceId)
}

async function collectionGroupDevices() {
  const usersSnapshot = await getDocs(collection(db, 'users'))
  const deviceSnapshots = await Promise.all(
    usersSnapshot.docs.map((userSnapshot) => getDocs(collection(db, 'users', userSnapshot.id, 'devices')))
  )
  return deviceSnapshots.flatMap((snapshot) => snapshot.docs)
}
