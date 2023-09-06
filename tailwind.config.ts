import { type Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/app/**/*.tsx', './src/components/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
