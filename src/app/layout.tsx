import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetBrains',
})

export const metadata: Metadata = {
  title: {
    default: 'zntask',
    template: '%s - zntask',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} overflow-x-hidden overflow-y-scroll font-sans text-sm text-gray-950`}
      >
        {children}
      </body>
    </html>
  )
}
