'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

export default function CustomCursor() {
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Even faster spring config
  const springConfig = { 
    damping: 12,     // Further reduced for faster movement
    stiffness: 300,  // Increased for snappier response
    mass: 0.1,       // Further reduced for lighter feel
    restSpeed: 0.001
  }
  
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  useEffect(() => {
    setIsMounted(true)
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const updatePosition = useCallback((e: MouseEvent) => {
    if (document.hidden) return

    const offset = 12
    // Directly set position without requestAnimationFrame for faster response
    x.set(e.clientX - offset)
    y.set(e.clientY - offset)

    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (hoveredElement) {
      const isLink = hoveredElement.tagName === 'A' || 
                    hoveredElement.tagName === 'BUTTON' || 
                    hoveredElement.role === 'button'
      setIsHoveringLink(isLink)
    }
  }, [x, y])

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        x.set(0)
        y.set(0)
        setIsHoveringLink(false)
      }
    }

    const handleMouseLeave = () => {
      setIsHoveringLink(false)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [x, y])

  useEffect(() => {
    if (!isMounted || isTouchDevice) return
    
    window.addEventListener('mousemove', updatePosition, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', updatePosition)
      x.stop()
      y.stop()
      x.set(0)
      y.set(0)
      setIsHoveringLink(false)
    }
  }, [isMounted, updatePosition, isTouchDevice, x, y])

  if (!isMounted || isTouchDevice) return null

  return (
    <motion.div
      initial={false}
      className="fixed top-0 left-0 z-[100] pointer-events-none"
      style={{ 
        x, 
        y,
        transform: 'translate3d(0,0,0)',
        willChange: 'transform'
      }}
    >
      <motion.div
        initial={false}
        animate={{ 
          scale: isHoveringLink ? 1 : 1,
          opacity: 1
        }}
        style={{
          transformOrigin: 'center',
        }}
      >
        {isHoveringLink ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20"
            height="20" 
            viewBox="0 0 24 24"
          >
            <path 
              fill="#FFFFFF"
              stroke="#404040"
              strokeWidth="2"       
              d="m16.24 12 3.18-3.18a1.5 1.5 0 0 0 0-2.12L17.3 4.58a1.5 1.5 0 0 0-2.12 0L12 7.76 8.82 4.58a1.5 1.5 0 0 0-2.12 0L4.58 6.7a1.5 1.5 0 0 0 0 2.12L7.76 12l-3.18 3.18a1.5 1.5 0 0 0 0 2.12l2.12 2.12a1.5 1.5 0 0 0 2.12 0L12 16.24l3.18 3.18a1.5 1.5 0 0 0 2.12 0l2.12-2.12a1.5 1.5 0 0 0 0-2.12L16.24 12Z"
            />
          </svg>
        ) : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24"
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
    </motion.div>
  )
}