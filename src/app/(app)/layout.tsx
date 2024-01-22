import React, { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { Inter, JetBrains_Mono } from 'next/font/google'

import { JotaiProvider, ThemeProvider } from '@/components/client-providers'
import { Dialogs } from '@/components/dialogs'
import {
  DelayRender,
  GlobalShortcut,
  State,
  SyncAppState,
} from '@/components/state'
import { ToastProvider } from '@/components/toast'
import { getInitialData } from '@/data'
import { getUser } from '@/data/user'
import { AppProvider } from '@/store/app'
import { CategoryProvider } from '@/store/category'
import { TaskProvider } from '@/store/task'
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
          'overflow-x-hidden overflow-y-scroll font-sans text-text'
        )}
      >
        <Suspense fallback={<SplashScreen />}>
          <ThemeProvider>
            <TaskProvider>
              <DelayRender>
                <InitData>
                  <Navbar />
                  <State />
                  <Sidebar />
                  <AppLayout>{children}</AppLayout>
                  <GlobalShortcut />
                  <Dialogs />
                </InitData>
              </DelayRender>
            </TaskProvider>
            <ToastProvider />
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}

const getUserData = unstable_cache(
  async () => {
    return await getUser()
  },
  ['user-data'],
  {
    tags: ['user'],
  }
)

async function InitData({ children }: { children: React.ReactNode }) {
  const initialData = await getInitialData()
  const user = await getUserData()
  return (
    <CategoryProvider initialProps={{ categories: initialData.categories }}>
      <AppProvider initialProps={{ user: user }}>
        <SyncAppState user={user} />
        {children}
      </AppProvider>
    </CategoryProvider>
  )
}
