'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AnimatedDashboard } from '@/components/animated-dashboard'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full w-fit"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-cyan-400">Live & Ready for Production</span>
            </motion.div>

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

          {/* Right Content - Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <AnimatedDashboard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
