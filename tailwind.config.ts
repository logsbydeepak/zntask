import { type Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.tsx',
    './src/components/**/*.tsx',
    './tw-safelist.txt',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetBrains)'],
        sans: ['var(--font-inter)'],
      },
      colors: {
        background: 'hsl(var(--color-background))',
        text: 'hsl(var(--color-text))',
      },
      screens: {
        xs: '355px',
      },
      backgroundImage: {
        'auth-layout-square': 'url(/square.svg)',
        'auth-layout-gradient': 'var(--auth-layout-gradient)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}
export default config
