'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function DarkMoodImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const hasFlickeredRef = useRef(false)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const maxLoadTimeRef = useRef<NodeJS.Timeout | null>(null)

  // Preload image with error handling and timeout
  useEffect(() => {
    const img = new window.Image()
    
    const handleLoad = () => {
      if (maxLoadTimeRef.current) {
        clearTimeout(maxLoadTimeRef.current)
      }
      setImageLoaded(true)
      // Small delay to ensure browser has fully processed the image
      setTimeout(() => {
        startTimeRef.current = Date.now()
        imageRef.current = img
      }, 50)
    }

    const handleError = () => {
      console.error('Failed to load image')
      setImageError(true)
    }

    // Set a maximum load time for Safari
    maxLoadTimeRef.current = setTimeout(() => {
      if (!imageLoaded) {
        handleLoad() // Force start if taking too long
      }
    }, 2000)

    img.onload = handleLoad
    img.onerror = handleError
    
    // Force CORS mode and cache control
    img.crossOrigin = 'anonymous'
    const cacheBuster = `?v=${Date.now()}`
    img.src = `/mood-office-optimized.jpg${cacheBuster}`
    
    return () => {
      if (maxLoadTimeRef.current) {
        clearTimeout(maxLoadTimeRef.current)
      }
      img.onload = null
      img.onerror = null
    }
  }, [imageLoaded])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return

    const ctx = canvas.getContext('2d', { 
      willReadFrequently: true,
      alpha: false // Optimize for non-transparent canvas
    })
    if (!ctx) return

    // Set canvas size with performance optimizations
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const displayWidth = window.innerWidth
      const displayHeight = window.innerHeight
      
      // Set logical size
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      
      // Set actual size with DPR
      canvas.width = Math.round(displayWidth * dpr)
      canvas.height = Math.round(displayHeight * dpr)
      
      // Scale context
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

      const INITIAL_DELAY = 0.8
      const FADE_DURATION = 2.5
      const ZOOM_DURATION = 3.0 // Longer zoom duration for subtlety
      
      const fadeStart = elapsed - INITIAL_DELAY
      
      // Clear canvas
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Base dimensions
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imageAspect = image.width / image.height

      // Calculate base render dimensions to cover the screen
      let renderWidth, renderHeight
      if (windowWidth / windowHeight > imageAspect) {
        renderWidth = windowWidth
        renderHeight = windowWidth / imageAspect
      } else {
        renderHeight = windowHeight
        renderWidth = windowHeight * imageAspect
      }

      // Enhanced zoom effect
      const ZOOM_START = 1.0
      const ZOOM_END = 1.08 // Subtle zoom amount
      
      // Calculate zoom progress with easing
      const zoomProgress = Math.min(Math.max(0, fadeStart / ZOOM_DURATION), 1)
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const currentZoom = ZOOM_START + (easeOutCubic(zoomProgress) * (ZOOM_END - ZOOM_START))
      
      // Apply zoom from center
      const scaledWidth = renderWidth * currentZoom
      const scaledHeight = renderHeight * currentZoom
      
      // Center the scaled image
      const offsetX = (windowWidth - scaledWidth) / 2
      const offsetY = (windowHeight - scaledHeight) / 2

      // Calculate opacity
      let opacity = fadeStart < 0 ? 0 : Math.min(fadeStart / FADE_DURATION, 0.68)
      opacity = easeOutCubic(opacity)
      
      // Flicker effect
      if (fadeStart > 0.2 && fadeStart < 0.3 && !hasFlickeredRef.current) {
        opacity = 1.2
        hasFlickeredRef.current = true
      }

      // Slower pulse
      const pulse = Math.sin(elapsed * 1.2) * 0.02
      opacity = Math.max(0, Math.min(1, opacity + pulse))

      // Draw image
      ctx.globalAlpha = opacity
      ctx.drawImage(
        image,
        offsetX, offsetY,
        scaledWidth, scaledHeight
      )
      
      // Overlay
      const overlayOpacity = 0.45 + Math.sin(elapsed * 1.5) * 0.05
      ctx.fillStyle = `rgba(2, 4, 8, ${overlayOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Grain effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const step = 2
      
      // Dynamic grain intensity
      const MAX_NOISE = 35
      const MIN_NOISE = 15
      const grainProgress = Math.min(fadeStart / (FADE_DURATION * 1.5), 1)
      const noiseRange = MAX_NOISE - (grainProgress * (MAX_NOISE - MIN_NOISE))
      
      for (let i = 0; i < data.length; i += (4 * step)) {
        const baseNoise = (Math.random() - 0.5) * noiseRange
        const noiseIntensity = 1 + Math.sin(elapsed * 1.5) * 0.1
        const noise = baseNoise * noiseIntensity
        
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = data[i]
        data[i + 2] = data[i]
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      frameRef.current = requestAnimationFrame(draw)
    }

    // Start animation only when image is loaded
    if (imageLoaded) {
      frameRef.current = requestAnimationFrame(draw)
    }

    // Enhanced cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      window.removeEventListener('resize', handleResize)
      if (imageRef.current) {
        imageRef.current.src = ''
      }
    }
  }, [imageLoaded]) // Only re-run effect when image loads

  return (
    <>
      {/* Fallback for errors */}
      {imageError && (
        <Image 
          src="/mood-office-optimized.jpg"
          alt=""
          width={1920}
          height={1080}
          priority
          className="fixed inset-0 w-screen h-screen object-cover"
          style={{ zIndex: -1 }}
        />
      )}
      {/* Loading indicator */}
      {!imageLoaded && !imageError && (
        <div className="fixed inset-0 bg-black z-[-1]" />
      )}
      {/* Hidden preload image */}
      <Image 
        src="/mood-office-optimized.jpg"
        alt=""
        width={1920}
        height={1080}
        priority
        className="hidden"
      />
      {/* Canvas for animation */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{ 
          zIndex: -1,
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: 1000,
        }}
      />
    </>
  )
}
