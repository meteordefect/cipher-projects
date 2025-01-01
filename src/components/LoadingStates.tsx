'use client'

import { motion } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

export function ComponentLoading() {
  const { isDark } = useBackground()

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <motion.div
        className={`w-6 h-6 border-2 border-t-transparent rounded-full
          ${isDark ? 'border-white' : 'border-black'}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export function PageLoading() {
  const { isDark } = useBackground()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className={`w-12 h-12 border-4 border-t-transparent rounded-full
          ${isDark ? 'border-white' : 'border-black'}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}