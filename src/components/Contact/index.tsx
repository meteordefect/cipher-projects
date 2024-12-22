'use client'

// Test:
//      curl -X POST -H "Content-Type: application/json" \
//      -d '{"name": "Test", "email": "test@example.com", "message": "Hello"}' \
//      https://mkz66v3npa.execute-api.ap-southeast-2.amazonaws.com/prod/contact

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: ''
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('loading')
    console.log('Form submitted with data:', formData)

    try {
      // Use environment variables if available, otherwise use /api/contact
      const endpoint = process.env.NEXT_PUBLIC_API_GATEWAY_URL || '/api/contact'
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // Add API key if available
      if (process.env.NEXT_PUBLIC_API_KEY) {
        headers['x-api-key'] = process.env.NEXT_PUBLIC_API_KEY
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log('Response:', data)

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        budget: '',
        message: ''
      })

    } catch (error) {
      console.error('Error:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  return (
    <main className="min-h-screen pt-48 pb-32">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column - Header & Contact Info */}
          <div>
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-16"
            >
              <h1 className="text-6xl md:text-[5vw] font-normal leading-[1.1] mb-8">
                Let's talk about your next project.
              </h1>
              <p className="text-xl opacity-60">
                The more details you include, the better we can understand your needs and provide the right solution.
              </p>
            </motion.div>

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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-lg mb-2 block">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-transparent border-b border-current py-4 focus:outline-none text-lg"
                  placeholder="First and Last Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="text-lg mb-2 block">Email</label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-current py-4 focus:outline-none text-lg"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="text-lg mb-2 block">Phone</label>
                <input
                  type="tel"
                  className="w-full bg-transparent border-b border-current py-4 focus:outline-none text-lg"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="text-lg mb-2 block">Budget</label>
                <select
                  className="w-full bg-transparent border-b border-current py-4 focus:outline-none text-lg appearance-none cursor-pointer"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="">Select a budget range</option>
                  <option value="under-25k">Under $25,000</option>
                  <option value="25-50k">$25,000 - $50,000</option>
                  <option value="50-100k">$50,000 - $100,000</option>
                  <option value="100k+">$100,000+</option>
                </select>
              </div>

              <div>
                <label className="text-lg mb-2 block">Message</label>
                <textarea
                  className="w-full bg-transparent border-b border-current py-4 focus:outline-none text-lg min-h-[120px]"
                  placeholder="Tell us about your project"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className={`w-full mt-8 px-8 py-4 border border-current
                  ${submitStatus === 'loading'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-black hover:text-white transition-all duration-300'}
                  text-lg`}
              >
                {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-600 mt-4 p-4 bg-green-50 rounded-md"
                >
                  Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 mt-4 p-4 bg-red-50 rounded-md"
                >
                  {errorMessage || 'Failed to send message. Please try again.'}
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}