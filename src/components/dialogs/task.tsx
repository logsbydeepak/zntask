import React, { useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from "@radix-ui/react-checkbox"
import { DialogTitle } from "@radix-ui/react-dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import {
  CheckCircleIcon,
  CircleIcon,
  InboxIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { CategoryPopover } from "#/components/category-popover"
import { Head } from "#/components/head"
import { SchedulePicker } from "#/components/schedule"
import * as Badge from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
} from "#/components/ui/dialog"
import { FormRoot } from "#/components/ui/form"
import { PopoverRoot, PopoverTrigger } from "#/components/ui/popover"
import { useAppStore } from "#/store/app"
import { ChildTask, ParentTask } from "#/store/task-slice"
import { getCategoryColor } from "#/utils/category"
import { cn } from "#/utils/style"

const schema = z.object({
  categoryId: z.string().nullable(),
  tasks: z.array(
    z.object({
      _id: z.string().nullable(),
      title: z.string(),
      date: z.date().nullable(),
      time: z.date().nullable(),
      details: z.string().nullable(),
      completedAt: z.date().nullable(),
    })
  ),
})

type InitialData =
  | { type: "create" }
  | {
      type: "edit"
      parentTask: ParentTask
      childTask: ChildTask[]
      triggerId: string | undefined
    }

export function TaskDialog() {
  const initialData = React.useRef<InitialData>({ type: "create" })

  const [isOpen, setIsOpen] = React.useState(false)
  const dialogOpen = useAppStore((state) => state.dialogOpen)

  const isCreate = useAppStore((state) => state.dialog.createTask)
  const isEdit = useAppStore((state) => state.dialog.editTask)
  const setDialog = useAppStore((state) => state.setDialog)

  const task = useAppStore((s) => {
    if (!isEdit) return { parentTask: undefined, childTasks: [] }
    const isParentId = "parentTaskId" in isEdit
    const isChildId = "childTaskId" in isEdit

    if (isParentId) {
      const parentTask = s.parentTasks.find((i) => i.id === isEdit.parentTaskId)

      const childTasks = s.childTasks.filter(
        (i) => i.parentId === isEdit.parentTaskId
      )

      if (parentTask) {
        return { parentTask, childTasks: childTasks }
      }

      return { parentTask: undefined, childTasks: [] }
    }

    if (isChildId) {
      const childTask = s.childTasks.find((i) => i.id === isEdit.childTaskId)

      if (!childTask) return { parentTask: undefined, childTasks: [] }

      const parentTask = s.parentTasks.find((i) => i.id === childTask?.parentId)
      const childTasks = s.childTasks.filter(
        (i) => i.parentId === childTask?.parentId
      )

      return { parentTask, childTasks }
    }

    return { parentTask: undefined, childTasks: [] }
  })

  React.useEffect(() => {
    if (isCreate) {
      initialData.current = { type: "create" }
      setIsOpen(true)
      setDialog({ createTask: false })
      return
    }

    if (isEdit) {
      if (!task.parentTask) return
      initialData.current = {
        type: "edit",
        parentTask: task.parentTask,
        childTask: task.childTasks,
        triggerId: isEdit
          ? "parentTaskId" in isEdit
            ? isEdit.parentTaskId
            : "childTaskId" in isEdit
              ? isEdit.childTaskId
              : undefined
          : undefined,
      }
      setIsOpen(true)
      setDialog({ editTask: null })
      return
    }
  }, [isCreate, isEdit, setIsOpen, setDialog, task.childTasks, task.parentTask])

  React.useEffect(() => {
    if (dialogOpen !== "editTask" && dialogOpen !== "createTask") {
      setIsOpen(false)
    }
  }, [dialogOpen, setIsOpen])

  return (
    <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 sm:p-0">
        <TaskDialogContent
          handleClose={() => setIsOpen(false)}
          initialData={initialData.current}
        />
      </DialogContent>
    </DialogRoot>
  )
}

type FormValues = z.infer<typeof schema>

