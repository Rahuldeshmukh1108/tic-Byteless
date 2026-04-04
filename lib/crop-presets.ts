export type CropPreset = {
  name: string
  description: string
  tds: { min: number; max: number }
  temp: { min: number; max: number }
  pH: { min: number; max: number }
  lightHours: number
  ldrThreshold: number
  pump1Duration: number
  pump2Duration: number
  pump3Duration: number
  waterAbsorptionDuration: number
  dryCycleDuration: number
}

export const cropPresets: CropPreset[] = [

  // 🌿 Leafy Greens
  {
    name: 'Lettuce',
    description: 'Fast-growing leafy green.',
    tds: { min: 400, max: 700 },
    temp: { min: 18, max: 22 },
    pH: { min: 5.8, max: 6.2 },
    lightHours: 16,
    ldrThreshold: 2000,
    pump1Duration: 30,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 30, // Updated from Water Cycle Duration
    dryCycleDuration: 10
  },
  {
    name: 'Spinach',
    description: 'Cool-weather leafy green.',
    tds: { min: 600, max: 1000 },
    temp: { min: 16, max: 22 },
    pH: { min: 6.0, max: 7.0 },
    lightHours: 12,
    ldrThreshold: 1800,
    pump1Duration: 30,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 30,
    dryCycleDuration: 10
  },
  {
    name: 'Kale',
    description: 'Hardy leafy green.',
    tds: { min: 800, max: 1200 },
    temp: { min: 18, max: 24 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    ldrThreshold: 1900,
    pump1Duration: 35,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 35,
    dryCycleDuration: 12
  },
  {
    name: 'Arugula',
    description: 'Peppery leafy green.',
    tds: { min: 600, max: 900 },
    temp: { min: 16, max: 22 },
    pH: { min: 6.0, max: 6.8 },
    lightHours: 12,
    ldrThreshold: 1800,
    pump1Duration: 25,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 25,
    dryCycleDuration: 10
  },
  {
    name: 'Pak Choi',
    description: 'Versatile Asian green.',
    tds: { min: 800, max: 1200 },
    temp: { min: 15, max: 24 },
    pH: { min: 6.0, max: 7.0 },
    lightHours: 14,
    ldrThreshold: 1800,
    pump1Duration: 30,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 30,
    dryCycleDuration: 10
  },

  // 🌿 Herbs
  {
    name: 'Basil',
    description: 'Aromatic herb.',
    tds: { min: 600, max: 900 },
    temp: { min: 20, max: 24 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    ldrThreshold: 1900,
    pump1Duration: 30,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 30,
    dryCycleDuration: 12
  },
  {
    name: 'Mint',
    description: 'Refreshing herb.',
    tds: { min: 600, max: 900 },
    temp: { min: 18, max: 24 },
    pH: { min: 6.0, max: 7.0 },
    lightHours: 12,
    ldrThreshold: 1800,
    pump1Duration: 25,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 25,
    dryCycleDuration: 10
  },
  {
    name: 'Coriander',
    description: 'Fast-growing herb.',
    tds: { min: 800, max: 1200 },
    temp: { min: 18, max: 25 },
    pH: { min: 6.2, max: 6.8 },
    lightHours: 12,
    ldrThreshold: 1800,
    pump1Duration: 30,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 30,
    dryCycleDuration: 12
  },

  // 🍅 Fruiting Plants
  {
    name: 'Tomato',
    description: 'High-yield plant.',
    tds: { min: 800, max: 1200 },
    temp: { min: 22, max: 26 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    ldrThreshold: 1900,
    pump1Duration: 45,
    pump2Duration: 5,
    pump3Duration: 20,
    waterAbsorptionDuration: 45,
    dryCycleDuration: 15
  },
  {
    name: 'Cucumber',
    description: 'Fast-growing vine.',
    tds: { min: 1200, max: 2000 },
    temp: { min: 22, max: 28 },
    pH: { min: 5.5, max: 6.0 },
    lightHours: 14,
    ldrThreshold: 1900,
    pump1Duration: 50,
    pump2Duration: 5,
    pump3Duration: 20,
    waterAbsorptionDuration: 50,
    dryCycleDuration: 15
  },
  {
    name: 'Chilli',
    description: 'Spicy plant.',
    tds: { min: 1200, max: 1800 },
    temp: { min: 22, max: 30 },
    pH: { min: 6.0, max: 6.8 },
    lightHours: 14,
    ldrThreshold: 1900,
    pump1Duration: 50,
    pump2Duration: 5,
    pump3Duration: 20,
    waterAbsorptionDuration: 50,
    dryCycleDuration: 15
  },

  // 🍓 Others
  {
    name: 'Strawberry',
    description: 'Sweet fruit plant.',
    tds: { min: 500, max: 900 },
    temp: { min: 18, max: 24 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    ldrThreshold: 1800,
    pump1Duration: 40,
    pump2Duration: 5,
    pump3Duration: 15,
    waterAbsorptionDuration: 40,
    dryCycleDuration: 12
  }
]