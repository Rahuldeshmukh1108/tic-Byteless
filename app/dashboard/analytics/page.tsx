'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Calendar, AlertTriangle, Lightbulb, Download } from 'lucide-react'

const insights = {
  issues: [
    {
      id: 1,
      title: 'High TDS Levels Detected',
      description: 'TDS levels reached 1620 ppm, exceeding optimal range',
      severity: 'critical',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Pump 2 Running Longer Than Usual',
      description: 'Pump2 has been running for 85 minutes, check for blockage',
      severity: 'warning',
      time: '45 minutes ago',
    },
  ],
  solutions: [
    {
      id: 1,
      title: 'Perform Water Change',
      description: 'Drain 30-40% of the water and refill with fresh water to reduce TDS levels',
      action: 'Learn more →',
    },
    {
      id: 2,
      title: 'Adjust Pump Duration',
      description: 'Reduce Pump2 duration to 40 seconds to optimize water usage',
      action: 'Apply →',
    },
  ],
  recommendations: [
    {
      id: 1,
      title: 'Optimize Lighting Schedule',
      description: 'Increase LED intensity during 6 AM - 10 AM for better plant growth',
    },
    {
      id: 2,
      title: 'Temperature Control',
      description: 'Lower night temperature to 22°C to reduce energy consumption',
    },
    {
      id: 3,
      title: 'Water Management',
      description: 'Current water usage is 5% below average. Consider increasing irrigation frequency',
    },
  ],
}

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState('24')

  const stats = [
    { label: 'Avg Temperature', value: '28.5°C', change: '+2.1%', positive: true },
    { label: 'Water Used', value: '342L', change: '-5.3%', positive: true },
    { label: 'Energy Consumed', value: '24.5 kWh', change: '+1.2%', positive: false },
    { label: 'Crop Health', value: '95%', change: '+3.8%', positive: true },
  ]

  return (
    <div className="space-y-8" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px), radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px, 20px 20px',
      backgroundPosition: '0 0, 10px 10px'
    }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground dark:text-slate-100 mb-2">Analytics & AI Insights</h1>
          <p className="text-foreground/60 dark:text-slate-400">Track performance and get intelligent recommendations</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-foreground/60 dark:text-slate-400" />
          <select 
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 smooth-transition focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="1">Last 1 hour</option>
            <option value="24">Last 24 hours</option>
            <option value="7">Last 7 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6 smooth-transition hover:border-slate-300 dark:hover:border-slate-600"
          >
            <p className="text-sm text-foreground/60 dark:text-slate-400 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <TrendingUp size={16} />
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Issues Detected */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-red-500 dark:text-red-400" />
          Issues Detected
        </h2>
        <div className="space-y-3">
          {insights.issues.map((issue) => (
            <div
              key={issue.id}
              className={`rounded-lg p-4 border-l-4 ${
                issue.severity === 'critical'
                  ? 'border-l-red-500 bg-red-50 dark:bg-red-500/10'
                  : 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-500/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{issue.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{issue.description}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  issue.severity === 'critical'
                    ? 'bg-red-200 dark:bg-red-500/30 text-red-700 dark:text-red-300'
                    : 'bg-yellow-200 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {issue.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{issue.time}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Suggested Solutions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-blue-500 dark:text-blue-400" />
          Suggested Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.solutions.map((solution) => (
            <div
              key={solution.id}
              className="rounded-lg p-4 border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{solution.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{solution.description}</p>
              <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-3 hover:underline">
                {solution.action}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Future Recommendations</h2>
        <div className="space-y-3">
          {insights.recommendations.map((rec) => (
            <div key={rec.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30 smooth-transition">
              <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{rec.id}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{rec.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Export Data</h3>
        <div className="flex gap-3 flex-wrap">
          {['CSV', 'JSON', 'PDF'].map((format) => (
            <button
              key={format}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 text-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 smooth-transition flex items-center gap-2"
            >
              <Download size={16} />
              Export as {format}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
