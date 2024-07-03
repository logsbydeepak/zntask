"use client"

import React from "react"
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from "@radix-ui/react-checkbox"
import {
  CheckCircleIcon,
  CircleIcon,
  InboxIcon,
  MoreVerticalIcon,
} from "lucide-react"

import * as Layout from "#/app/(app)/app-layout"
import { SchedulePicker } from "#/components/schedule"
import { TaskMenuContent } from "#/components/task-menu-content"
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "#/components/ui/menu"
import { genID } from "#/shared/id"
import { useAppStore } from "#/store/app"
import { ChildTask, ParentTask } from "#/store/task-slice"
import { cn } from "#/utils/style"

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

export function TaskContainer({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export const TaskItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    task: ParentTask | ChildTask
  }
>(({ task, className, ...props }, ref) => {
  const editChildTask = useAppStore((s) => s.editChildTask)
  const editParentTask = useAppStore((s) => s.editParentTask)
  const setDialog = useAppStore((s) => s.setDialog)

  const handleOnTaskCheckboxClick = React.useCallback(
    (value: boolean) => {
      if ("categoryId" in task) {
        editParentTask({
          ...task,
          completedAt: value ? new Date().toISOString() : null,
        })
      }

      if ("parentId" in task) {
        editChildTask({
          ...task,
          completedAt: value ? new Date().toISOString() : null,
        })
      }
    },
    [editChildTask, editParentTask, task]
  )

  const handleOnTaskClick = React.useCallback(() => {
    if ("categoryId" in task) {
      setDialog({ editTask: { parentTaskId: task.id } })
    }

    if ("parentId" in task) {
      setDialog({ editTask: { childTaskId: task.id } })
    }
  }, [setDialog, task])

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <div
            {...props}
            ref={ref}
            className={cn(
              "flex w-full cursor-pointer touch-none flex-col space-y-1 rounded-lg border border-transparent px-3 py-2 text-sm hover:border-gray-3 hover:bg-gray-2 data-[state=open]:border-gray-3 data-[state=open]:bg-gray-2",
              className
            )}
            onClick={(e) => {
              handleOnTaskClick()
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <Checkbox
                    value={!!task.completedAt}
                    setValue={handleOnTaskCheckboxClick}
                  />
                </div>
                <p className="w-full truncate text-left">{task.title}</p>
              </div>

              <div>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex size-6 items-center justify-center text-gray-10 hover:text-gray-11 data-[state=open]:text-gray-11"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <span className="inline-block size-4">
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
                    className="truncate text-xs text-gray-11"
                    onClick={handleOnTaskClick}
                  >
                    {task.details?.split("\n").map((i, index) => (
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
                      if ("categoryId" in task) {
                        editParentTask({
                          ...task,
                          date: date ? date.toISOString() : null,
                          time: time ? time.toISOString() : null,
                        })
                      }

                      if ("parentId" in task) {
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
          <ContextMenuContent>
            <TaskMenuContent task={task} type="context" />
          </ContextMenuContent>
        </ContextMenuPortal>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <TaskMenuContent task={task} type="dropdown" />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </ContextMenuRoot>
  )
})

TaskItem.displayName = "TaskItem"

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
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={(value) => {
        if (typeof value === "boolean") {
          setValue(value)
        }
      }}
      className="size-3.5 rounded-full text-gray-11 outline-offset-4 hover:text-gray-12"
      name="task status"
    >
      {!value && <CircleIcon />}
      <CheckboxIndicator asChild>
        <CheckCircleIcon />
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}
