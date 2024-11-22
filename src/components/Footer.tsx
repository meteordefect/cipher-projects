'use client'

import Link from 'next/link'
import Image from 'next/image'

// First, create a social media links configuration
const socialLinks = {
  LinkedIn: 'https://www.linkedin.com/company/cipherprojects',
  Twitter: 'https://twitter.com/cipherprojects',
  Facebook: 'https://www.facebook.com/profile.php?id=61560910197514'
};

export default function Footer() {
  return (
    <footer className="w-screen relative left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] bg-black text-white">
      {/* Main Section */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 py-32">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl md:text-4xl font-normal mb-8">
              Got a project in mind?
              <br />
              Let's make it happen.
            </h2>
            <Link 
              href="/contact" 
              className="inline-block text-lg border border-white px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
            >
              Start a Project
            </Link>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4 opacity-60">Contact</h3>
              <Link href="tel:+61261761580" className="block text-xl hover:opacity-60 transition-opacity">
                +61 2 6176 1580
              </Link>
              <Link href="mailto:hello@cipherprojects.com" className="block text-xl hover:opacity-60 transition-opacity">
                hello@cipherprojects.com
              </Link>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider mb-4 opacity-60">Location</h3>
              <p className="text-xl">
                Mawson 2607
                <br />
                Canberra, Australia
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-12 gap-8 pt-16 border-t border-white/20">
          {/* Logo */}
          <div className="col-span-12 md:col-span-3">
            <div className="relative w-32 h-12">
              <Image
                src="/white-logo.png"
                alt="Cipher Projects"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-6 md:col-span-3">
            <h3 className="text-sm uppercase tracking-wider mb-4 opacity-60">Menu</h3>
            <nav className="flex flex-col gap-2">
              {['Projects', 'Services', 'About', 'Research'].map((item) => (
                <Link 
                  key={item} 
                  href={`/${item.toLowerCase()}`}
                  className="hover:opacity-60 transition-opacity"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="col-span-6 md:col-span-3">
            <h3 className="text-sm uppercase tracking-wider mb-4 opacity-60">Social</h3>
            <nav className="flex flex-col gap-2">
              {Object.entries(socialLinks).map(([platform, url]) => (
                <Link 
                  key={platform} 
                  href={url}
                  target="_blank"  // Opens in new tab
                  rel="noopener noreferrer"  // Security best practice
                  className="hover:opacity-60 transition-opacity group flex items-center gap-2"
                >
                  {platform}
                  <span className="opacity-0 group-hover:opacity-60 transition-opacity">↗</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Copyright */}
          <div className="col-span-12 md:col-span-3 flex flex-col justify-between">
            <div className="text-sm opacity-60">
              <p className="mb-2">© 2024 Cipher Projects.</p>
              <Link href="/privacy-policy" className="hover:opacity-100 transition-opacity">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}