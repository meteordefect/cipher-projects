'use client'

import { ReactNode, useEffect } from 'react'
import { useScroll, useSpring, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    if (window) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [pathname])

  return (
    <motion.div
      style={{
        y: scaleX,
      }}
      transition={{
        duration: 1.2,
        ease: [0.32, 0.72, 0, 1]
      }}
    >
      {children}
    </motion.div>
  )
}
