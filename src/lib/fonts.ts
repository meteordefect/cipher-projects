import localFont from 'next/font/local'

export const neueHaas = localFont({
  src: [
    {
      path: '../../public/fonts/NeueHaasDisplay-XXThin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-XXThinItalic.woff2',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-XThin.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-XThinItalic.woff2',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Thin.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-ThinItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Roman.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-RomanItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-MediumItalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NeueHaasDisplay-BlackItalic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-neue-haas',
  fallback: ['system-ui', 'arial']
})
