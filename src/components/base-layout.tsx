import { Inter } from 'next/font/google'

import { cn } from '@/utils/style'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body
        className={cn(
          inter.variable,
          `overflow-x-hidden font-sans text-sm text-newGray-12`
        )}
      >
        {children}
      </body>
    </html>
  )
}
