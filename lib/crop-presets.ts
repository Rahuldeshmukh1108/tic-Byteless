export type CropPreset = {
  name: string
  tds: { min: number; max: number }
  temp: { min: number; max: number }
  pH: { min: number; max: number }
  lightHours: number
  pump1Duration: number
  pump2Duration: number
  pump3Duration: number
}

export const cropPresets: CropPreset[] = [

  // 🌿 Leafy Greens
  { name: 'Lettuce', tds: { min: 400, max: 700 }, temp: { min: 18, max: 22 }, pH: { min: 5.8, max: 6.2 }, lightHours: 16, pump1Duration: 30, pump2Duration: 45, pump3Duration: 0 },
  { name: 'Spinach', tds: { min: 600, max: 1000 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, pump1Duration: 30, pump2Duration: 40, pump3Duration: 0 },
  { name: 'Kale', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, pump1Duration: 35, pump2Duration: 50, pump3Duration: 10 },
  { name: 'Arugula', tds: { min: 600, max: 900 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 6.8 }, lightHours: 12, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0 },

  // 🌿 Herbs
  { name: 'Basil', tds: { min: 600, max: 900 }, temp: { min: 20, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, pump1Duration: 30, pump2Duration: 45, pump3Duration: 10 },
  { name: 'Mint', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0 },
  { name: 'Coriander', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 25 }, pH: { min: 6.2, max: 6.8 }, lightHours: 12, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5 },
  { name: 'Parsley', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 12, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5 },

  // 🍅 Fruiting Plants
  { name: 'Tomato', tds: { min: 800, max: 1200 }, temp: { min: 22, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, pump1Duration: 45, pump2Duration: 60, pump3Duration: 20 },
  { name: 'Cherry Tomato', tds: { min: 800, max: 1200 }, temp: { min: 22, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, pump1Duration: 45, pump2Duration: 60, pump3Duration: 20 },
  { name: 'Cucumber', tds: { min: 1200, max: 2000 }, temp: { min: 22, max: 28 }, pH: { min: 5.5, max: 6.0 }, lightHours: 14, pump1Duration: 50, pump2Duration: 70, pump3Duration: 25 },
  { name: 'Bell Pepper', tds: { min: 1000, max: 1400 }, temp: { min: 20, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, pump1Duration: 45, pump2Duration: 65, pump3Duration: 20 },
  { name: 'Chilli', tds: { min: 1200, max: 1800 }, temp: { min: 22, max: 30 }, pH: { min: 6.0, max: 6.8 }, lightHours: 14, pump1Duration: 50, pump2Duration: 70, pump3Duration: 25 },
  { name: 'Strawberry', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 12, pump1Duration: 40, pump2Duration: 60, pump3Duration: 15 },

  // 🥕 Root / Others
  { name: 'Radish', tds: { min: 600, max: 900 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0 },
  { name: 'Carrot', tds: { min: 800, max: 1200 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 6.8 }, lightHours: 12, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5 },
  { name: 'Beetroot', tds: { min: 1000, max: 1400 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, pump1Duration: 35, pump2Duration: 50, pump3Duration: 10 },
  { name: 'Green Onion', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0 }

]