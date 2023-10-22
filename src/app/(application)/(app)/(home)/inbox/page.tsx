'use client'

import React from 'react'
import { InboxIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'

export default function Page() {
  const tasks = useTaskStore(
    useShallow((s) => s.parentTasks.filter((i) => !i.categoryId))
  )

  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Inbox</Layout.Title>
        <Head title="Inbox" />
      </Layout.Header>
      <Layout.Content>
        {tasks.length === 0 && (
          <Layout.Empty.Container>
            <Layout.Empty.Icon>
              <InboxIcon />
            </Layout.Empty.Icon>
            <Layout.Empty.Label>No task</Layout.Empty.Label>
          </Layout.Empty.Container>
        )}

        <div className="space-y-3">
          {tasks.map((i) => (
            <ParentTaskItem key={i.id} task={i} />
          ))}
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}

function ParentTaskItem({ task }: { task: ParentTask }) {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)
  const childTask = useTaskStore(
    useShallow((s) => s.childTasks.filter((i) => i.parentId === task.id))
  )
  const setDialog = useAppStore((s) => s.setDialog)

  const childTaskToDisplay = childTask.slice(
    0,
    childTask.length >= 5 && !isCollapsibleOpen ? 4 : childTask.length
  )

  return (
    <div>
      <button
        className="w-full text-left"
        onClick={() => {
          setDialog({ editTask: { parentTaskId: task.id } })
        }}
      >
        <p>{task.title}</p>
      </button>
      <div className="ml-5">
        {childTaskToDisplay.map((i) => (
          <ChildTaskItem key={i.id} task={i} />
        ))}
        <button onClick={() => setIsCollapsibleOpen((open) => !open)}>
          toggle show
        </button>
      </div>
    </div>
  )
}

function ChildTaskItem({ task }: { task: ChildTask }) {
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <button
      className="block text-xs"
      onClick={() => setDialog({ editTask: { childTaskId: task.id } })}
    >
      <p>{task.title}</p>
    </button>
  )
}
