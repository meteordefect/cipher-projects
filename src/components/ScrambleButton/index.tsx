'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useBackground } from '@/context/BackgroundContext'

const letters = [
  '零', '壱', '弐', '参', '肆', '伍', '陸', '質', '捌', '玖',
  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
  '⟨', '⟩', '⟪', '⟫', '⌈', '⌉', '⌊', '⌋', '∮', '∯',
  '†', '‡', '§', '¶', '©', '®', '™', '⁂', '⁕', '⁜',
]

interface ScrambleButtonProps {
  onClickComplete?: () => void;
}

export default function ScrambleButton({ onClickComplete }: ScrambleButtonProps) {
  const { isDark } = useBackground()
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [displayText, setDisplayText] = useState(["LET'S", "TALK "])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;

    const originalText = ["LET'S", "TALK "]
    
    if (isHovered) {
      setIsAnimating(true)
      let iteration = 0
      const maxIterations = originalText.join('').length * 2
      
      const interval = setInterval(() => {
        setDisplayText(prevWords => 
          prevWords.map((word, wordIndex) => 
            word
              .split("")
              .map((_, charIndex) => {
                const totalPrevChars = wordIndex === 0 ? 0 : originalText[0].length
                const absoluteIndex = wordIndex === 0 ? charIndex : charIndex + totalPrevChars
                
                if (absoluteIndex < iteration / 2) {
                  return originalText[wordIndex][charIndex]
                }
                
                if (originalText[wordIndex][charIndex] === "'" || originalText[wordIndex][charIndex] === " ") {
                  return originalText[wordIndex][charIndex]
                }
                
                if (Math.random() < 0.15) {
                  return word[charIndex]
                }
                
                return letters[Math.floor(Math.random() * letters.length)]
              })
              .join("")
          )
        )

        if (iteration >= maxIterations) {
          clearInterval(interval)
          setIsAnimating(false)
        }

        iteration += 1
      }, 50)

      return () => clearInterval(interval)
    } else {
      const timeout = setTimeout(() => {
        setDisplayText(originalText)
        setIsAnimating(false)
      }, 150)
      return () => clearTimeout(timeout)
    }
  }, [isHovered, mounted])

  if (!mounted) {
    return (
      <Link href="/contact" className="block">
        <div className={`px-6 py-3 w-[160px] flex justify-center items-center border ${
          isDark 
            ? 'border-white border-opacity-90' 
            : 'border-black border-opacity-60'
        }`}>
          <span className={`text-lg ${isDark ? 'text-white' : 'text-black'}`}>
            LET'S TALK
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link 
      href="/contact" 
      onClick={(e) => {
        if (onClickComplete) {
          e.preventDefault()
          onClickComplete()
          setTimeout(() => {
            window.location.href = '/contact'
          }, 200)
        }
      }}
      className="block"
    >
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative group`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div 
          className={`relative px-6 py-3 w-[160px] flex justify-center items-center border ${
            isDark 
              ? 'border-white border-opacity-90 hover:bg-white/5' 
              : 'border-black border-opacity-60 hover:bg-black/5'
          } transition-colors duration-300`}
        >
          <div className={`relative z-10 text-lg tracking-normal ${
            isDark ? 'text-white' : 'text-black'
          } flex items-center gap-2`}>
            <div className="flex items-center gap-2 w-[110px] justify-center">
              {displayText.map((word, wordIndex) => (
                <div 
                  key={wordIndex}
                  className="flex items-center overflow-hidden"
                  style={{
                    letterSpacing: '0.01em',
                    width: word === "LET'S" ? '48px' : '44px',
                  }}
                >
                  {word.split('').map((char, charIndex) => (
                    <motion.span 
                      key={`${wordIndex}-${charIndex}`}
                      className="inline-block text-lg"
                      initial={{ opacity: 1 }}
                      animate={{ 
                        opacity: isAnimating ? [0.5, 1] : 1,
                      }}
                      transition={{ 
                        duration: 0.15,
                        repeat: isAnimating ? Infinity : 0,
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              ))}
            </div>

            <motion.div
              animate={isHovered ? {
                x: [0, 4, 4],
                y: [0, -4, -4],
                opacity: [1, 0.8, 1]
              } : {
                x: 0,
                y: 0,
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.div>
          </div>
          
          <motion.span 
            className={`absolute inset-0 border ${
              isDark 
                ? 'border-white border-opacity-90' 
                : 'border-black border-opacity-60'
            }`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: isDark 
                ? '0 0 10px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.1)' 
                : '0 0 10px rgba(0,0,0,0.3), 0 0 20px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </motion.div>
    </Link>
  )
}