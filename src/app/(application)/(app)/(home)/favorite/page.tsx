'use client'

import React from 'react'
import { HeartIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

import { CategoryContainer, CategoryItem } from '../category'

export default function Page() {
  const favorites = useCategoryStore(
    useShallow((s) => s.categories.filter((c) => c.isFavorite))
  )

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Favorite</Layout.Title>
        <Head title="Favorite" />
      </Layout.Header>
      <Layout.Content>
        <CategoryContainer>
          {favorites.length === 0 && (
            <Layout.Empty.Container>
              <Layout.Empty.Icon>
                <HeartIcon />
              </Layout.Empty.Icon>
              <Layout.Empty.Label>No favorite</Layout.Empty.Label>
            </Layout.Empty.Container>
          )}

          {favorites.map((i) => (
            <CategoryItem key={i.id} category={i} href={`/favorite/${i.id}`} />
          ))}
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
