'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { ResearchPost } from '../data/posts'

interface BlogPostProps {
  post: ResearchPost
}

export default function BlogPost({ post }: BlogPostProps) {
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
