import { Device, updateDevice as updateDeviceInFirestore, getLiveData, updateLiveData } from './firestore'
import { db } from './config'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

/**
 * Connect a device to a user account
 */
export async function connectDevice(userId: string, deviceData: Omit<Device, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Generate a device document in the user's devices collection
    // This simulates pairing a physical device with a user account
    const deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create initial device document
    const deviceRef = doc(db, 'users', userId, 'devices', deviceId)
    await setDoc(deviceRef, {
      ...deviceData,
      status: 'offline',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    // Initialize live data collection
    const liveRef = doc(db, 'devices', deviceId, 'live', 'current')
    await setDoc(liveRef, {
      deviceId,
      temperature: 0,
      tds: 0,
      ldr: 0,
      humidity: 0,
      timestamp: Timestamp.now(),
      pump1Status: false,
      pump2Status: false,
      fanStatus: false,
      growLightStatus: false,
    })

    return deviceId
  } catch (error) {
    throw error
  }
}

/**
 * Update device status (online/offline/error)
 */
export async function updateDeviceStatus(userId: string, deviceId: string, status: 'online' | 'offline' | 'error'): Promise<void> {
  try {
    await updateDeviceInFirestore(userId, deviceId, { status })
  } catch (error) {
    throw error
  }
}

/**
 * Get current device status
 */
export async function getDeviceStatus(deviceId: string): Promise<'online' | 'offline' | 'error' | null> {
  try {
    const liveData = await getLiveData(deviceId)
    return liveData ? 'online' : 'offline'
  } catch (error) {
    return null
  }
}

/**
 * Update device controls (pump, fan, grow light)
 */
export async function updateDeviceControls(
  deviceId: string,
  controls: {
    pump1Status?: boolean
    pump2Status?: boolean
    fanStatus?: boolean
    growLightStatus?: boolean
  }
): Promise<void> {
  try {
    const currentData = await getLiveData(deviceId)
    if (!currentData) {
      throw new Error('Device not found')
    }

    await updateLiveData(deviceId, {
      ...currentData,
      ...controls,
    })
  } catch (error) {
    throw error
  }
}

/**
 * Simulate device connection (for testing)
 */
export async function simulateDeviceConnection(userId: string, deviceName: string, deviceType: Device['type']): Promise<string> {
  return connectDevice(userId, {
    userId,
    name: deviceName,
    type: deviceType,
    status: 'online',
  })
}
