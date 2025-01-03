// src/app/layout.tsx
import localFont from 'next/font/local'
import Script from 'next/script'
import ClientProviders from '@/components/ClientProviders'
import type { Metadata } from 'next'
import './globals.css'
import SchemaMarkup from '@/components/SchemaMarkup'

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
  title: 'Cipher Projects', // Title shown in the browser tab and search engines
  description: 'Cipher Projects delivers world-class software development services to clients across Europe, Asia & Australia. Web, mobile, cloud & AI expertise', // Meta description for search engines
  icons: {
    icon: { url: '/api/favicon', type: 'image/x-icon' },
    shortcut: { url: '/api/favicon', type: 'image/x-icon' },
  },
  keywords: ['Cipher Projects', 'Cloud Solutions', 'Cybersecurity', 'Software Development', 'IT Outsourcing'], // SEO keywords
  openGraph: {
    title: 'Cipher Projects',
    description: 'Expertly crafted cloud solutions, cybersecurity, and software projects tailored to your needs. Build smarter with Cipher Projects.',
    url: 'https://cipherprojects.com',
    siteName: 'Cipher Projects',
    images: [
      {
        url: 'https://www.cipherprojects.com/og-image.jpg', // Path to your Open Graph image
        width: 1200,
        height: 630,
        alt: 'Cipher Projects - Outsource smarter',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cipher Projects',
    description: 'Expertly crafted cloud solutions, cybersecurity, and software projects tailored to your needs. Build smarter with Cipher Projects.',
    images: ['https://www.cipherprojects.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${neueHaas.variable}`}>
      <head>
        <SchemaMarkup />
      </head>
      <body className="font-sans">
        <Script
          src="https://s.ahrefs.com/website-analytics.js"
          data-domain="cipherprojects.com"
          strategy="afterInteractive"
        />
        <ClientProviders>
          {/* <CustomCursor /> */}
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
