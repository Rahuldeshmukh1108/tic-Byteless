import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { cropPresets } from '@/lib/crop-presets'

const apiKey = process.env.GEMINI_API_KEY
const cropAliases: Record<string, string> = {
  lettuce: 'Lettuce',
  salad: 'Lettuce',
  spinach: 'Spinach',
  palak: 'Spinach',
  'पालक': 'Spinach',
  kale: 'Kale',
  arugula: 'Arugula',
  rocket: 'Arugula',
  'pak choi': 'Pak Choi',
  pakchoi: 'Pak Choi',
  'bok choy': 'Pak Choi',
  bokchoy: 'Pak Choi',
  basil: 'Basil',
  tulsi: 'Basil',
  'तुलसी': 'Basil',
  mint: 'Mint',
  pudina: 'Mint',
  'पुदीना': 'Mint',
  coriander: 'Coriander',
  cilantro: 'Coriander',
  dhania: 'Coriander',
  'धनिया': 'Coriander',
  tomato: 'Tomato',
  tamatar: 'Tomato',
  'टमाटर': 'Tomato',
  cucumber: 'Cucumber',
  kheera: 'Cucumber',
  khira: 'Cucumber',
  'खीरा': 'Cucumber',
  chilli: 'Chilli',
  chili: 'Chilli',
  mirch: 'Chilli',
  'मिर्च': 'Chilli',
  strawberry: 'Strawberry',
  'स्ट्रॉबेरी': 'Strawberry',
}

function normalizePlantName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
}

function getCanonicalPlantName(message: string) {
  const normalized = normalizePlantName(message)

  if (cropAliases[normalized]) {
    return cropAliases[normalized]
  }

  for (const [alias, canonicalName] of Object.entries(cropAliases)) {
    if (normalized.includes(alias)) {
      return canonicalName
    }
  }

  return null
}

function levenshteinDistance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0))

  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      )
    }
  }

  return dp[a.length][b.length]
}

function findClosestPreset(message: string) {
  const normalized = normalizePlantName(message)
  let bestMatch: { name: string; distance: number } | null = null

  for (const preset of cropPresets) {
    const presetName = normalizePlantName(preset.name)
    const distance = levenshteinDistance(normalized, presetName)
    const threshold = Math.max(2, Math.floor(presetName.length * 0.35))

    if (distance <= threshold && (!bestMatch || distance < bestMatch.distance)) {
      bestMatch = { name: preset.name, distance }
    }
  }

  return bestMatch
}

function findPreset(message: string) {
  const canonicalName = getCanonicalPlantName(message)
  if (canonicalName) {
    return cropPresets.find((preset) => preset.name === canonicalName) ?? null
  }

  const normalized = normalizePlantName(message)
  return cropPresets.find((preset) => {
    const presetName = normalizePlantName(preset.name)
    return normalized === presetName || normalized.includes(presetName)
  }) ?? null
}

function formatPresetResponse(message: string, correctedFrom?: string) {
  const preset = findPreset(message)
  if (!preset) return null

  const tdsThreshold = Math.round((preset.tds.min + preset.tds.max) / 2)
  const correctionNote =
    correctedFrom && normalizePlantName(correctedFrom) !== normalizePlantName(preset.name)
      ? `Corrected Crop: ${correctedFrom} -> ${preset.name}\n\n`
      : ''

  return `${correctionNote}Plant: ${preset.name}

Short Description:
${preset.description} It is generally suitable for controlled hydroponic cultivation when temperature, nutrient strength, and irrigation timing stay stable.

Key Parameters:
- Temp Min: ${preset.temp.min} C
- Temp Max: ${preset.temp.max} C
- TDS Threshold: ${tdsThreshold} ppm
- LDR Intensity: ${Math.min(3000, Math.max(0, preset.ldrThreshold))}
- Nutrient Cycle Duration: ${preset.waterAbsorptionDuration * 1000} ms
- Dry Cycle Duration: ${preset.dryCycleDuration * 1000} ms

Cultivation Decision:
- Cultivate: Yes
- Reason: ${preset.name} matches the stored hydroponic crop presets in this system and can be managed with the above automation values.`
}

