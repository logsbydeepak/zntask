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

import * as Layout from '@/app/(application)/(app)/app-layout'
import { SchedulePicker } from '@/components/schedule'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@/components/ui/menu'
import { useAppStore } from '@/store/app'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { DNDProvider, useDNDState, useDrag, useDrop } from '@/utils/dnd'
import { cn } from '@/utils/style'

export function EmptyInbox() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <InboxIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}

export function EmptyTaskCategory() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <InboxIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
  )
}

export function TaskContainer({ task }: { task: ParentTask }) {
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

  const childTaskToDisplay = childTask.slice(
    0,
    childTask.length >= 5 && !isCollapsibleOpen ? 4 : childTask.length
  )

  return (
    <div className="space-y-2">
      <TaskItem task={task} />
      <div className="ml-8 space-y-1">
        {childTaskToDisplay.map((i) => (
          <TaskItem key={i.id} task={i} />
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

const TaskItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & {
    task: ParentTask | ChildTask
  }
>(({ task, className, ...props }, ref) => {
  const editChildTask = useTaskStore((s) => s.editChildTask)
  const editParentTask = useTaskStore((s) => s.editParentTask)
  const [preventFocus, setPreventFocus] = React.useState(false)

  const handleOnTaskCheckboxClick = React.useCallback(
    (value: boolean) => {
      if ('categoryId' in task) {
        editParentTask({ ...task, isCompleted: value })
      }

      if ('parentId' in task) {
        editChildTask({ ...task, isCompleted: value })
      }
    },
    [editChildTask, editParentTask, task]
  )

  const handleOnTaskClick = React.useCallback(() => {
    if ('categoryId' in task) {
      setPreventFocus(true)
      editParentTask({ ...task, isCompleted: !task.isCompleted })
    }

    if ('parentId' in task) {
      setPreventFocus(true)
      editChildTask({ ...task, isCompleted: !task.isCompleted })
    }
  }, [editChildTask, editParentTask, task])

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <div
            {...props}
            ref={ref}
            className={cn(
              'relative flex w-full touch-none flex-col space-y-1 rounded-lg border border-transparent px-3 py-2 text-sm data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50',
              className
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Checkbox
                    value={task.isCompleted}
                    setValue={handleOnTaskCheckboxClick}
                  />
                </div>
                <p
                  className="w-full overflow-hidden text-ellipsis text-left"
                  onClick={handleOnTaskClick}
                >
                  {task.title}
                </p>
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
            {(task.details || task.date) && (
              <div className="ml-[26px] space-y-2">
                {task.details && (
                  <p
                    className="overflow-hidden text-ellipsis text-xs text-gray-600"
                    onClick={handleOnTaskClick}
                  >
                    {task.details?.split('\n').map((i, index) => (
                      <React.Fragment key={index}>
                        {index < 3 && (
                          <>
                            <span>{i}</span>
                            {index !== 2 && <br />}
                          </>
                        )}
                        {index === 3 && <span>...</span>}
                      </React.Fragment>
                    ))}
                  </p>
                )}
                {task.date && (
                  <SchedulePicker
                    value={{
                      date: task.date ? new Date(task.date) : null,
                      time: task.time ? new Date(task.time) : null,
                    }}
                    setValue={({ date, time }) => {
                      if ('categoryId' in task) {
                        editParentTask({
                          ...task,
                          date: date ? date.toISOString() : null,
                          time: time ? time.toISOString() : null,
                        })
                      }

                      if ('parentId' in task) {
                        editChildTask({
                          ...task,
                          date: date ? date.toISOString() : null,
                          time: time ? time.toISOString() : null,
                        })
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </ContextMenuTrigger>

        <ContextMenuPortal>
          <ContextMenuContent
            onCloseAutoFocus={(e) => preventFocus && e.preventDefault()}
          >
            <TaskMenuContent
              task={task}
              type="context"
              setPreventFocus={setPreventFocus}
            />
          </ContextMenuContent>
        </ContextMenuPortal>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            onCloseAutoFocus={(e) => preventFocus && e.preventDefault()}
          >
            <TaskMenuContent
              task={task}
              type="dropdown"
              setPreventFocus={setPreventFocus}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </ContextMenuRoot>
  )
})

TaskItem.displayName = 'TaskItem'

function TaskMenuContent({
  task,
  type,
  setPreventFocus,
}: {
  task: ParentTask | ChildTask
  type: 'context' | 'dropdown'
  setPreventFocus: (value: boolean) => void
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
          setPreventFocus(true)
          setDialog({ editTask: { parentTaskId: task.id } })
        }

        if ('parentId' in task) {
          setPreventFocus(true)
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

function BottomIndicator() {
  return (
    <div className="absolute -bottom-[5px] left-0 right-0 flex w-full translate-y-[2px] items-center px-3">
      <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

function TopIndicator() {
  return (
    <div className="absolute -top-[5px] left-0 right-0 flex w-full translate-y-[-2px] items-center px-3">
      <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

const EmptyShell = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 rounded-lg border border-gray-200 bg-gray-50"
    />
  )
})
EmptyShell.displayName = 'EmptyShell'
