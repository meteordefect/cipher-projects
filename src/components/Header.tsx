'use client'

import { useState, useEffect, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useBackground } from '@/context/BackgroundContext'
import { Menu, X } from '@/components/ui/SharedIcons'
import { motion, AnimatePresence } from 'framer-motion'
import ScrambleButton from '@/components/ScrambleButton'

const menuItems = [
  { name: 'Projects', href: '/projects' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/research' }
]

const MobileMenuItem = memo(({ 
  item, 
  isDark, 
  pathname, 
  index, 
  onClick 
}: { 
  item: typeof menuItems[0]
  isDark: boolean
  pathname: string
  index: number
  onClick: () => void
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Link
      href={item.href}
      onClick={onClick}
      className={`text-4xl font-medium block text-black transition-colors duration-300 ${
        pathname === item.href ? 'opacity-100' : 'opacity-60 hover:opacity-100'
      }`}
    >
      {item.name}
    </Link>
  </motion.div>
))
MobileMenuItem.displayName = 'MobileMenuItem'

export default function Header() {
  const { isDark } = useBackground()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])


  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-10 transition-all duration-700 ${
          isScrolled ? 'backdrop-blur-md' : ''
        }`}
      >
        <div className="container">
          <nav className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <div className="relative w-40 h-14">
                <Image
                  src={isDark ? "/white-logo.png" : "/black-logo.png"}
                  alt="Cipher Projects"
                  width={160}
                  height={56}
                  priority
                  className="w-auto h-14 object-contain transition-opacity duration-700"
                />
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-12">
              {menuItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className={`text-lg font-normal tracking-wide transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-black'
                  } ${
                    pathname === item.href 
                      ? 'opacity-100' 
                      : 'opacity-100 hover:opacity-60'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Replace the old button with ScrambleButton */}
              <ScrambleButton />
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden z-50 p-2 transition-opacity ${
                isMenuOpen ? 'text-black' : isDark ? 'text-white' : 'text-black'
              } hover:opacity-70`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>

          {/* Divider Line */}
          <motion.div 
            className={`h-px transition-all duration-700 ${
              isScrolled 
                ? 'bg-transparent' 
                : isDark 
                  ? 'bg-white/90'
                  : 'bg-black/90'  // Show black divider on light backgrounds
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 backdrop-blur-sm bg-white/95"
          >
            <div className="container h-full flex flex-col justify-center">
              <nav className="space-y-8">
                {menuItems.map((item, index) => (
                  <MobileMenuItem
                    key={item.name}
                    item={item}
                    isDark={isDark}
                    pathname={pathname}
                    index={index}
                    onClick={() => setIsMenuOpen(false)}
                  />
                ))}

                {/* Mobile Let's Talk Button */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3,
                    delay: menuItems.length * 0.1 
                  }}
                  className="pt-8"
                >
                  <Link href="/contact">
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="py-3 px-6 text-2xl font-normal bg-black text-white transition-colors duration-300 hover:opacity-80"
                    >
                      Let's Talk
                    </button>
                  </Link>
                </motion.div>

              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
