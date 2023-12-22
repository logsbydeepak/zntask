import { Inter } from 'next/font/google'

import { JotaiProvider, ThemeProvider } from '@/components/client-providers'
import { ToastProvider } from '@/components/toast'
import { cn } from '@/utils/style'

import { Theme } from './client-components'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          'h-full items-center justify-center overflow-x-hidden font-sans text-text md:flex md:bg-gray-50'
        )}
      >
        <ThemeProvider>
          <div className="flex flex-col items-center space-y-6 border-gray-100 p-6 sm:p-8 md:my-[180px]  md:w-[500px] md:rounded-xl md:border md:border-gray-950/5 md:bg-white md:p-10 md:drop-shadow-sm">
            {children}
            <Theme />
          </div>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
