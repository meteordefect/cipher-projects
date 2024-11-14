// src/components/Experts/index.tsx
'use client'

import { motion } from 'framer-motion'
import { Code2, Cloud, Layout, Database, Settings, Lock } from 'lucide-react'
import { useBackground } from '@/context/BackgroundContext'

const experts = [
  {
    icon: <Code2 size={32} />,
    title: "Development",
    description: "Full-stack development with modern frameworks and cloud-native architecture.",
    tags: ["React", "Node.js", "TypeScript", "Next.js"]
  },
  {
    icon: <Cloud size={32} />,
    title: "Cloud Infrastructure",
    description: "Secure, scalable cloud solutions with AWS expertise and best practices.",
    tags: ["AWS", "Azure", "Terraform", "Docker"]
  },
  {
    icon: <Layout size={32} />,
    title: "Architecture",
    description: "Robust system design focusing on scalability and maintainability.",
    tags: ["Microservices", "API Design", "System Design"]
  },
  {
    icon: <Database size={32} />,
    title: "Data Solutions",
    description: "Database design and optimization for high-performance applications.",
    tags: ["PostgreSQL", "MongoDB", "Redis", "ElasticSearch"]
  },
  {
    icon: <Settings size={32} />,
    title: "DevOps",
    description: "Streamlined CI/CD pipelines and infrastructure automation.",
    tags: ["CI/CD", "Kubernetes", "Jenkins", "GitLab"]
  },
  {
    icon: <Lock size={32} />,
    title: "Security",
    description: "Enterprise-grade security implementation and best practices.",
    tags: ["WAF", "IAM", "Compliance", "Encryption"]
  }
]

export default function Experts() {
  const { isDark } = useBackground()

  return (
    <section className="py-32">
      {/* Top Divider */}
      <div className="h-[1px] bg-current mb-32" />
      
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl font-normal"
        >
          Our Expertise
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
        >
          Deep technical knowledge combined with 
          years of enterprise experience.
        </motion.p>
      </div>

      {/* Expertise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experts.map((expert, index) => (
          <motion.div
            key={expert.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="p-8 h-full border border-current/10 hover:border-current/30 transition-colors duration-300">
              {/* Icon */}
              <div className="mb-6 text-current opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                {expert.icon}
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-2xl font-normal">{expert.title}</h3>
                <p className="text-base opacity-60 leading-relaxed">
                  {expert.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {expert.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-flex px-3 py-1 text-sm border border-current/10 
                             opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover Effect Border */}
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={false}
                whileHover={{
                  boxShadow: isDark 
                    ? '0 0 20px rgba(255,255,255,0.1)' 
                    : '0 0 20px rgba(0,0,0,0.05)'
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}