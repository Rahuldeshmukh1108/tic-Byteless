'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, ChevronDown } from 'lucide-react'
import { cropPresets } from '@/lib/crop-presets'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ControlValues {
  tdsThreshold: number
  tempMin: number
  tempMax: number
  ldrThreshold: number
  pump1Duration: number
  pump2Duration: number
  pump3Duration: number
  dryCycleTime: number
  waterAbsorptionTime: number
}

export default function AutomationPage() {
  const [controls, setControls] = useState<ControlValues>({
    tdsThreshold: 200,
    tempMin: 20,
    tempMax: 32,
    ldrThreshold: 50,
    pump1Duration: 30,
    pump2Duration: 45,
    pump3Duration: 60,
    dryCycleTime: 5,
    waterAbsorptionTime: 5,
  })

  const [selectedCrop, setSelectedCrop] = useState('')
  const [presetMessage, setPresetMessage] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [cropSearch, setCropSearch] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const applyCropPreset = (presetName: string) => {
    const preset = cropPresets.find((p) => p.name === presetName)
    if (!preset) {
      setPresetMessage('Preset not found, try another crop.')
      return
    }

    setControls((prev) => ({
      ...prev,
      tdsThreshold: preset.tds.min,
      tempMin: preset.temp.min,
      tempMax: preset.temp.max,
      ldrThreshold: preset.ldrThreshold,
      pump1Duration: preset.pump1Duration,
      pump2Duration: preset.pump2Duration,
      pump3Duration: preset.pump3Duration,
      dryCycleTime: preset.dryCycleDuration,
      waterAbsorptionTime: preset.waterAbsorptionDuration,
    }))

    setSelectedCrop(preset.name)
    setPresetMessage(`Applied crop preset: ${preset.name}`)
  }

  const handleSliderChange = (key: keyof ControlValues, value: number) => {
    setControls((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const sliderInputs = [
    { label: 'TDS Threshold (ppm)', key: 'tdsThreshold' as const, min: 0, max: 2000, unit: 'ppm' },
    { label: 'Temp Min (°C)', key: 'tempMin' as const, min: 0, max: 30, unit: '°C' },
    { label: 'Temp Max (°C)', key: 'tempMax' as const, min: 20, max: 50, unit: '°C' },
    { label: 'LDR Threshold', key: 'ldrThreshold' as const, min: 0, max: 1023, unit: '' },
    { label: 'Pump1 Duration (sec)', key: 'pump1Duration' as const, min: 10, max: 300, unit: 's' },
    { label: 'Pump2 Duration (sec)', key: 'pump2Duration' as const, min: 5, max: 300, unit: 's' }, // changed 10 -> 5
    { label: 'Pump3 Duration (sec)', key: 'pump3Duration' as const, min: 10, max: 300, unit: 's' },
    { label: 'Dry Cycle Time (min)', key: 'dryCycleTime' as const, min: 5, max: 240, unit: 'min' },
    { label: 'Water Absorption Time (min)', key: 'waterAbsorptionTime' as const, min: 5, max: 240, unit: 'min' },
  ]

  return (
    <div className="space-y-8" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      <div>
        <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Automation Control</h1>
        <p className="text-foreground/60 dark:text-slate-400">Modern control panel for system parameters</p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-4 flex flex-col gap-3">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Crop Preset</label>
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <PopoverTrigger asChild>
              <button
                className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center justify-between gap-2 min-w-[200px]"
              >
                <span className={selectedCrop ? '' : 'text-slate-500 dark:text-slate-400'}>
                  {selectedCrop || 'Select planting profile'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-slate-900 dark:bg-slate-900 border border-slate-700 dark:border-slate-700" align="start">
              <Command className="bg-slate-900 dark:bg-slate-900">
                <CommandInput
                  placeholder="Search crops..."
                  value={cropSearch}
                  onValueChange={setCropSearch}
                  className="border-0 bg-slate-900 dark:bg-slate-900 text-slate-100 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 focus:ring-0 focus:bg-slate-850 dark:focus:bg-slate-850"
                />
                <CommandList className="max-h-[300px] overflow-y-auto bg-slate-900 dark:bg-slate-900">
                  {cropPresets
                    .filter((preset) =>
                      preset.name.toLowerCase().includes(cropSearch.toLowerCase())
                    )
                    .length === 0 ? (
                    <CommandEmpty className="py-2 text-center text-sm text-slate-400 dark:text-slate-400">
                      No crops found
                    </CommandEmpty>
                  ) : (
                    <CommandGroup className="bg-slate-900 dark:bg-slate-900">
                      {cropPresets
                        .filter((preset) =>
                          preset.name.toLowerCase().includes(cropSearch.toLowerCase())
                        )
                        .map((preset) => (
                          <CommandItem
                            key={preset.name}
                            value={preset.name}
                            onSelect={(value) => {
                              applyCropPreset(value)
                              setCropSearch('')
                              setIsDropdownOpen(false)
                            }}
                            className="cursor-pointer bg-slate-900 dark:bg-slate-900 text-slate-100 dark:text-slate-100 hover:bg-slate-800 dark:hover:bg-slate-800 focus:bg-slate-800 dark:focus:bg-slate-800"
                          >
                            {preset.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {presetMessage && <p className="text-xs text-slate-500 dark:text-slate-400">{presetMessage}</p>}
      </div>

      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-500/50 text-green-700 dark:text-green-400"
        >
          {savedMessage}
        </motion.div>
      )}

      {/* Control Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8">System Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sliderInputs.map((input, index) => (
            <motion.div
              key={input.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{input.label}</label>
                <span className="text-lg font-bold text-cyan-500 dark:text-cyan-400">
                  {controls[input.key]}{input.unit ? ` ${input.unit}` : ''}
                </span>
              </div>
              <input
                type="range"
                min={input.min}
                max={input.max}
                value={controls[input.key]}
                onChange={(e) => handleSliderChange(input.key, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
                <span>{input.min}</span>
                <span>{input.max}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={handleSave}
        className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 smooth-transition flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Save Configuration
      </motion.button>
    </div>
  )
}
