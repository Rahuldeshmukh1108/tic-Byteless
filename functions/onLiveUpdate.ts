/**
 * Firebase Cloud Function: onLiveUpdate
 * 
 * Triggers when device live data is updated in Firestore
 * Evaluates automation rules and updates device controls
 * 
 * Deploy with: firebase deploy --only functions:onLiveUpdate
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

interface LiveData {
  deviceId: string
  temperature: number
  tds: number
  ldr: number
  humidity: number
  timestamp: any
  pump1Status: boolean
  pump2Status: boolean
  fanStatus: boolean
  growLightStatus: boolean
}

interface AutomationRule {
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
}

/**
 * Triggered when a device's live data is written
 * Evaluates automation rules and creates alerts
 */
export const onLiveDataUpdate = functions.firestore
  .document('devices/{deviceId}/live/current')
  .onWrite(async (change, context) => {
    try {
      const deviceId = context.params.deviceId
      const newData = change.after.data() as LiveData
      
      if (!newData) {
        console.log(`[HydroSync] Live data deleted for device: ${deviceId}`)
        return
      }

      console.log(`[HydroSync] Processing live data for device: ${deviceId}`, newData)

      // Find the user who owns this device
      const userSnapshot = await db
        .collectionGroup('devices')
        .where('id', '==', deviceId)
        .limit(1)
        .get()

      if (userSnapshot.empty) {
        console.warn(`[HydroSync] No user found for device: ${deviceId}`)
        return
      }

      const userPath = userSnapshot.docs[0].ref.parent.parent?.path
      if (!userPath) {
        console.warn(`[HydroSync] Could not determine user path for device: ${deviceId}`)
        return
      }

      const userId = userPath.split('/')[1] // Extract user ID from path like 'users/userId'

      // Get automation rules for this device
      const rulesSnapshot = await db
        .doc(`${userPath}`)
        .collection('automation')
        .where('deviceId', '==', deviceId)
        .where('enabled', '==', true)
        .limit(1)
        .get()

      if (rulesSnapshot.empty) {
        console.log(`[HydroSync] No automation rules for device: ${deviceId}`)
        return
      }

      const rule = rulesSnapshot.docs[0].data() as AutomationRule

      // Evaluate rules and determine actions
      const actions = evaluateRules(newData, rule)

      // Update device controls
      await updateDeviceControls(deviceId, actions)

      // Create alerts if needed
      if (actions.alerts.length > 0) {
        for (const alertMessage of actions.alerts) {
          await createAlert(userId, deviceId, alertMessage)
        }
      }

      console.log(`[HydroSync] Automation actions executed for device: ${deviceId}`, actions)
    } catch (error) {
      console.error('[HydroSync] Error in onLiveDataUpdate:', error)
      throw error
    }
  })

/**
 * Evaluate automation rules against sensor data
 */
function evaluateRules(
  data: LiveData,
  rule: AutomationRule
): { pump1: boolean; pump2: boolean; fan: boolean; growLight: boolean; alerts: string[] } {
  const alerts: string[] = []
  const actions = {
    pump1: false,
    pump2: false,
    fan: false,
    growLight: false,
    alerts,
  }

  // TDS Level Check - Nutrient pump control
  if (data.tds < rule.tdsMin) {
    actions.pump2 = true
    alerts.push(`Critical: TDS level low (${data.tds.toFixed(0)} ppm). Nutrient pump activated.`)
  } else if (data.tds > rule.tdsMax) {
    actions.pump2 = false
    alerts.push(`Warning: TDS level high (${data.tds.toFixed(0)} ppm). Nutrient pump disabled.`)
  }

  // Temperature Check - Fan control
  if (data.temperature > rule.tempMax) {
    actions.fan = true
    alerts.push(`Warning: Temperature too high (${data.temperature.toFixed(1)}°C). Cooling fan activated.`)
  } else if (data.temperature < rule.tempMin) {
    actions.fan = false
    alerts.push(`Warning: Temperature too low (${data.temperature.toFixed(1)}°C). Cooling fan disabled.`)
  }

  // Light Level Check - Grow light control
  if (data.ldr < rule.ldrMin) {
    actions.growLight = true
    alerts.push(`Info: Light level low (${data.ldr.toFixed(0)}%). Grow light activated.`)
  } else {
    actions.growLight = false
  }

  // Humidity Check
  if (data.humidity > rule.humidityMax) {
    actions.fan = true
    alerts.push(`Warning: Humidity too high (${data.humidity.toFixed(1)}%). Fan activated for ventilation.`)
  }

  if (data.humidity < rule.humidityMin) {
    alerts.push(`Warning: Humidity too low (${data.humidity.toFixed(1)}%). Consider misting.`)
  }

  return actions
}

/**
 * Update device control status in Firestore
 */
async function updateDeviceControls(
  deviceId: string,
  actions: { pump1: boolean; pump2: boolean; fan: boolean; growLight: boolean }
): Promise<void> {
  await db.doc(`devices/${deviceId}/live/current`).update({
    pump1Status: actions.pump1,
    pump2Status: actions.pump2,
    fanStatus: actions.fan,
    growLightStatus: actions.growLight,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
}

/**
 * Create an alert document for the user
 */
async function createAlert(userId: string, deviceId: string, message: string): Promise<void> {
  await db.collection(`users/${userId}/alerts`).add({
    message,
    type: message.includes('Critical') ? 'error' : message.includes('Warning') ? 'warning' : 'info',
    deviceId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    read: false,
  })
}

/**
 * Cleanup function - runs daily to clean up old alerts
 */
export const cleanupOldAlerts = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('UTC')
  .onRun(async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      const usersSnapshot = await db.collection('users').get()
      
      let totalDeleted = 0
      for (const userDoc of usersSnapshot.docs) {
        const alertsSnapshot = await db
          .collection(`users/${userDoc.id}/alerts`)
          .where('timestamp', '<', thirtyDaysAgo)
          .get()

        for (const alertDoc of alertsSnapshot.docs) {
          await alertDoc.ref.delete()
          totalDeleted++
        }
      }
      
      console.log(`[HydroSync] Cleaned up ${totalDeleted} old alerts`)
    } catch (error) {
      console.error('[HydroSync] Error in cleanup function:', error)
    }
  })
