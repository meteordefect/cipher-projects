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
      <AnimatePresence mode="wait">
        {!isInitialLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
