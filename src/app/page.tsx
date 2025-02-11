import { Metadata } from 'next'
import HomeContent from './components/HomeContent'

export const metadata: Metadata = {
  title: 'Cipher Projects | Leading Software Development & Cloud Engineering in Australia',
  description: 'Expert software development, cloud engineering, and cybersecurity solutions. Delivering innovative digital solutions across Australia, Europe, and Asia.',
  keywords: 'Cipher Projects, software development Australia, cloud engineering, cybersecurity solutions, AWS partners, custom software development Canberra',
  openGraph: {
    title: 'Cipher Projects | Software Development & Cloud Engineering',
    description: 'Expert software development and cloud engineering solutions. Delivering excellence across Australia, Europe, and Asia.',
    url: 'https://cipherprojects.com',
    siteName: 'Cipher Projects',
    images: [{
      url: 'https://cipherprojects.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cipher Projects'
    }],
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cipher Projects | Software Development & Cloud Engineering',
    description: 'Expert software development and cloud engineering solutions. Delivering excellence across Australia, Europe, and Asia.',
    images: 'https://cipherprojects.com/og-image.jpg'
  },
  alternates: {
    canonical: 'https://cipherprojects.com'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

export default function Home() {
  return <HomeContent />
}
