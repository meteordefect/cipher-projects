import Image from 'next/image'
import AnimatedSection from './components/AnimatedSection'

const values = [
  {
    title: "Technical Excellence",
    description: "We pursue engineering excellence through continuous learning and staying at the forefront of cloud and development technologies."
  },
  {
    title: "Security First",
    description: "Security isn't an afterthought—it's built into everything we do, from infrastructure design to code implementation."
  },
  {
    title: "Client Partnership",
    description: "We work as an extension of your team, bringing our expertise while deeply understanding your business goals."
  }
];

const milestones = [
  {
    id: 1,
    year: "2024",
    title: "AWS Partnership",
    description: "Expanded our technical team to deliver enterprise-grade cloud solutions and custom software development."
  },
  {
    id: 2,
    year: "2023",
    title: "Growth & Innovation",
    description: "Successfully delivered multiple cloud migration projects and established our cloud-native development framework for startups and enterprises."
  },
  {
    id: 3,
    year: "2023",
    title: "Foundation",
    description: "Launched Cipher Projects with a focus on cloud excellence and modern software development, bringing together experienced AWS architects and developers."
  }
];

export default function AboutContent() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-48 pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimatedSection className="text-5xl md:text-[4vw] leading-[1.2] font-normal">
              Where innovation
              <br />
              Meets Engineering
            </AnimatedSection>

            <AnimatedSection 
              delay={0.2}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
            >
              We are a trusted technology partner transforming business visions into powerful technical solutions, delivering excellence across Australia, Europe and Asia.
            </AnimatedSection>
          </div>

          {/* Hero Image */}
          <AnimatedSection
            delay={0.3}
            className="mt-32 relative aspect-[21/9] w-full overflow-hidden rounded-lg"
          >
            <Image
              src="/about-hero.jpg"
              alt="Our team at work"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            <AnimatedSection className="text-6xl md:text-7xl font-normal">
              Our Values
            </AnimatedSection>

            <AnimatedSection
              delay={0.2}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
            >
              Guided by principles that prioritize excellence, security, and lasting partnerships.
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {values.map((value, index) => (
              <AnimatedSection
                key={value.title}
                delay={index * 0.2}
                className="space-y-4"
              >
                <h3 className="text-2xl font-normal">{value.title}</h3>
                <p className="text-lg opacity-60">{value.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            <AnimatedSection className="text-6xl md:text-7xl font-normal">
              Our Journey
            </AnimatedSection>

            <AnimatedSection
              delay={0.2}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
            >
              From inception to industry leadership, charting our path in cloud excellence.
            </AnimatedSection>
          </div>

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <AnimatedSection
                key={milestone.id}
                delay={index * 0.2}
                direction="left"
                className="grid grid-cols-12 gap-8 items-start"
              >
                <div className="col-span-2 md:col-span-1">
                  <span className="text-sm opacity-60">{milestone.year}</span>
                </div>
                <div className="col-span-10 md:col-span-11">
                  <h3 className="text-2xl font-normal mb-2">{milestone.title}</h3>
                  <p className="text-lg opacity-60">{milestone.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
