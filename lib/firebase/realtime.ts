import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from './config'
import { LiveData, Alert, Device, AutomationRule } from './firestore'

/**
 * Subscribe to live device data in real-time
 */
export function subscribeLiveData(
  deviceId: string,
  callback: (data: LiveData | null) => void
): () => void {
  const docRef = doc(db, 'devices', deviceId, 'live', 'current')
  const unsubscribe = onSnapshot(docRef, snapshot => {
    if (snapshot.exists()) {
      callback(snapshot.data() as LiveData)
    } else {
      callback(null)
    }
  })

  return unsubscribe
}

/**
 * Subscribe to user's devices in real-time
 */
export function subscribeUserDevices(
  userId: string,
  callback: (devices: Device[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'devices')
  const unsubscribe = onSnapshot(collectionRef, snapshot => {
    const devices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Device[]
    callback(devices)
  })

  return unsubscribe
}

/**
 * Subscribe to user's alerts in real-time
 */
export function subscribeUserAlerts(
  userId: string,
  callback: (alerts: Alert[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'alerts')
  const unsubscribe = onSnapshot(collectionRef, snapshot => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[]
    callback(alerts)
  })

  return unsubscribe
}

/**
 * Subscribe to unread alerts only
 */
export function subscribeUnreadAlerts(
  userId: string,
  callback: (alerts: Alert[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'alerts')
  const q = query(collectionRef, where('read', '==', false))
  const unsubscribe = onSnapshot(q, snapshot => {
    const alerts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Alert[]
    callback(alerts)
  })

  return unsubscribe
}

/**
 * Subscribe to user's automation rules in real-time
 */
export function subscribeAutomationRules(
  userId: string,
  callback: (rules: AutomationRule[]) => void
): () => void {
  const collectionRef = collection(db, 'users', userId, 'automation')
  const unsubscribe = onSnapshot(collectionRef, snapshot => {
    const rules = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AutomationRule[]
    callback(rules)
  })

  return unsubscribe
}

/**
 * Subscribe to specific automation rule
 */
export function subscribeAutomationRule(
  userId: string,
  ruleId: string,
  callback: (rule: AutomationRule | null) => void
): () => void {
  const docRef = doc(db, 'users', userId, 'automation', ruleId)
  const unsubscribe = onSnapshot(docRef, snapshot => {
    if (snapshot.exists()) {
      callback({
        id: snapshot.id,
        ...snapshot.data(),
      } as AutomationRule)
    } else {
      callback(null)
    }
  })

  return unsubscribe
}

/**
 * Subscribe to multiple devices' live data
 */
export function subscribeMultipleLiveData(
  deviceIds: string[],
  callback: (data: Record<string, LiveData>) => void
): (() => void)[] {
  const unsubscribers: (() => void)[] = []
  const data: Record<string, LiveData> = {}

  deviceIds.forEach(deviceId => {
    const unsubscribe = subscribeLiveData(deviceId, liveData => {
      if (liveData) {
        data[deviceId] = liveData
      }
      callback(data)
    })
    unsubscribers.push(unsubscribe)
  })

  return unsubscribers
}
