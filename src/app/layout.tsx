// src/app/layout.tsx
import localFont from 'next/font/local'
import Script from 'next/script'
import ClientProviders from '@/components/ClientProviders'
import type { Metadata } from 'next'
import './globals.css'

const neueHaas = localFont({
  src: [
    {
      path: '../../public/fonts/NeueHaasDisplay-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Roman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Black.woff2',
      weight: '900',
      style: 'normal',
    }
  ],
  variable: '--font-neue-haas',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cipher Projects',
  description: 'Cipher Projects',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${neueHaas.variable}`}>
      <body className="font-sans">
        <Script 
          src="https://s.ahrefs.com/website-analytics.js"
          data-domain="cipherprojects.com"
          strategy="afterInteractive"
        />
        <ClientProviders>
          <main id="main" className="relative">
            {children}
          </main>
        </ClientProviders>

        <a 
          href="#main" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black"
        >
          Skip to main content
        </a>
      </body>
    </html>
  )
}