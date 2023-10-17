import React, { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'
import { useCategoryStore } from '@/store/category'

import { InitStore, SidebarState } from './app-loading'
import { getCategories } from './category.h'
import { getUser } from './fetch'
import { AppLayout, JotaiProvider } from './layout-client'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { SplashScreen } from './splash-screen'
import { Sync } from './sync'
import { getTasks } from './task.h'

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
  const user = await getUser()
  const categories = await getCategories()
  const tasks = await getTasks()

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        profilePicture={user.profilePicture}
        email={user.email}
      />
      <InitStore
        categories={categories.categories}
        parentTask={tasks.parentTask}
        childTask={tasks.childTask}
      />
    </>
  )
}
