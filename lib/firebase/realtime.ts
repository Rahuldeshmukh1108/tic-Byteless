import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { onValue, ref } from 'firebase/database'
import { db, rtdb } from './config'
import {
  Alert,
  AutomationRule,
  Device,
  DeviceConfig,
  LiveData,
  SystemMetrics,
  UserSettings,
  getDeviceConfig,
  getUserDevices,
} from './firestore'

function normalizeDate(value: unknown): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string') return new Date(value)
  if (value && typeof value === 'object' && 'seconds' in value) {
    return new Date(Number((value as { seconds: number }).seconds) * 1000)
  }
  return new Date()
}

function buildLiveData(deviceId: string, raw: any): LiveData {
  const sensors = raw?.sensors ?? {}
  const status = raw?.status ?? {}

  return {
    deviceId,
    temperature: Number(sensors.temperature ?? 0),
    tds: Number(sensors.tds ?? 0),
    ldr: Number(sensors.light ?? sensors.ldr ?? 0),
    humidity: Number(sensors.humidity ?? 0),
    timestamp: normalizeDate(raw?.lastUpdated ?? Date.now()),
    pump1Status: Boolean(status.pump1),
    pump2Status: Boolean(status.pump2),
    pump3Status: Boolean(status.pump3),
    fanStatus: Boolean(status.fan),
    growLightStatus: Boolean(status.light),
  }
}

function toDevice(snapshot: any): Device {
  const data = snapshot.data() as Omit<Device, 'id'>
  return {
    id: snapshot.id,
    ...data,
    createdAt: normalizeDate(data.createdAt),
    updatedAt: normalizeDate(data.updatedAt),
  }
}

export function subscribeLiveData(
  deviceId: string,
  callback: (data: LiveData | null) => void
): () => void {
  const deviceRef = ref(rtdb, `devices/${deviceId}`)
  const unsubscribe = onValue(
    deviceRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      callback(buildLiveData(deviceId, snapshot.val()))
    },
    (error) => {
      console.error('[HydroSync] RTDB live data listener error:', error)
      callback(null)
    }
  )

  return unsubscribe
}

export function subscribeDeviceConfig(
  deviceId: string,
  callback: (config: DeviceConfig | null) => void
): () => void {
  const configRef = ref(rtdb, `devices/${deviceId}/config`)
  const unsubscribe = onValue(
    configRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        callback(await getDeviceConfig(deviceId))
        return
      }
      callback(await getDeviceConfig(deviceId))
    },
    (error) => {
      console.error('[HydroSync] RTDB config listener error:', error)
      callback(null)
    }
  )
  return unsubscribe
}

export function subscribeUserDevices(
  userId: string,
  callback: (devices: Device[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'devices')
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      callback(snapshot.docs.map(toDevice))
    },
    (error) => {
      console.error('[HydroSync] Firestore user devices listener error:', error)
      callback([])
    }
  )

  return unsubscribe
}

export function subscribeUserAlerts(
  userId: string,
  callback: (alerts: Alert[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'alerts')
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      callback(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...(data as Omit<Alert, 'id'>),
            timestamp: normalizeDate(data.timestamp),
          }
        })
      )
    },
    (error) => {
      console.error('[HydroSync] Firestore user alerts listener error:', error)
      callback([])
    }
  )

  return unsubscribe
}

export function subscribeUnreadAlerts(
  userId: string,
  callback: (alerts: Alert[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'alerts')
  const q = query(collectionRef, where('read', '==', false))
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...(data as Omit<Alert, 'id'>),
            timestamp: normalizeDate(data.timestamp),
          }
        })
      )
    },
    (error) => {
      console.error('[HydroSync] Firestore unread alerts listener error:', error)
      callback([])
    }
  )

  return unsubscribe
}

export function subscribeAutomationRules(
  userId: string,
  callback: (rules: AutomationRule[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'automation')
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      callback(
        snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()
          return {
            id: docSnapshot.id,
            ...(data as Omit<AutomationRule, 'id'>),
            createdAt: normalizeDate(data.createdAt),
            updatedAt: normalizeDate(data.updatedAt),
          }
        })
      )
    },
    (error) => {
      console.error('[HydroSync] Firestore automation rules listener error:', error)
      callback([])
    }
  )

  return unsubscribe
}

