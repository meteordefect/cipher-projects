'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Linkedin, Twitter } from 'lucide-react'

export default function AWSCloudPage() {
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
            <span className="text-sm opacity-60">Cloud Computing</span>
            <h1 className="text-5xl font-normal leading-tight">
              AWS Cloud 101: How It Can Help Your Business Grow
            </h1>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] mb-16 overflow-hidden rounded-sm">
          <Image
            src="/research/aws-cloud.jpg"
            alt="AWS Cloud Infrastructure"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-16 text-sm opacity-60">
          <span>Cipher Weekly Team</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>August 9, 2024</span>
        </div>

        {/* Content */}
        <div className="[&>*]:mb-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Understanding AWS Cloud</h2>
            <p className="text-lg leading-relaxed opacity-80">
              AWS (Amazon Web Services) Cloud stands at the forefront of cloud computing, offering a comprehensive platform that's transforming how businesses operate in the digital age. For companies looking to modernize their IT infrastructure, AWS provides scalable, reliable, and cost-effective solutions that drive growth and innovation. This sophisticated platform empowers businesses of all sizes to compete effectively in the global marketplace.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Global Website Hosting</h2>
            <p className="text-lg leading-relaxed opacity-80">
              Consider an e-commerce platform based in Hanoi aiming to expand its reach to international markets. Through AWS Cloud services like EC2 (Elastic Compute Cloud) and S3 (Simple Storage Service), the platform can achieve seamless global presence. By replicating website content across data centers in strategic locations, businesses ensure faster loading times and improved user experience for customers worldwide. The platform automatically scales to handle traffic spikes during peak periods, maintaining consistent performance regardless of user load.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Cross-Border Data Management</h2>
            <p className="text-lg leading-relaxed opacity-80">
              For businesses operating across multiple locations, AWS offers sophisticated data synchronization solutions. Through services like Amazon RDS (Relational Database Service) and AWS Direct Connect, companies can maintain seamless data consistency across distributed offices. This ensures that critical business information remains current and accessible regardless of geographical location, enabling efficient collaboration and decision-making across international teams.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Advanced Business Applications</h2>
            <p className="text-lg leading-relaxed opacity-80">
              AWS provides robust solutions for diverse business needs. For disaster recovery, services like Amazon S3 and Glacier offer secure, redundant data storage options. Businesses can leverage Amazon EMR and Redshift for sophisticated data analytics, gaining valuable insights from their operations. Mobile-first companies benefit from AWS AppSync and DynamoDB, creating scalable applications that serve millions of users efficiently.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">IoT and Innovation</h2>
            <p className="text-lg leading-relaxed opacity-80">
              The platform's IoT capabilities open new frontiers for innovation. Through AWS IoT Core, agricultural technology companies can revolutionize farming practices by collecting and analyzing data from field sensors. This enables optimization of crop yields and resource usage, demonstrating how AWS can drive innovation in traditional industries. The platform's scalability ensures that these solutions can grow alongside business needs.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-normal">Looking Forward</h2>
            <p className="text-lg leading-relaxed opacity-80">
              AWS Cloud represents more than just technology infrastructure; it's a catalyst for digital transformation and global competitiveness. By providing access to world-class technology infrastructure, AWS enables businesses to innovate faster and more efficiently. As digital transformation continues to accelerate, embracing cloud technologies like AWS becomes increasingly crucial for businesses aiming to thrive in the global digital economy.
            </p>
          </div>
        </div>

        {/* Share Links */}
        <div className="mt-32 pt-8 border-t border-current/10">
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-60">Share this article</span>
            <Link
              href={`https://twitter.com/intent/tweet?text=AWS Cloud 101: How It Can Help Your Business Grow&url=${encodeURIComponent('https://cipherprojects.com/research/aws-cloud-101')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent('https://cipherprojects.com/research/aws-cloud-101')}&title=AWS Cloud 101: How It Can Help Your Business Grow`}
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