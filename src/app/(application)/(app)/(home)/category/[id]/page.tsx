'use client'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

export default function Page({ params }: { params: { id?: string } }) {
  const category = useCategoryStore((state) =>
    state.categories.find((c) => c.id === params.id)
  )

  if (!category || !params.id) {
    return <Layout.NotFound />
  }

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>{category.title}</Layout.Title>
        <Head title={category.title} />
      </Layout.Header>
      <Layout.Content></Layout.Content>
    </Layout.Root>
  )
}
