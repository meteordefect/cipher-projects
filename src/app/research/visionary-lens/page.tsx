import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export const metadata: Metadata = {
  title: "The Visionary's Lens: Turning Everyday Frustrations into Software Gold | Cipher Projects",
  description: 'Discover how successful software innovators transform daily frustrations into valuable solutions. Learn the mindset that turns common problems into million-dollar opportunities.',
  keywords: 'software innovation, visionary thinking, software development mindset, business opportunities, software solutions, problem solving, innovation mindset, software entrepreneurship',
  openGraph: {
    title: "The Visionary's Lens: Turning Everyday Frustrations into Software Gold",
    description: 'How visionary software builders transform daily frustrations into valuable solutions - insights from real-world examples.',
    url: 'https://cipherprojects.com/research/visionary-lens',
    siteName: 'Cipher Projects',
    images: [
      {
        url: 'https://cipherprojects.com/research/visionary.jpg',
        width: 1200,
        height: 630,
        alt: 'Visionary perspective',
      }
    ],
    locale: 'en_US',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Visionary's Lens: Software Innovation Mindset",
    description: 'How to transform everyday frustrations into valuable software solutions - a visionary approach.',
    images: ['https://cipherprojects.com/research/visionary.jpg'],
  }
}

export default function VisionaryLensPage() {
  return (
    <main className="min-h-screen pt-48 pb-32">
      <article className="container max-w-3xl">
        {/* Back Link */}
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-lg opacity-60 hover:opacity-100 transition-opacity duration-300 mb-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>

        {/* Category & Title */}
        <div className="space-y-8 mb-16">
          <div className="space-y-4">
            <span className="text-sm opacity-60">Innovation</span>
            <h1 className="text-5xl font-normal leading-tight">
              The Visionary's Lens: Turning Everyday Frustrations into Software Gold
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/visionary.jpg"
            alt="Visionary perspective"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Keith Vaughan</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>November 9, 2024</span>
        </div>

        {/* Content */}
        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <p className="text-xl leading-relaxed opacity-80">
              What's the difference between a tourist and a visionary? About $100 million in potential value. On a recent trip to Vietnam, I met a real estate agent whose optimistic view transformed what tourists saw as depressing vacant lots into opportunities for grand city development.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">A Tale of Two Perspectives</h2>
            <p className="text-lg leading-relaxed opacity-80">
              In Da Nang, where tourists lamented empty buildings and vacant lots as signs of underdevelopment, my real estate friend saw a canvas of possibility. Her mind was a repository of stories behind every empty lot, brimming with visions of architectural potential and how future city plans would transform each view. Every street lamp and sign we passed sparked ideas for cohesive urban design improvements. Her perspective transformed apparent emptiness into opportunities for innovation.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">The Software Builder's Mindset</h2>
            <p className="text-lg leading-relaxed opacity-80">
              This visionary perspective isn't limited to real estate. Consider my software architect friend who sees opportunity in everyday friction. When restaurant mains arrive before starters, others get annoyed. He envisions an affordable Point of Sale system that could streamline service and enhance the restaurant owner's operations.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Great software builders possess this same transformative vision. Ancient software slowing down company operations? That's not just a frustration—it's a market gap waiting to be filled. Flight delays spark ideas about improving backend infrastructure. Clumsy delivery processes become blueprints for innovative software solutions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">The Art of Positive Adaptation</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Stoicism teaches us to accept what is and find positive adaptations. Similarly, great software builders transform every flaw and annoyance into opportunities to improve the digital interfaces we interact with daily. Even seemingly smooth operations like the Apple Store contain incremental improvements waiting to be discovered.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Opportunities Everywhere</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Think about the software touchpoints in your daily life: ordering pizza, applying for a car loan, buying a laptop. Each interaction holds potential for improvement. The question isn't whether these opportunities exist—it's whether we let them frustrate us or inspire us to build better solutions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Cultivating the Visionary's Lens</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The next time you encounter a frustrating process or system, pause. Instead of adding to the chorus of complaints, ask yourself: What could be built to solve this? How could this experience be transformed? This shift in perspective—from tourist to visionary—might just be worth its weight in gold.
            </p>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link
              href={`https://twitter.com/intent/tweet?text=The Visionary's Lens: Turning Everyday Frustrations into Software Gold&url=${encodeURIComponent('https://cipherprojects.com/research/visionary-lens')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/visionary-lens')}&title=The Visionary's Lens: Turning Everyday Frustrations into Software Gold`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </div>
      </article>
    </main>
  )
}