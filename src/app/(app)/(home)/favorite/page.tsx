'use client'

import React from 'react'
import { HeartIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'
import { categoryHelper } from '@/utils/category'
import { DNDProvider } from '@/utils/dnd'

import {
  BottomDrop,
  CategoryContainer,
  DNDCategoryItem,
  TopDrop,
} from '../category'

export default function Page() {
  const favorites = useCategoryStore(
    useShallow((s) =>
      categoryHelper.sortFavoriteCategories(
        categoryHelper.getFavoriteCategories(s.categories)
      )
    )
  )
  const reorderFavoriteCategoryToTop = useCategoryStore(
    (i) => i.reorderFavoriteCategoryToTop
  )
  const reorderFavoriteCategoryToBottomOf = useCategoryStore(
    (i) => i.reorderFavoriteCategoryToBottomOf
  )

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
              const overId = over.split(':')
              if (overId[0] === start) return

              if (overId[0] === 'start') {
                reorderFavoriteCategoryToTop(start)
              }

              if (overId[0] === 'bottom') {
                reorderFavoriteCategoryToBottomOf(start, overId[1])
              }
            }}
          >
            {favorites.map((i, idx) => (
              <div className="relative" key={i.id}>
                {idx === 0 && <TopDrop id={`start:${i.id}`} />}
                <DNDCategoryItem
                  key={i.id}
                  category={i}
                  href={`/favorite/${i.id}`}
                />
                <BottomDrop id={`bottom:${i.id}`} />
              </div>
            ))}
          </DNDProvider>
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
