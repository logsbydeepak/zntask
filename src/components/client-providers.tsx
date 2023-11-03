'use client'

import { Provider } from 'jotai'
import { ThemeProvider as Theme } from 'next-themes'

export function JotaiProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <Theme attribute="class">{children}</Theme>
}
