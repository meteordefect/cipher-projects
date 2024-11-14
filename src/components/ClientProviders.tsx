// src/components/ClientProviders.tsx
'use client'

import dynamic from 'next/dynamic'
import { ReactNode, Suspense } from 'react'
import { BackgroundProvider } from '@/context/BackgroundContext'
import SmoothScroll from '@/components/SmoothScroll'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'

const ColorTransition = dynamic(() => import('@/components/ColorTransition'), {
  ssr: false
})

const CipherLoading = dynamic(() => import('@/components/CipherLoading'), {
  ssr: false
})

const LoadingFallback = () => null

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BackgroundProvider>
        <CipherLoading />
        <SmoothScroll>
          <ColorTransition />
          <Header />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </BackgroundProvider>
    </Suspense>
  )
}