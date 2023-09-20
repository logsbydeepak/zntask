import { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'

import { AppLoading } from './app-loading'
import { getUser } from './fetch'
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
        <AppLoading>
          <GetUser />
          <Sidebar />
          <AppLayout>{children}</AppLayout>
          <Dialogs />
          <Sync />
        </AppLoading>
      </JotaiProvider>
    </Suspense>
  )
}

async function GetUser() {
  const user = await getUser()
  return (
    <Navbar
      firstName={user.firstName}
      lastName={user.lastName}
      profilePicture={user.profilePicture}
      email={user.email}
    />
  )
}
