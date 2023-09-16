'use client'

import Link from 'next/link'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

export default function Page() {
  const categories = useCategoryStore((state) => state.categories)

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content>
        {categories.map((i) => (
          <Link key={i.id} href={`/category/${i.id}`} className="block">
            {i.title}
          </Link>
        ))}
      </Layout.Content>
    </Layout.Root>
  )
}
