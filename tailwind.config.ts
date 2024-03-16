import { type Config } from 'tailwindcss'

const colorNumber = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const

const newGray = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--gray-${n}))`])
)

const newOrange = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--orange-${n}))`])
)

const newRed = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--red-${n}))`])
)

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
        newGray,
        newOrange,
        newRed,
      },
      screens: {
        xs: '355px',
      },
      backgroundImage: {
        'auth-layout-gradient': 'var(--auth-layout-gradient)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}
export default config
