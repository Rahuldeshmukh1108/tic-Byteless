import { Timestamp, doc, setDoc } from 'firebase/firestore'
import { db } from './config'
import {
  Device,
  DeviceConfig,
  ensureDeviceRealtimeStructure,
  getDeviceConfig,
  getLiveData,
  getRealtimeDeviceIds,
  isDeviceClaimed,
  updateDeviceConfig,
  updateLiveData,
} from './firestore'

async function findAttachableDeviceId(): Promise<string> {
  const realtimeDeviceIds = await getRealtimeDeviceIds()

  for (const deviceId of realtimeDeviceIds) {
    if (!(await isDeviceClaimed(deviceId))) {
      return deviceId
    }
  }

  return `device${String(Date.now()).slice(-6)}`
}

function normalizeDeviceId(deviceId: string): string {
  return deviceId.trim().replace(/\s+/g, '-')
}

export async function connectDevice(
  userId: string,
  deviceData: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>,
  preferredDeviceId?: string
): Promise<string> {
  const requestedDeviceId = preferredDeviceId ? normalizeDeviceId(preferredDeviceId) : ''
  const deviceId = requestedDeviceId || await findAttachableDeviceId()

  if (requestedDeviceId && await isDeviceClaimed(requestedDeviceId)) {
    throw new Error(`Device ID "${requestedDeviceId}" is already linked to another account.`)
  }

  await ensureDeviceRealtimeStructure(deviceId)

  await setDoc(doc(db, 'users', userId, 'devices', deviceId), {
    ...deviceData,
    status: 'offline',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })

  return deviceId
}

export async function getDeviceConnectionStatus(deviceId: string): Promise<{
  existsInRealtimeDb: boolean
  isAlreadyLinked: boolean
}> {
  const normalizedDeviceId = normalizeDeviceId(deviceId)
  if (!normalizedDeviceId) {
    return {
      existsInRealtimeDb: false,
      isAlreadyLinked: false,
    }
  }

  const realtimeDeviceIds = await getRealtimeDeviceIds()

  return {
    existsInRealtimeDb: realtimeDeviceIds.includes(normalizedDeviceId),
    isAlreadyLinked: await isDeviceClaimed(normalizedDeviceId),
  }
}

export async function getDeviceAutomationConfig(deviceId: string): Promise<DeviceConfig> {
  return getDeviceConfig(deviceId)
}

export async function updateDeviceAutomationConfig(deviceId: string, config: Partial<DeviceConfig>): Promise<void> {
  await updateDeviceConfig(deviceId, config)
}

export async function getDeviceStatus(deviceId: string): Promise<'online' | 'offline' | 'error' | null> {
  const liveData = await getLiveData(deviceId)
  if (!liveData) return 'offline'

  const isOnline = Date.now() - liveData.timestamp.getTime() < 2 * 60 * 1000
  return isOnline ? 'online' : 'offline'
}

export async function updateDeviceControls(
  deviceId: string,
  controls: {
    pump1Status?: boolean
    pump2Status?: boolean
    pump3Status?: boolean
    fanStatus?: boolean
    growLightStatus?: boolean
  }
): Promise<void> {
  const currentData = await getLiveData(deviceId)
  if (!currentData) {
    throw new Error('Device not found')
  }

  await updateLiveData(deviceId, {
    ...currentData,
    ...controls,
    timestamp: new Date(),
  })
}

export async function simulateDeviceConnection(
  userId: string,
  deviceName: string,
  deviceType: Device['type']
): Promise<string> {
  return connectDevice(userId, {
    userId,
    name: deviceName,
    type: deviceType,
    status: 'offline',
  })
}
