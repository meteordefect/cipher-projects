// src/components/contact/ContactForm.tsx
"use client"; 
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-16 bg-slate-50">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-light mb-6">
          Hello. Let's talk about what you need, and how we can help
        </h1>
        <p className="text-slate-600">
          The more details you include, the easier it will be for us to get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="border-b border-slate-200">
          <label className="block text-slate-700 mb-2">Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="First and Last"
            className="w-full bg-transparent py-3 focus:outline-none text-slate-800"
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        {/* Other form fields remain the same but with proper TypeScript types */}
        
        <button
          type="submit"
          className="mt-8 px-8 py-3 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};