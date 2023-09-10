import { Suspense } from 'react'

import { getUser } from './fetch'
import { Navbar } from './navbar'

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
        {children}
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
    />
  )
}

function Loading() {
  return <h1>LOADING...</h1>
}
