'use client'

import { CheckCheckIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/app-layout'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ParentTask, useTaskStore } from '@/store/task'

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
      <Layout.Header>
        <Layout.Title>{category.title}</Layout.Title>
        <Head title={category.title} />
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
