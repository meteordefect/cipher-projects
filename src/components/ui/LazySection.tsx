'use client'

import { Suspense, lazy, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface LazySectionProps {
  children: ReactNode;
}

// Wrapper component that adds motion and suspense
export default function LazySection({ children }: LazySectionProps) {
  return (
    <Suspense fallback={<div className="min-h-[200px] animate-pulse bg-gray-100 rounded-lg" />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </Suspense>
  )
}
