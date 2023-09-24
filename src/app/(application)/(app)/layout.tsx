import React, { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'
import { useCategoryStore } from '@/store/category'

import { getCategories } from './actions'
import { InitStore, SidebarState } from './app-loading'
import { getUser } from './fetch'
import { AppLayout, JotaiProvider } from './layout-client'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'
import { SplashScreen } from './splash-screen'

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
      </JotaiProvider>
    </Suspense>
  )
}

async function GetUser() {
  const user = await getUser()
  const categoriesRes = await getCategories()

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        profilePicture={user.profilePicture}
        email={user.email}
      />
      <InitStore categories={categoriesRes.categories} />
    </>
  )
}
