'use client'

import React from 'react'
import { InboxIcon } from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { ParentTask, Task, useTaskStore } from '@/store/task'

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
            <TaskContainer key={i.id} task={i} />
          ))}
        </div>
      </Layout.Content>
    </Layout.Root>
  )
}

function TaskContainer({ task }: { task: ParentTask }) {
  const childTask = useTaskStore(
    useShallow((s) => s.childTasks.filter((i) => i.parentId === task.id))
  )

  return (
    <div>
      <TaskItem task={task} />
      <div className="ml-4">
        {childTask.map((i) => (
          <TaskItem key={i.id} task={i} isChildTask={true} />
        ))}
      </div>
    </div>
  )
}

function TaskItem({
  task,
  isChildTask = false,
}: {
  task: Task
  isChildTask?: boolean
}) {
  const setDialog = useAppStore((s) => s.setDialog)

  const handleOnTaskClick = () => {
    if (isChildTask) {
      setDialog({ editTask: { childTaskId: task.id } })
      return
    }
    setDialog({ editTask: { parentTaskId: task.id } })
  }

  return (
    <div>
      <button onClick={handleOnTaskClick}>
        <p>{task.title}</p>
      </button>
    </div>
  )
}
