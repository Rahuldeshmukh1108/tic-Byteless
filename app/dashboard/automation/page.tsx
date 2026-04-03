'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save } from 'lucide-react'
import { cropPresets, CropPreset } from '@/lib/crop-presets'

interface ControlValues {
  tdsMin: number
  tdsMax: number
  tempMin: number
  tempMax: number
  ldrThreshold: number
  pump1Duration: number
  pump2Duration: number
  pump3Duration: number
  autoMode: boolean
}

export default function AutomationPage() {
  const [controls, setControls] = useState<ControlValues>({
    tdsMin: 200,
    tdsMax: 1500,
    tempMin: 20,
    tempMax: 32,
    ldrThreshold: 50,
    pump1Duration: 30,
    pump2Duration: 45,
    pump3Duration: 60,
    autoMode: true,
  })

  const [selectedCrop, setSelectedCrop] = useState('')
  const [presetMessage, setPresetMessage] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  const applyCropPreset = (presetName: string) => {
    const preset = cropPresets.find((p) => p.name === presetName)
    if (!preset) {
      setPresetMessage('Preset not found, try another crop.')
      return
    }

    setControls((prev) => ({
      ...prev,
      tdsMin: preset.tds.min,
      tdsMax: preset.tds.max,
      tempMin: preset.temp.min,
      tempMax: preset.temp.max,
      ldrThreshold: Math.round((preset.pH.min + preset.pH.max) / 2 * 10) / 10,
      pump1Duration: preset.pump1Duration,
      pump2Duration: preset.pump2Duration,
      pump3Duration: preset.pump3Duration,
    }))

    setSelectedCrop(preset.name)
    setPresetMessage(`Applied crop preset: ${preset.name}`)
  }

  const handleSliderChange = (key: keyof ControlValues, value: number) => {
    setControls((prev) => ({ ...prev, [key]: value }))
  }

  const handleToggleAutoMode = () => {
    setControls((prev) => ({ ...prev, autoMode: !prev.autoMode }))
  }

  const handleSave = () => {
    setSavedMessage('Settings saved successfully!')
    setTimeout(() => setSavedMessage(''), 3000)
  }

  const sliderInputs = [
    { label: 'TDS Min (ppm)', key: 'tdsMin' as const, min: 0, max: 500, unit: 'ppm' },
    { label: 'TDS Max (ppm)', key: 'tdsMax' as const, min: 500, max: 2000, unit: 'ppm' },
    { label: 'Temp Min (°C)', key: 'tempMin' as const, min: 0, max: 30, unit: '°C' },
    { label: 'Temp Max (°C)', key: 'tempMax' as const, min: 20, max: 50, unit: '°C' },
    { label: 'LDR Threshold (%)', key: 'ldrThreshold' as const, min: 0, max: 100, unit: '%' },
    { label: 'Pump1 Duration (sec)', key: 'pump1Duration' as const, min: 10, max: 300, unit: 's' },
    { label: 'Pump2 Duration (sec)', key: 'pump2Duration' as const, min: 10, max: 300, unit: 's' },
    { label: 'Pump3 Duration (sec)', key: 'pump3Duration' as const, min: 10, max: 300, unit: 's' },
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
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select planting profile</option>
            {cropPresets.map((preset) => (
              <option key={preset.name} value={preset.name}>{preset.name}</option>
            ))}
          </select>
          <button
            onClick={() => applyCropPreset(selectedCrop)}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 smooth-transition"
          >
            Apply Preset
          </button>
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

      {/* Auto Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Auto Mode</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enable/disable automatic system control</p>
          </div>
          <button
            onClick={handleToggleAutoMode}
            className={`relative w-16 h-8 rounded-full smooth-transition ${
              controls.autoMode
                ? 'bg-cyan-500 dark:bg-cyan-500'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full smooth-transition ${
                controls.autoMode
                  ? 'translate-x-8'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className={`text-sm ${controls.autoMode ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {controls.autoMode ? 'Auto Mode is ON - System is controlling devices automatically' : 'Auto Mode is OFF - Manual control required'}
        </p>
      </motion.div>

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
                  {controls[input.key]} {input.unit}
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
