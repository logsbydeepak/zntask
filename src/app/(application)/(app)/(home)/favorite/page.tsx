'use client'

import React from 'react'
import { HeartIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'
import { Category, sortCategories } from '@/utils/category'
import { DNDProvider } from '@/utils/dnd'

import { CategoryContainer, CategoryItem, DNDCategoryItem } from '../category'

export default function Page() {
  const favorites = useCategoryStore(
    useShallow((s) => sortCategories(s.categories, { sortByFavorite: true }))
  )

  const reorderFavorites = useCategoryStore((s) => s.reorderFavorites)

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Favorite</Layout.Title>
        <Head title="Favorite" />
      </Layout.Header>
      <Layout.Content>
        {favorites.length === 0 && (
          <Layout.Empty.Container>
            <Layout.Empty.Icon>
              <HeartIcon />
            </Layout.Empty.Icon>
            <Layout.Empty.Label>No favorite</Layout.Empty.Label>
          </Layout.Empty.Container>
        )}

        <CategoryContainer>
          <DNDProvider
            onDrop={({ start, over }) => {
              if (!start) return
              if (!over) return
              if (start === over) return
              reorderFavorites(start, over)
            }}
          >
            {favorites.map((i) => (
              <DNDCategoryItem
                key={i.id}
                category={i}
                href={`/favorite/${i.id}`}
              />
            ))}
          </DNDProvider>
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
