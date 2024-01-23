'use client'

import { ThemeProvider as Theme } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Theme attribute="class">{children}</Theme>
}
