'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import DarkMoodImage from './GrainyBlob'
import GrainEffect from './GrainEffect'

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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          >
            {/* Background container */}
            <div className="absolute inset-0 w-full h-full">
              <DarkMoodImage />
              <GrainEffect />
            </div>
            
            {/* Logo container */}
            <motion.div
              className="relative z-[103] h-full w-full flex items-center justify-center"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.2,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            >
              <div className="relative w-48 md:w-72 h-full max-h-screen flex items-center justify-center">
                <div className="relative w-full aspect-[3/1]">
                  <Image
                    src="/white-logo.png"
                    alt="Cipher Projects"
                    fill
                    sizes="(max-width: 768px) 192px, 288px"
                    priority
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}
