import AnimatedSection from '../about/components/AnimatedSection'
import ProjectCard from './components/ProjectCard'

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
  technologies: string[];
  year: string;
  client: string;
}

const projects: DetailedProject[] = [
  {
    title: "Cloud Migration",
    subtitle: "Enhancing security and reducing costs",
    image: "/work/cloud-migrate.jpg",
    category: "Cloud Infrastructure & Security",
    accentColor: "#1E3A8A",
    description: "Helped manage a comprehensive cloud migration strategy focusing on security enhancement and cost optimization.",
    challenge: "The client's legacy VMWare infrastructure was becoming increasingly costly to maintain. They needed a seamless migration to AWS while ensuring zero downtime and maintaining strict security standards.",
    solution: "Helped develop a migration approach using AWS EC2, implementing infrastructure as code with CDK and Terraform, and containerizing applications for better scalability. Enhanced security measures were implemented through AWS WAF and comprehensive monitoring.",
    results: [
      "Completed migration with zero downtime",
      "Reduced monthly infrastructure costs by 41%",
      "Improved system startup times by 15%",
      "Enhanced security posture with real-time Grafana monitoring",
      "Automated 90% of deployment processes"
    ],
    technologies: [
      "AWS EC2", "CloudWatch", "Grafana", "AWS Systems Manager", "AWS Lambda",
      "Docker", "ECS", "ECR", "AWS App Mesh", "AWS WAF",
      "Security Hub", "IAM"
    ],
    year: "2024",
    client: "Fifth Domain"
  },
  {
    title: "AWS Infrastructure",
    subtitle: "Private AI chat management with Open-WebUI",
    image: "/work/ollama.jpg",
    category: "Infrastructure & AI",
    accentColor: "#3B2F4F",
    description: "Built a secure, scalable infrastructure for hosting private AI models with Open-WebUI and Ollama integration.",
    challenge: "The client required a private, secure environment for AI model deployment and management, with strict data privacy requirements and the need for scalable infrastructure.",
    solution: "Implemented a containerized architecture using AWS CDK and ECS Fargate, integrating Open-WebUI with Ollama for model management. Used Lambda for serverless processing and implemented comprehensive security measures.",
    results: [
      "Achieved high-speed response times for AI queries",
      "Maintained 100% data privacy compliance",
      "Automated deployment and scaling processes"
    ],
    technologies: [
      "AWS CDK", "ECS Fargate", "Lambda", "API Gateway", "VPC",
      "Open-WebUI", "Ollama", "Docker", "ECR", "AWS CloudWatch",
      "IAM", "AWS Secrets Manager"
    ],
    year: "2024",
    client: "Redacted"
  },
  {
    title: "AWS Partnership",
    subtitle: "Software verification to become an AWS Partner",
    image: "/work/ftr.jpg",
    category: "AWS Consulting",
    accentColor: "#2F4F4F",
    description: "Guided client through AWS Partner verification process, implementing best practices and achieving compliance standards.",
    challenge: "The client needed to meet AWS Partner Network requirements while maintaining operational efficiency and implementing comprehensive security measures across their infrastructure.",
    solution: "Implemented AWS Well-Architected framework principles, established Control Tower for multi-account management, and configured comprehensive logging and monitoring solutions.",
    results: [
      "Achieved AWS Partner status within 3 months",
      "Implemented 100% of required security controls",
      "Enhanced overall security posture"
    ],
    technologies: [
      "AWS Control Tower", "AWS Organizations", "AWS Config", "AWS SSO",
      "AWS GuardDuty", "AWS Security Hub", "AWS CloudTrail", "AWS IAM",
      "AWS CloudWatch", "Amazon OpenSearch", "AWS Systems Manager"
    ],
    year: "2023",
    client: "Fifth Domain"
  },
  {
    title: "Blockchain",
    subtitle: "Industry grade infrastructure for proof-of-stake",
    image: "/work/pos.jpg",
    category: "Blockchain Infrastructure",
    accentColor: "#2F4F2F",
    description: "Designed and implemented a secure, scalable proof-of-stake blockchain infrastructure for enterprise deployment.",
    challenge: "The client needed a robust, secure infrastructure for their proof-of-stake blockchain network that could handle high transaction volumes while maintaining security and compliance standards.",
    solution: "Implemented a comprehensive AWS infrastructure using advanced networking features and security groups, with automated scaling and monitoring systems.",
    results: [
      "Achieved 99.99% uptime for validator nodes",
      "Implemented real-time security monitoring and automated responses",
      "Utilize sentry node architecture for DDoS mitigation."
    ],
    technologies: [
      "AWS Network Firewall", "EC2 Auto Scaling", "VPC Security Groups",
      "AWS CloudWatch", "Terraform", "Docker",
      "Github", "AWS KMS", "AWS Secrets Manager",
      "API Gateway", "Oracles", "Cosmos", "Python"
    ],
    year: "2023",
    client: "Critical Staking"
  }
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <section className="pt-48 pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimatedSection className="text-5xl md:text-[4vw] leading-[1.2] font-normal">
              Our Projects
            </AnimatedSection>

            <AnimatedSection
              delay={0.2}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
            >
              Detailed overview of our featured work in cloud infrastructure,
              blockchain, and enterprise solutions.
            </AnimatedSection>
          </div>

          <div className="space-y-32 mt-32">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} isFirst={index === 0} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
