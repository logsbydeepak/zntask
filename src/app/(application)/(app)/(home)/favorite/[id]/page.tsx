'use client'

import { CheckCheckIcon, MoreVerticalIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { useCategoryStore } from '@/store/category'

import { CategoryMenuContent } from '../../category'

export default function Page({ params }: { params: { id?: string } }) {
  const category = useCategoryStore(
    useShallow((s) =>
      s.categories.find((c) => c.id === params.id && c.isFavorite)
    )
  )

  if (!category || !params.id) {
    return <Layout.NotFound />
  }

  return (
    <Layout.Root>
      <Head title={category.title} />
      <Layout.Header>
        <div className="flex items-center justify-between">
          <Layout.Title>{category.title}</Layout.Title>

          <DropdownMenuRoot>
            <DropdownMenuTrigger asChild>
              <button className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800">
                <span className="inline-block h-4 w-4">
                  <MoreVerticalIcon />
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent align={'end'}>
                <CategoryMenuContent category={category} type="dropdown" />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </Layout.Header>
      <Layout.Content>
        <Layout.Empty.Container>
          <Layout.Empty.Icon>
            <CheckCheckIcon />
          </Layout.Empty.Icon>
          <Layout.Empty.Label>No task</Layout.Empty.Label>
        </Layout.Empty.Container>
      </Layout.Content>
    </Layout.Root>
  )
}
