import React, { useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import {
  CheckCircleIcon,
  CircleIcon,
  InboxIcon,
  PlusIcon,
  Trash2Icon,
} from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { CategoryPopover } from '@/components/category-popover'
import { Head } from '@/components/head'
import { SchedulePicker } from '@/components/schedule'
import * as Badge from '@/components/ui/badge'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormError,
  FormFieldset,
  FormInput,
  FormLabel,
  FormRoot,
} from '@/components/ui/form'
import * as Popover from '@/components/ui/popover'
import { useAppStore } from '@/store/app'
import { ChildTask, ParentTask } from '@/store/task-slice'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

import { Button } from '../ui/button'

const schema = z.object({
  categoryId: z.string().nullable(),
  tasks: z.array(
    z.object({
      _id: z.string().nullable(),
      title: z.string().nullable(),
      date: z.date().nullable(),
      time: z.date().nullable(),
      details: z.string().nullable(),
      completedAt: z.date().nullable(),
    })
  ),
})

export function TaskDialog() {
  const isCreate = useAppStore((state) => state.dialog.createTask)
  const isEdit = useAppStore((state) => state.dialog.editTask)
  const setDialog = useAppStore((state) => state.setDialog)

  const task = useAppStore((s) => {
    if (!isEdit) return { parentTask: undefined, childTasks: [] }
    const isParentId = 'parentTaskId' in isEdit
    const isChildId = 'childTaskId' in isEdit

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

  const isOpen = isCreate || !!isEdit

  const closeDialog = () => {
    if (isCreate) return setDialog({ createTask: false })
    if (isEdit) return setDialog({ editTask: null })
  }

  if (isEdit && !task.parentTask) {
    closeDialog()
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="p-0 sm:p-0">
        <TaskDialogContent
          handleClose={closeDialog}
          isCreate={isCreate}
          parentTask={task.parentTask}
          childTasks={task.childTasks}
          triggerId={
            isEdit
              ? 'parentTaskId' in isEdit
                ? isEdit.parentTaskId
                : 'childTaskId' in isEdit
                  ? isEdit.childTaskId
                  : undefined
              : undefined
          }
        />
      </DialogContent>
    </DialogRoot>
  )
}

type FormValues = z.infer<typeof schema>
function TaskDialogContent({
  handleClose,
  isCreate,
  childTasks,
  parentTask,
  triggerId,
}: {
  handleClose: () => void
  isCreate: boolean
  parentTask: ParentTask | undefined
  childTasks: ChildTask[]
  triggerId?: string
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

  const childTask = childTasks.map((i) => {
    return {
      ...i,
      _id: i.id,
      date: i.date ? new Date(i.date) : null,
      time: i.time ? new Date(i.time) : null,
      completedAt: i.completedAt ? new Date(i.completedAt) : null,
    }
  })

  const { register, handleSubmit, getValues, setValue, watch, control } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        categoryId: parentTask?.categoryId ?? null,
        tasks: [
          {
            _id: parentTask?.id ?? null,
            title: parentTask?.title ?? '',
            details: parentTask?.details ?? '',
            date: parentTask?.date ? new Date(parentTask.date) : null,
            time: parentTask?.time ? new Date(parentTask.time) : null,
            completedAt: parentTask?.completedAt ? new Date() : null,
          },
          ...childTask,
        ],
      },
    })

  const { fields, append, remove } = useFieldArray({
    name: 'tasks',
    control,
  })

  const onSubmit = useCallback(
    (data: FormValues) => {
      if (isCreate) {
        let parentId = ''

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

      if (parentTask) {
        removedChildTaskIds.forEach((i) => removeChildTask(i))

        const parentId = parentTask.id
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
              parentTask.title !== task.title ||
              parentTask.details !== task.details ||
              parentTask.date !== task.date ||
              parentTask.time !== task.time ||
              parentTask.categoryId !== data.categoryId ||
              parentTask.completedAt !== task.completedAt
            ) {
              isParentTaskEdited = true
            }

            if (isParentTaskEdited) {
              editParentTask({
                ...parentTask,
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
          const originalChildTask = childTask.find((j) => j.id === i._id)
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
      childTask,
      handleClose,
      parentTask,
      removedChildTaskIds,
      removeChildTask,
      editChildTask,
      editParentTask,
      isCreate,
    ]
  )

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSubmit, onSubmit])

  return (
    <>
      <Head title={parentTask ? `Edit ${parentTask?.title}` : 'Create Task'} />
      <div className="">
        <div className="flex justify-between space-x-6 p-6">
          <CategoryPicker
            value={watch('categoryId')}
            setValue={(value) => setValue('categoryId', value)}
          />

          <Badge.Button
            onClick={() => {
              append({
                _id: null,
                title: '',
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
              className={cn('snap-start space-y-2', index !== 0 && 'pl-7')}
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
                    {...(isCreate && {
                      autoFocus: true,
                    })}
                    {...(triggerId === _._id && {
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

                    {index === 0 && parentTask && (
                      <Badge.Button
                        onClick={() => {
                          removeParentTask(parentTask.id)
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
        if (typeof value === 'boolean') {
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
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Badge.Button className="max-w-[95%] overflow-hidden">
          <Badge.Icon>
            {!currentCategory && <InboxIcon strokeWidth={2} />}
            {currentCategory && (
              <div
                className={cn(
                  'size-2.5 rounded-full',
                  getCategoryColor(currentCategory.indicator, 'bg')
                )}
              />
            )}
          </Badge.Icon>
          <span className="truncate">
            {currentCategory ? currentCategory.title : 'Inbox'}
          </span>
        </Badge.Button>
      </Popover.Trigger>
      {isOpen && (
        <CategoryPopover
          setValue={setValue}
          currentCategory={currentCategory}
          setIsOpen={setIsOpen}
        />
      )}
    </Popover.Root>
  )
}
