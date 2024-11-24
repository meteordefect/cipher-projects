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
              width="20" 
              height="20" 
              viewBox="0 0 20 20"
              style={{ transform: 'translateZ(0)' }}
            >
              <path 
                fill="none" 
                stroke="#808080"
                strokeLinecap="round" 
                strokeWidth="2" 
                d="M2 2 18 18M18 2 2 18"  // Adjusted coordinates to fit 20x20 viewBox
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
            strokeWidth="2.5"
          />
        </svg>
      )}
    </motion.div>
  )
}