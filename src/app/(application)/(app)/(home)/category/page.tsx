'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FolderIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useCategoryStore } from '@/store/category'

import { CategoryContainer, CategoryItem } from '../category'

export default function Page() {
  const statusParams = useSearchParams().get('status')
  const activeTab = statusParams === 'archive' ? 'archive' : 'active'
  const router = useRouter()

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Category</Layout.Title>
        <Head title="Category" />
      </Layout.Header>
      <Layout.Content>
        <TabsRoot
          value={activeTab}
          onValueChange={(value) => router.push(`/category?status=${value}`)}
        >
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
