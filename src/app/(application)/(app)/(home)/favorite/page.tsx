'use client'

import { Link } from 'lucide-react'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

export default function Page() {
  const favorites = useCategoryStore((s) =>
    s.categories.filter((c) => c.isFavorite)
  )

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Favorite</Layout.Title>
        <Head title="Favorite" />
      </Layout.Header>
      <Layout.Content>
        {favorites.map((i) => (
          <Link key={i.id} href={`/favorite/${i.id}`} className="block">
            {i.title}
          </Link>
        ))}
      </Layout.Content>
    </Layout.Root>
  )
}
