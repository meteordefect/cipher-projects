import Contact from '@/components/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Cipher Projects | Expert Software Development Services',
  description: 'Get in touch with Cipher Projects for custom software development, cloud engineering, cybersecurity, and AI solutions. Serving clients across Australia, Europe, and Asia.',
  keywords: 'contact Cipher Projects, software development services, cloud engineering, cybersecurity solutions, AI development, custom software Australia',
  openGraph: {
    title: 'Contact Cipher Projects | Software Development Experts',
    description: 'Connect with Cipher Projects for your next software development project. Specializing in cloud engineering, cybersecurity, and AI solutions.',
    url: 'https://cipherprojects.com/contact',
    siteName: 'Cipher Projects',
    images: [{
      url: 'https://cipherprojects.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Contact Cipher Projects'
    }],
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Cipher Projects | Software Development Services',
    description: 'Ready to start your next software project? Contact Cipher Projects for expert development services across Australia, Europe, and Asia.',
    images: 'https://cipherprojects.com/og-image.jpg'
  },
  alternates: {
    canonical: 'https://cipherprojects.com/contact'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

export default function ContactPage() {
  return <Contact />;
}
