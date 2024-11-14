'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

export default function ColorTransition() {
  const { isDark } = useBackground()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Main background */}
      <motion.div 
        className="fixed inset-0 -z-20"
        animate={{
          backgroundColor: isDark ? '#000000' : '#ffffff'
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      />

      {/* Gradient overlay */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 -z-20 bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Theme transition flash */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 -z-20 bg-gradient-radial from-black/20 to-transparent pointer-events-none"
          />
        ) : (
          <motion.div
            key="light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 -z-20 bg-gradient-radial from-white/40 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>
    </>
  )
}