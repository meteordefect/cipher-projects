'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useBackground } from '@/context/BackgroundContext'
import { usePathname } from 'next/navigation'

export default function LoadingTransition() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const { setIsDark, setIsInitialLoading } = useBackground()
  const pathname = usePathname()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const frameRef = useRef<number>(0)

  // Handle dark mode and loading state
  useEffect(() => {
    setIsDark(true)
    const timeout = setTimeout(() => {
      setIsVisible(false)
      setIsInitialLoading(false)
      if (pathname !== '/') {
        setIsDark(false)
      }
    }, 2000) // Total animation duration

    return () => {
      clearTimeout(timeout)
      if (pathname === '/') {
        setIsDark(true)
      }
    }
  }, [setIsDark, setIsInitialLoading, pathname])

  // Handle background image animation
  useEffect(() => {
    const img = new window.Image()
    img.onload = () => {
      setImageLoaded(true)
      imageRef.current = img
    }
    img.src = '/mood-office-optimized.jpg'
    
    return () => {
      img.onload = null
    }
  }, [])

  // Canvas animation for background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.scale(dpr, dpr)
    }
    resize()

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resize, 100)
    }
    window.addEventListener('resize', handleResize)

    const draw = () => {
      if (!canvas || !ctx || !imageRef.current) return

      const image = imageRef.current
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const imageAspect = image.width / image.height

      const renderHeight = windowHeight
      const renderWidth = windowHeight * imageAspect
      const offsetX = (windowWidth - renderWidth) / 2
      const offsetY = 0

      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.drawImage(
        image,
        offsetX, offsetY,
        renderWidth, renderHeight
      )

      frameRef.current = requestAnimationFrame(draw)
    }

    if (imageLoaded) {
      frameRef.current = requestAnimationFrame(draw)
    }

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (resizeTimeout) clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [imageLoaded])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }
          }}
        >
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <canvas
              ref={canvasRef}
              className="fixed inset-0 w-screen h-screen object-cover pointer-events-none"
              style={{ 
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                perspective: 1000,
              }}
            />
          </motion.div>

          {/* Logo */}
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96]
            }}
          >
            <div className="relative w-48 md:w-72 aspect-[3/1]">
              <Image
                src="/white-logo.png"
                alt="Cipher Projects"
                fill
                sizes="(max-width: 768px) 192px, 288px"
                priority
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Flash Effect */}
          <motion.div
            className="absolute inset-0 bg-white mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 0.3,
              delay: 1.2,
              ease: "easeOut",
              times: [0, 0.5, 1]
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
