import { NextRequest, NextResponse } from 'next/server'
import { createReading, updateLiveData } from '@/lib/firebase/firestore'

export interface DeviceDataPayload {
  deviceId: string
  temperature: number
  tds: number
  ldr?: number
  light?: number
  humidity?: number
  pump1Status?: boolean
  pump2Status?: boolean
  pump3Status?: boolean
  fanStatus?: boolean
  growLightStatus?: boolean
  apiKey?: string
}

function asNumber(value: unknown, fallback: number = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.deviceId) {
      return NextResponse.json({ error: 'Missing required field: deviceId' }, { status: 400 })
    }

    const payload: DeviceDataPayload = {
      deviceId: String(body.deviceId),
      temperature: asNumber(body.temperature),
      tds: asNumber(body.tds),
      ldr: asNumber(body.ldr ?? body.light),
      light: asNumber(body.light ?? body.ldr),
      humidity: asNumber(body.humidity, 0),
      pump1Status: Boolean(body.pump1Status),
      pump2Status: Boolean(body.pump2Status),
      pump3Status: Boolean(body.pump3Status),
      fanStatus: Boolean(body.fanStatus),
      growLightStatus: Boolean(body.growLightStatus),
      apiKey: body.apiKey,
    }

    if (!Number.isFinite(payload.temperature) || !Number.isFinite(payload.tds)) {
      return NextResponse.json({ error: 'temperature and tds must be numeric' }, { status: 400 })
    }

    const timestamp = new Date()

    await updateLiveData(payload.deviceId, {
      temperature: payload.temperature,
      tds: payload.tds,
      ldr: payload.ldr ?? payload.light ?? 0,
      humidity: payload.humidity ?? 0,
      timestamp,
      pump1Status: payload.pump1Status ?? false,
      pump2Status: payload.pump2Status ?? false,
      pump3Status: payload.pump3Status ?? false,
      fanStatus: payload.fanStatus ?? false,
      growLightStatus: payload.growLightStatus ?? false,
    })

    await createReading(payload.deviceId, {
      deviceId: payload.deviceId,
      temperature: payload.temperature,
      tds: payload.tds,
      ldr: payload.ldr ?? payload.light ?? 0,
      humidity: payload.humidity ?? 0,
      timestamp,
    })

    return NextResponse.json({
      success: true,
      message: 'Device data stored successfully',
      timestamp: timestamp.toISOString(),
    })
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const deviceId = searchParams.get('deviceId')

  if (!deviceId) {
    return NextResponse.json({ error: 'Missing required parameter: deviceId' }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    message: `POST sensor data for ${deviceId} to this endpoint, or let the ESP32 write directly to Firebase RTDB.`,
  })
}
