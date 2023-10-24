import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
  HourglassIcon,
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
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { SchedulePopover } from '../schedule-popover'

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
    return
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Portal>
        <Dialog.Content className="p-0 focus:outline-none sm:p-0">
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
                    id="title"
                    placeholder="task"
                    className="m-0 w-full border-0 p-0 outline-none focus-visible:ring-0"
                    autoComplete="off"
                    autoFocus={isCreate ? true : triggerId === _._id}
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
                  id="details"
                  className="container-scroll w-full resize-none border-0 p-0 text-xs font-medium outline-none focus-visible:ring-0"
                />
                <div className="flex flex-wrap gap-x-1.5 gap-y-2">
                  <DateAndTimePicker
                    date={watch(`tasks.${index}.date`)}
                    time={watch(`tasks.${index}.time`)}
                    setDate={(value) => setValue(`tasks.${index}.date`, value)}
                    setTime={(value) => setValue(`tasks.${index}.time`, value)}
                  />

                  {index === 0 && parentTask && (
                    <InfoButton
                      onClick={() => {
                        removeParentTask(parentTask.id)
                        handleClose()
                      }}
                    >
                      <InfoIcon>
                        <TrashIcon />
                      </InfoIcon>
                      <InfoText>delete</InfoText>
                    </InfoButton>
                  )}

                  {index === 0 && (
                    <InfoButton
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
                      <InfoIcon>
                        <PlusIcon />
                      </InfoIcon>
                      <InfoText>subtask</InfoText>
                    </InfoButton>
                  )}

                  {index !== 0 && (
                    <InfoButton
                      onClick={() => {
                        const id = getValues(`tasks.${index}._id`)
                        if (id) {
                          setRemovedChildTaskIds((prev) => [...prev, id])
                        }

                        remove(index)
                      }}
                    >
                      <InfoIcon>
                        <XIcon />
                      </InfoIcon>
                      <InfoText>remove</InfoText>
                    </InfoButton>
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
        <InfoButton className="max-w-[95%] overflow-hidden">
          <InfoIcon>
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
          </InfoIcon>
          <InfoText className="w-full overflow-hidden overflow-ellipsis">
            {currentCategory ? currentCategory.title : 'Inbox'}
          </InfoText>
        </InfoButton>
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

function ActionButton({ children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className="group flex items-center space-x-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-950"
    >
      {children}
    </button>
  )
}
