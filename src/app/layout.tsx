import './globals.css'

import type { Metadata } from 'next'

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
  return children
}
