'use client'

import React from 'react'
import { HeartIcon } from 'lucide-react'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { categoryHelper } from '@/utils/category'

import { CategoryContainer, CategoryItem } from '../category'

export default function Page() {
  const favorites = useAppStore((s) =>
    categoryHelper.sortFavoriteCategories(
      categoryHelper.getFavoriteCategories(s.categories)
    )
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
          {favorites.map((i) => (
            <CategoryItem key={i.id} category={i} href={i.id} />
          ))}
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
