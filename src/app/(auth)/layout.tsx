import { Inter } from 'next/font/google'

import { JotaiProvider, ThemeProvider } from '@/components/client-providers'
import { cn } from '@/utils/style'

import { Theme } from './client-components'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          'overflow-x-hidden bg-gray-100 font-sans text-text'
        )}
      >
        <JotaiProvider>
          <ThemeProvider>
            <div className="items-center justify-center md:flex">
              <div className="flex flex-col items-center space-y-6 border-gray-100 bg-white p-4 sm:p-8 md:my-[180px] md:w-[500px] md:rounded-md md:border md:p-10 md:shadow-sm md:drop-shadow-sm">
                {children}
                <Theme />
              </div>
            </div>
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}
