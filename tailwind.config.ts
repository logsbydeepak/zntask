import { type Config } from "tailwindcss"
import colors from "tailwindcss/colors"

import { categoryIndicatorOptions } from "./src/utils/category"

const colorNumber = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
]

const colorName = [
  "gray",
  "orange",
  "red",
  "blue",
  "green",
  "lime",
  "pink",
  "violet",
  "indigo",
  "cyan",
  "amber",
]

const newColor: { [key: string]: { [key: string]: string } } = {}

colorName.forEach((color) => {
  const colorList: { [key: string]: string } = {}

  colorNumber.forEach((n) => {
    colorList[n] = `hsl(var(--${color}-${n}))`
  })

  newColor[color] = colorList
})

const safelist: string[] = []
categoryIndicatorOptions.forEach((item) => {
  const color = item.color
  safelist.push(`bg-${color}-9`, `hover:ring-${color}-6`)
})

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.tsx", "./src/components/**/*.tsx"],
  theme: {
    colors: {
      white: colors.white,
      black: colors.black,
      transparent: colors.transparent,
      ...newColor,
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      screens: {
        xs: "355px",
      },
      backgroundImage: {
        "auth-layout-gradient": "var(--auth-layout-gradient)",
      },
    },
  },
  safelist,
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
}
export default config
