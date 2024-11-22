// src/app/research/repo-swatting/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export default function RepoSwattingPage() {
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
            <span className="text-sm opacity-60">Security</span>
            <h1 className="text-5xl font-normal leading-tight">
              Repo Swatting: How False Reports Can Take Down Developer Accounts
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/repo-swatting.jpg"
            alt="Repository Security"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Keith Vaughan</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>November 22, 2024</span>
        </div>

        {/* Content */}
        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <p className="text-xl leading-relaxed opacity-80">
              Imagine losing your entire GitHub account overnight - not because you were hacked, but because someone weaponised the platform's own safety systems against you. A concerning new attack method dubbed "repo swatting" has emerged, threatening developers' accounts on major source code management platforms like GitHub and GitLab.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">The New Form of Digital Harassment</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The attack is named after the dangerous practice of 'swatting' - making false emergency calls to provoke armed response teams to attend victims' houses, a tactic often weaponised against prominent YouTubers. Similarly, it exploits these platforms' trust and safety mechanisms through a simple but dangerous process: attackers upload malicious files to a target's repository using the platforms' file upload features, then report the account for hosting malicious content, potentially leading to complete account deletion.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              When investigated by the platform's abuse team, these reports can result in the deletion of the targeted user's account. What makes this attack vector especially problematic is that until recent changes, attackers could upload files to other users' repositories anonymously on some platforms.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Platform Responses and Changes</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Both GitHub and GitLab have implemented significant changes to address this vulnerability, particularly in October 2024. The platforms have modified their URL paths for uploaded files and strengthened authentication requirements, making it more difficult to establish direct connections between malicious uploads and target accounts.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              However, the fundamental challenge remains: balancing collaboration features with security concerns in platforms that manage much of the world's source code. This delicate balance between openness and security continues to be a critical challenge for platform providers.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Critical Vulnerabilities</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Several key concerns make this attack vector particularly troubling. Attackers are creating disposable "code puppet" accounts to execute attacks, while file upload features, though necessary for collaboration, continue to pose security risks. Manual review processes struggle to keep up with automated attacks, and even with recent mitigations, variations of this attack may still emerge.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Looking Ahead</h2>
            <p className="text-lg leading-relaxed opacity-80">
              As this security threat evolves, developers and organizations need to consider implementing additional protective measures for their repositories. The question isn't just about platform security anymore - it's about how we as developers can protect our work and our online presence against these sophisticated social engineering attacks.
            </p>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link 
              href={`https://twitter.com/intent/tweet?text=Repo Swatting: How False Reports Can Take Down Developer Accounts&url=${encodeURIComponent('https://cipherprojects.com/research/repo-swatting')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/repo-swatting')}&title=Repo Swatting: How False Reports Can Take Down Developer Accounts`}
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