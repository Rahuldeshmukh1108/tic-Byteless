'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Leaf, Zap } from 'lucide-react'

export function BenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Yield',
      metrics: [
        { label: 'Higher Output', value: '+45%' },
        { label: 'Better Quality', value: '+32%' },
        { label: 'Faster Growth', value: '+28%' },
      ],
      description: 'Optimize every aspect of your growing environment to maximize production.',
      gradient: 'from-green-400 to-emerald-600',
    },
    {
      icon: Leaf,
      title: 'Save Water',
      metrics: [
        { label: 'Water Saved', value: '-60%' },
        { label: 'Cost Reduction', value: '-50%' },
        { label: 'Runoff Eliminated', value: '-95%' },
      ],
      description: 'Intelligent irrigation reduces waste and preserves precious resources.',
      gradient: 'from-blue-400 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Fully Automated',
      metrics: [
        { label: 'Labor Reduced', value: '-70%' },
        { label: 'Manual Work', value: '-90%' },
        { label: 'Consistency', value: '100%' },
      ],
      description: 'Hands-free operation with 24/7 monitoring and automatic adjustments.',
      gradient: 'from-yellow-400 to-orange-600',
    },
  ]

  return (
    <section id="benefits" className="py-16 sm:py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Measurable Impact on Your <span className="gradient-text">Bottom Line</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Real results from real farms using HydroSync technology.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="glassmorphism p-8 space-y-6"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.gradient} p-4 flex items-center justify-center`}
                >
                  <Icon className="text-white" size={32} />
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground">{benefit.title}</h3>

                {/* Metrics */}
                <div className="space-y-3">
                  {benefit.metrics.map((metric) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-foreground/70">{metric.label}</span>
                      <span className="text-lg font-bold gradient-text">{metric.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Description */}
                <p className="text-foreground/70 leading-relaxed pt-4 border-t border-white/10">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
