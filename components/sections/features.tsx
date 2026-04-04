'use client'

import { motion } from 'framer-motion'
import { GlassmorphismCard } from '@/components/glassmorphism-card'
import { Droplet, Lightbulb, Wind, BarChart3 } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Droplet,
      title: 'Smart Irrigation',
      description:
        'AI-powered irrigation system that learns your soil conditions and adjusts water delivery automatically.',
      gradient: 'from-blue-400 to-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'Auto Lighting',
      description:
        'Intelligent grow lights that optimize spectrum and duration based on crop stage and weather.',
      gradient: 'from-yellow-400 to-orange-600',
    },
    {
      icon: Wind,
      title: 'Climate Control',
      description:
        'Automated temperature and humidity management maintaining ideal growing conditions.',
      gradient: 'from-cyan-400 to-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Real-time Monitoring',
      description:
        'Comprehensive dashboard showing soil health, water usage, crop growth, and weather impact.',
      gradient: 'from-green-400 to-green-600',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section id="features" className="py-16 sm:py-24 px-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Powerful Features for <span className="gradient-text">Modern Farming</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Complete automation and monitoring suite designed specifically for agricultural excellence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <GlassmorphismCard key={feature.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 mb-4 flex items-center justify-center`}
                >
                  <Icon className="text-white" size={24} />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{feature.description}</p>
              </GlassmorphismCard>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
