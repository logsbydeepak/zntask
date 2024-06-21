'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FolderIcon } from 'lucide-react'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'
import { categoryHelper } from '@/utils/category'

import { CategoryContainer, CategoryItem } from '../category'

export default function Page() {
  const statusParams = useSearchParams().get('status')
  const activeTab = statusParams === 'archive' ? 'archive' : 'active'
  const router = useRouter()

  return (
    <Layout.Root>
      <Layout.Header>
        <div>
          <Layout.Title>Category</Layout.Title>
          <Head title="Category" />
        </div>
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
            <ActiveTab />
          </TabsContent>
          <TabsContent value="archive">
            <ArchiveTab />
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

function ActiveTab() {
  const categories = useAppStore((s) =>
    categoryHelper.sortActiveCategories(
      categoryHelper.getActiveCategories(s.categories)
    )
  )

  return (
    <>
      {categories.length === 0 && <EmptyLayout />}

      <CategoryContainer>
        {categories.map((i) => (
          <CategoryItem href={i.id} key={i.id} category={i} />
        ))}
      </CategoryContainer>
    </>
  )
}

function ArchiveTab() {
  const categories = useAppStore((s) =>
    categoryHelper.sortArchivedCategories(
      categoryHelper.getArchivedCategories(s.categories)
    )
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
