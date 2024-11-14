import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-neue-haas)'],
      },
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
        black: '900',
      },
      colors: {
        'cipherblack': '#101010',
        'ciphergold': '#e8ded5',
        'ciphernavy': '#002244',
        'offwhite': '#f8f8f8',
      },
      cursor: {
        'custom': 'url("/path/to/your/cursor-image.png"), auto',
      },
      transform: {
        'perspective-1000': 'perspective(1000px)',
      },
      transformOrigin: {
        'center': 'center',
      },
      scale: {
        '95': '0.95',
        '105': '1.05',
        '110': '1.10',
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.6, 0.01, 0.05, 0.95)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'magnetic': 'magnetic 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        magnetic: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(var(--x, 0), var(--y, 0))' },
        },
      },
      boxShadow: {
        'hover-3d': '0 10px 30px -15px rgba(0, 0, 0, 0.2)',
        'card-3d': '0 20px 40px -20px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1))',
        'hover-gradient': 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.2))',
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.transform-style-flat': {
          'transform-style': 'flat',
        },
        '.backface-visible': {
          'backface-visibility': 'visible',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.perspective-none': {
          'perspective': 'none',
        },
        '.perspective-500': {
          'perspective': '500px',
        },
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.perspective-2000': {
          'perspective': '2000px',
        },
        '.translate-z-0': {
          'transform': 'translateZ(0)',
        },
        '.translate-z-50': {
          'transform': 'translateZ(50px)',
        },
        '.translate-z-100': {
          'transform': 'translateZ(100px)',
        },
      })
    }),
  ],
}

export default config