function defaultValue(initialData: InitialData): FormValues | undefined {
  const tasks: FormValues["tasks"] = []
  let categoryId: string | null = null

  if (initialData.type === "create") {
    tasks.push({
      _id: "",
      title: "",
      details: null,
      date: null,
      time: null,
      completedAt: null,
    })
  }

  if (initialData.type === "edit") {
    tasks.push({
      _id: initialData.parentTask.id,
      title: initialData.parentTask.title,
      details: initialData.parentTask.details,
      date: initialData.parentTask.date
        ? new Date(initialData.parentTask.date)
        : null,
      time: initialData.parentTask.time
        ? new Date(initialData.parentTask.time)
        : null,
      completedAt: initialData.parentTask.completedAt ? new Date() : null,
    })

    initialData.childTask.forEach((i) => {
      tasks.push({
        ...i,
        _id: i.id,
        date: i.date ? new Date(i.date) : null,
        time: i.time ? new Date(i.time) : null,
        completedAt: i.completedAt ? new Date(i.completedAt) : null,
      })
    })
    categoryId = initialData.parentTask.categoryId
  }

  return {
    tasks,
    categoryId,
  }
}

function TaskDialogContent({
  handleClose,
  initialData,
}: {
  handleClose: () => void
  initialData: InitialData
}) {
  const addParentTask = useAppStore((s) => s.addParentTask)
  const addChildTask = useAppStore((s) => s.addChildTask)
  const editParentTask = useAppStore((s) => s.editParentTask)
  const editChildTask = useAppStore((s) => s.editChildTask)
  const removeChildTask = useAppStore((s) => s.removeChildTask)
  const removeParentTask = useAppStore((s) => s.removeParentTask)

  const [removedChildTaskIds, setRemovedChildTaskIds] = React.useState<
    string[]
  >([])

  const { register, handleSubmit, getValues, setValue, watch, control } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: defaultValue(initialData),
    })

  const { fields, append, remove } = useFieldArray({
    name: "tasks",
    control,
  })

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (initialData.type === "create") {
        let parentId = ""

        data.tasks.forEach((i, index) => {
          if (!i.title) return
          const task = {
            title: i.title,
            details: i.details,
            date: i.date ? i.date.toISOString() : null,
            time: i.time ? i.time.toISOString() : null,
            completedAt: i.completedAt ? i.completedAt.toISOString() : null,
          }

          if (index === 0) {
            const { id } = addParentTask({
              ...task,
              categoryId: data.categoryId,
            })
            parentId = id
            return
          }

          if (!parentId) return
          addChildTask({
            ...task,
            parentId,
            orderId: index.toString(),
          })
        })
      }

      if (initialData.type === "edit") {
        removedChildTaskIds.forEach((i) => removeChildTask(i))

        const parentId = initialData.parentTask.id
        data.tasks.forEach((i, index) => {
          if (!i.title) return
          const task = {
            title: i.title,
            details: i.details,
            date: i.date ? i.date.toISOString() : null,
            time: i.time ? i.time.toISOString() : null,
            completedAt: i.completedAt ? i.completedAt.toISOString() : null,
          }

          if (index === 0) {
            let isParentTaskEdited = false
            if (
              initialData.parentTask.title !== task.title ||
              initialData.parentTask.details !== task.details ||
              initialData.parentTask.date !== task.date ||
              initialData.parentTask.time !== task.time ||
              initialData.parentTask.categoryId !== data.categoryId ||
              initialData.parentTask.completedAt !== task.completedAt
            ) {
              isParentTaskEdited = true
            }

            if (isParentTaskEdited) {
              editParentTask({
                ...initialData.parentTask,
                ...task,
                categoryId: data.categoryId,
              })
            }
            return
          }

          if (!i._id) {
            addChildTask({
              ...task,
              parentId,
              orderId: index.toString(),
            })
            return
          }

          let isChildTaskEdited = false
          const originalChildTask = initialData.childTask.find(
            (j) => j.id === i._id
          )
          if (!originalChildTask) return

          if (
            originalChildTask.completedAt !== i.completedAt ||
            originalChildTask.details !== i.details ||
            originalChildTask.title !== i.title ||
            originalChildTask.date !== i.date ||
            originalChildTask.time !== i.time ||
            originalChildTask.completedAt !== i.completedAt
          )
            isChildTaskEdited = true

          if (isChildTaskEdited) {
            editChildTask({
              ...task,
              id: i._id,
              parentId,
              orderId: index.toString(),
            })
          }
        })
      }

      handleClose()
    },
    [
      addChildTask,
      addParentTask,
      handleClose,
      removedChildTaskIds,
      removeChildTask,
      editChildTask,
      editParentTask,
      initialData,
    ]
  )

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleSubmit, onSubmit])

  const title =
    initialData.type === "edit"
      ? `Edit ${initialData.parentTask?.title}`
      : "Create Task"
  const description = initialData.type === "edit" ? "Edit task" : "Create Task"

  return (
    <>
      <VisuallyHidden.Root>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </VisuallyHidden.Root>
      <Head title={title} />
      <div className="">
        <div className="flex justify-between space-x-6 p-6">
          <CategoryPicker
            value={watch("categoryId")}
            setValue={(value) => setValue("categoryId", value)}
          />

          <Badge.Button
            onClick={() => {
              append({
                _id: null,
                title: "",
                date: null,
                time: null,
                details: null,
                completedAt: null,
              })
            }}
          >
            <Badge.Icon>
              <PlusIcon />
            </Badge.Icon>
            <span>subtask</span>
          </Badge.Button>
        </div>

        <FormRoot
          className="container-scroll mb-6 max-h-[200px] snap-y snap-mandatory snap-normal scroll-pb-8 space-y-7 overflow-y-scroll pl-6 sm:max-h-[400px] sm:snap-none"
          onSubmit={handleSubmit(onSubmit)}
          id="task"
        >
          {fields.map((_, index) => (
            <div
              className={cn("snap-start space-y-2", index !== 0 && "pl-7")}
              key={index}
            >
              <div className="flex space-x-2">
                <div className="flex size-6 items-center justify-center">
                  <Checkbox
                    value={!!watch(`tasks.${index}.completedAt`)}
                    setValue={(value) => {
                      setValue(
                        `tasks.${index}.completedAt`,
                        value ? new Date() : null
                      )
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <input
                    {...register(`tasks.${index}.title`)}
                    autoComplete="off"
                    id={`tasks.${index}.title`}
                    placeholder="task"
                    className="m-0 w-full border-0 p-0 outline-none placeholder:text-gray-11 focus-visible:ring-0"
                    {...(initialData.type === "create" && {
                      autoFocus: true,
                    })}
                    {...(initialData.type === "edit" &&
                      initialData.triggerId === _._id && {
                        autoFocus: true,
                      })}
                  />

                  <textarea
                    {...register(`tasks.${index}.details`)}
                    placeholder="details"
                    id={`details.${index}.details`}
                    className="container-scroll w-full resize-none border-0 p-0 text-gray-11 outline-none placeholder:text-gray-11 focus-visible:ring-0"
                  />

                  <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                    <SchedulePicker
                      value={{
                        date: watch(`tasks.${index}.date`),
                        time: watch(`tasks.${index}.time`),
                      }}
                      setValue={({ date, time }) => {
                        setValue(`tasks.${index}.date`, date)
                        setValue(`tasks.${index}.time`, time)
                      }}
                    />

                    {index === 0 && initialData.type === "edit" && (
                      <Badge.Button
                        onClick={() => {
                          removeParentTask(initialData.parentTask.id)
                          handleClose()
                        }}
                      >
                        <Badge.Icon>
                          <Trash2Icon />
                        </Badge.Icon>
                        <span>delete</span>
                      </Badge.Button>
                    )}

                    {index !== 0 && (
                      <Badge.Button
                        onClick={() => {
                          const id = getValues(`tasks.${index}._id`)
                          if (id) {
                            setRemovedChildTaskIds((prev) => [...prev, id])
                          }

                          remove(index)
                        }}
                      >
                        <Badge.Icon>
                          <Trash2Icon />
                        </Badge.Icon>
                        <span>delete</span>
                      </Badge.Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </FormRoot>
      </div>

      <fieldset className="flex justify-between space-x-4 border-t border-gray-3 px-5 py-2">
        <DialogClose asChild>
          <Button intent="ghost">Cancel</Button>
        </DialogClose>

        <Button type="submit" form="task" intent="ghost">
          Save
        </Button>
      </fieldset>
    </>
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

function CategoryPicker({
  value,
  setValue,
}: {
  value: string | null
  setValue: (id: string | null) => void
}) {
  const getCategory = useAppStore((state) => state.getCategory)
  const [isOpen, setIsOpen] = React.useState(false)
  const currentCategory = getCategory(value)

  return (
    <PopoverRoot open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Badge.Button className="max-w-[95%] overflow-hidden">
          <Badge.Icon>
            {!currentCategory && <InboxIcon strokeWidth={2} />}
            {currentCategory && (
              <div
                className={cn(
                  "size-2.5 rounded-full",
                  getCategoryColor(currentCategory.indicator, "bg")
                )}
              />
            )}
          </Badge.Icon>
          <span className="truncate">
            {currentCategory ? currentCategory.title : "Inbox"}
          </span>
        </Badge.Button>
      </PopoverTrigger>
      {isOpen && (
        <CategoryPopover
          setValue={setValue}
          currentCategory={currentCategory}
          setIsOpen={setIsOpen}
        />
      )}
    </PopoverRoot>
  )
}
