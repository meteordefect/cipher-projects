'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function IntroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const hasFlickeredRef = useRef(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Preload image
  useEffect(() => {
    const img = new window.Image()
    
    img.onload = () => {
      setImageLoaded(true)
      startTimeRef.current = Date.now()
      imageRef.current = img
    }

    img.onerror = (e) => {
      console.error('Failed to load image:', e)
    }

    img.src = '/mood-office-optimized.jpg'
    
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size with performance optimizations
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const displayWidth = window.innerWidth
      const displayHeight = window.innerHeight
      
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      
      canvas.width = Math.round(displayWidth * dpr)
      canvas.height = Math.round(displayHeight * dpr)
      
      ctx.scale(dpr, dpr)
    }
    resize()

    // Throttled resize listener
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resize, 100)
    }
    window.addEventListener('resize', handleResize)

    const draw = () => {
      if (!canvas || !ctx || !imageRef.current) return
      
      const image = imageRef.current
      const elapsed = (Date.now() - startTimeRef.current) / 1000

      // Animation timing
      const INITIAL_DELAY = 0.5  // Shorter initial delay
      const FADE_DURATION = 2.0  // Faster fade in
      const fadeStart = elapsed - INITIAL_DELAY
      
      // Clear canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Calculate dimensions to maintain aspect ratio and full height
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imageAspect = image.width / image.height

      // Always fit height, adjust width accordingly
      const renderHeight = windowHeight
      const renderWidth = windowHeight * imageAspect
      const offsetX = (windowWidth - renderWidth) / 2
      const offsetY = 0

      // Calculate opacity with smooth fade
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      let opacity = fadeStart < 0 ? 0 : Math.min(fadeStart / FADE_DURATION, 1)
      opacity = easeOutCubic(opacity)

      // Flicker effect
      if (fadeStart > 0.2 && fadeStart < 0.25) {
        opacity = 1.2 // Bright flash
      } else if (fadeStart > 0.3 && fadeStart < 0.32) {
        opacity = 0.4 // Quick dim
      } else if (fadeStart > 0.32 && fadeStart < 0.4 && !hasFlickeredRef.current) {
        opacity = 1.0 // Final reveal
        hasFlickeredRef.current = true
      }

      // Draw image
      ctx.globalAlpha = opacity
      ctx.drawImage(
        image,
        offsetX, offsetY,
        renderWidth, renderHeight
      )
      
      // Request next frame
      frameRef.current = requestAnimationFrame(draw)
    }

    // Start animation when image is loaded
    if (imageLoaded) {
      frameRef.current = requestAnimationFrame(draw)
    }

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [imageLoaded])

  return (
    <>
      {/* Loading state */}
      {!imageLoaded && (
        <div className="fixed inset-0 bg-black z-[-1]" />
      )}
      {/* Canvas for animation */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{ 
          zIndex: -1,
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
      />
    </>
  )
}
