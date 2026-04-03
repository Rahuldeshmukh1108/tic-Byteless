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
  {
    name: 'Lettuce',
    tds: { min: 400, max: 700 },
    temp: { min: 18, max: 22 },
    pH: { min: 5.8, max: 6.2 },
    lightHours: 16,
    pump1Duration: 30,
    pump2Duration: 45,
    pump3Duration: 0,
  },
  {
    name: 'Tomato',
    tds: { min: 800, max: 1200 },
    temp: { min: 22, max: 26 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    pump1Duration: 45,
    pump2Duration: 60,
    pump3Duration: 20,
  },
  {
    name: 'Basil',
    tds: { min: 600, max: 900 },
    temp: { min: 20, max: 24 },
    pH: { min: 5.5, max: 6.5 },
    lightHours: 14,
    pump1Duration: 30,
    pump2Duration: 45,
    pump3Duration: 10,
  },
]
