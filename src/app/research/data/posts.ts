export interface ResearchPost {
  id: string
  title: string
  subtitle: string
  date: string
  author: string
  category: string
  image: string
  excerpt: string
}

export const researchPosts: ResearchPost[] = [
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
