import React, { Suspense } from 'react'
import { unstable_cache } from 'next/cache'

import { Dialogs } from '@/components/dialogs'
import { GlobalShortcut, InitAppState, State } from '@/components/state'
import { getInitialData } from '@/data'
import { getUser } from '@/data/user'

import { AppLayout } from './app-layout'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { SplashScreen } from './splash-screen'
import { Sync } from './sync'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <InitData>
        <Navbar />
        <State />
        <Sidebar />
        <AppLayout>{children}</AppLayout>
        <GlobalShortcut />
        <Dialogs />
        <Sync />
      </InitData>
    </Suspense>
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
