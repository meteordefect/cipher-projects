'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '../../about/components/AnimatedSection'

interface ServiceItemProps {
  title: string
  items: string[]
  description: string
}

export default function ServiceItem({ title, items, description }: ServiceItemProps) {
  return (
    <div>
      <div className="h-[1px] bg-current opacity-20" />
      <div className="py-24 md:py-32">
        <AnimatedSection className="grid grid-cols-12 gap-8 items-start">
          {/* Title */}
          <div className="col-span-12 md:col-span-3">
            <h2 className="text-5xl md:text-6xl font-normal">{title}</h2>
          </div>

          {/* Items List */}
          <div className="col-span-12 md:col-span-4">
            <ul className="space-y-4 text-xl md:text-2xl">
              {items.map((item, itemIndex) => (
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
              {description}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