export function subscribeAutomationRule(
  userId: string,
  ruleId: string,
  callback: (rule: AutomationRule | null) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'automation', ruleId)
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      const data = snapshot.data()
      callback({
        id: snapshot.id,
        ...(data as Omit<AutomationRule, 'id'>),
        createdAt: normalizeDate(data.createdAt),
        updatedAt: normalizeDate(data.updatedAt),
      })
    },
    (error) => {
      console.error('[HydroSync] Firestore automation rule listener error:', error)
      callback(null)
    }
  )

  return unsubscribe
}

export function subscribeMultipleLiveData(
  deviceIds: string[],
  callback: (data: Record<string, LiveData>) => void
): (() => void)[] {
  const unsubscribers: (() => void)[] = []
  const data: Record<string, LiveData> = {}

  deviceIds.forEach((deviceId) => {
    const unsubscribe = subscribeLiveData(deviceId, (liveData) => {
      if (liveData) {
        data[deviceId] = liveData
      } else {
        delete data[deviceId]
      }
      callback({ ...data })
    })
    unsubscribers.push(unsubscribe)
  })

  return unsubscribers
}

export function subscribeUserSettings(
  userId: string,
  callback: (settings: UserSettings | null) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'settings', 'preferences')
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      const data = snapshot.data()
      callback({
        ...(data as UserSettings),
        createdAt: normalizeDate(data.createdAt),
        updatedAt: normalizeDate(data.updatedAt),
      })
    },
    (error) => {
      console.error('[HydroSync] Firestore user settings listener error:', error)
      callback(null)
    }
  )

  return unsubscribe
}

export function subscribeSystemMetrics(
  userId: string,
  callback: (metrics: SystemMetrics | null) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'metrics', 'system')
  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      const data = snapshot.data()
      callback({
        ...(data as SystemMetrics),
        lastUpdated: normalizeDate(data.lastUpdated),
      })
    },
    (error) => {
      console.error('[HydroSync] Firestore system metrics listener error:', error)
      callback(null)
    }
  )

  return unsubscribe
}

function severityForLiveData(liveData: LiveData, config: DeviceConfig): Alert[] {
  const now = liveData.timestamp
  const alerts: Alert[] = []

  if (liveData.temperature > config.tempMax) {
    alerts.push({
      id: `${liveData.deviceId}-temp-high`,
      userId: '',
      deviceId: liveData.deviceId,
      type: 'warning',
      message: `Temperature is high at ${liveData.temperature.toFixed(1)} C`,
      timestamp: now,
      read: false,
    })
  }

  if (liveData.temperature < config.tempMin) {
    alerts.push({
      id: `${liveData.deviceId}-temp-low`,
      userId: '',
      deviceId: liveData.deviceId,
      type: 'info',
      message: `Temperature is low at ${liveData.temperature.toFixed(1)} C`,
      timestamp: now,
      read: false,
    })
  }

  if (liveData.tds < config.tdsThreshold) {
    alerts.push({
      id: `${liveData.deviceId}-tds-low`,
      userId: '',
      deviceId: liveData.deviceId,
      type: 'warning',
      message: `TDS dropped below threshold at ${liveData.tds} ppm`,
      timestamp: now,
      read: false,
    })
  }

  if (liveData.ldr > config.ldrThreshold && liveData.growLightStatus) {
    alerts.push({
      id: `${liveData.deviceId}-light-active`,
      userId: '',
      deviceId: liveData.deviceId,
      type: 'info',
      message: 'Grow light is active because ambient light is above the set threshold',
      timestamp: now,
      read: false,
    })
  }

  return alerts
}

export function subscribeRecentAlerts(
  userId: string,
  limit: number = 10,
  callback: (alerts: Alert[]) => void
): () => void {
  let unsubscribers: (() => void)[] = []

  getUserDevices(userId)
    .then((devices) => {
      const derivedAlerts = new Map<string, Alert[]>()

      devices.forEach((device) => {
        const unsubscribe = subscribeLiveData(device.id, async (liveData) => {
          if (!liveData) {
            derivedAlerts.delete(device.id)
            callback(
              Array.from(derivedAlerts.values())
                .flat()
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, limit)
            )
            return
          }

          const config = await getDeviceConfig(device.id)
          const alerts = severityForLiveData(liveData, config).map((alert) => ({
            ...alert,
            userId,
          }))
          derivedAlerts.set(device.id, alerts)

          callback(
            Array.from(derivedAlerts.values())
              .flat()
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .slice(0, limit)
          )
        })
        unsubscribers.push(unsubscribe)
      })
    })
    .catch((error) => {
      if (error?.code !== 'permission-denied') {
        console.error('[HydroSync] Derived alerts listener setup error:', error)
      }
      callback([])
    })

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe())
    unsubscribers = []
  }
}
