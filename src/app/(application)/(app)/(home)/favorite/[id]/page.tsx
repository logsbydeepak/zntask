'use client'

import { CheckCheckIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

export default function Page({ params }: { params: { id?: string } }) {
  const category = useCategoryStore(
    useShallow((s) =>
      s.categories.find((c) => c.id === params.id && c.isFavorite)
    )
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
      <Layout.Content>
        <Layout.Empty.Container>
          <Layout.Empty.Icon>
            <CheckCheckIcon />
          </Layout.Empty.Icon>
          <Layout.Empty.Label>No task</Layout.Empty.Label>
        </Layout.Empty.Container>
      </Layout.Content>
    </Layout.Root>
  )
}
