import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { cropPresets } from '@/lib/crop-presets'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function callGeminiAI(plantName: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a hydroponics assistant. Provide optimal threshold values for ${plantName} in JSON format with fields: pH(min,max), TDS(min,max), temperature(min,max), lightHours, pump1Duration, pump2Duration, pump3Duration, and a short explanation.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  return text
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
