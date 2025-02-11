import { Metadata } from 'next'
import { researchPosts } from './data/posts'
import BlogPost from './components/BlogPost'
import AnimatedSection from '../about/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Research & Insights | Cipher Projects',
  description: 'Deep dives into technology, innovation, and strategic thinking. Explore our latest research on cloud engineering, cybersecurity, and software development.',
  keywords: 'research, technology insights, cloud engineering, cybersecurity, software development, AWS, DevOps, innovation',
  openGraph: {
    title: 'Research & Insights | Cipher Projects',
    description: 'Expert insights into cloud engineering, cybersecurity, and software development. Stay informed with our latest research and analysis.',
    url: 'https://cipherprojects.com/research',
    siteName: 'Cipher Projects',
    images: [{
      url: 'https://cipherprojects.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Cipher Projects Research'
    }],
    locale: 'en_AU',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research & Insights | Cipher Projects',
    description: 'Expert insights into cloud engineering, cybersecurity, and software development.',
    images: 'https://cipherprojects.com/og-image.jpg'
  },
  alternates: {
    canonical: 'https://cipherprojects.com/research'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  }
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen pt-48 pb-32">
      <div className="container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <AnimatedSection className="text-5xl md:text-[4vw] leading-[1.2] font-normal">
            Research & Insights
          </AnimatedSection>

          <AnimatedSection
            delay={0.2}
            className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
          >
            Deep dives into technology, innovation,
            and strategic thinking.
          </AnimatedSection>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchPosts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
