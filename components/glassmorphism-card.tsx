'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hoverEffect?: boolean
}

export function GlassmorphismCard({
  children,
  className = '',
  delay = 0,
  hoverEffect = true,
}: GlassmorphismCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { y: -8, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.2)' } : {}}
      className={`glassmorphism p-6 sm:p-8 smooth-transition ${className}`}
    >
      {children}
    </motion.div>
  )
}
