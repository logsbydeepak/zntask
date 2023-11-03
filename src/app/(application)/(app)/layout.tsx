import React, { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'
import { getInitialData } from '@/data'

import { InitAppState } from './app-loading'
import { AppLayout, JotaiProvider } from './layout-client'
import { Sidebar } from './sidebar'
import { SplashScreen } from './splash-screen'
import { Sync } from './sync'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <JotaiProvider>
      <Suspense fallback={<SplashScreen />}>
        <InitData>
          <Sidebar />
          <AppLayout>{children}</AppLayout>
          <Dialogs />
          <Sync />
        </InitData>
      </Suspense>
    </JotaiProvider>
  )
}

async function InitData({ children }: { children: React.ReactNode }) {
  const initialData = await getInitialData()
  const user = initialData.user

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
