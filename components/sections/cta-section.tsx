'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          {/* Heading */}
          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Ready to <span className="gradient-text">Transform Your Farm?</span>
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Join thousands of farmers worldwide who are increasing yields, saving water, and reducing costs with HydroSync.
            </p>
          </div>

          {/* Stats Before CTA */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {[
              { value: '30 days', label: 'Free Trial' },
              { value: '24/7', label: 'Support' },
              { value: '∞', label: 'Integrations' },
              { value: '100%', label: 'Satisfaction' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="glassmorphism p-4 space-y-1"
              >
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/50 smooth-transition text-lg"
              >
                Start Your Free Trial
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-foreground font-semibold rounded-lg hover:bg-white/5 smooth-transition text-lg"
              >
                Schedule Demo
              </Link>
            </motion.div>
          </div>

          {/* Footer Text */}
          <p className="text-sm text-foreground/60 pt-4">
            No credit card required • Setup takes 5 minutes • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}
