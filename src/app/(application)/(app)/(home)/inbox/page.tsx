'use client'

import React from 'react'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import { CheckCircleIcon, CircleIcon, InboxIcon } from 'lucide-react'
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

        <div className="space-y-1">
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
  const setDialog = useAppStore((s) => s.setDialog)
  const editChildTask = useTaskStore((s) => s.editChildTask)
  const editParentTask = useTaskStore((s) => s.editParentTask)

  return (
    <div className="space-y-2">
      <TaskItem
        task={task}
        handleOnTaskCheckboxClick={(value) =>
          editParentTask({ ...task, isCompleted: value })
        }
        handleOnTaskClick={() =>
          setDialog({ editTask: { parentTaskId: task.id } })
        }
      />
      <div className="ml-8 space-y-1">
        {childTask.map((i) => (
          <TaskItem
            key={i.id}
            task={i}
            handleOnTaskCheckboxClick={(value) =>
              editChildTask({ ...i, isCompleted: value })
            }
            handleOnTaskClick={() =>
              setDialog({ editTask: { childTaskId: i.id } })
            }
          />
        ))}
      </div>
    </div>
  )
}

function TaskItem({
  task,
  handleOnTaskCheckboxClick,
  handleOnTaskClick,
}: {
  task: Task
  handleOnTaskClick: () => void
  handleOnTaskCheckboxClick: (value: boolean) => void
}) {
  return (
    <div className="rounded-md border border-transparent px-3 py-2 text-sm hover:border-gray-200 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <Checkbox
          value={task.isCompleted}
          setValue={handleOnTaskCheckboxClick}
        />
        <button onClick={handleOnTaskClick}>
          <p>{task.title}</p>
        </button>
      </div>
    </div>
  )
}

function Checkbox({
  value,
  setValue,
}: {
  value: boolean
  setValue: (value: boolean) => void
}) {
  return (
    <CheckboxRoot
      checked={value}
      onCheckedChange={(value) => {
        if (typeof value === 'boolean') {
          setValue(value)
        }
      }}
      className="h-3.5 w-3.5 rounded-full text-gray-600 outline-offset-4 hover:text-gray-950"
      name="task status"
    >
      {!value && <CircleIcon />}
      <CheckboxIndicator asChild>
        <CheckCircleIcon />
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}
