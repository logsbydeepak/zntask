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
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
