import React, { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { Inter, JetBrains_Mono } from 'next/font/google'

import { JotaiProvider, ThemeProvider } from '@/components/client-providers'
import { Dialogs } from '@/components/dialogs'
import { GlobalShortcut, InitAppState, State } from '@/components/state'
import { ToastProvider } from '@/components/toast'
import { getInitialData } from '@/data'
import { getUser } from '@/data/user'
import { cn } from '@/utils/style'

import { AppLayout } from './app-layout'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { SplashScreen } from './splash-screen'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetBrains',
})

export default async function Layout({
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
          'overflow-x-hidden bg-gray-100 font-sans text-text'
        )}
      >
        <JotaiProvider>
          <ThemeProvider>
            <Suspense fallback={<SplashScreen />}>
              <InitData>
                <Navbar />
                <State />
                <Sidebar />
                <AppLayout>{children}</AppLayout>
                <GlobalShortcut />
                <Dialogs />
                {children}
              </InitData>
            </Suspense>
            <ToastProvider />
          </ThemeProvider>
        </JotaiProvider>
      </body>
    </html>
  )
}

const getUserData = unstable_cache(async () => {
  return await getUser()
}, ['user'])

async function InitData({ children }: { children: React.ReactNode }) {
  const initialData = await getInitialData()
  const user = await getUserData()

  return (
    <InitAppState
      categories={initialData.categories}
      parentTask={initialData.parentTasks}
      childTask={initialData.childTasks}
      user={user}
    >
      {children}
    </InitAppState>
  )
}
