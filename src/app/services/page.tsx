import Image from 'next/image'
import AnimatedSection from '../about/components/AnimatedSection'
import ServiceItem from './components/ServiceItem'

const services = [
  {
    title: "Development",
    items: [
      "Front-end Development",
      "Back-end Development",
      "Infrastructure",
      "DevOps",
      "Mobile Development",
      "API Development"
    ],
    description: "In our development approach, code and design work hand in hand to create digital products that push the boundaries of what is possible."
  },
  {
    title: "Cloud",
    items: [
      "Cloud Migration",
      "Cloud Development",
      "Infrastructure",
      "Serverless Solutions",
      "Cloud Security",
      "Performance Optimization"
    ],
    description: "Transform your infrastructure with our cloud expertise. We help businesses migrate, optimize, and innovate in the cloud."
  },
  {
    title: "Design",
    items: [
      "Mobile App Design",
      "Website Design",
      "UX / UI Design",
      "Research & Testing"
    ],
    description: "Design with purpose. Our design services combine aesthetics and functionality to create digital products that captivate users and drive your business forward."
  }
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimatedSection className="text-5xl md:text-[4vw] leading-[1.2] font-normal">
              Engineering
              <br />
              Digital Excellence
            </AnimatedSection>

            <AnimatedSection
              delay={0.2}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
            >
              We transform complex business challenges into elegant digital solutions, partnering with you to create software that drives real growth and lasting success.
            </AnimatedSection>
          </div>

          <AnimatedSection
            delay={0.3}
            className="mt-32 relative aspect-[21/9] w-full overflow-hidden rounded-lg"
          >
            <Image
              src="/services-hero.jpg"
              alt="Services hero image"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-32">
        <div className="container">
          {services.map((service) => (
            <ServiceItem
              key={service.title}
              title={service.title}
              items={service.items}
              description={service.description}
            />
          ))}
          {/* Final divider line */}
          <div className="h-[1px] bg-current opacity-20" />
        </div>
      </section>
    </main>
  )
}
