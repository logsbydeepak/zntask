import { CheckCheckIcon } from 'lucide-react'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Upcoming</Layout.Title>
        <Head title="Upcoming" />
      </Layout.Header>
      <Layout.Content>
        <Layout.Empty.Container>
          <Layout.Empty.Icon>
            <CheckCheckIcon className="h-full w-full" />
          </Layout.Empty.Icon>
          <Layout.Empty.Label>No task</Layout.Empty.Label>
        </Layout.Empty.Container>
      </Layout.Content>
    </Layout.Root>
  )
}
