'use client'

import { FolderIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useCategoryStore } from '@/store/category'
import { CategoryType } from '@/utils/category'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@ui/tabs'

import { CategoryContainer, CategoryItem } from '../category-components'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content>
        <TabsRoot defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archive">Archive</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <AllTab />
          </TabsContent>
          <TabsContent value="archive">
            <ArchiveTab />
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

function AllTab() {
  const categories = useCategoryStore(
    useShallow((s) => s.categories.filter((c) => !c.isArchived))
  )

  return (
    <>
      {categories.length === 0 && <EmptyLayout />}

      <CategoryContainer>
        {categories.map((i) => (
          <CategoryItem key={i.id} category={i} href={`/category/${i.id}`} />
        ))}
      </CategoryContainer>
    </>
  )
}

function ArchiveTab() {
  const categories = useCategoryStore(
    useShallow((s) => s.categories.filter((c) => c.isArchived))
  )

  return (
    <>
      {categories.length === 0 && <EmptyLayout />}
      <CategoryContainer>
        {categories.map((i) => (
          <CategoryItem key={i.id} category={i} href={`/category/${i.id}`} />
        ))}
      </CategoryContainer>
    </>
  )
}

function EmptyLayout() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <FolderIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No category</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}
