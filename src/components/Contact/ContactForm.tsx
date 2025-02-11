'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface FormData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  )
}
