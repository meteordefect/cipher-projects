import { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About Cipher Projects | Leading Software Development in Australia',
  description: 'Discover Cipher Projects - delivering excellence in cloud engineering, cybersecurity, and custom software development across Australia, Europe, and Asia since 2023.',
  keywords: 'Cipher Projects, Australian software development, cloud engineering experts, cybersecurity solutions, AWS partners, custom software development Canberra',
  openGraph: {
    title: 'About Cipher Projects | Software Development Experts',
    description: 'Meet the team behind Cipher Projects. AWS partners delivering innovative software solutions across Australia, Europe, and Asia.',
    url: 'https://cipherprojects.com/about',
    siteName: 'Cipher Projects',
    images: [{
      url: 'https://cipherprojects.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cipher Projects Team'
    }],
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Cipher Projects | Software Development Experts',
    description: 'AWS partners delivering innovative cloud and software solutions across Australia, Europe, and Asia.',
    images: 'https://cipherprojects.com/og-image.jpg'
  },
  alternates: {
    canonical: 'https://cipherprojects.com/about'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

export default function AboutPage() {
  return <AboutContent />
}