'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { usePathname } from 'next/navigation'

interface SmoothScrollProps {
  children: ReactNode;
}

// Add type definition for Lenis instance
declare global {
  interface Window {
    lenis: Lenis | null;
  }
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Store lenis instance globally for potential external use
    window.lenis = lenis

    function raf(time: number): void {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle route changes
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
      lenis.scrollTo(0)
    }

    // Cleanup
    return () => {
      window.lenis = null
      lenis.destroy()
    }
  }, [pathname])

  return <>{children}</>
}