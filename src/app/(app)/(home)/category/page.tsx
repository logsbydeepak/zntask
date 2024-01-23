'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FolderIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import * as Tabs from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'
import { categoryHelper } from '@/utils/category'
import { DNDProvider } from '@/utils/dnd'

import { CategoryContainer, CategoryItem, DNDCategoryItem } from '../category'

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
        <Tabs.Root
          value={activeTab}
          onValueChange={(value) => router.push(`/category?status=${value}`)}
        >
          <Tabs.List className="mb-4">
            <Tabs.Trigger value="active">Active</Tabs.Trigger>
            <Tabs.Trigger value="archive">Archive</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="active">
            <ActiveTab />
          </Tabs.Content>
          <Tabs.Content value="archive">
            <ArchiveTab />
          </Tabs.Content>
        </Tabs.Root>
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
        <DNDProvider
          onDrop={(data) => {
            console.log(data)
            // if (!start) return
            // if (!over) return
            // if (start === over) return
            // const overId = over.split(':')
            // if (overId[0] === start) return
            //
            // if (overId[0] === 'start') {
            //   reorderCategoryToTop(start)
            // }
            //
            // if (overId[0] === 'bottom') {
            //   reorderCategoryToBottomOf(start, overId[1])
            // }
          }}
        >
          {categories.map((i, idx) => (
            <DNDCategoryItem
              key={i.id}
              category={i}
              href={`/category/${i.id}`}
              topCategoryId={categories[idx - 1]?.id}
              bottomCategoryId={categories[idx + 1]?.id}
            />
          ))}
        </DNDProvider>
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
