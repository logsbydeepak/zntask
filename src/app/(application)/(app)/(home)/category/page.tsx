'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { FolderIcon, MoreVerticalIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { DropdownMenuRoot } from '@/components/ui/menu'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useCategoryStore } from '@/store/category'
import { Category } from '@/utils/category'

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
    useShallow((s) => {
      const categories = s.categories.filter((c) => !c.isArchived)

      const lastCategory = categories.find((c) => c.orderId === null)
      if (!lastCategory) return []

      const sortedCategories: Category[] = []

      const findCategory = (id: string) => {
        const category = categories.find((c) => c.orderId === id)
        if (!category) return
        sortedCategories.unshift(category)
        findCategory(category.id)
      }
      findCategory(lastCategory.id)
      sortedCategories.push(lastCategory)

      return sortedCategories
    })
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
