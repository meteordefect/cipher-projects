import type { Metadata } from 'next'
import './globals.css'
import { neueHaas } from '@/lib/fonts'
import RootLayoutClient from '@/components/RootLayoutClient'
import BodyWrapper from '@/components/BodyWrapper'

export const metadata: Metadata = {
  title: 'Cipher Projects',
  description: 'Cipher Projects delivers world-class software development services to clients across Europe, Asia & Australia. Web, mobile, cloud & AI expertise',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', url: '/favicon.png', type: 'image/png' },
    { rel: 'icon', url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
  ],
  keywords: ['Cipher Projects', 'Cloud Solutions', 'Cybersecurity', 'Software Development', 'IT Outsourcing'],
  openGraph: {
    title: 'Cipher Projects',
    description: 'Expertly crafted cloud solutions, cybersecurity, and software projects tailored to your needs. Build smarter with Cipher Projects.',
    url: 'https://cipherprojects.com',
    siteName: 'Cipher Projects',
    images: [
      {
        url: 'https://www.cipherprojects.com/og-image.jpg',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={neueHaas.variable}>
      <BodyWrapper className="font-sans">
        <RootLayoutClient>{children}</RootLayoutClient>
      </BodyWrapper>
    </html>
  )
}
