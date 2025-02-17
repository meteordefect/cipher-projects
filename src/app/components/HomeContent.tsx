'use client'

import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'

// Loading States Components
const SectionLoader = () => (
  <div className="w-full opacity-0">
    {/* Invisible placeholder that maintains layout structure */}
    <div className="h-24" />
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

export default function HomeContent() {
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
