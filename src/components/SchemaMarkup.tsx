'use client'

export default function SchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cipher Projects',
    url: 'https://cipherprojects.com',
    logo: 'https://cipherprojects.com/black-logo.png',
    image: 'https://cipherprojects.com/black-logo.png',
    description: 'Cipher Projects delivers world-class software development services to clients across Asia & Australia. Web, mobile, cloud & AI expertise.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Canberra',
      addressRegion: 'ACT',
      postalCode: '2607',
      addressCountry: 'AU'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+61-2-6176-1580',
      contactType: 'customer service',
      email: 'hello@cipherprojects.com'
    },
    sameAs: [
      'https://www.linkedin.com/company/cipherprojects',
      'https://twitter.com/cipherprojects',
      'https://www.facebook.com/profile.php?id=61560910197514'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}