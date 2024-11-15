// src/app/loading.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion} from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'

const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+'
const gridSize = 8

const CipherLoading = () => {
  const { isDark } = useBackground()
  const [matrix, setMatrix] = useState<string[][]>([])

  useEffect(() => {
    // Initialize matrix
    const initialMatrix = Array(gridSize).fill(0).map(() => 
      Array(gridSize).fill('0')
    )
    setMatrix(initialMatrix)

    // Update random positions periodically
    const interval = setInterval(() => {
      setMatrix(prev => {
        const newMatrix = [...prev]
        // Update 5 random positions
        for (let i = 0; i < 5; i++) {
          const row = Math.floor(Math.random() * gridSize)
          const col = Math.floor(Math.random() * gridSize)
          newMatrix[row][col] = characters[Math.floor(Math.random() * characters.length)]
        }
        return newMatrix
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: isDark ? '#000000' : '#ffffff'
      }}
    >
      <div className="relative">
        {/* Matrix Grid */}
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {matrix.map((row, i) => (
            row.map((char, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: char === '0' ? 0.2 : 1,
                  scale: char === '0' ? 0.8 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`w-8 h-8 flex items-center justify-center font-mono text-lg
                  ${isDark ? 'text-white' : 'text-black'}`}
              >
                {char}
              </motion.div>
            ))
          ))}
        </div>

        {/* Loading Text */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`text-sm font-mono ${isDark ? 'text-white' : 'text-black'} opacity-60`}>
            DECRYPTING
          </div>
        </motion.div>

        {/* Circular Progress */}
        <svg 
          className="absolute -inset-4 -z-10"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
            strokeWidth="1"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isDark ? 'white' : 'black'}
            strokeWidth="1"
            strokeDasharray="301.59289474462014"
            animate={{
              strokeDashoffset: [301.59289474462014, 0]
            }}
            transition={{
              duration: 2,
              ease: "linear",
              repeat: Infinity
            }}
            style={{
              transformOrigin: 'center',
              transform: 'rotate(-90deg)'
            }}
          />
        </svg>
      </div>
    </motion.div>
  )
}

export default CipherLoading