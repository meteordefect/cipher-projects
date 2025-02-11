'use client'

import Image from 'next/image'
import AnimatedSection from '../../about/components/AnimatedSection'

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

export default function ProjectCard({ project, isFirst = false }: { project: DetailedProject, isFirst?: boolean }) {
  return (
    <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-16">
      {/* Project Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority={isFirst}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Project Details */}
      <div className="space-y-8">
        <div>
          <span
            className="text-sm font-normal opacity-60"
            style={{ color: project.accentColor }}
          >
            {project.category}
          </span>
          <h2 className="text-4xl font-normal mt-2">{project.title}</h2>
          <p className="text-xl opacity-80 mt-4">{project.subtitle}</p>
          <p className="mt-4 opacity-80">{project.description}</p>
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
            {project.results.map((result, idx) => (
              <li key={idx}>{result}</li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="space-y-4">
          <h3 className="text-xl font-normal">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-current/20 rounded-sm text-sm opacity-60"
              >
                {tech}
              </span>
            ))}
          </div>
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
    </AnimatedSection>
  )
}
