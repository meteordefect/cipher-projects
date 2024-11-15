'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { Arrow } from '@/components/ui/Arrow'

interface Project {
  title: string;
  subtitle: string;
  image: string;
  category: string;
  accentColor: string;
  link: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    title: "Blockchain",
    subtitle: "Industry grade infrastructure for proof-of-stake",
    image: "/work/pos.jpg",
    category: "Blockchain Infrastructure",  // Updated from "Migrating"
    accentColor: "#2F4F2F",
    link: "/projects",
    technologies: [
      "AWS Network Firewall", 
      "EC2 Auto Scaling",
      "Terraform",
      "VPC Security Groups"
    ]
  },
  {
    title: "Cloud Migration",
    subtitle: "Enhancing security and reducing costs",
    image: "/work/cloud-migrate.jpg",
    category: "Cloud Infrastructure & Security",
    accentColor: "#1E3A8A",
    link: "/projects",
    technologies: [
      "AWS Migration Hub",
      "Terraform", 
      "Docker", 
      "ECS",
      "AWS WAF",
      "CloudWatch"
    ]
  },
  {
    title: "AWS Infrastructure",
    subtitle: "Private AI chat management with Open-WebUI",
    image: "/work/ollama.jpg",
    category: "Infrastructure & AI",
    accentColor: "#3B2F4F",
    link: "/projects",
    technologies: [
      "AWS CDK", 
      "Open-WebUI", 
      "Ollama", 
      "Docker",
      "ECS Fargate",
      "Lambda"
    ]
  },
  {
    title: "AWS Partnership",
    subtitle: "Software verification to become an AWS Partner",
    image: "/work/ftr.jpg",
    category: "AWS Consulting",  // Updated from "Enterprise Development"
    accentColor: "#2F4F4F",
    link: "/projects",
    technologies: [
      "AWS Well-Architected",
      "AWS Control Tower", 
      "CloudTrail", 
      "AWS SSO",
      "AWS Config"
    ]
  }
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scale = useMotionValue(1)

  const rotateXSpring = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const rotateYSpring = useSpring(rotateY, { stiffness: 300, damping: 30 })
  const scaleSpring = useSpring(scale, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    rotateX.set((mouseY / rect.height) * 20)
    rotateY.set(-(mouseX / rect.width) * 20)
    scale.set(1.05)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          delay: index * 0.1
        }
      }}
      style={{
        transformStyle: "preserve-3d",
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
      }}
      className="relativebg-[#f8f8f8] rounded-sm overflow-hidden shadow-xl"
    >
      <motion.div 
        className="aspect-[16/10] relative"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      
      <motion.div 
        className="p-8 relative"
        style={{ transform: "translateZ(50px)" }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span 
          className="text-sm font-normal text-current opacity-60"
          whileHover={{ opacity: 1 }}
        >
          {project.category}
        </motion.span>
        <motion.h3 
          className="text-2xl font-normal mt-2"
          whileHover={{ scale: 1.02 }}
        >
          {project.title}
        </motion.h3>
        <motion.p 
          className="text-base opacity-60 mt-2"
          whileHover={{ opacity: 1 }}
        >
          {project.subtitle}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-2 mt-4"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {project.technologies.map((tech) => (
            <motion.span 
              key={tech}
              className="px-3 py-1 border border-current/20 rounded-sm text-sm"
              whileHover={{ 
                scale: 1.05,
                borderColor: 'currentColor',
              }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, {
    stiffness: 150,
    damping: 15
  })
  const mouseYSpring = useSpring(y, {
    stiffness: 150,
    damping: 15
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    x.set(mouseX / 3)
    y.set(mouseY / 3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseXSpring,
        y: mouseYSpring
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  )
}

export default function SelectedWork() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section className="py-32">
      {/* Top Divider Line */}
      <div className="h-[1px] bg-current mb-32" />

      {/* Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
        {/* Left column - Title */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: titleY }}
          className="text-6xl md:text-7xl font-normal"
        >
          Selected Work
        </motion.h2>

        {/* Right column - Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
        >
          Explore our featured projects showcasing our expertise in development,
          cloud infrastructure, and digital innovation.
        </motion.p>
      </div>

      {/* Projects Grid */}
      <motion.div 
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32"
      >
        {projects.map((project, index) => (
          <Link 
            href={project.link}
            key={project.title}
            className="block transform-gpu"
          >
            <ProjectCard project={project} index={index} />
          </Link>
        ))}
      </motion.div>

      {/* Magnetic CTA Button */}
      <div className="text-center">
        <MagneticButton>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 px-8 py-4 border border-current 
              hover:bg-black hover:text-white transition-colors duration-300 rounded-sm"
          >
            <span>Start a Project</span>
            <Arrow className="w-4 h-4" />
          </Link>
        </MagneticButton>
      </div>
    </section>
  )
}