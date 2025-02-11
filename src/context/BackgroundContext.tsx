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

  // Handle initial route and route changes
  useEffect(() => {
    // Define routes that should have a dark background
    const darkBackgroundRoutes = ['/']
    // Define routes that should have a light background
    const lightBackgroundRoutes = ['/contact', '/about', '/services', '/projects', '/research']
    
    if (darkBackgroundRoutes.includes(pathname)) {
      // For homepage, handle scroll-based theme changes
      if (pathname === '/') {
        setIsDark(true)
        
        const handleScroll = () => {
          const vh = window.innerHeight
          setIsDark(scrollY.get() < vh)
        }

        // Subscribe to scroll changes
        const unsubscribe = scrollY.on('change', handleScroll)
        return () => unsubscribe()
      } else {
        // For other dark background routes, just set dark theme
        setIsDark(true)
      }
    } else if (lightBackgroundRoutes.includes(pathname)) {
      // For light background routes
      setIsDark(false)
    } else {
      // Default to light theme for any other routes
      setIsDark(false)
    }
  }, [pathname, scrollY])

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
