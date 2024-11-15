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
      {/* Hero Section - Increased padding and adjusted layout */}
      <section className="pt-48 pb-32"> {/* Increased padding */}
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-[4vw] leading-[1.2] font-normal" // Larger, more impactful text
            >
              Engineering 
              <br />
              Digital Excellence
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80 mt-8 lg:mt-16" // Added margin top for better spacing
            >
              We transform complex business challenges into elegant digital solutions, partnering with you to create software that drives real growth and lasting success.
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-32 relative aspect-[21/9] w-full overflow-hidden rounded-lg" // Adjusted aspect ratio
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

      {/* Services Detail Section - Reimagined layout */}
      <section className="py-32"> {/* Increased vertical spacing */}
        <div className="container">
          <div className="h-[2px] bg-current mb-32" /> {/* Increased margin */}
          
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${index !== services.length - 1 ? 'mb-40' : ''}`} // Increased spacing between services
            >
              <div className="grid grid-cols-1 gap-8">
                {/* Service Title */}
                <h2 className="text-6xl md:text-7xl font-normal mb-16">{service.title}</h2>
                
                {/* Service Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Service Items List */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-4">
                    <ul className="space-y-6">
                      {service.items.map((item, itemIndex) => (
                        <motion.li
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.4,
                            delay: itemIndex * 0.1
                          }}
                          className="flex items-start gap-4 text-xl"
                        >
                          <span className="text-sm opacity-40 font-medium pt-1">0{itemIndex + 1}</span>
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Service Description */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-6 lg:col-start-7">
                    <p className="text-2xl leading-relaxed opacity-60">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-24">
        <div className="container">
          <div className="h-[1px] bg-current mb-24" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-7xl font-normal"
            >
              Our Process
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl md:text-4xl font-normal leading-tight opacity-80"
            >
              Drive innovation with expert technical leadership, from strategic CTO guidance to optimized full-stack solutions and cloud architecture.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[
              {
                title: "User Experience From All Angles",
                description: "Product strategy, design, motion and front-end all have to work together to give the best experience to the users. Every detail counts."
              },
              {
                title: "Decisions Based on Goals",
                description: "Everything we do, we do it to achieve goals. Beauty and tech are just means to an end. Startups are all about hitting milestones."
              },
              {
                title: "Small Teams, Big Impact",
                description: "A multidisciplinary team of designers, developers, and product managers with experience crafting and deploying products."
              },
              {
                title: "Zero Big Reveal",
                description: "Be informed every step of the way with weekly meetings and deliverables, frequent testing and validation, and incremental progress."
              }
            ].map((item, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-2xl font-normal">{item.title}</h3>
                <p className="text-lg opacity-60">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}