function formatUnknownPlantResponse(message: string) {
  const plantName = message
    .trim()
    .split(/[?.!,\n]/)[0]
    .replace(/^plant\s+/i, '')
    .replace(/^about\s+/i, '')
    .trim()

  const resolvedPlant = plantName || 'Unknown Plant'
  const supportedExamples = cropPresets.map((preset) => preset.name).join(', ')

  return `Plant: ${resolvedPlant}

Short Description:
This plant does not exist in the current HydroChat crop library.
Check the spelling or try one of the supported crops listed below.

Key Parameters:
- Temp Min: Not available
- Temp Max: Not available
- TDS Threshold: Not available
- LDR Intensity: Not available
- Nutrient Cycle Duration: Not available
- Dry Cycle Duration: Not available

Cultivation Decision:
- Cultivate: No
- Reason: No verified crop preset was found. Supported examples: ${supportedExamples}.`
}

const systemPrompt = `
You are HydroChat, an assistant for hydroponics, smart farming, irrigation automation, nutrient control, plant health, and ESP32-based monitoring systems.

Your primary job is this:
- The user usually gives a plant name.
- Return a short, farmer-friendly answer focused on cultivation suitability and automation settings.

For plant questions, always respond in this exact structure:

Plant: <plant name>

Short Description:
<2 to 3 short sentences about the plant and hydroponic suitability>

Key Parameters:
- Temp Min: <value in C>
- Temp Max: <value in C>
- TDS Threshold: <single practical threshold value in ppm>
- LDR Intensity: <value from 0 to 3000>
- Nutrient Cycle Duration: <value in ms>
- Dry Cycle Duration: <value in ms>

Cultivation Decision:
- Cultivate: Yes or No
- Reason: <short practical reason>

Rules:
- Keep the answer concise.
- Use realistic hydroponic guidance.
- LDR intensity must be between 0 and 3000.
- Durations must be machine-friendly integers in milliseconds.
- If the plant is not suitable for hydroponics, say "Cultivate: No".
- If the user asks something broader than a plant name, still answer in a useful hydroponic advisory style.
- Do not add long disclaimers.
- Do not use markdown tables.

If the user asks something unrelated to farming or plants, briefly redirect them back to hydroponics.
`.trim()

export async function POST(request: NextRequest) {
  let message = ''

  try {
    const body = await request.json()
    message = typeof body?.message === 'string' ? body.message.trim() : ''

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const presetResponse = formatPresetResponse(message)
    if (presetResponse) {
      return NextResponse.json({ message: presetResponse })
    }

    const closestPreset = findClosestPreset(message)
    if (closestPreset) {
      return NextResponse.json({
        message: formatPresetResponse(closestPreset.name, message),
      })
    }

    if (!apiKey) {
      return NextResponse.json({ message: formatUnknownPlantResponse(message) })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent([
      systemPrompt,
      '',
      `User question: ${message}

If this looks like a plant name, assume the user wants hydroponic cultivation guidance for that plant using ESP32 automation-style parameters.`,
    ])

    const responseText = result.response.text().trim()

    return NextResponse.json({
      message: responseText || formatUnknownPlantResponse(message),
    })
  } catch (error) {
    console.error('[HydroChat] API error:', error)

    const presetResponse = formatPresetResponse(message)
    if (presetResponse) {
      return NextResponse.json({ message: presetResponse })
    }

    const closestPreset = findClosestPreset(message)
    if (closestPreset) {
      return NextResponse.json({
        message: formatPresetResponse(closestPreset.name, message),
      })
    }

    return NextResponse.json({
      message: formatUnknownPlantResponse(message || 'Unknown Plant'),
    })
  }
}
