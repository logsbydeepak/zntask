import React, { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'
import { getInitialData } from '@/data'

import { InitStore, SidebarState } from './app-loading'
import { AppLayout, JotaiProvider } from './layout-client'
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
      <JotaiProvider>
        <SidebarState />
        <GetUser />
        <Sidebar />
        <AppLayout>{children}</AppLayout>
        <Dialogs />
        <Sync />
      </JotaiProvider>
    </Suspense>
  )
}

async function GetUser() {
  const initialData = await getInitialData()
  const user = initialData.user

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        profilePicture={user.profilePicture}
        email={user.email}
      />
      <InitStore
        categories={initialData.categories}
        parentTask={initialData.parentTasks}
        childTask={initialData.childTasks}
      />
    </>
  )
}
