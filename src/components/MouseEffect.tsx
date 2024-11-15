// src/components/MouseEffect.tsx
'use client'

import { useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function MouseEffect() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 100 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      // Convert mouse position to percentage (-20 to 20)
      const xPercent = ((e.clientX / screenWidth) - 0.5) * 40
      const yPercent = ((e.clientY / screenHeight) - 0.5) * 40
      
      mouseX.set(xPercent)
      mouseY.set(yPercent)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div 
      className="fixed inset-0 -z-5 opacity-50 pointer-events-none"
      style={{
        background: 'radial-gradient(circle at center, rgba(0,102,204,0.15), transparent 50%)',
        x,
        y,
      }}
    />
  )
}