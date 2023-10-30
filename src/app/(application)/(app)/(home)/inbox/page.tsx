'use client'

import React from 'react'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import { format, isThisYear, isToday, isTomorrow, isYesterday } from 'date-fns'
import {
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
  EditIcon,
  HourglassIcon,
  InboxIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import * as Layout from '@/app/(application)/(app)/layout-components'
import { Head } from '@/components/head'
import { SchedulePopover } from '@/components/schedule-popover'
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
import { cn } from '@/utils/style'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@ui/tabs'

import { editCategory } from '../../category.h'

export default function Page() {
  return (
    <Layout.Root>
      <Layout.Header>
        <Layout.Title>Inbox</Layout.Title>
        <Head title="Inbox" />
      </Layout.Header>
      <Layout.Content>
        <TabsRoot defaultValue="planed">
          <TabsList>
            <TabsTrigger value="planed">Planed</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="planed">
            <div className="mt-4">
              <PlanedTab />
            </div>
          </TabsContent>
          <TabsContent value="completed">
            <div className="mt-4">
              <CompletedTab />
            </div>
          </TabsContent>
        </TabsRoot>
      </Layout.Content>
    </Layout.Root>
  )
}

function PlanedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => !i.categoryId && !i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyState />
  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}

function CompletedTab() {
  const tasks = useTaskStore(
    useShallow((s) =>
      s.parentTasks.filter((i) => !i.categoryId && i.isCompleted)
    )
  )

  if (tasks.length === 0) return <EmptyState />

  return (
    <div className="space-y-1">
      {tasks.map((i) => (
        <TaskContainer key={i.id} task={i} />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <Layout.Empty.Container>
      <Layout.Empty.Icon>
        <InboxIcon />
      </Layout.Empty.Icon>
      <Layout.Empty.Label>No task</Layout.Empty.Label>
    </Layout.Empty.Container>
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
  const editChildTask = useTaskStore((s) => s.editChildTask)
  const editParentTask = useTaskStore((s) => s.editParentTask)

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <div className="flex w-full items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm hover:cursor-pointer hover:border-gray-200 hover:bg-gray-50 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50">
            <div className="w-[95%]">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Checkbox
                    value={task.isCompleted}
                    setValue={handleOnTaskCheckboxClick}
                  />
                </div>
                <p
                  className="w-full cursor-text overflow-hidden text-ellipsis text-left"
                  onClick={handleOnTaskClick}
                >
                  {task.title}
                </p>
              </div>
              <div className="ml-[26px] space-y-2">
                <p
                  className="cursor-text overflow-hidden text-ellipsis text-xs text-gray-600"
                  onClick={handleOnTaskClick}
                >
                  {task.details?.split('\n').map((i, index) => (
                    <React.Fragment key={index}>
                      {index < 3 && (
                        <>
                          <span>{i}</span>
                          <br />
                        </>
                      )}
                      {index === 3 && <span>...</span>}
                    </React.Fragment>
                  ))}
                </p>
                {task.date && (
                  <DateAndTimePicker
                    date={task.date ? new Date(task.date) : null}
                    time={task.time ? new Date(task.time) : null}
                    setDate={(value) => {
                      if ('categoryId' in task) {
                        editParentTask({
                          ...task,
                          date: !value ? null : value.toISOString(),
                        })
                      }

                      if ('parentId' in task) {
                        editChildTask({
                          ...task,
                          date: !value ? null : value.toISOString(),
                        })
                      }
                    }}
                    setTime={(value) => {
                      if ('categoryId' in task) {
                        editParentTask({
                          ...task,
                          time: !value ? null : value.toISOString(),
                        })
                      }
                      if ('parentId' in task) {
                        editChildTask({
                          ...task,
                          time: !value ? null : value.toISOString(),
                        })
                      }
                    }}
                  />
                )}
              </div>
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

function showDate(date: Date) {
  return (
    (isTomorrow(date) && 'tomorrow') ||
    (isToday(date) && 'today') ||
    (isYesterday(date) && 'yesterday') ||
    (isThisYear(date) &&
      !isToday(date) &&
      !isTomorrow(date) &&
      !isYesterday(date) &&
      format(date, 'MMM d')) ||
    format(date, 'MMM d, yyyy')
  )
}

function showTime(time: Date) {
  return format(time, 'h:mm a')
}

function DateAndTimePicker({
  date,
  time,
  setDate,
  setTime,
}: {
  date: Date | null
  time: Date | null
  setDate: (date: Date | null) => void
  setTime: (date: Date | null) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <InfoButton>
          <InfoIcon>
            <CalendarIcon />
          </InfoIcon>
          <InfoText>{date ? showDate(date) : 'select'}</InfoText>

          {time && (
            <div>
              <div className="mx-1 h-2 border-l border-gray-200" />
            </div>
          )}

          {time && (
            <>
              <InfoIcon>
                <HourglassIcon />
              </InfoIcon>
              <InfoText>{time && showTime(time)}</InfoText>
            </>
          )}
        </InfoButton>
      </Popover.Trigger>
      {isOpen && (
        <SchedulePopover
          setIsOpen={setIsOpen}
          date={date}
          time={time}
          setDate={setDate}
          setTime={setTime}
        />
      )}
    </Popover.Root>
  )
}

const InfoButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ className, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className={cn(
        'mr-2 inline-flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-50 hover:text-gray-950',
        className
      )}
    />
  )
})
InfoButton.displayName = 'InfoButton'

function InfoIcon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-3 w-3 place-content-center">{children}</span>
}

function InfoText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('text-xs font-medium', className)}>{children}</span>
  )
}
