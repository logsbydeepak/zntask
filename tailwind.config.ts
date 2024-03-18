import { type Config } from 'tailwindcss'

import { categoryIndicatorOptions } from './src/utils/category'

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

const newBlue = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--blue-${n}))`])
)

const newGreen = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--green-${n}))`])
)

const newLime = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--lime-${n}))`])
)

const newPink = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--pink-${n}))`])
)

const newViolet = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--violet-${n}))`])
)

const newIndigo = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--indigo-${n}))`])
)

const newCyan = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--cyan-${n}))`])
)

const newAmber = Object.fromEntries(
  colorNumber.map((n) => [n, `hsl(var(--amber-${n}))`])
)

const safelist: string[] = []
categoryIndicatorOptions.forEach((item) => {
  const color = item.color
  const newColor = `new${color.charAt(0).toUpperCase()}${color.slice(1)}`
  safelist.push(`bg-${newColor}-9`, `hover:ring-${newColor}-6`)
})

const config: Config = {
  darkMode: 'class',
  content: ['./src/app/**/*.tsx', './src/components/**/*.tsx'],
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
        newBlue,
        newGreen,
        newLime,
        newPink,
        newViolet,
        newIndigo,
        newCyan,
        newAmber,
      },
      screens: {
        xs: '355px',
      },
      backgroundImage: {
        'auth-layout-gradient': 'var(--auth-layout-gradient)',
      },
    },
  },
  safelist,
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-animate')],
}
export default config
