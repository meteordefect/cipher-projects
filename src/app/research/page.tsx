// src/app/research/page.tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const researchPosts = [
  {
    id: 'software-development-team',
    title: "Building an Effective Software Development Team: The Complete Guide for 2025",
    subtitle: "Essential strategies for assembling and managing high-performing development teams",
    date: "January 1, 2025",
    author: "Cipher Projcects Team",
    category: "Development",
    image: "/research/software-development-team.jpg",
    excerpt: "Discover how to build and maintain a high-performing software development team in 2024. Learn about crucial team roles, optimal structures, and best practices for fostering collaboration and innovation in modern development environments."
  },
  {
    id: 'cdk-s3-exploit',
    title: "How a Deleted S3 Bucket Could Hand Over Your Entire AWS Account to Attackers",
    subtitle: "Critical security vulnerability discovered in AWS CDK",
    date: "July 2, 2024",
    author: "Cipher Projects Team",
    category: "Security Alert",
    image: "/research/cdk-s3-exploit.jpg",
    excerpt: "A critical security vulnerability in AWS Cloud Development Kit (CDK) could allow attackers to gain full administrative access to AWS accounts through deleted S3 buckets. Research shows 10% of CDK users potentially affected."
  },
  {
    id: 'repo-swatting',
    title: "Repo Swatting: How False Reports Can Take Down Developer Accounts",
    subtitle: "A new threat to source code platforms",
    date: "November 22, 2024",
    author: "Keith Vaughan",
    category: "Security",
    image: "/research/repo-swatting.jpg",
    excerpt: "A concerning new attack method threatens developers' accounts on major platforms like GitHub and GitLab, exploiting trust and safety mechanisms through malicious file uploads."
  },
  {
    id: 'visionary-lens',
    title: "The Visionary's Lens: Turning Everyday Frustrations into Software Gold",
    subtitle: "Seeing opportunity where others see obstacles",
    date: "November 9, 2024",
    author: "Keith Vaughan",
    category: "Innovation",
    image: "/research/visionary.jpg",
    excerpt: "What's the difference between a tourist and a visionary? About $100 million in potential value. A perspective on transforming daily frustrations into software opportunities."
  },
  {
    id: 'kitchen-nightmares-software',
    title: "Gordon Ramsay's Kitchen Nightmares: A Lesson for Software Development",
    subtitle: "What cooking can teach us about code",
    date: "September 23, 2024",
    author: "Cipher Projects Team",
    category: "Software Development",
    image: "/research/kitchen-dev.jpg",
    excerpt: "How the principles that make a successful kitchen mirror those that create successful software projects. Insights from Gordon Ramsay's approach to fixing failing restaurants."
  },
  {
    id: 'china-green-energy',
    title: "China's Green Energy Revolution: Lessons in Long-Term Thinking",
    subtitle: "Strategic insights for business leaders",
    date: "August 11, 2024",
    author: "Cipher Projects Team",
    category: "Strategic Innovation",
    image: "/research/china-energy.jpg",
    excerpt: "How China's approach to green energy offers compelling lessons in long-term strategic planning that business leaders can learn from, regardless of their industry."
  },
  {
    id: 'aws-waf-security',
    title: "Enhancing Digital Security with AWS WAF",
    subtitle: "Protecting your cloud infrastructure",
    date: "June 18, 2024",
    author: "Cipher Projects Team",
    category: "Security",
    image: "/research/aws-waf.jpg",
    excerpt: "An exploration of AWS Web Application Firewall capabilities and how customized configurations can enhance security for businesses."
  },
  {
    id: 'sap-business-guide',
    title: "What is SAP and How is it Used in Business?",
    subtitle: "A comprehensive guide to enterprise solutions",
    date: "June 18, 2024",
    author: "Cipher Projects Team",
    category: "Enterprise Solutions",
    image: "/research/sap.jpg",
    excerpt: "A deep dive into SAP's comprehensive modules and how they help businesses streamline their processes by integrating various functions into a single system."
  }
]

export default function ResearchPage() {

  return (
    <main className="min-h-screen pt-48 pb-32">
      <div className="container">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-[4vw] leading-[1.2] font-normal"
          >
            Research & Insights
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
          >
            Deep dives into technology, innovation,
            and strategic thinking.
          </motion.p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 gap-32">
          {researchPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/research/${post.id}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-sm opacity-60">{post.category}</span>
                        <span className="w-1 h-1 rounded-full bg-current opacity-60" />
                        <span className="text-sm opacity-60">{post.date}</span>
                      </div>
                      <h2 className="text-3xl font-normal group-hover:opacity-80 transition-opacity duration-300">
                        {post.title}
                      </h2>
                      <p className="text-lg opacity-60 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-60">{post.author}</span>
                        <div className="inline-flex items-center gap-2 text-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                          Read Article
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}