import { Metadata } from 'next'

import { ResetPassword } from './component.c'
import { getUserWithAuth } from './fetch'

export const metadata: Metadata = {
  title: 'User',
}

export default async function Page() {
  const user = await getUserWithAuth()
  return (
    <>
      <h1>User</h1>
      {JSON.stringify(user)}
      <ResetPassword />
    </>
  )
}
