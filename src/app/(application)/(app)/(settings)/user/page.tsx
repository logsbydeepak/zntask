import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import { ResetPassword, Update } from './edit'

export default async function Page() {
  const user = await getUserWithAuth()

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>User</Layout.Title>
        <Head title="User" />
      </Layout.Header>
      <Layout.Content>
        {JSON.stringify(user)}
        <ResetPassword />
        <Update />
      </Layout.Content>
    </Layout.Root>
  )
}
