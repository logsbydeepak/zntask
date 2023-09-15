import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category Id</Layout.Title>
        <Head title="Category Id" />
      </Layout.Header>
      <Layout.Content></Layout.Content>
    </Layout.Root>
  )
}
