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
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
