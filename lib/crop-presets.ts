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
  dryCycleDuration: number
}

export const cropPresets: CropPreset[] = [

  // 🌿 Leafy Greens
  { name: 'Lettuce', description: 'Fast-growing leafy green, ideal for beginners. Harvest outer leaves for continuous yield.', tds: { min: 400, max: 700 }, temp: { min: 18, max: 22 }, pH: { min: 5.8, max: 6.2 }, lightHours: 16, ldrThreshold: 2000, pump1Duration: 30, pump2Duration: 45, pump3Duration: 0, dryCycleDuration: 60 },
  { name: 'Spinach', description: 'Nutrient-rich leafy green, tolerates cooler temperatures. High in iron and vitamins.', tds: { min: 600, max: 1000 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 30, pump2Duration: 40, pump3Duration: 0, dryCycleDuration: 60 },
  { name: 'Kale', description: 'Hardy leafy green with curly leaves, rich in antioxidants. Grows well in various conditions.', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 35, pump2Duration: 50, pump3Duration: 10, dryCycleDuration: 60 },
  { name: 'Arugula', description: 'Peppery leafy green, quick to mature. Adds flavor to salads and sandwiches.', tds: { min: 600, max: 900 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 6.8 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0, dryCycleDuration: 60 },

  // 🌿 Herbs
  { name: 'Basil', description: 'Aromatic herb used in cooking. Requires warm temperatures and plenty of light.', tds: { min: 600, max: 900 }, temp: { min: 20, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 30, pump2Duration: 45, pump3Duration: 10, dryCycleDuration: 60 },
  { name: 'Mint', description: 'Refreshing herb with spreading growth. Easy to propagate from cuttings.', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0, dryCycleDuration: 60 },
  { name: 'Coriander', description: 'Dual-purpose herb with leaves and seeds. Fast-growing and versatile in cuisine.', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 25 }, pH: { min: 6.2, max: 6.8 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5, dryCycleDuration: 60 },
  { name: 'Parsley', description: 'Biennial herb, often grown as annual. Adds freshness to dishes.', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5, dryCycleDuration: 60 },

  // 🍅 Fruiting Plants
  { name: 'Tomato', description: 'Popular fruiting plant, produces juicy red fruits. Requires support for vines.', tds: { min: 800, max: 1200 }, temp: { min: 22, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 45, pump2Duration: 60, pump3Duration: 20, dryCycleDuration: 60 },
  { name: 'Cherry Tomato', description: 'Smaller, sweeter variety of tomato. Prolific producer, great for snacking.', tds: { min: 800, max: 1200 }, temp: { min: 22, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 45, pump2Duration: 60, pump3Duration: 20, dryCycleDuration: 60 },
  { name: 'Cucumber', description: 'Vining fruit with crisp texture. Needs trellising for straight growth.', tds: { min: 1200, max: 2000 }, temp: { min: 22, max: 28 }, pH: { min: 5.5, max: 6.0 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 50, pump2Duration: 70, pump3Duration: 25, dryCycleDuration: 60 },
  { name: 'Bell Pepper', description: 'Colorful fruiting plant, sweet and crunchy. Takes longer to mature.', tds: { min: 1000, max: 1400 }, temp: { min: 20, max: 26 }, pH: { min: 5.5, max: 6.5 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 45, pump2Duration: 65, pump3Duration: 20, dryCycleDuration: 60 },
  { name: 'Chilli', description: 'Spicy fruiting plant, varies in heat level. Adds kick to meals.', tds: { min: 1200, max: 1800 }, temp: { min: 22, max: 30 }, pH: { min: 6.0, max: 6.8 }, lightHours: 14, ldrThreshold: 1900, pump1Duration: 50, pump2Duration: 70, pump3Duration: 25, dryCycleDuration: 60 },
  { name: 'Strawberry', description: 'Sweet berry producer, runners for propagation. Fruit hangs below leaves.', tds: { min: 800, max: 1200 }, temp: { min: 18, max: 24 }, pH: { min: 5.5, max: 6.5 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 40, pump2Duration: 60, pump3Duration: 15, dryCycleDuration: 60 },

  // 🥕 Root / Others
  { name: 'Radish', description: 'Quick-growing root vegetable, spicy flavor. Ready in 3-4 weeks.', tds: { min: 600, max: 900 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0, dryCycleDuration: 60 },
  { name: 'Carrot', description: 'Orange root vegetable, sweet and crunchy. Needs deep medium for roots.', tds: { min: 800, max: 1200 }, temp: { min: 16, max: 22 }, pH: { min: 6.0, max: 6.8 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 30, pump2Duration: 45, pump3Duration: 5, dryCycleDuration: 60 },
  { name: 'Beetroot', description: 'Red root with edible greens. Dual harvest from roots and leaves.', tds: { min: 1000, max: 1400 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 35, pump2Duration: 50, pump3Duration: 10, dryCycleDuration: 60 },
  { name: 'Green Onion', description: 'Mild onion flavor, harvest young for scallions. Continuous harvest possible.', tds: { min: 600, max: 900 }, temp: { min: 18, max: 24 }, pH: { min: 6.0, max: 7.0 }, lightHours: 12, ldrThreshold: 1800, pump1Duration: 25, pump2Duration: 40, pump3Duration: 0, dryCycleDuration: 60 }

]