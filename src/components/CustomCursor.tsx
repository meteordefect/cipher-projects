'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

export default function CustomCursor() {
  const { isDark } = useBackground()
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const springConfig = { 
    damping: 25, 
    stiffness: 250, 
    mass: 0.5,
    restDelta: 0.001 
  }
  
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  const checkIfLink = useCallback((element: HTMLElement) => {
    return (
      element.tagName === 'A' ||
      element.tagName === 'BUTTON' ||
      element.role === 'button' ||
      element.hasAttribute('href')
    )
  }, [])

  const updatePosition = useCallback((e: MouseEvent) => {
    // Adjust offset for smaller cursor size
    const offset = isHoveringLink ? 14 : 12
    x.set(e.clientX - offset)
    y.set(e.clientY - offset)

    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY)
    if (hoveredElement) {
      const isLink = hoveredElement instanceof HTMLElement && checkIfLink(hoveredElement)
      setIsHoveringLink(isLink)
    }
  }, [x, y, checkIfLink, isHoveringLink])

  useEffect(() => {
    if (isTouchDevice) return

    window.addEventListener('mousemove', updatePosition, { passive: true })
    return () => {
      window.removeEventListener('mousemove', updatePosition)
    }
  }, [updatePosition, isTouchDevice])

  if (isTouchDevice) return null

  return (
    <motion.div
      className="fixed top-0 left-0 z-[100] pointer-events-none will-change-transform"
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
                xmlns="http://www.w3.org/2000/svg" 
                width="20"   // Keeping the smaller size we had before
                height="20" 
                viewBox="0 0 24 24"
                style={{ transform: 'translateZ(0)' }}
              >
                <path 
                  fill="#FFFFFF"        // White fill
                  stroke="#404040"      // Light gray stroke, using our previous color
                  strokeWidth="2"       
                  d="m16.24 12 3.18-3.18a1.5 1.5 0 0 0 0-2.12L17.3 4.58a1.5 1.5 0 0 0-2.12 0L12 7.76 8.82 4.58a1.5 1.5 0 0 0-2.12 0L4.58 6.7a1.5 1.5 0 0 0 0 2.12L7.76 12l-3.18 3.18a1.5 1.5 0 0 0 0 2.12l2.12 2.12a1.5 1.5 0 0 0 2.12 0L12 16.24l3.18 3.18a1.5 1.5 0 0 0 2.12 0l2.12-2.12a1.5 1.5 0 0 0 0-2.12L16.24 12Z"
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
            fill="#ffffff" 
            stroke="#404040" 
            strokeWidth="1.5"
          />
        </svg>
      )}
    </motion.div>
  )
}