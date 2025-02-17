'use client'

import Script from 'next/script'
import ClientProviders from '@/components/ClientProviders'
import SchemaMarkup from '@/components/SchemaMarkup'
import { neueHaas } from '@/lib/fonts'
import styles from '@/app/initial-bg.module.css'
import { useBackground } from '@/context/BackgroundContext'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { isInitialLoading } = useBackground()

  return (
    <>
      <SchemaMarkup />
      <Script
        src="https://s.ahrefs.com/website-analytics.js"
        data-domain="cipherprojects.com"
        strategy="lazyOnload"
      />
      <ClientProviders>
        {children}
      </ClientProviders>
    </>
  )
}
