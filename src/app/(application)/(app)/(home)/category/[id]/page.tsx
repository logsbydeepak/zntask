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
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { useTaskStore } from '@/store/task'

import { CategoryMenuContent } from '../../category'

export default function Page({ params }: { params: { id?: string } }) {
  const setDialog = useAppStore((s) => s.setDialog)

  const category = useCategoryStore(
    useShallow((s) => s.categories.find((c) => c.id === params.id))
  )

  const tasks = useTaskStore(
    useShallow((s) => {
      if (!category) return []
      return s.parentTasks.filter((i) => i.categoryId === category.id)
    })
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
        {tasks.length === 0 && (
          <Layout.Empty.Container>
            <Layout.Empty.Icon>
              <CheckCheckIcon />
            </Layout.Empty.Icon>
            <Layout.Empty.Label>No task</Layout.Empty.Label>
          </Layout.Empty.Container>
        )}

        {tasks.map((i) => (
          <p
            key={i.id}
            onClick={() => setDialog({ editTask: { parentTaskId: i.id } })}
          >
            {i.title}
          </p>
        ))}
      </Layout.Content>
    </Layout.Root>
  )
}
