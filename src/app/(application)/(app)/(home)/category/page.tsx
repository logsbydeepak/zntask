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
import { Category, sortCategories } from '@/utils/category'
import { DNDProvider, useDrop } from '@/utils/dnd'

import {
  BottomDrop,
  CategoryContainer,
  CategoryItem,
  DNDCategoryItem,
  TopDrop,
} from '../category'

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
    useShallow((s) => sortCategories(s.categories))
  )
  const reorderCategories = useCategoryStore((s) => s.reorderCategories)

  return (
    <>
      {categories.length === 0 && <EmptyLayout />}

      <CategoryContainer>
        <DNDProvider
          onDrop={({ start, over }) => {
            if (!start) return
            if (!over) return
            if (start === over) return
            reorderCategories(start, over)
          }}
        >
          {categories.map((i, idx) => (
            <div className="relative" key={i.id}>
              {idx === 0 && <TopDrop id={`start:${i.id}`} />}
              <DNDCategoryItem
                key={i.id}
                category={i}
                href={`/category/${i.id}`}
              />
              <BottomDrop id={`${i.id}:${categories[idx + 1]}`} />
            </div>
          ))}
        </DNDProvider>
      </CategoryContainer>
    </>
  )
}

function ArchiveTab() {
  const categories = useCategoryStore(
    useShallow((s) => {
      const category = s.categories.filter((c) => c.archivedAt)

      return category.sort((a, b) => {
        if (!a.archivedAt) return 1
        if (!b.archivedAt) return -1
        if (a.archivedAt > b.archivedAt) return -1
        if (a.archivedAt < b.archivedAt) return 1
        return 0
      })
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
