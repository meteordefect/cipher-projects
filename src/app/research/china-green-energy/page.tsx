// src/app/research/china-green-energy/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export default function ChinaGreenEnergyPage() {
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
            <span className="text-sm opacity-60">Strategic Innovation</span>
            <h1 className="text-5xl font-normal leading-tight">
              China's Green Energy Revolution: Lessons in Long-Term Thinking for Business Leaders
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/china-energy.jpg"
            alt="China's Green Energy Infrastructure"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Cipher Weekly Team</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>August 11, 2024</span>
        </div>

        {/* Content */}
        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <p className="text-xl leading-relaxed opacity-80">
              In today's fast-paced business world, the temptation to focus on short-term gains is strong. However, China's approach to green energy offers a compelling case study in long-term strategic planning that business leaders can learn from, regardless of their industry.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">The Path to Energy Leadership</h2>
            <p className="text-lg leading-relaxed opacity-80">
              China's emergence as a green energy leader is rooted in necessity and strategic foresight. As Louis-Vincent Gave explains, "Economic activity is energy transformed." China recognized early that securing its economic future meant rethinking its energy strategy. Unlike nations with abundant natural resources, China faced limitations that demanded innovation. This drove China to invest heavily in green technologies, particularly nuclear and solar.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Erik Townsend's observation that China is "at least 15 years ahead" in advanced nuclear technology underscores the success of this approach. While Western nations are still in discussions, China is already building and implementing next-generation energy solutions.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Strategic Imperatives</h2>
            <p className="text-lg leading-relaxed opacity-80">
              China's green energy focus extends beyond environmental concerns; it's a calculated move to ensure long-term economic stability and global competitiveness. Their dominance in automobile exports, particularly to emerging markets, demonstrates their growing industrial capabilities. In nuclear energy, China's pioneering work with thorium-fueled molten salt reactors showcases their commitment to revolutionary technologies, with practical applications already in development for their container ship fleet.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Historical and Cultural Context</h2>
            <p className="text-lg leading-relaxed opacity-80">
              China's approach is deeply informed by its history. The period from 1860 to 1975 marked a dramatic fall from empire to hardship, creating a powerful drive to secure future prosperity. This historical context, combined with a cultural emphasis on long-term thinking, stands in stark contrast to the Western focus on quarterly results. China's planning horizon extends decades into the future, enabling more strategic and patient investment approaches.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Strategic Insights for Business Leaders</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Future-focused investment strategies are crucial. Just as China invests in advanced energy systems, businesses should allocate resources to technologies that position them for future success. Sustainability isn't merely about environmental responsibility; it's a strategic imperative for long-term viability. The cultivation of expertise, as demonstrated by China's emphasis on engineering education, drives innovation and competitive advantage.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Market anticipation is equally vital. China's unexpected dominance in auto exports to emerging markets exemplifies the importance of looking beyond current markets to identify future opportunities. Success requires balancing immediate business needs with long-term vision, much like China's energy policy balances current demands with future aspirations.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Looking to the Future</h2>
            <p className="text-lg leading-relaxed opacity-80">
              China's green energy revolution demonstrates the power of strategic foresight and long-term planning. Their approach to thinking decades ahead while making corresponding investments positions them as a future energy leader. Business leaders across all sectors can apply these principles of forward-thinking and strategic investment to ensure their companies' long-term success and sustainability. The future belongs to those who prepare for it today.
            </p>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link 
              href={`https://twitter.com/intent/tweet?text=China's Green Energy Revolution&url=${encodeURIComponent('https://cipherprojects.com/research/china-green-energy')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/china-green-energy')}&title=China's Green Energy Revolution`}
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