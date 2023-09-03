import { type Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/app/**/*.tsx', './src/components/**/*.tsx'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
