'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left'
}

export default function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up'
}: AnimatedSectionProps) {
  const initial = direction === 'up' 
    ? { opacity: 0, y: 20 }
    : { opacity: 0, x: -20 }
    
  const animate = direction === 'up'
    ? { opacity: 1, y: 0 }
    : { opacity: 1, x: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
