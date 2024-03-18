import { Inter, JetBrains_Mono } from 'next/font/google'

import { cn } from '@/utils/style'

import './globals.css'

import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme'

export const metadata: Metadata = {
  title: 'zntask',
}

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetBrains',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          jetBrainsMono.variable,
          'overflow-y-scroll bg-gray-1 font-sans text-gray-12'
        )}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
