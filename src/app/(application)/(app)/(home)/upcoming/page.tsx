import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Upcoming</Layout.Title>
        <Head title="Upcoming" />
      </Layout.Header>
      <Layout.Content></Layout.Content>
    </Layout.Root>
  )
}
