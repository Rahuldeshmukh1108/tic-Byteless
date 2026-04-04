import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { cropPresets } from '@/lib/crop-presets'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }

  return matrix[b.length][a.length]
}

function findTopMatches(query: string, limit: number = 3): { name: string; distance: number }[] {
  const queryLower = query.toLowerCase()
  const matches = cropPresets.map(preset => ({
    name: preset.name,
    distance: levenshteinDistance(queryLower, preset.name.toLowerCase())
  })).sort((a, b) => a.distance - b.distance)

  return matches.slice(0, limit)
}

async function callGeminiAI(message: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are an expert hydroponics assistant. Answer the following user question clearly and helpfully:

User: ${message}

If the user asks about crop thresholds, environmental values, or pump settings, provide a concise practical response in plain text.`

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  return text
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message = (body.message ?? '').trim()
    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    const preset = cropPresets.find((p) => p.name.toLowerCase() === message.toLowerCase())
    if (preset) {
      const lightIntensity = 24 - preset.lightHours // higher means more dark hours
      const waterCycleDuration = preset.pump1Duration // using pump1 as water cycle
      const dryCycleDuration = preset.dryCycleDuration
      const params = [
        `TDS Required: ${preset.tds.min}-${preset.tds.max} ppm`,
        `Temperature Range: ${preset.temp.min}-${preset.temp.max} °C`,
        `LDR Threshold: ${preset.ldrThreshold} (turn on grow light if above this value)`,
        `Water Cycle Duration: ${waterCycleDuration} min`,
        `Dry Cycle Duration: ${dryCycleDuration} min`
      ].join('\n')

      return NextResponse.json({
        message: `Plant: ${preset.name}\n\nDescription: ${preset.description}\n\nParameters:\n${params}\n\nCultivation Advice: This crop is suitable for hydroponic cultivation.`,
        preset,
      })
    }

    // Check for close matches
    const topMatches = findTopMatches(message)
    const bestMatch = topMatches[0]
    if (bestMatch && bestMatch.distance <= 2) {
      // Correct spelling and return
      const correctedPreset = cropPresets.find(p => p.name === bestMatch.name)!
      const lightIntensity = 24 - correctedPreset.lightHours
      const waterCycleDuration = correctedPreset.pump1Duration
      const dryCycleDuration = correctedPreset.dryCycleDuration
      const params = [
        `TDS Required: ${correctedPreset.tds.min}-${correctedPreset.tds.max} ppm`,
        `Temperature Range: ${correctedPreset.temp.min}-${correctedPreset.temp.max} °C`,
        `LDR Threshold: ${correctedPreset.ldrThreshold} (turn on grow light if above this value)`,
        `Water Cycle Duration: ${waterCycleDuration} min`,
        `Dry Cycle Duration: ${dryCycleDuration} min`
      ].join('\n')

      return NextResponse.json({
        message: `Did you mean: ${correctedPreset.name}?\n\nDescription: ${correctedPreset.description}\n\nParameters:\n${params}\n\nCultivation Advice: This crop is suitable for hydroponic cultivation.`,
        preset: correctedPreset,
      })
    }

    // No match, suggest alternatives
    const suggestions = topMatches.map(m => m.name).join(', ')
    return NextResponse.json({
      message: `This crop doesn't exist. Did you mean one of these: ${suggestions}?`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
