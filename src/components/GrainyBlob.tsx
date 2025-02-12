'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function DarkMoodImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const frameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(0)
  const hasFlickeredRef = useRef(false)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Preload image using Next.js Image
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setImageLoaded(true)
      startTimeRef.current = Date.now()
      // Create a mutable ref
      imageRef.current = img
    }
    img.src = '/mood-office-optimized.jpg'
    // Explicitly set crossOrigin to anonymous for better browser compatibility
    img.crossOrigin = 'anonymous'
    
    return () => {
      img.onload = null
    }
  }, [])

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

      // Clear canvas with pure black using fillRect for better performance
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Height-first scaling calculation for all devices
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imageAspect = image.width / image.height

      // Calculate dimensions once per frame
      const renderHeight = windowHeight
      const renderWidth = windowHeight * imageAspect
      const offsetX = (windowWidth - renderWidth) / 2
      const offsetY = 0

      // Add extra scale for safety
      const safetyScale = 1.1
      const finalWidth = renderWidth * safetyScale
      const finalHeight = renderHeight * safetyScale
      const finalOffsetX = offsetX - (renderWidth * (safetyScale - 1)) / 2
      const finalOffsetY = offsetY - (renderHeight * (safetyScale - 1)) / 2

      // Optimize opacity calculations
      let opacity = Math.min((elapsed - 0.2) / 1.8, 0.68)
      
      // Dramatic color flicker at start
      if (elapsed > 0.1 && elapsed < 0.15 && !hasFlickeredRef.current) {
        opacity = 1.2
        hasFlickeredRef.current = true
      }

      // Optimize pulse calculation
      const pulse = Math.sin(elapsed * 2) * 0.03
      opacity = Math.max(0, Math.min(1, opacity + pulse))

      // Draw the scaled image with optimized opacity
      ctx.globalAlpha = opacity
      ctx.drawImage(
        image,
        finalOffsetX, finalOffsetY,
        finalWidth, finalHeight
      )
      
      // Optimize overlay
      const overlayOpacity = 0.45 + Math.sin(elapsed * 1.5) * 0.05
      ctx.fillStyle = `rgba(2, 4, 8, ${overlayOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Optimize grain effect by processing fewer pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const step = 2 // Process every other pixel for better performance
      
      for (let i = 0; i < data.length; i += (4 * step)) {
        const baseNoise = (Math.random() - 0.5) * 35
        const noiseIntensity = 1 + Math.sin(elapsed * 3) * 0.15
        const noise = baseNoise * noiseIntensity
        
        // Apply same noise to RGB channels for better performance
        data[i] = Math.min(255, Math.max(0, data[i] + noise))
        data[i + 1] = data[i]
        data[i + 2] = data[i]
      }
      
      ctx.putImageData(imageData, 0, 0)
      
      // Request next frame
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
      {/* Hidden Next.js Image component for preloading */}
      <Image 
        src="/mood-office-optimized.jpg"
        alt=""
        width={1920}
        height={1080}
        priority
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
        style={{ 
          zIndex: -1,
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
          backfaceVisibility: 'hidden', // Additional GPU optimization
          perspective: 1000, // Improve performance for transforms
        }}
      />
    </>
  )
}
