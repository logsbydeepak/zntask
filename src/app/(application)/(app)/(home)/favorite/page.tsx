'use client'

import React from 'react'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

import { CategoryContainer, CategoryItem } from '../category-components'

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
        <CategoryContainer>
          {favorites.map((i) => (
            <CategoryItem key={i.id} category={i} href={`/favorite/${i.id}`} />
          ))}
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
