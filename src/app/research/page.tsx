'use client'

import { motion } from 'framer-motion'
import { ReactElement } from 'react'

interface ResearchPost {
  id: string
  title: string
  subtitle: string
  date: string
  author: string
  category: string
  image: string
  excerpt: string
}

interface BlogPostProps {
  post: ResearchPost
}
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

const BlogPost = ({ post }: BlogPostProps): ReactElement => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Link href={`/research/${post.id}`}>
        <motion.article
          className="bg-white/5 rounded-lg overflow-hidden"
          whileHover={{
            y: -10,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            transition: { duration: 0.3 }
          }}
        >
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Category & Date */}
            <div className="flex items-center gap-4">
              <span className="text-sm opacity-60">{post.category}</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-60" />
              <span className="text-sm opacity-60">{post.date}</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-normal leading-tight group-hover:translate-x-2 transition-transform duration-300">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-base opacity-60 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm opacity-60">{post.author}</span>
              <div className="inline-flex items-center gap-2 text-base opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                Read Article
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  )
}

export default function ResearchPage(): ReactElement {
  const researchPosts: ResearchPost[] = [
    {
      id: 'offshore-development-team',
      title: "Managing Offshore Development Teams: A Comprehensive Guide",
      subtitle: "Strategies for successful offshore collaboration",
      date: "February 1, 2025",
      author: "Cipher Projects Team",
      category: "Team Management",
      image: "/research/offshore-development-team.jpg",
      excerpt: "A detailed guide on effectively managing offshore development teams, covering communication strategies, cultural considerations, and best practices for maintaining productivity and quality across distributed teams."
    },
    {
      id: 'remote-devops-teams',
      title: "Building Successful Remote DevOps Teams: Best Practices and Strategies",
      subtitle: "Creating high-performing distributed DevOps teams",
      date: "February 1, 2025",
      author: "Cipher Projects Team",
      category: "Team Management",
      image: "/research/remote-devops-teams.jpg",
      excerpt: "A comprehensive guide to building and managing successful remote DevOps teams. Learn key strategies for communication, collaboration, and maintaining high performance in distributed teams while fostering a strong remote work culture."
    },
    {
      id: 'hire-remote-devops-engineer',
      title: "How to Hire Remote DevOps Engineers: A Strategic Guide for Australian Companies",
      subtitle: "Building effective remote DevOps teams in the digital age",
      date: "February 1, 2025",
      author: "Cipher Projects Team",
      category: "Hiring",
      image: "/research/hire-remote-devops-engineer.jpg",
      excerpt: "A comprehensive guide for Australian companies on hiring and managing remote DevOps engineers. Learn about essential skills, hiring processes, and best practices for building successful remote DevOps teams that drive innovation and maintain operational excellence."
    },
    {
      id: 'aws-security-australia',
      title: "AWS Security Best Practices for Australian Businesses in 2025",
      subtitle: "Implementing robust cloud security for the evolving threat landscape",
      date: "January 21, 2025",
      author: "Cipher Projects Team",
      category: "Security",
      image: "/research/aws-security-australia.jpg",
      excerpt: "An in-depth analysis of AWS security implementation for Australian enterprises, covering emerging threats, compliance requirements, and proven strategies. Learn how leading organizations are securing their cloud infrastructure while maintaining operational efficiency and regulatory compliance."
    },
    {
      id: 'expo-vs-flutter',
      title: "Expo vs Flutter: A Technical Analysis for Enterprise Mobile Development",
      subtitle: "Making data-driven framework decisions",
      date: "January 6, 2025",
      author: "Keith Vaughan",
      category: "Development",
      image: "/research/cross-platform.jpg",
      excerpt: "A comprehensive technical comparison of Expo and Flutter for enterprise mobile development, analyzing performance metrics, developer productivity, and total cost of ownership across real-world implementations."
    },
    {
      id: 'software-development-australia',
      title: "Software Development in Australia: The Strategic Advantage of Next-Generation Technologies",
      subtitle: "How Australian businesses are leveraging Cloud, AI, and Cybersecurity for digital transformation",
      date: "January 1, 2025",
      author: "Cipher Projects Team",
      category: "Industry Insights",
      image: "/research/software-development-australia.jpg",
      excerpt: "Explore how Australian businesses are gaining competitive advantages through strategic software development partnerships. Learn how next-generation technologies in Cloud Computing, AI, and Cybersecurity are reshaping the digital landscape and why choosing the right development partner is crucial for success."
    },
    {
      id: 'software-development-team',
      title: "Building an Effective Software Development Team: The Complete Guide for 2025",
      subtitle: "Essential strategies for assembling and managing high-performing development teams",
      date: "January 1, 2025",
      author: "Cipher Projects Team",
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
      image: "/repo-swatting.jpg",
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
      image: "/research/aws-security.jpg",
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchPosts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
