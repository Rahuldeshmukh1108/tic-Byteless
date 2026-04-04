'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const HydroponicGraph = () => {
  const pathData = "M62 300 L125 275 L187 225 L250 175 L312 125 L375 100 L437 75";
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full h-full"
    >
      <div className="w-full h-full flex items-center justify-center">
        <div className="p-4">
          <svg width="500" height="400" viewBox="0 0 500 400" className="rounded-lg">
            <defs>
              <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#9ca3af" strokeWidth="0.5"/>
              </pattern>
              <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <text x="250" y="25" textAnchor="middle" className="text-lg font-semibold fill-gray-300">Hydroponic Yield Growth</text>
            <text x="250" y="45" textAnchor="middle" className="text-sm fill-gray-400">Projected growth over 6 weeks</text>
            <line x1="62" y1="300" x2="437" y2="300" stroke="#374151" strokeWidth="2" />
            <line x1="62" y1="300" x2="62" y2="50" stroke="#374151" strokeWidth="2" />
            {/* Y-axis ticks and labels */}
            <line x1="60" y1="300" x2="64" y2="300" stroke="#374151" strokeWidth="1" />
            <text x="50" y="305" textAnchor="middle" className="text-xs fill-gray-400">0%</text>
            <line x1="60" y1="250" x2="64" y2="250" stroke="#374151" strokeWidth="1" />
            <text x="50" y="255" textAnchor="middle" className="text-xs fill-gray-400">25%</text>
            <line x1="60" y1="200" x2="64" y2="200" stroke="#374151" strokeWidth="1" />
            <text x="50" y="205" textAnchor="middle" className="text-xs fill-gray-400">50%</text>
            <line x1="60" y1="150" x2="64" y2="150" stroke="#374151" strokeWidth="1" />
            <text x="50" y="155" textAnchor="middle" className="text-xs fill-gray-400">75%</text>
            <line x1="60" y1="100" x2="64" y2="100" stroke="#374151" strokeWidth="1" />
            <text x="50" y="105" textAnchor="middle" className="text-xs fill-gray-400">100%</text>
            {/* X-axis ticks and labels */}
            <line x1="62" y1="302" x2="62" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="62" y="320" textAnchor="middle" className="text-xs fill-gray-400">0</text>
            <line x1="125" y1="302" x2="125" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="125" y="320" textAnchor="middle" className="text-xs fill-gray-400">7</text>
            <line x1="187" y1="302" x2="187" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="187" y="320" textAnchor="middle" className="text-xs fill-gray-400">14</text>
            <line x1="250" y1="302" x2="250" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="250" y="320" textAnchor="middle" className="text-xs fill-gray-400">21</text>
            <line x1="312" y1="302" x2="312" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="312" y="320" textAnchor="middle" className="text-xs fill-gray-400">28</text>
            <line x1="375" y1="302" x2="375" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="375" y="320" textAnchor="middle" className="text-xs fill-gray-400">35</text>
            <line x1="437" y1="302" x2="437" y2="298" stroke="#374151" strokeWidth="1" />
            <text x="437" y="320" textAnchor="middle" className="text-xs fill-gray-400">42</text>
            <text x="250" y="360" textAnchor="middle" className="text-sm fill-gray-400">Days</text>
            <text x="25" y="175" textAnchor="middle" className="text-sm fill-gray-400" transform="rotate(-90 25 175)">Yield (%)</text>
            <motion.path
              d={pathData}
              stroke="url(#traceGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4.5,
                ease: "easeInOut",
                times: [0, 0.6, 0.82, 1],
                repeat: Infinity,
                repeatDelay: 0.4,
              }}
            />
            <motion.circle
              r="8"
              fill="url(#traceGradient)"
              filter="url(#glow)"
              initial={{ offsetDistance: "0%", opacity: 0 }}
              animate={{
                offsetDistance: ["0%", "100%"],
                scale: [0.9, 1.35, 0.9],
                opacity: [0, 1, 0],
              }}
              transition={{
                offsetDistance: {
                  duration: 4.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.4,
                },
                scale: {
                  duration: 4.5,
                  ease: "easeInOut",
                  times: [0, 0.6, 1],
                  repeat: Infinity,
                  repeatDelay: 0.4,
                },
                opacity: {
                  duration: 4.5,
                  ease: "easeInOut",
                  times: [0, 0.12, 0.75],
                  repeat: Infinity,
                  repeatDelay: 0.4,
                },
              }}
              style={{ offsetPath: `path('${pathData}')` }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export function HeroSection() {
  return (
    <section className="relative isolate min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 px-4">
      {/* Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '25px 25px',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >


            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                Smart Farming <span className="gradient-text">Powered by AI</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-lg">
                Revolutionize your agricultural operations with real-time monitoring, intelligent automation, and data-driven decisions. Increase yields while reducing resource consumption.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 smooth-transition"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-cyan-500/50 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 smooth-transition"
              >
                View Dashboard
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {[
                { value: '50K+', label: 'Active Farms' },
                { value: '2M+', label: 'Acres Monitored' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-foreground/60">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hydroponic Graph */}
          <HydroponicGraph />
        </div>
      </div>
    </section>
  )
}
