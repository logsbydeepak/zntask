import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import {
  CheckCircleIcon,
  CircleIcon,
  InboxIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { CategoryPopover } from '@/components/category-popover'
import { Head } from '@/components/head'
import { SchedulePicker } from '@/components/schedule'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import * as Badge from '@ui/badge'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { ActionButton } from '../ui/button'

const schema = z.object({
  categoryId: z.string().nullable(),
  tasks: z.array(
    z.object({
      _id: z.string().nullable(),
      title: zRequired,
      date: z.date().nullable(),
      time: z.date().nullable(),
      details: z.string().nullable(),
      isCompleted: z.boolean(),
    })
  ),
})

export function TaskDialog() {
  const isCreate = useAppStore((state) => state.dialog.createTask)
  const isEdit = useAppStore((state) => state.dialog.editTask)
  const setDialog = useAppStore((state) => state.setDialog)

  const task = useTaskStore(
    useShallow((s) => {
      if (!isEdit) return { parentTask: undefined, childTasks: [] }
      const isParentId = 'parentTaskId' in isEdit
      const isChildId = 'childTaskId' in isEdit

      if (isParentId) {
        const parentTask = s.parentTasks.find(
          (i) => i.id === isEdit.parentTaskId
        )

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

        const parentTask = s.parentTasks.find(
          (i) => i.id === childTask?.parentId
        )
        const childTasks = s.childTasks.filter(
          (i) => i.parentId === childTask?.parentId
        )

        return { parentTask, childTasks }
      }

      return { parentTask: undefined, childTasks: [] }
    })
  )

  const isOpen = isCreate || !!isEdit

  const closeDialog = () => {
    if (isCreate) return setDialog({ createTask: false })
    if (isEdit) return setDialog({ editTask: null })
  }

  if (isEdit && !task.parentTask) {
    closeDialog()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Portal>
        <Dialog.Content
          className="p-0 focus:outline-none sm:p-0"
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            document
              .querySelector<HTMLInputElement>('[data-init-focus="true"]')
              ?.focus()
          }}
        >
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
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
  const addParentTask = useTaskStore((s) => s.addParentTask)
  const addChildTask = useTaskStore((s) => s.addChildTask)
  const editParentTask = useTaskStore((s) => s.editParentTask)
  const editChildTask = useTaskStore((s) => s.editChildTask)
  const removeChildTask = useTaskStore((s) => s.removeChildTask)
  const removeParentTask = useTaskStore((s) => s.removeParentTask)

  const [removedChildTaskIds, setRemovedChildTaskIds] = React.useState<
    string[]
  >([])

  const childTask = childTasks.map((i) => {
    return {
      ...i,
      _id: i.id,
      date: i.date ? new Date(i.date) : null,
      time: i.time ? new Date(i.time) : null,
    }
  })

  const {
    register,
    handleSubmit,
    formState: { errors, defaultValues },
    getValues,
    setValue,
    watch,
    control,
  } = useForm<FormValues>({
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
          isCompleted: parentTask?.isCompleted ?? false,
        },
        ...childTask,
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: 'tasks',
    control,
  })

  const onSubmit = (data: FormValues) => {
    if (isCreate) {
      let parentId = ''

      data.tasks.forEach((i, index) => {
        const task = {
          title: i.title,
          details: i.details,
          date: i.date ? i.date.toISOString() : null,
          time: i.time ? i.time.toISOString() : null,
          isCompleted: i.isCompleted,
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
        const task = {
          title: i.title,
          details: i.details,
          date: i.date ? i.date.toISOString() : null,
          time: i.time ? i.time.toISOString() : null,
          isCompleted: i.isCompleted,
        }

        if (index === 0) {
          let isParentTaskEdited = false
          if (parentTask.title !== task.title) isParentTaskEdited = true
          if (parentTask.details !== task.details) isParentTaskEdited = true
          if (parentTask.date !== task.date) isParentTaskEdited = true
          if (parentTask.time !== task.time) isParentTaskEdited = true
          if (parentTask.categoryId !== data.categoryId)
            isParentTaskEdited = true
          if (parentTask.isCompleted !== task.isCompleted)
            isParentTaskEdited = true
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
        if (originalChildTask.title !== i.title) isChildTaskEdited = true
        if (originalChildTask.details !== i.details) isChildTaskEdited = true
        if (originalChildTask.date !== i.date) isChildTaskEdited = true
        if (originalChildTask.time !== i.time) isChildTaskEdited = true
        if (originalChildTask.isCompleted !== i.isCompleted)
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
  }

  return (
    <>
      <Head title={parentTask ? `Edit ${parentTask?.title}` : 'Create Task'} />
      <div className="container-scroll max-h-[400px] space-y-6 overflow-y-scroll p-6">
        <span>
          <CategoryPicker
            value={watch('categoryId')}
            setValue={(value) => setValue('categoryId', value)}
          />
        </span>

        <Form.Root
          className="space-y-7"
          onSubmit={handleSubmit(onSubmit)}
          id="task"
        >
          {fields.map((_, index) => (
            <div className={cn('space-y-2', index !== 0 && 'pl-7')} key={index}>
              <div>
                <div className="flex items-center">
                  <div className="w-7">
                    <Checkbox
                      value={watch(`tasks.${index}.isCompleted`)}
                      setValue={(value) =>
                        setValue(`tasks.${index}.isCompleted`, value)
                      }
                    />
                  </div>

                  <input
                    {...register(`tasks.${index}.title`)}
                    id={`tasks.${index}.title`}
                    placeholder="task"
                    className="m-0 w-full border-0 p-0 outline-none focus-visible:ring-0"
                    autoComplete="off"
                    {...(isCreate && {
                      'data-init-focus': 'true',
                    })}
                    {...(triggerId === _._id && {
                      'data-init-focus': 'true',
                    })}
                  />
                </div>
                {errors.tasks && errors.tasks[index]?.title?.message && (
                  <span className="ml-7 mt-2 inline-block">
                    <Form.Error>
                      {errors.tasks[index]?.title?.message}
                    </Form.Error>
                  </span>
                )}
              </div>
              <div className="pl-7">
                <textarea
                  {...register(`tasks.${index}.details`)}
                  placeholder="details"
                  id={`details.${index}.details`}
                  className="container-scroll w-full resize-none border-0 p-0 text-xs font-medium text-gray-600 outline-none focus-visible:ring-0"
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
                        <TrashIcon />
                      </Badge.Icon>
                      <Badge.Label>delete</Badge.Label>
                    </Badge.Button>
                  )}

                  {index === 0 && (
                    <Badge.Button
                      onClick={() => {
                        append({
                          _id: null,
                          title: '',
                          date: null,
                          time: null,
                          isCompleted: false,
                          details: null,
                        })
                      }}
                    >
                      <Badge.Icon>
                        <PlusIcon />
                      </Badge.Icon>
                      <Badge.Label>subtask</Badge.Label>
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
                        <XIcon />
                      </Badge.Icon>
                      <Badge.Label>remove</Badge.Label>
                    </Badge.Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Form.Root>
      </div>

      <fieldset className="flex justify-between space-x-4 border-t border-gray-100 px-5 py-2">
        <Dialog.Close asChild>
          <ActionButton>Cancel</ActionButton>
        </Dialog.Close>

        <ActionButton type="submit" form="task">
          Save
        </ActionButton>
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
      className="h-4 w-4 rounded-full text-gray-600 outline-offset-4 hover:text-gray-950"
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
  const getCategory = useCategoryStore((state) => state.getCategory)
  const [isOpen, setIsOpen] = React.useState(false)
  const currentCategory = getCategory(value)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <Badge.Button className="max-w-[95%] overflow-hidden">
          <Badge.Icon>
            {!currentCategory && (
              <InboxIcon className="h-full w-full text-gray-600" />
            )}
            {currentCategory && (
              <div
                className={cn(
                  'h-2.5 w-2.5 rounded-[4.5px]',
                  `bg-${getCategoryColor(currentCategory.indicator)}-600`
                )}
              />
            )}
          </Badge.Icon>
          <Badge.Label className="w-full overflow-hidden overflow-ellipsis">
            {currentCategory ? currentCategory.title : 'Inbox'}
          </Badge.Label>
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
