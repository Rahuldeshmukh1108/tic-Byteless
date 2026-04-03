'use client'

import { useState } from 'react'

export default function HydrochatPage() {
  const [plantName, setPlantName] = useState('')
  const [responseText, setResponseText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchHydroData = async () => {
    if (!plantName.trim()) return
    setLoading(true)
    setResponseText('')
    setError('')

    try {
      const res = await fetch('/api/hydrochat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantName: plantName.trim() }),
      })

      if (!res.ok) throw new Error(`Unexpected status ${res.status}`)

      const data = await res.json()
      if (data.error) throw new Error(data.error)

      setResponseText(data.message || 'No bot response.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">HydroChat AI</h1>
        <p className="text-foreground/60 dark:text-slate-400">Ask for plant-specific nutrient thresholds and actuator values.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
        <input
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="Enter plant name (e.g., Lettuce, Tomato)"
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          onClick={fetchHydroData}
          className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:opacity-90 smooth-transition"
          disabled={loading}
        >
          {loading ? 'Getting details...' : 'Get Plant Logic'}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">Hydrochat Output</h2>
        <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">{responseText || 'No data yet. Select a plant to begin.'}</pre>
      </div>
    </div>
  )
}
