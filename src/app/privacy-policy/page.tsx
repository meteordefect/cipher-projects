import { Metadata } from 'next'
import PrivacyContent from './components/PrivacyContent'

export const metadata: Metadata = {
  title: 'Privacy Policy | Cipher Projects',
  description: 'Our commitment to protecting your privacy and personal information. Learn how we collect, use, and safeguard your data in compliance with Australian Privacy Principles.',
  keywords: 'privacy policy, data protection, personal information, Australian Privacy Principles, Cipher Projects privacy',
  openGraph: {
    title: 'Privacy Policy | Cipher Projects',
    description: 'Learn how we protect your privacy and personal information at Cipher Projects.',
    url: 'https://cipherprojects.com/privacy-policy',
    siteName: 'Cipher Projects',
    images: [{
      url: 'https://cipherprojects.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cipher Projects Privacy Policy'
    }],
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | Cipher Projects',
    description: 'Learn how we protect your privacy and personal information at Cipher Projects.',
    images: 'https://cipherprojects.com/og-image.jpg'
  },
  alternates: {
    canonical: 'https://cipherprojects.com/privacy-policy'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

export default function PrivacyPolicy() {
  return <PrivacyContent />
}
