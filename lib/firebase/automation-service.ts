import { LiveData, AutomationRule, createAlert } from './firestore'

/**
 * Automation actions that can be triggered
 */
export interface AutomationAction {
  pump1: boolean
  pump2: boolean
  fan: boolean
  growLight: boolean
  alertMessage?: string
}

/**
 * Evaluates sensor data against automation rules and determines actions
 * This logic will be mirrored in Cloud Functions for server-side automation
 */
export function evaluateAutomationRules(
  liveData: LiveData,
  rules: AutomationRule[]
): AutomationAction {
  const actions: AutomationAction = {
    pump1: false,
    pump2: false,
    fan: false,
    growLight: false,
    alertMessage: undefined,
  }

  if (!rules || rules.length === 0) {
    return actions
  }

  // Get the first enabled rule (in production, you might have multiple rules)
  const activeRule = rules.find(r => r.enabled)
  if (!activeRule) {
    return actions
  }

  const alerts: string[] = []

  // Check TDS levels - control nutrient pump
  if (liveData.tds < activeRule.tdsMin) {
    actions.pump2 = true // Nutrient pump ON
    alerts.push(`TDS low: ${liveData.tds.toFixed(0)} ppm (min: ${activeRule.tdsMin})`)
  } else if (liveData.tds > activeRule.tdsMax) {
    actions.pump2 = false // Nutrient pump OFF
    alerts.push(`TDS high: ${liveData.tds.toFixed(0)} ppm (max: ${activeRule.tdsMax})`)
  }

  // Check temperature - control cooling fan
  if (liveData.temperature > activeRule.tempMax) {
    actions.fan = true // Fan ON for cooling
    alerts.push(`Temperature high: ${liveData.temperature.toFixed(1)}°C (max: ${activeRule.tempMax}°C)`)
  }

  // Check light levels - control grow light
  if (liveData.ldr < activeRule.ldrMin) {
    actions.growLight = true // Grow light ON
    alerts.push(`Light level low: ${liveData.ldr.toFixed(0)}% (min: ${activeRule.ldrMin}%)`)
  } else {
    actions.growLight = false // Grow light OFF
  }

  // Check humidity levels
  if (liveData.humidity > activeRule.humidityMax) {
    actions.fan = true // Fan ON for humidity control
    alerts.push(`Humidity high: ${liveData.humidity.toFixed(1)}% (max: ${activeRule.humidityMax}%)`)
  }

  if (liveData.humidity < activeRule.humidityMin) {
    alerts.push(`Humidity low: ${liveData.humidity.toFixed(1)}% (min: ${activeRule.humidityMin}%)`)
  }

  if (alerts.length > 0) {
    actions.alertMessage = alerts.join(' | ')
  }

  return actions
}

/**
 * Logs automation action for analytics
 * This would be called by Cloud Functions after updating device status
 */
export async function logAutomationAction(
  userId: string,
  deviceId: string,
  action: AutomationAction,
  triggerValues: {
    temperature: number
    tds: number
    ldr: number
    humidity: number
  }
) {
  // This would log to the analytics collection
  console.log('[HydroSync Automation] Action triggered:', {
    userId,
    deviceId,
    timestamp: new Date().toISOString(),
    action,
    triggerValues,
  })
}

/**
 * Creates alerts based on automation evaluation
 */
export async function createAutomationAlert(
  userId: string,
  deviceId: string,
  message: string,
  severity: 'warning' | 'error' | 'info' = 'warning'
) {
  try {
    await createAlert(userId, {
      userId,
      message,
      type: severity,
      deviceId,
      timestamp: new Date(),
      read: false,
    })
  } catch (error) {
    console.error('[HydroSync] Failed to create alert:', error)
  }
}

/**
 * Gets default automation rules for a device type
 */
export function getDefaultAutomationRules(deviceType: string) {
  const baseRules = {
    tempMax: 28,
    tempMin: 18,
    tdsMin: 1000,
    tdsMax: 1800,
    ldrMin: 30,
    humidityMax: 80,
    humidityMin: 40,
  }

  // Customize based on system type
  switch (deviceType) {
    case 'hydroponic':
      return {
        ...baseRules,
        tdsMin: 1200, // Higher nutrient concentration for hydroponics
        tdsMax: 1600,
      }
    case 'aquaponic':
      return {
        ...baseRules,
        tdsMin: 400, // Lower TDS for aquaponics (fish waste)
        tdsMax: 600,
        humidityMin: 50, // Higher humidity preference
      }
    case 'aeroponic':
      return {
        ...baseRules,
        tempMax: 25, // More sensitive to temperature
        tdsMin: 1100,
        tdsMax: 1500,
      }
    default:
      return baseRules
  }
}
