import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { getUserWithAuth } from '@/data/user'

import { ResetPassword } from './component.c'

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
      </Layout.Content>
    </Layout.Root>
  )
}
