import { NextResponse } from 'next/server'
import { cropPresets } from '@/lib/crop-presets'

async function callGeminiAI(plantName: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key not configured (set GOOGLE_API_KEY or GEMINI_API_KEY)')
  }

  const prompt = `You are a hydroponics assistant. Provide optimal threshold values for ${plantName} in JSON format with fields: pH(min,max), TDS(min,max), temperature(min,max), lightHours, pump1Duration, pump2Duration, pump3Duration, and a short explanation.`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: {
          text: prompt,
        },
        temperature: 0.1,
        maxOutputTokens: 500,
      }),
    }
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${body}`)
  }

  const data = await response.json()
  const generativeText = data?.candidates?.[0]?.output ?? data?.output?.[0]?.content?.map((c: any) => c.text).join('')

  if (!generativeText) {
    throw new Error('Empty response from Gemini AI')
  }

  return generativeText
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const plantName = (body.plantName ?? '').trim()
    if (!plantName) {
      return NextResponse.json({ error: 'plantName is required' }, { status: 400 })
    }

    const preset = cropPresets.find((p) => p.name.toLowerCase() === plantName.toLowerCase())
    if (preset) {
      return NextResponse.json({
        message: `Found preset for ${preset.name}:\n- TDS ${preset.tds.min}-${preset.tds.max} ppm\n- Temp ${preset.temp.min}-${preset.temp.max} °C\n- pH ${preset.pH.min}-${preset.pH.max}\n- Light ${preset.lightHours} hrs\n- Pump1 ${preset.pump1Duration}s, Pump2 ${preset.pump2Duration}s, Pump3 ${preset.pump3Duration}s`,
        preset,
      })
    }

    const genText = await callGeminiAI(plantName)
    return NextResponse.json({ message: genText })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
