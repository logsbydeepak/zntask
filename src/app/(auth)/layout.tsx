import { Inter } from 'next/font/google'

import { ThemeProvider } from '@/components/client-providers'
import { cn } from '@/utils/style'

import { Theme } from './client-components'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          inter.variable,
          'relative min-h-full items-center justify-center bg-newGray-1 font-sans text-newGray-12 md:flex'
        )}
      >
        <ThemeProvider>
          <div className="absolute inset-0 hidden *:absolute *:inset-0 md:block">
            <div className="bg-auth-layout-gradient opacity-20" />
            <div className="bg-auth-layout-square" />
            <div className="bg-gradient-to-t from-gray-50/80 to-gray-100/50" />
          </div>
          <div className="flex flex-col items-center space-y-6 border-gray-100 p-6 sm:p-8 md:my-[180px]  md:w-[500px] md:rounded-xl md:border md:border-gray-200 md:bg-newGray-1 md:p-10 md:drop-shadow-md">
            {children}
            <Theme />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
