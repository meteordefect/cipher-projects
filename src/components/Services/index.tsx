'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const services: string[] = [
  "Full-stack Development",
  "Cloud Migration",
  "DevOps Implementation",
  "Mobile Development",
  "API Development",
  "Web Applications",
  "System Architecture",
  "Database Design",
  "Security Solutions",
  "Frontend Development",
  "Backend Systems",
  "Cloud Native Apps",
  "Serverless Solutions",
  "Technical Consulting",
  "Performance Optimization",
  "Digital Transformation"
]

interface ServiceItemProps {
  text: string;
  index: number;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ text, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    margin: "-45% 0px -45% 0px",
    once: false
  })

  const xOffset = index % 2 === 0 ? -20 : 20

  return (
    <motion.div
      ref={ref}
      className="py-8 md:py-12 px-4 md:px-0 flex items-start gap-8"
      initial={{ x: xOffset, opacity: 0 }}
      animate={{
        x: isInView ? 0 : xOffset,
        opacity: isInView ? 1 : 0.2,
        filter: isInView ? 'blur(0px)' : 'blur(1px)',
        scale: isInView ? 1 : 0.98,
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      whileHover={{ 
        scale: isInView ? 1.02 : 1,
        x: isInView ? 10 : xOffset,
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        className="text-base opacity-40 min-w-[32px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.4 : 0 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.div>
      <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal">
        {text}
      </h3>
    </motion.div>
  )
}

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section className="py-24">
      {/* Top Divider */}
      <div className="h-[1px] bg-black" />
      
      <div className="grid grid-cols-12 gap-8 pt-24 px-4 md:px-0"> {/* Added padding for mobile */}
        {/* Left Column - Sticky Title */}
        <motion.div 
          className="col-span-12 md:col-span-4 md:sticky md:top-32 h-fit mb-8 md:mb-0"
          style={{ y: titleY }}
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-normal"
          >
            Services
          </motion.h2>
        </motion.div>

        {/* Right Column - Scrolling Text */}
        <div 
          ref={containerRef} 
          className="col-span-12 md:col-span-8 overflow-x-hidden"
        >
          <div className="space-y-4">
            {services.map((service, index) => (
              <ServiceItem 
                key={index}
                text={service}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services