'use client'

import React from 'react'
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
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { useTaskStore } from '@/store/task'

import { CategoryMenuContent } from '../../category'
import { EmptyTaskCategory, TaskContainer } from '../../task'

export default function Page({ params }: { params: { id?: string } }) {
  const [preventFocus, setPreventFocus] = React.useState(false)
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
              <DropdownMenuContent
                align={'end'}
                onCloseAutoFocus={(e) => preventFocus && e.preventDefault()}
              >
                <CategoryMenuContent
                  category={category}
                  type="dropdown"
                  setPreventFocus={setPreventFocus}
                />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </Layout.Header>
      <Layout.Content>
        <TabsRoot defaultValue="planed">
          <TabsList>
            <TabsTrigger value="planed">Planed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="planed">
            <div className="mt-4">
              <PlanedTab categoryId={category.id} />
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="mt-4">
              <CompletedTab categoryId={category.id} />
            </div>
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

function PlanedTab({ categoryId }: { categoryId: string }) {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => i.categoryId === categoryId && !i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyTaskCategory />
  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}

function CompletedTab({ categoryId }: { categoryId: string }) {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => i.categoryId === categoryId && i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyTaskCategory />

  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}
