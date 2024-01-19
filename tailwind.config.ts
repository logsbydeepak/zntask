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
type g = (typeof colorNumber)[number]

const newGray = Object.fromEntries(
  colorNumber.map((n) => [n, `var(--gray-${n})`])
)

const newOrange = Object.fromEntries(
  colorNumber.map((n) => [n, `var(--orange-${n})`])
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
