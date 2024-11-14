'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const letters = [
  '零', '壱', '弐', '参', '肆', '伍', '陸', '質', '捌', '玖',  
  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
  '⟨', '⟩', '⟪', '⟫', '⌈', '⌉', '⌊', '⌋', '∮', '∯',
  '†', '‡', '§', '¶', '©', '®', '™', '⁂', '⁕', '⁜',
]

interface MatrixSymbol {
  id: number;
  x: number;
  y: number;
  char: string;
  opacity: number;
}

function BackgroundMatrix() {
  const [isClient, setIsClient] = useState(false)
  const [symbols, setSymbols] = useState<MatrixSymbol[]>([])
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initialSymbols: MatrixSymbol[] = []
    const symbolCount = Math.floor((window.innerWidth * window.innerHeight) / 10000) * 2
    
    for (let i = 0; i < symbolCount; i++) {
      initialSymbols.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        char: letters[Math.floor(Math.random() * letters.length)],
        opacity: Math.random() * 0.5 + 0.1
      })
    }
    setSymbols(initialSymbols)

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        setSymbols(prevSymbols => 
          prevSymbols.map(symbol => ({
            ...symbol,
            char: Math.random() < 0.15 ? letters[Math.floor(Math.random() * letters.length)] : symbol.char,
            opacity: Math.sin(time / 1000 + symbol.id) * 0.3 + 0.2
          }))
        )
      }
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isClient])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 overflow-hidden">
      {symbols.map(symbol => (
        <motion.div
          key={symbol.id}
          className="absolute text-2xl md:text-4xl text-white font-light pointer-events-none select-none"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            opacity: symbol.opacity
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }} // Faster scale animation
        >
          {symbol.char}
        </motion.div>
      ))}
    </div>
  )
}

export default function CipherLoading() {
    const [isVisible, setIsVisible] = useState(true)
    const { setIsDark, setIsInitialLoading } = useBackground()
    const pathname = usePathname()
  
    useEffect(() => {
      // Force dark mode during loading
      setIsDark(true)
      
      const timeout = setTimeout(() => {
        setIsVisible(false)
        setIsInitialLoading(false)
        // Only maintain dark mode after loading if we're on the homepage
        if (pathname === '/') {
          setIsDark(true)
        } else {
          setIsDark(false)
        }
      }, 1500)
  
      return () => {
        clearTimeout(timeout)
        // Ensure we maintain the correct state on cleanup
        if (pathname === '/') {
          setIsDark(true)
        }
      }
    }, [setIsDark, setIsInitialLoading, pathname])
    
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <BackgroundMatrix />
            <motion.div 
              className="relative z-10 w-64 md:w-96"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            >
              <div className="relative w-full aspect-[3/1]">
                <Image
                  src="/white-logo.png"
                  alt="Cipher Projects"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}