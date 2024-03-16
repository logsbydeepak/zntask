import React, { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { LoaderIcon } from 'lucide-react'

import { ThemeProvider } from '@/components/client-providers'
import { Dialogs } from '@/components/dialogs'
import { LogoIcon } from '@/components/icon/logo'
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
import { cn } from '@/utils/style'

import { AppLayout } from './app-layout'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

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
          'overflow-y-scroll font-sans text-newGray-12 bg-newGray-1'
        )}
      >
        <Suspense fallback={<Loading />}>
          <ThemeProvider>
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
    <AppProvider
      initialProps={{ user: user, categories: initialData.categories }}
    >
      <SyncAppState user={user} />
      {children}
    </AppProvider>
  )
}

function Loading() {
  return (
    <div className="flex h-[calc(100vh-50px)] flex-col items-center justify-center space-y-2">
      <span className="flex size-10 items-center justify-center rounded-full bg-newOrange-9 text-[#ffffff]">
        <LogoIcon className="size-4" />
      </span>
      <span className="size-5">
        <LoaderIcon className="size-full animate-spin text-newGray-11" />
      </span>
    </div>
  )
}
