import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import AnimatedSection from '../../app/about/components/AnimatedSection'
import ContactForm from './ContactForm'

export default function Contact() {
  return (
    <main className="min-h-screen pt-48 pb-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column - Header & Contact Info */}
          <div>
            {/* Hero Text */}
            <AnimatedSection className="mb-16">
              <h1 className="text-6xl md:text-[5vw] font-normal leading-[1.1] mb-8">
                Let's talk about your next project.
              </h1>
              <p className="text-xl opacity-60">
                The more details you include, the better we can understand your needs and provide the right solution.
              </p>
            </AnimatedSection>

            {/* Contact Info */}
            <div className="space-y-8">
              <h2 className="text-2xl font-normal">Get in Touch</h2>
              <div className="space-y-6">
                <Link
                  href="tel:+61261761580"
                  className="flex items-center gap-4 text-lg hover:opacity-60 transition-opacity duration-300"
                >
                  <Phone size={24} className="opacity-60" />
                  <span>+61 2 6176 1580</span>
                </Link>
                <Link
                  href="mailto:hello@cipherprojects.com"
                  className="flex items-center gap-4 text-lg hover:opacity-60 transition-opacity duration-300"
                >
                  <Mail size={24} className="opacity-60" />
                  <span>hello@cipherprojects.com</span>
                </Link>
                <div className="flex items-center gap-4 text-lg">
                  <MapPin size={24} className="opacity-60" />
                  <span>
                    Mawson 2607
                    <br />
                    Canberra, Australia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  )
}
