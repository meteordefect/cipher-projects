'use client'

import { useEffect, useRef } from 'react'

export default function DarkMoodImage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Load image
    const image = new Image()
    imageRef.current = image
    let frame = 0
    let startTime = 0
    let hasFlickered = false
    let isImageLoaded = false

    image.onload = () => {
      isImageLoaded = true
      startTime = Date.now()
    }
    image.src = '/mood-office-optimized.jpg'

    const draw = () => {
      frame = requestAnimationFrame(draw)

      if (!canvas || !ctx || !isImageLoaded) return

      // Clear canvas with pure black
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!isImageLoaded) return

      const elapsed = (Date.now() - startTime) / 1000

      // Height-first scaling calculation for all devices
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imageAspect = image.width / image.height

      // Always set height to 100% viewport height
      let renderHeight = windowHeight
      // Calculate width to maintain aspect ratio
      let renderWidth = windowHeight * imageAspect
      // Center horizontally
      let offsetX = (windowWidth - renderWidth) / 2
      let offsetY = 0

      // Add extra scale for safety
      const safetyScale = 1.1
      renderWidth *= safetyScale
      renderHeight *= safetyScale
      offsetX -= (renderWidth * (safetyScale - 1)) / 2
      offsetY -= (renderHeight * (safetyScale - 1)) / 2

      // Calculate opacity with effects
      let opacity = Math.min((elapsed - 0.2) / 1.8, 0.68)
      
      // Dramatic color flicker at start
      if (elapsed > 0.1 && elapsed < 0.15 && !hasFlickered) {
        opacity = 1.2
        hasFlickered = true
      }

      // Add subtle pulse to the opacity
      const pulse = Math.sin(elapsed * 2) * 0.03
      opacity = Math.max(0, Math.min(1, opacity + pulse))

      // Draw the scaled image
      ctx.globalAlpha = opacity
      ctx.drawImage(
        image,
        offsetX, offsetY,
        renderWidth, renderHeight
      )
      
      // Add a dark blue overlay for mood with subtle variation
      const overlayOpacity = 0.45 + Math.sin(elapsed * 1.5) * 0.05 // Subtle breathing effect
      ctx.fillStyle = `rgba(2, 4, 8, ${overlayOpacity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add grain effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        // Dynamic grain intensity based on time
        const baseNoise = (Math.random() - 0.5) * 35
        const noiseIntensity = 1 + Math.sin(elapsed * 3) * 0.15 // Pulsing grain effect
        const noise = baseNoise * noiseIntensity
        data[i] = Math.min(255, Math.max(0, data[i] + noise))     // r
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)) // g
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)) // b
      }
      
      ctx.putImageData(imageData, 0, 0)
    }

    // Start animation
    draw()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
      if (imageRef.current) {
        imageRef.current.src = ''
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
      style={{ 
        zIndex: -1,
        transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
      }}
    />
  )
}
