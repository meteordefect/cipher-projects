'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useBackground } from '@/context/BackgroundContext'
import { Arrow } from '@/components/ui/Arrow'


interface DetailedProject {
  title: string;
  subtitle: string;
  image: string;
  category: string;
  accentColor: string;
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: {
    category: string;
    items: string[];
  }[];
  year: string;
  client: string;
}


function Project({ project }: { project: DetailedProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-16"
    >
      {/* Project Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Project Details */}
      <div className="space-y-8">
        <div>
          <span className="text-sm font-normal opacity-60">{project.category}</span>
          <h2 className="text-4xl font-normal mt-2">{project.title}</h2>
          <p className="text-xl opacity-80 mt-4">{project.subtitle}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-normal">Challenge</h3>
          <p className="opacity-80">{project.challenge}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-normal">Solution</h3>
          <p className="opacity-80">{project.solution}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-normal">Results</h3>
          <ul className="list-disc list-inside space-y-2 opacity-80">
            {project.results.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="space-y-4">
          {project.technologies.map((tech, index) => (
            <div key={index}>
              <h4 className="text-sm font-normal opacity-60 mb-2">{tech.category}</h4>
              <div className="flex flex-wrap gap-2">
                {tech.items.map((item, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 border border-current/20 rounded-sm text-sm opacity-60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-current/20">
          <div>
            <span className="text-sm opacity-60">Year</span>
            <p className="mt-1">{project.year}</p>
          </div>
          <div>
            <span className="text-sm opacity-60">Client</span>
            <p className="mt-1">{project.client}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const projects: DetailedProject[] = [
  {
    title: "Cloud Migration",
    subtitle: "Enhancing security and reducing costs",
    image: "/work/cloud-migrate.jpg",
    category: "Cloud Infrastructure & Security",
    accentColor: "#1E3A8A",
    description: "Executed a comprehensive cloud migration strategy focusing on security enhancement and cost optimization.",
    challenge: "The client's legacy infrastructure was becoming increasingly costly to maintain and posed security risks. They needed a seamless migration to AWS while ensuring zero downtime and maintaining strict security standards.",
    solution: "We developed a phased migration approach using AWS Migration Hub, implementing infrastructure as code with Terraform, and containerizing applications for better scalability. Enhanced security measures were implemented through AWS WAF and comprehensive monitoring.",
    results: [
      "Completed migration with zero downtime",
      "Reduced monthly infrastructure costs by 35%",
      "Improved system response time by 60%",
      "Enhanced security posture with real-time threat detection",
      "Automated 90% of deployment processes"
    ],
    technologies: [
      {
        category: "AWS Migration & Management",
        items: [
          "AWS Migration Hub",
          "CloudWatch",
          "AWS Systems Manager",
          "AWS Organizations",
          "AWS Control Tower"
        ]
      },
      {
        category: "Container & Orchestration",
        items: [
          "Docker",
          "ECS",
          "ECR",
          "AWS App Mesh"
        ]
      },
      {
        category: "Security & Compliance",
        items: [
          "AWS WAF",
          "AWS Shield",
          "Security Hub",
          "IAM"
        ]
      }
    ],
    year: "2023",
    client: "Enterprise Solutions Corp"
  },
  {
    title: "AWS Infrastructure",
    subtitle: "Private AI chat management with Open-WebUI",
    image: "/work/ollama.jpg",
    category: "Infrastructure & AI",
    accentColor: "#3B2F4F",
    description: "Built a secure, scalable infrastructure for hosting private AI models with Open-WebUI and Ollama integration.",
    challenge: "The client needed a secure environment to run their own AI models privately, requiring high performance computing capabilities while maintaining data security and easy management interface.",
    solution: "We architected a containerized solution using AWS CDK for infrastructure deployment, implementing Ollama for model management and Open-WebUI for user interaction. The system was deployed on ECS Fargate for optimal scalability and cost management.",
    results: [
      "Successfully deployed 5 different AI models",
      "Achieved sub-second response times",
      "Maintained 100% data privacy compliance",
      "Reduced compute costs by 45% through optimal scaling",
      "Enabled self-service model deployment"
    ],
    technologies: [
      {
        category: "AI & Computing",
        items: [
          "Open-WebUI",
          "Ollama",
          "AWS Lambda",
          "ECS Fargate"
        ]
      },
      {
        category: "Infrastructure",
        items: [
          "AWS CDK",
          "Docker",
          "EC2",
          "Auto Scaling"
        ]
      },
      {
        category: "Monitoring & Security",
        items: [
          "CloudWatch",
          "AWS X-Ray",
          "Secret Manager",
          "KMS"
        ]
      }
    ],
    year: "2024",
    client: "AI Solutions Ltd"
  },
  {
    title: "AWS Partnership",
    subtitle: "Software verification to become an AWS Partner",
    image: "/work/ftr.jpg",
    category: "AWS Consulting",
    accentColor: "#2F4F4F",
    description: "Guided the certification process for AWS Partnership status, implementing best practices and security standards.",
    challenge: "The client needed to meet AWS Partner Network requirements, requiring comprehensive implementation of AWS best practices, security standards, and operational excellence across their entire infrastructure.",
    solution: "We conducted a thorough assessment using the AWS Well-Architected framework, implemented AWS Control Tower for account management, and established comprehensive monitoring and security controls.",
    results: [
      "Achieved AWS Partner Network certification",
      "Implemented 100% of required security controls",
      "Established automated compliance reporting",
      "Reduced security incidents by 75%",
      "Created comprehensive documentation and training"
    ],
    technologies: [
      {
        category: "AWS Governance",
        items: [
          "AWS Well-Architected",
          "AWS Control Tower",
          "AWS Organizations",
          "AWS Config"
        ]
      },
      {
        category: "Security & Identity",
        items: [
          "AWS SSO",
          "IAM",
          "CloudTrail",
          "Security Hub"
        ]
      },
      {
        category: "Monitoring & Compliance",
        items: [
          "AWS Audit Manager",
          "AWS Inspector",
          "CloudWatch",
          "AWS Trusted Advisor"
        ]
      }
    ],
    year: "2023",
    client: "Technology Solutions Partner"
  },
  {
    title: "Blockchain",
    subtitle: "Industry grade infrastructure for proof-of-stake",
    image: "/work/pos.jpg",
    category: "Blockchain Infrastructure",
    accentColor: "#2F4F2F",
    description: "Designed and implemented a secure, scalable infrastructure for a proof-of-stake blockchain network.",
    challenge: "The client needed a highly secure and scalable infrastructure to support their proof-of-stake blockchain network. The system needed to handle multiple validators while maintaining strict security protocols and ensuring 99.99% uptime.",
    solution: "We architected a comprehensive AWS solution utilizing multiple availability zones and implementing industry-leading security practices. The infrastructure was fully automated using Terraform, with auto-scaling capabilities to handle varying loads.",
    results: [
      "Achieved 99.99% uptime since deployment",
      "Reduced infrastructure costs by 40% through optimization",
      "Successfully handled peak loads of over 1000 transactions per second",
      "Zero security incidents since launch"
    ],
    technologies: [
      {
        category: "AWS Services",
        items: [
          "AWS Network Firewall",
          "EC2 Auto Scaling",
          "VPC Security Groups",
          "AWS Shield Advanced",
          "AWS KMS",
          "CloudWatch"
        ]
      },
      {
        category: "Infrastructure as Code",
        items: [
          "Terraform",
          "CloudFormation",
          "AWS CDK"
        ]
      },
      {
        category: "Security",
        items: [
          "WAF Rules",
          "GuardDuty",
          "Security Hub",
          "AWS Inspector"
        ]
      }
    ],
    year: "2023",
    client: "Blockchain Enterprise"
  }
]

export default function ProjectsPage() {
  const { isDark } = useBackground()

  return (
    <main className="min-h-screen">
      <section className="pt-48 pb-32"> {/* Updated padding to match */}
        <div className="container"> 
          {/* Remove the divider line */}
          
          {/* Title Section - Updated styling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-[4vw] leading-[1.2] font-normal"
            >
              Our Projects
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
            >
              Detailed overview of our featured work in cloud infrastructure,
              blockchain, and enterprise solutions.
            </motion.p>
          </div>

          {/* Projects List */}
          <div className="space-y-32 mt-32"> {/* Added top margin to match */}
            {projects.map((project, index) => (
              <Project key={project.title} project={project} />
            ))}
          </div>
        </div> 
      </section>
    </main>
  )
}