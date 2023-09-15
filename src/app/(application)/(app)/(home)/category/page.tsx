'use client'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content></Layout.Content>
    </Layout.Root>
  )
}
