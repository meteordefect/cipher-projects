'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react' 
import { useBackground } from '@/context/BackgroundContext'
import { usePathname } from 'next/navigation'

const fadeUpVariant = {
  initial: { 
    opacity: 0, 
    y: 20
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, 0.05, 0.95]
    }
  }
}

const containerVariant = {
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

export default function Hero() {
  const { isDark, isInitialLoading } = useBackground()
  const pathname = usePathname()
  const [shouldAnimate, setShouldAnimate] = useState(false)
  
  const heroText = [
    "Elite development teams",
    "for transformative projects",
    "from cloud to core systems."
  ]

  useEffect(() => {
    // If we're not in initial loading, or if we're navigating back to the page   
    if (!isInitialLoading || pathname !== '/') {
      setShouldAnimate(true)
    }
  }, [isInitialLoading, pathname])

  return (
    <section className="min-h-[100dvh] flex flex-col justify-between max-w-[1920px] mx-auto">
      {/* Hero Content */}
      <div className="pt-52">
        <motion.div
          initial="initial"
          animate={shouldAnimate ? "animate" : "initial"}
          variants={containerVariant}
          className="px-4 sm:px-8 md:px-12"
        >
          <div className="overflow-hidden">
            {heroText.map((line, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariant}
                className="overflow-hidden"
              >
                <h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.2] tracking-[-0.02em] transition-colors duration-700"
                  style={{ 
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                >
                  {line}
                </h1>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={fadeUpVariant}
            className="mt-12 md:mt-16 flex justify-end"
          >
            <Link 
              href="/contact"
              style={{ 
                color: isDark ? '#ffffff' : '#000000'
              }}
              className="group inline-flex items-center text-xl sm:text-2xl md:text-3xl font-normal transition-colors duration-700 hover:opacity-80 mb-8"
            >
              <span>Let&apos;s Talk About Your Project</span>
              <ArrowUpRight 
                className="w-6 h-6 ml-3 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" 
                strokeWidth={2}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: shouldAnimate ? 0.8 : 0, duration: 0.6 }}
        className="w-full pb-16 md:pb-24 px-4 sm:px-8 md:px-12"
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src="/scrum-grey-wide.jpg"
            alt="Hero image"
            fill
            sizes="100vw"
            className="object-cover object-center transition-opacity duration-700"
            style={{ 
              opacity: isDark ? 0.8 : 1
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}