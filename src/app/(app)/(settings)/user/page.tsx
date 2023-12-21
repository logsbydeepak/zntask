import { unstable_cache } from 'next/cache'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import { Update } from './edit'

const getUserWithAuthData = unstable_cache(async () => {
  return await getUserWithAuth()
}, ['user'])

export default async function Page() {
  const user = await getUserWithAuthData()

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>User</Layout.Title>
        <Head title="User" />
      </Layout.Header>
      <Layout.Content>
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
        </div>

        <Update />
      </Layout.Content>
    </Layout.Root>
  )
}
