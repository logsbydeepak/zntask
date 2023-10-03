'use client'

import { FolderIcon } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

import { CategoryContainer, CategoryItem } from '../category-components'

export default function Page() {
  const categories = useCategoryStore(useShallow((s) => s.categories))

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content>
        <CategoryContainer>
          {categories.length === 0 && (
            <Layout.Empty.Container>
              <Layout.Empty.Icon>
                <FolderIcon className="h-full w-full" />
              </Layout.Empty.Icon>
              <Layout.Empty.Label>No category</Layout.Empty.Label>
            </Layout.Empty.Container>
          )}

          {categories.map((i) => (
            <CategoryItem key={i.id} category={i} href={`/category/${i.id}`} />
          ))}
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}
