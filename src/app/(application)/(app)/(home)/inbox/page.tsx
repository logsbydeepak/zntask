'use client'

import React from 'react'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import {
  CheckCircleIcon,
  CircleIcon,
  EditIcon,
  InboxIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@/components/ui/menu'
import { useAppStore } from '@/store/app'
import { ChildTask, ParentTask, Task, useTaskStore } from '@/store/task'

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
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)

  const childTask = useTaskStore(
    useShallow((s) =>
      s.childTasks
        .filter((i) => i.parentId === task.id)
        .sort((a, b) => {
          if (a.isCompleted && !b.isCompleted) {
            return 1
          }
          if (!a.isCompleted && b.isCompleted) {
            return -1
          }
          return 0
        })
    )
  )
  const setDialog = useAppStore((s) => s.setDialog)
  const editChildTask = useTaskStore((s) => s.editChildTask)
  const editParentTask = useTaskStore((s) => s.editParentTask)

  const childTaskToDisplay = childTask.slice(
    0,
    childTask.length >= 5 && !isCollapsibleOpen ? 4 : childTask.length
  )

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
        {childTaskToDisplay.map((i) => (
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

        {childTask.length > 4 && (
          <button
            onClick={() => setIsCollapsibleOpen((open) => !open)}
            className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
          >
            {isCollapsibleOpen
              ? 'show less'
              : `show ${childTask.length - 4} more`}
          </button>
        )}
      </div>
    </div>
  )
}

function TaskItem({
  task,
  handleOnTaskCheckboxClick,
  handleOnTaskClick,
}: {
  task: ParentTask | ChildTask
  handleOnTaskClick: () => void
  handleOnTaskCheckboxClick: (value: boolean) => void
}) {
  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <div className="flex items-center rounded-md border border-transparent px-3 py-2 text-sm hover:cursor-pointer hover:border-gray-200 hover:bg-gray-50 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50">
            <div className="flex w-full items-center space-x-3">
              <Checkbox
                value={task.isCompleted}
                setValue={handleOnTaskCheckboxClick}
              />
              <button onClick={handleOnTaskClick} className="w-full text-left">
                <p>{task.title}</p>
              </button>
            </div>
            <div>
              <DropdownMenuTrigger asChild>
                <button className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800">
                  <span className="inline-block h-4 w-4">
                    <MoreVerticalIcon />
                  </span>
                </button>
              </DropdownMenuTrigger>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <TaskMenuContent task={task} type="context" />
        </ContextMenuContent>
        <DropdownMenuContent align="end">
          <TaskMenuContent task={task} type="dropdown" />
        </DropdownMenuContent>
      </DropdownMenuRoot>
    </ContextMenuRoot>
  )
}

function TaskMenuContent({
  task,
  type,
}: {
  task: ParentTask | ChildTask
  type: 'context' | 'dropdown'
}) {
  const setDialog = useAppStore((s) => s.setDialog)
  const removeParentTask = useTaskStore((s) => s.removeParentTask)
  const removeChildTask = useTaskStore((s) => s.removeChildTask)

  const menuItem = [
    {
      label: 'Edit',
      icon: <EditIcon />,
      onSelect: () => {
        if ('categoryId' in task) {
          setDialog({ editTask: { parentTaskId: task.id } })
        }

        if ('parentId' in task) {
          setDialog({ editTask: { childTaskId: task.id } })
        }
      },
    },
    {
      label: 'Delete',
      icon: <Trash2Icon />,
      onSelect: () => {
        if ('categoryId' in task) {
          removeParentTask(task.id)
        }
        if ('parentId' in task) {
          removeChildTask(task.id)
        }
      },
      intent: 'destructive' as const,
    },
  ]

  if (type === 'context') {
    return menuItem.map((i) => (
      <ContextMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
        <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
        <span>{i.label}</span>
      </ContextMenuItem>
    ))
  }

  return menuItem.map((i) => (
    <DropdownMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
      <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
      <span>{i.label}</span>
    </DropdownMenuItem>
  ))
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
