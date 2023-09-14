import { Suspense } from 'react'

import { Dialogs } from '@/components/dialogs'

import { CategorySync } from './category-sync'
import { getUser } from './fetch'
import { IsReady } from './is-ready'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  return (
    <>
      <Suspense fallback={<Loading />}>
        <GetUser />
        <IsReady>
          <Sidebar />
          <main className="h-[1000px] pl-56 pt-14">{children}</main>
          <Dialogs />
          <CategorySync />
        </IsReady>
      </Suspense>
    </>
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

function Loading() {
  return <h1>LOADING...</h1>
}
