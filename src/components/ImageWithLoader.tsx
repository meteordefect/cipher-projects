'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageWithLoaderProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ImageWithLoader({ src, alt, className = '', priority = false }: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gray-100 dark:bg-gray-800"
          animate={{ opacity: [0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${className} ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
      />
    </div>
  )
}