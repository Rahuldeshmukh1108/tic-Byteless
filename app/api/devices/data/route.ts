import { NextRequest, NextResponse } from 'next/server'
import { updateLiveData, createReading } from '@/lib/firebase/firestore'

export interface DeviceDataPayload {
  deviceId: string
  temperature: number
  tds: number // Total Dissolved Solids in ppm
  ldr: number // Light Dependent Resistor (0-100)
  humidity: number
  apiKey?: string // Optional API key for device authentication
}

/**
 * POST /api/devices/data
 * Receives sensor data from ESP32 devices and updates Firebase
 * 
 * Request body:
 * {
 *   "deviceId": "device_1234567890",
 *   "temperature": 22.5,
 *   "tds": 1200,
 *   "ldr": 78,
 *   "humidity": 65.3,
 *   "apiKey": "optional-device-api-key"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Data received and stored",
 *   "timestamp": "2024-01-15T10:30:00Z"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.deviceId) {
      return NextResponse.json(
        { error: 'Missing required field: deviceId' },
        { status: 400 }
      )
    }

    if (
      body.temperature === undefined ||
      body.tds === undefined ||
      body.ldr === undefined ||
      body.humidity === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required sensor data fields' },
        { status: 400 }
      )
    }

    const payload: DeviceDataPayload = {
      deviceId: body.deviceId,
      temperature: parseFloat(body.temperature),
      tds: parseFloat(body.tds),
      ldr: parseFloat(body.ldr),
      humidity: parseFloat(body.humidity),
      apiKey: body.apiKey,
    }

    // Validate data ranges
    if (isNaN(payload.temperature) || isNaN(payload.tds) || isNaN(payload.ldr) || isNaN(payload.humidity)) {
      return NextResponse.json(
        { error: 'Invalid sensor data: values must be numbers' },
        { status: 400 }
      )
    }

    // Optional: Validate API key (implement your own validation logic)
    // if (payload.apiKey !== process.env.DEVICE_API_KEY) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized: Invalid API key' },
    //     { status: 401 }
    //   )
    // }

    // Update live data
    await updateLiveData(payload.deviceId, {
      temperature: payload.temperature,
      tds: payload.tds,
      ldr: payload.ldr,
      humidity: payload.humidity,
      pump1Status: false, // These will be set by automation functions
      pump2Status: false,
      fanStatus: false,
      growLightStatus: false,
    })

    // Store reading in historical data
    await createReading(payload.deviceId, {
      temperature: payload.temperature,
      tds: payload.tds,
      ldr: payload.ldr,
      humidity: payload.humidity,
    })

    console.log('[HydroSync] Device data received:', {
      deviceId: payload.deviceId,
      timestamp: new Date().toISOString(),
      ...payload,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Data received and stored',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[HydroSync] Error processing device data:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to process device data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/devices/data
 * Returns current live data for a device
 * 
 * Query parameters:
 * - deviceId: ID of the device
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: deviceId' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Use POST to submit device data. For GET requests, use your Firestore database directly.',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve device data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
