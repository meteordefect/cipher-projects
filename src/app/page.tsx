// src/app/page.tsx
'use client'

import { Suspense, lazy } from 'react' // Remove useState and useEffect
import { motion } from 'framer-motion' // Remove AnimatePresence since PageTransition handles it
import { useBackground } from '@/context/BackgroundContext'

// Loading States Components
const ComponentLoader = () => (
  <div className="w-full min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
  </div>
)

const SectionLoader = () => (
  <div className="w-full py-24">
    <div className="animate-pulse space-y-8">
      <div className="h-12 bg-gray-200 rounded w-2/3" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  </div>
)

// Dynamically import components with loading states
const Hero = lazy(() => import('@/components/Hero'))
const ClientMarquee = lazy(() => import('@/components/Marquee'))
const Services = lazy(() => import('@/components/Services'))
const Experts = lazy(() => import('@/components/Experts'))
const SelectedWork = lazy(() => import('@/components/Work'))

// Section wrapper component for consistent loading behavior
const Section = ({ children, fullWidth = false }: { children: React.ReactNode, fullWidth?: boolean }) => (
  <Suspense fallback={<SectionLoader />}>
    {fullWidth ? children : <div className="container">{children}</div>}
  </Suspense>
)

export default function Home() {
  const { isDark } = useBackground()

  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hero Section - Full Width */}
      <Section fullWidth>
        <Hero />
      </Section>

      {/* Other Sections - With Container */}
      <Section>
        <ClientMarquee />
      </Section>

      <Section>
        <Services />
      </Section>

      <Section>
        <SelectedWork />
      </Section>
      
      <Section>
        <Experts />
      </Section>
    </motion.main>
  )
}