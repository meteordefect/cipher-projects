'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

interface FormState {
  name: string;
  email: string;
  phone: string;
  budget: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
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

    try {
      const response = await fetch('/api/contact', {  // We'll create this next
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      setSubmitStatus('success')
      
      // Clear form
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
    // Your existing JSX stays exactly the same
    // Just add these status indicators:
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Your existing form fields stay the same */}

      <button
        type="submit"
        disabled={submitStatus === 'loading'}
        className={`w-full mt-8 px-8 py-4 border border-current transition-all duration-300 text-lg
          ${submitStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
      >
        {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
      </button>

      {submitStatus === 'success' && (
        <div className="text-green-600 mt-4">
          Message sent successfully!
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="text-red-600 mt-4">
          {errorMessage || 'Failed to send message. Please try again.'}
        </div>
      )}
    </form>
  )
}