'use client'

import dynamic from 'next/dynamic'
import { ReactNode, Suspense } from 'react'
import { BackgroundProvider } from '@/context/BackgroundContext'
import SmoothScroll from '@/components/SmoothScroll'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
import LoadingWrapper from '@/components/LoadingWrapper'

const ColorTransition = dynamic(() => import('@/components/ColorTransition'), {
  ssr: false
})

const LoadingTransition = dynamic(() => import('@/components/LoadingTransition'), {
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
        <LoadingTransition />
        <LoadingWrapper>
          <SmoothScroll>
            <ColorTransition />
            <Header />
            <PageTransition>
              {children}
            </PageTransition>
            <Footer />
          </SmoothScroll>
        </LoadingWrapper>
      </BackgroundProvider>
    </Suspense>
  )
}
