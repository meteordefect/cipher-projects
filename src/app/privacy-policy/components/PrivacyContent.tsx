'use client'

import { motion } from 'framer-motion'

export default function PrivacyContent() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="container">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-8">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg mb-4 block"
              >
                Legal
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-7xl md:text-8xl font-bold leading-tight mb-8"
              >
                Privacy Policy
              </motion.h1>
            </div>
            <div className="col-span-12 md:col-span-4 md:mt-20">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl opacity-60 font-light"
              >
                Last updated: October 28, 2024
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-24">
        <div className="container">
          <div className="h-[1px] bg-current mb-24" />
          
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-16"
            >
              {/* Introduction */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Introduction</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  Cipher Projects (ABN: 38 668 009 836) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the Australian Privacy Principles contained in the Privacy Act 1988 (Cth).
                </p>
              </div>

              {/* Collection of Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Information We Collect</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg opacity-80">
                  <li>Contact information (name, email address, phone number)</li>
                  <li>Business information (company name, position)</li>
                  <li>Project requirements and specifications</li>
                  <li>Payment information for services rendered</li>
                  <li>Communication history with our team</li>
                </ul>
              </div>

              {/* Use of Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">How We Use Your Information</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg opacity-80">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Communicate with you about our services</li>
                  <li>Process payments and send invoices</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Send you technical notices and support messages</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              {/* Disclosure of Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Disclosure of Your Information</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg opacity-80">
                  <li>Our employees and contractors who need access to provide services</li>
                  <li>Service providers who assist in our operations</li>
                  <li>Professional advisers (lawyers, accountants, auditors)</li>
                  <li>Law enforcement or regulatory bodies when required by law</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Data Security</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, modification, or disclosure. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
                </p>
              </div>

              {/* Your Rights */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Your Rights</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  Under Australian privacy laws, you have the right to:
                </p>
                <ul className="list-disc list-inside space-y-3 text-lg opacity-80">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Withdraw consent for specific processing activities</li>
                  <li>Lodge a complaint with the Office of the Australian Information Commissioner</li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Contact Us</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="space-y-2 text-lg opacity-80">
                  <p>Cipher Projects</p>
                  <p>Phone: +61 2 6176 1580</p>
                  <p>Email: hello@cipherprojects.com</p>
                </div>
              </div>

              {/* Updates to Privacy Policy */}
              <div className="space-y-6">
                <h2 className="text-3xl font-normal">Changes to This Policy</h2>
                <p className="text-lg opacity-80 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this policy.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}
