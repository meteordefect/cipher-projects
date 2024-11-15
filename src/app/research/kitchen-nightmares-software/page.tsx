// src/app/research/kitchen-nightmares-software/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export default function KitchenNightmaresPage() {
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
            <span className="text-sm opacity-60">Software Development</span>
            <h1 className="text-5xl font-normal leading-tight">
              Gordon Ramsay's Kitchen Nightmares: A Lesson for Software Development
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/kitchen-dev.jpg"
            alt="Kitchen and Code"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Cipher Weekly Team</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>September 23, 2024</span>
        </div>

        {/* Content */}
        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <p className="text-xl leading-relaxed opacity-80">
              Gordon Ramsay's "Kitchen Nightmares" was savage. A TV show in the 2010s where Ramsay visited struggling restaurants across Britain. These restaurants often boasted prestigious reputations or grand visions, but something had gone wrong with their product. Ramsay would arrive, inspect the decor, and taste the food with great amusement. Instantly, he could tell from the presentation and taste that something had gone off in the backend.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">The Process of Rescue</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The rest of the episode involved Ramsay investigating where processes broke down, engaging in heated arguments with chefs or managers responsible for these failures, and working to completely redesign and rebuild the system. He focussed on helping them build a process to serve quality food again. By starting from an outside perspective with the customer in mind, he was potentially saving the business from closure.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Software Development Parallels</h2>
            <p className="text-lg leading-relaxed opacity-80">
              This focus on reconnecting kitchen processes with the end product offers valuable lessons for software development. In many ways, software development is like cooking: developers are the chefs, and if they become too disconnected from the end product, they risk losing sight of what truly matters. Instead of "tasting the food" and caring about the end result, they might become preoccupied with following outdated practices that prioritise metrics like lines of code per day or number of merge requests per week, rather than making beautiful user-friendly software.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Just as in Ramsay's kitchen rescues, software development teams can become so caught up in their internal processes that they lose sight of what really matters - the quality of the product reaching the user. To avoid this pitfall, teams should constantly realign their processes and priorities with the end-user experience.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Real-World Applications</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Jeff Bezos introduced a practice at Amazon where product development begins with writing a press release and FAQ as if the product has already launched. This "Working Backwards" approach forces teams to think from the customer's perspective from the very beginning, ensuring that all development efforts are aligned with customer needs and expectations.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Peter Thiel, in his book "Zero to One," emphasizes the importance of focusing on one core value proposition that solves a significant problem for users. This aligns with Ramsay's approach of simplifying menus and focusing on executing a few dishes exceptionally well, rather than having a large, mediocre menu.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Moving Forward</h2>
            <p className="text-lg leading-relaxed opacity-80">
              By maintaining a strong connection between development processes and user experience, software teams can ensure they're delivering true value and not just going through the motions of development. Like Ramsay refocusing kitchen staff on the quality of food reaching the customer, software developers need to keep the end-user experience at the forefront of their minds throughout the development process.
            </p>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link 
              href={`https://twitter.com/intent/tweet?text=Gordon Ramsay's Kitchen Nightmares: A Lesson for Software Development&url=${encodeURIComponent('https://cipherprojects.com/research/kitchen-nightmares-software')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/kitchen-nightmares-software')}&title=Gordon Ramsay's Kitchen Nightmares: A Lesson for Software Development`}
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