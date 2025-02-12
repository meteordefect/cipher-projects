'use client'

import { useBackground } from '@/context/BackgroundContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const { isInitialLoading, isDark } = useBackground()

  return (
    <>
      {/* Background layer */}
      <div 
        className={`fixed inset-0 -z-10 transition-colors duration-300 ${isDark ? 'bg-black' : 'bg-white'}`}
      />
      
      {/* Content layer */}
      {/* Temporarily disabled fade-in animation */}
      {!isInitialLoading && (
        <div>
          {children}
        </div>
      )}
    </>
  )
}
