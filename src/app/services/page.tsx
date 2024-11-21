'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-[4vw] leading-[1.2] font-normal"
            >
              Engineering 
              <br />
              Digital Excellence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16"
            >
              We transform complex business challenges into elegant digital solutions, partnering with you to create software that drives real growth and lasting success.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-32 relative aspect-[21/9] w-full overflow-hidden rounded-lg"
          >
            <Image
              src="/services-hero.jpg"
              alt="Services hero image"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-32">
        <div className="container">
          {services.map((service, index) => (
            <div key={service.title}>
              {/* Divider line */}
              <div className="h-[1px] bg-current opacity-20" />
              
              <div className="py-24 md:py-32">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-12 gap-8 items-start"
                >
                  {/* Title */}
                  <div className="col-span-12 md:col-span-3">
                    <h2 className="text-5xl md:text-6xl font-normal">{service.title}</h2>
                  </div>

                  {/* Items List */}
                  <div className="col-span-12 md:col-span-4">
                    <ul className="space-y-4 text-xl md:text-2xl">
                      {service.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Description */}
                  <div className="col-span-12 md:col-span-5">
                    <p className="text-xl md:text-2xl opacity-60 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}
          {/* Final divider line */}
          <div className="h-[1px] bg-current opacity-20" />
        </div>
      </section>
    </main>
  )
}

