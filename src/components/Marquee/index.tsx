'use client'

import { useBackground } from '@/context/BackgroundContext'
import { motion } from 'framer-motion'

const clients = [
  {
    name: 'AWS',
    logo: '/logos/Amazon_Web_Services_Logo.svg'
  },
  {
    name: 'Azure',
    logo: '/logos/Microsoft_Azure.svg'
  },
  {
    name: 'MS',
    logo: '/logos/ms.png'
  },
  {
    name: 'NodeJS',
    logo: '/logos/Nodejs_logo.svg'
  },
  {
    name: 'Terraform',
    logo: '/logos/Terraform.svg'
  },
  {
    name: 'ServiceNow',
    logo: '/logos/ServiceNow.svg'
  },
  {
    name: 'SAP',
    logo: '/logos/SAP_2011_logo.svg'
  },
  {
    name: 'React',
    logo: '/logos/React-icon.svg'
  }
]

export default function ClientMarquee() {
  const { isDark } = useBackground()

  return (
    <section className="py-32">
      <div className="h-[1px] bg-current mb-32" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left column - Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-normal"
          >
            Future-ready
            <br />technology
          </motion.h2>

          {/* Right column - Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
          >
            We leverage modern tech stacks and cloud infrastructure to transform business challenges into elegant, scalable solutions that drive real-world impact.
          </motion.p>
        </div>

        {/* Logo grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-32"
        >
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="relative h-12 w-full">
                <img
                  src={client.logo}
                  alt={client.name}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${isDark ? 'invert' : ''}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

    </section>
  )
}