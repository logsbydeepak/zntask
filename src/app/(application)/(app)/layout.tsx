import React, { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'
import { GlobalShortcut, InitAppState, State } from '@/components/state'
import { getInitialData } from '@/data'

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

async function InitData({ children }: { children: React.ReactNode }) {
  const initialData = await getInitialData()
  const user = initialData.user

  return (
    <InitAppState
      categories={initialData.categories}
      parentTask={initialData.parentTasks}
      childTask={initialData.childTasks}
    >
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        profilePicture={user.profilePicture}
        email={user.email}
      />
      {children}
    </InitAppState>
  )
}
