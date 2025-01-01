'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useScroll } from 'framer-motion'

interface BackgroundContextType {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  isInitialLoading: boolean;
  setIsInitialLoading: (value: boolean) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  isDark: true,
  setIsDark: () => {},
  isInitialLoading: true,
  setIsInitialLoading: () => {},
});

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/') {
        const vh = window.innerHeight
        // Change to light mode after scrolling past first section
        setIsDark(scrollY.get() < vh)
      } else {
        // On other routes, maintain light theme
        setIsDark(false)
      }
    }

    handleScroll() // Initial check

    // Subscribe to scroll changes
    const unsubscribe = scrollY.on('change', handleScroll)

    return () => {
      unsubscribe()
    }
  }, [pathname, scrollY, isInitialLoading])

  // Reset to dark when loading completes on homepage
  useEffect(() => {
    if (!isInitialLoading && pathname === '/') {
      setIsDark(true)
    }
  }, [isInitialLoading, pathname])

  return (
    <BackgroundContext.Provider value={{
      isDark,
      setIsDark,
      isInitialLoading,
      setIsInitialLoading
    }}>
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => useContext(BackgroundContext)