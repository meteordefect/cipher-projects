import localFont from 'next/font/local'

export const neueHaas = localFont({
  src: [
    {
      path: '../../public/fonts/NeueHaasDisplay-Roman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  preload: true,
  // Subset the font to only include Latin characters
  variable: '--font-neue-haas',
  fallback: ['system-ui', 'arial'],
})
