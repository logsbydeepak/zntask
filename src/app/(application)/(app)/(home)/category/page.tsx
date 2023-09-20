'use client'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'

import { CategoryContainer, CategoryItem } from '../category-components'

export default function Page() {
  const categories = useCategoryStore((state) => state.categories)

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content>
        <CategoryContainer>
          {categories.map((i) => (
            <CategoryItem key={i.id} category={i} href={`/category/${i.id}`} />
          ))}
        </CategoryContainer>
      </Layout.Content>
    </Layout.Root>
  )
}