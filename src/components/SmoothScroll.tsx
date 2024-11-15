'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { usePathname } from 'next/navigation'

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,  // use this instead of 'smooth'
      wheelMultiplier: 1, // use this instead of 'mouseMultiplier'
      touchMultiplier: 2,
      infinite: false,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    if (window) {
      window.scrollTo(0, 0)
      lenis.scrollTo(0)
    }

    return () => {
      lenis.destroy()
    }
  }, [pathname])

  return <>{children}</>
}