'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

export default function CustomCursor() {
  const { isDark } = useBackground()
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Detect if the device is touch-based
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  // Optimized spring config
  const springConfig = { 
    damping: 25, 
    stiffness: 250, 
    mass: 0.5,
    restDelta: 0.001 
  }
  
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  // Memoize the link hover check
  const checkIfLink = useCallback((element: HTMLElement) => {
    return (
      element.tagName === 'A' ||
      element.tagName === 'BUTTON' ||
      element.role === 'button' ||
      element.hasAttribute('href')
    )
  }, [])

  // Memoize position update
  const updatePosition = useCallback((e: MouseEvent) => {
    x.set(e.clientX - 12)
    y.set(e.clientY - 12)

    // Check for link hover
    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
    if (hoveredElement) {
      const isLink = hoveredElement instanceof HTMLElement && checkIfLink(hoveredElement)
      setIsHoveringLink(isLink)
    }
  }, [x, y, checkIfLink])

  useEffect(() => {
    if (isTouchDevice) return

    window.addEventListener('mousemove', updatePosition, { passive: true })
    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [updatePosition, isTouchDevice])

  // Disable rendering on touch devices
  if (isTouchDevice) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none mix-blend-difference will-change-transform"
      style={{ 
        x, 
        y,
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: 1000,
        WebkitTransform: 'translate3d(0,0,0)',
      }}
    >
      {isHoveringLink ? (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
          style={{ transform: 'translateZ(0)' }}
        >
          <path 
            d="m16.24 12 3.18-3.18a1.5 1.5 0 0 0 0-2.12L17.3 4.58a1.5 1.5 0 0 0-2.12 0L12 7.76 8.82 4.58a1.5 1.5 0 0 0-2.12 0L4.58 6.7a1.5 1.5 0 0 0 0 2.12L7.76 12l-3.18 3.18a1.5 1.5 0 0 0 0 2.12l2.12 2.12a1.5 1.5 0 0 0 2.12 0L12 16.24l3.18 3.18a1.5 1.5 0 0 0 2.12 0l2.12-2.12a1.5 1.5 0 0 0 0-2.12L16.24 12Z"
            fill={isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'} 
            stroke={isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.9)'}
            strokeWidth="1"
          />
        </svg>
      ) : (
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
          style={{ transform: 'translateZ(0)' }}
        >
          <circle 
            cx="12" 
            cy="12" 
            r="6" 
            fill={isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'} 
            stroke={isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.9)'}
            strokeWidth="1.5"
          />
        </svg>
      )}
    </motion.div>
  )
}
