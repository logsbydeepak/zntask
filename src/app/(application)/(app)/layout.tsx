import { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'

import { AppLoading } from './app-loading'
import { getUser } from './fetch'
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
      <AppLoading>
        <GetUser />
        <Sidebar />
        <main className="pl-56 pt-14">
          <div className="mx-auto max-w-7xl px-10 py-4">{children}</div>
        </main>
        <Dialogs />
        <Sync />
      </AppLoading>
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
