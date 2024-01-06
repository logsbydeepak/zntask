import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { Loader2Icon, LoaderIcon } from 'lucide-react'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import { Update } from './edit'

export const dynamic = 'force-dynamic'

const getUserWithAuthData = unstable_cache(
  async () => {
    return await getUserWithAuth()
  },
  ['user-with-auth'],
  {
    tags: ['user'],
  }
)

export default async function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>User</Layout.Title>
        <Head title="User" />
      </Layout.Header>
      <Layout.Content>
        <Suspense fallback={<Loading />}>
          <UserInformation />
        </Suspense>
      </Layout.Content>
    </Layout.Root>
  )
}

function Loading() {
  return (
    <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
      <LoaderIcon className="size-6 animate-spin text-gray-400" />
    </div>
  )
}

async function UserInformation() {
  const user = await getUserWithAuthData()

  return (
    <div className="pb-8">
      <table className="border-separate border-spacing-x-2 border-spacing-y-2 text-sm">
        <tbody className="">
          <tr>
            <td>Name</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>Picture</td>
            <td>{user.profilePicture}</td>
          </tr>
          <tr>
            <td>Google</td>
            <td>{user.auth.google.toString()}</td>
          </tr>
          <tr>
            <td>Credential</td>
            <td>{user.auth.credential.toString()}</td>
          </tr>
        </tbody>
      </table>
      <Update />
    </div>
  )
}
