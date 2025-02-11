'use client'

import { useEffect, useRef } from 'react'

export default function GrainEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Set canvas size to match window size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Animation variables
    let frame = 0
    const patternSize = 70 // Smaller pattern size for finer grain
    const fps = 24 // Lower FPS for better performance while maintaining effect
    const interval = 1000 / fps
    let lastTime = 0
    
    // Create noise pattern
    const createNoise = () => {
      const imageData = ctx.createImageData(patternSize, patternSize)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        
        data[i] = value     // r
        data[i + 1] = value // g
        data[i + 2] = value // b
        data[i + 3] = 20    // Reduced alpha for subtler grain
      }
      
      return imageData
    }

    // Pre-generate some noise patterns for performance
    const noisePatterns = Array.from({ length: 3 }, () => createNoise())

    // Animation loop
    const animate = (currentTime: number) => {
      frame = requestAnimationFrame(animate)

      // Throttle to target FPS
      if (currentTime - lastTime < interval) return
      lastTime = currentTime

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Use a random pre-generated pattern
      const pattern = noisePatterns[Math.floor(Math.random() * noisePatterns.length)]
      
      // Offset pattern based on time for subtle movement
      const offset = (Date.now() / 1000) * 2 // Slower movement
      
      // Fill canvas with repeating pattern
      for (let x = 0; x < canvas.width; x += patternSize) {
        for (let y = 0; y < canvas.height; y += patternSize) {
          ctx.putImageData(
            pattern, 
            x + Math.sin(offset + y * 0.05) * 1.5, // Reduced movement
            y + Math.cos(offset + x * 0.05) * 1.5
          )
        }
      }
    }

    // Start animation
    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen object-cover pointer-events-none opacity-30 mix-blend-overlay"
      style={{ 
        zIndex: 2,
        transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
      }}
    />
  )
}
