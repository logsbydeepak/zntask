'use client'

import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(app)/app-layout'
import { Head } from '@/components/head'
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import * as Tabs from '@/components/ui/tabs'
import { useAppStore } from '@/store/app'

import { CategoryMenuContent } from '../../category'
import { EmptyTaskCategory, TaskContainer } from '../../task'

export default function Page({ params }: { params: { id?: string } }) {
  const [preventFocus, setPreventFocus] = React.useState(false)
  const category = useAppStore((s) =>
    s.categories.find((c) => c.id === params.id)
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
              <button className="flex size-6 items-center justify-center text-gray-10 hover:text-gray-11 data-[state=open]:text-gray-11">
                <span className="inline-block size-4">
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
        <Tabs.Root defaultValue="planed">
          <Tabs.List>
            <Tabs.Trigger value="planed">Planed</Tabs.Trigger>
            <Tabs.Trigger value="completed">Completed</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="planed">
            <div className="mt-4">
              <PlanedTab categoryId={category.id} />
            </div>
          </Tabs.Content>
          <Tabs.Content value="completed">
            <div className="mt-4">
              <CompletedTab categoryId={category.id} />
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Layout.Content>
    </Layout.Root>
  )
}

function PlanedTab({ categoryId }: { categoryId: string }) {
  const tasks = useAppStore(
    useShallow((s) =>
      s.parentTasks.filter(
        (i) => i.categoryId === categoryId && !!!i.completedAt
      )
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
  const tasks = useAppStore((s) =>
    s.parentTasks.filter((i) => i.categoryId === categoryId && i.details)
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
