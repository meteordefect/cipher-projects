import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export async function generateMetadata() {
  return {
    title: 'Repo Swatting: When Trust & Safety Features Become Weapons | Cipher Projects',
    description: 'An analysis of repo swatting attacks on GitHub and GitLab, where trust and safety features are weaponized against developers, potentially leading to account deletion and loss of intellectual property.',
    keywords: 'repo swatting, GitHub security, GitLab security, trust and safety, developer security, code repository security, malicious uploads, account deletion, intellectual property protection',
    openGraph: {
      title: 'Repo Swatting: When Trust & Safety Features Become Weapons',
      description: 'Analysis of how trust and safety features can be weaponized against developers on code hosting platforms.',
      url: 'https://cipherprojects.com/research/repo-swatting',
      siteName: 'Cipher Projects',
      images: [
        {
          url: 'https://cipherprojects.com/research/repo-swatting.jpg',
          width: 1200,
          height: 630,
          alt: 'Repository security and protection',
        }
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Repo Swatting: When Trust & Safety Features Become Weapons',
      description: 'How trust and safety features can be weaponized against developers',
      images: ['https://cipherprojects.com/research/repo-swatting.jpg'],
    },
    alternates: {
      canonical: 'https://cipherprojects.com/research/repo-swatting'
    }
  }
}

export default function RepoSwatting() {
  return (
    <main className="min-h-screen pt-48 pb-32">
      <article className="container max-w-3xl">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-lg opacity-60 hover:opacity-100 transition-opacity duration-300 mb-16"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>

        <div className="space-y-8 mb-16">
          <div className="space-y-4">
            <span className="text-sm opacity-60">Security</span>
            <h1 className="text-5xl font-normal leading-tight">
              Repo Swatting: When Trust & Safety Features Become Weapons
            </h1>
          </div>
        </div>

        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/repo-swatting.jpg"
            alt="Repository security and protection"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Keith Vaughan</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>February 2, 2025</span>
        </div>

        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <p className="text-xl leading-relaxed opacity-80">
              Imagine losing your entire GitHub account overnight - not because you were hacked, but because someone weaponized the platform's own safety systems against you. A new attack called "repo swatting" is making this nightmare scenario possible for millions of developers.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Understanding the Attack</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The attack is named after the dangerous practice of "swatting" - making false emergency calls to provoke armed response teams to attend victims' houses, a tactic often weaponized against prominent YouTubers. Similarly, it exploits these platforms' trust and safety mechanisms through a simple but dangerous process: attackers upload malicious files to a target's repository using the platforms' file upload features, then report the account for hosting malicious content, potentially leading to complete account deletion.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Scale and Impact</h2>
            <p className="text-lg leading-relaxed opacity-80">
              What makes this attack particularly concerning is its scale and simplicity. GitHub and GitLab together host the majority of the world's source code, making this vulnerability a significant threat to the developer ecosystem. Until recent platform changes in October 2024, attackers could even upload files anonymously on some platforms, making attribution nearly impossible.
            </p>
            <p className="text-lg leading-relaxed opacity-80">
              Both GitHub and GitLab have implemented significant changes to address this vulnerability. The platforms have modified their URL paths for uploaded files and strengthened authentication requirements, making it more difficult to establish direct connections between malicious uploads and target accounts. However, the fundamental challenge remains: balancing collaboration features with security concerns in platforms that manage much of the world's source code.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Why This Matters</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The implications of repo swatting are severe. Account deletion means losing not just code, but also issues, pull requests, and collaboration history. This can lead to significant business disruption, affecting development pipelines and team workflows. What makes this attack particularly concerning is that it requires minimal technical expertise to execute, yet is hard to prevent since platform features that enable collaboration can't be completely locked down.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Current State of Protection</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Recent platform changes have made repo swatting more difficult, but not impossible. GitHub now requires authentication for file uploads and has changed how uploaded files are stored and referenced. GitLab has implemented similar protections. However, these changes are more about making the attack harder rather than impossible.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Looking Forward</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The challenge facing platforms like GitHub and GitLab is substantial: how do you maintain the openness and collaboration that makes these platforms valuable while protecting users from abuse? As one security researcher noted, "This is not an easy problem to solve, because as the joke goes 'it's a feature, not a bug'."
            </p>
          </div>

          <div className="my-12 p-6 bg-gray-50/50 dark:bg-gray-800/50 rounded-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-medium mb-4">Protect Your Code Repository</h3>
            <p className="text-lg mb-4">
              Our security experts can help you implement robust protection strategies for your code repositories, including backup systems and repository mirroring solutions.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-sm hover:bg-blue-600 transition-colors"
            >
              Schedule a Security Consultation
            </Link>
          </div>
        </div>

        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link
              href={`https://twitter.com/intent/tweet?text=Repo Swatting: When Trust & Safety Features Become Weapons&url=${encodeURIComponent('https://cipherprojects.com/research/repo-swatting')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/repo-swatting')}`}
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
