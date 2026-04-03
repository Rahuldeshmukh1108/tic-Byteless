import { DeviceDataPayload } from '@/app/api/devices/data/route'

/**
 * Simulates ESP32 sensor data with realistic variations
 */
export function generateSimulatedSensorData(): Omit<DeviceDataPayload, 'deviceId' | 'apiKey'> {
  // Base values with realistic oscillations
  const baseTemp = 22 + Math.sin(Date.now() / 10000) * 2 + (Math.random() - 0.5) * 0.5
  const baseTds = 1200 + Math.cos(Date.now() / 15000) * 100 + (Math.random() - 0.5) * 50
  const baseLdr = 60 + Math.sin(Date.now() / 8000) * 20 + (Math.random() - 0.5) * 10
  const baseHumidity = 65 + Math.sin(Date.now() / 12000) * 10 + (Math.random() - 0.5) * 5

  return {
    temperature: Math.max(10, Math.min(35, Math.round(baseTemp * 10) / 10)),
    tds: Math.max(0, Math.min(2000, Math.round(baseTds))),
    ldr: Math.max(0, Math.min(100, Math.round(baseLdr))),
    humidity: Math.max(0, Math.min(100, Math.round(baseHumidity * 10) / 10)),
  }
}

/**
 * Simulates critical sensor data for testing alerts
 */
export function generateCriticalSensorData(type: 'temperature' | 'tds' | 'humidity'): Omit<DeviceDataPayload, 'deviceId' | 'apiKey'> {
  const baseData = generateSimulatedSensorData()

  switch (type) {
    case 'temperature':
      return {
        ...baseData,
        temperature: 35, // High temperature
      }
    case 'tds':
      return {
        ...baseData,
        tds: 1900, // High TDS
      }
    case 'humidity':
      return {
        ...baseData,
        humidity: 95, // High humidity
      }
  }
}

/**
 * Uploads simulated data to the API
 */
export async function uploadSimulatedData(deviceId: string, isCritical: boolean = false): Promise<boolean> {
  try {
    let data = generateSimulatedSensorData()
    
    if (isCritical) {
      const criticalTypes: ('temperature' | 'tds' | 'humidity')[] = ['temperature', 'tds', 'humidity']
      const randomType = criticalTypes[Math.floor(Math.random() * criticalTypes.length)]
      data = generateCriticalSensorData(randomType)
    }

    const payload: DeviceDataPayload = {
      deviceId,
      ...data,
    }

    const response = await fetch('/api/devices/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return response.ok
  } catch (error) {
    console.error('[HydroSync] Failed to upload simulated data:', error)
    return false
  }
}

/**
 * Global registry of active simulations
 */
const activeSimulations = new Map<string, () => void>()

/**
 * Starts a continuous simulation of ESP32 data
 * Returns a function to stop the simulation
 */
export function startDataSimulation(
  deviceId: string,
  interval: number = 5000,
  criticalDataInterval: number = 30000
): () => void {
  // Stop existing simulation if running
  if (activeSimulations.has(deviceId)) {
    activeSimulations.get(deviceId)!()
  }

  let dataInterval: NodeJS.Timeout | null = null
  let criticalInterval: NodeJS.Timeout | null = null

  // Regular data upload
  dataInterval = setInterval(() => {
    uploadSimulatedData(deviceId, false)
  }, interval)

  // Occasional critical data (every 30 seconds)
  if (criticalDataInterval > 0) {
    criticalInterval = setInterval(() => {
      const shouldBeCritical = Math.random() < 0.3 // 30% chance
      if (shouldBeCritical) {
        uploadSimulatedData(deviceId, true)
      }
    }, criticalDataInterval)
  }

  const cleanup = () => {
    if (dataInterval) clearInterval(dataInterval)
    if (criticalInterval) clearInterval(criticalInterval)
    activeSimulations.delete(deviceId)
  }

  activeSimulations.set(deviceId, cleanup)
  return cleanup
}

/**
 * Stops data simulation for a specific device
 */
export function stopDataSimulation(deviceId: string): void {
  const cleanup = activeSimulations.get(deviceId)
  if (cleanup) {
    cleanup()
  }
}

/**
 * Stops all active simulations
 */
export function stopAllSimulations(): void {
  activeSimulations.forEach(cleanup => cleanup())
  activeSimulations.clear()
}

/**
 * Sends a single batch of simulated data
 */
export async function sendSingleDataBatch(deviceId: string): Promise<boolean> {
  return uploadSimulatedData(deviceId, false)
}

/**
 * Simulates multiple devices
 */
export function startMultiDeviceSimulation(
  deviceIds: string[],
  interval: number = 5000
): () => void {
  const cleanupFunctions = deviceIds.map(id => startDataSimulation(id, interval, 0))

  return () => {
    cleanupFunctions.forEach(cleanup => cleanup())
  }
}
