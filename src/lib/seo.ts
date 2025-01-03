import type { Metadata } from 'next'

interface PageSEO {
  title: string;
  description: string;
  path: string;
}

export const defaultMetadata: Metadata = {
  title: {
    default: 'Cipher Projects | Cloud & Software Development',
    template: '%s | Cipher Projects'
  },
  description: 'Elite development teams for transformative projects from cloud to core systems. Serving clients across Europe, Asia & Australia.',
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://cipherprojects.com',
    siteName: 'Cipher Projects',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cipher Projects'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cipher Projects',
    description: 'Elite development teams for transformative projects',
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

// Important pages for sitelinks
export const mainPages: PageSEO[] = [
  {
    title: 'Projects',
    description: 'Featured cloud infrastructure and software development projects by Cipher Projects.',
    path: '/projects'
  },
  {
    title: 'Services',
    description: 'Cloud infrastructure, software development, and digital transformation services.',
    path: '/services'
  },
  {
    title: 'About',
    description: 'Learn about Cipher Projects - elite development teams for transformative projects.',
    path: '/about'
  },
  {
    title: 'Research',
    description: 'Insights and research on cloud technology, software development and digital innovation.',
    path: '/research'
  }
]