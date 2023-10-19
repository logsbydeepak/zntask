import { setFips } from 'crypto'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckboxIndicator,
  Root as CheckboxRoot,
} from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import {
  format,
  isThisYear,
  isToday,
  isTomorrow,
  isYesterday,
  sub,
} from 'date-fns'
import {
  ArrowBigUpIcon,
  ArrowUpLeftFromCircle,
  ArrowUpLeftFromCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
  CornerDownLeftIcon,
  DeleteIcon,
  HourglassIcon,
  InboxIcon,
  PlusIcon,
  ShovelIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react'
import {
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { ulid } from 'ulidx'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import { CategoryPopover } from '@/components/category-popover'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, Task, useTaskStore } from '@/store/task'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import { Button } from '@ui/button'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { SchedulePopover } from '../schedule-popover'

const schema = z.object({
  categoryId: z.string().nullable(),
  tasks: z.array(
    z.object({
      id: z.string().nullable(),
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

  const isOpen = isCreate || !!isEdit
  const setIsOpen = React.useCallback(
    (isOpen: boolean) => {
      if (isCreate) return setDialog('createTask', isOpen)
      if (isEdit) return setDialog('editTask', null)
    },
    [setDialog, isCreate, isEdit]
  )

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content className="p-0 focus:outline-none sm:p-0">
          <TaskDialogContent
            handleClose={handleClose}
            isEdit={isEdit}
            isCreate={isCreate}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type FormValues = z.infer<typeof schema>
function TaskDialogContent({
  handleClose,
  isEdit,
  isCreate,
}: {
  handleClose: () => void
  isCreate: boolean
  isEdit: null | ParentTask
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

  const subTasks = useTaskStore(
    useShallow((s) =>
      s.childTasks
        .filter((i) => i.parentId === isEdit?.id)
        .map((i) => ({
          ...i,
          id: i.id,
          date: i.date ? new Date(i.date) : null,
          time: i.time ? new Date(i.time) : null,
        }))
    )
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: isEdit?.categoryId ?? null,
      tasks: [
        {
          id: isEdit?.id ?? null,
          title: isEdit?.title ?? '',
          date: isEdit?.date ? new Date(isEdit.date) : null,
          time: isEdit?.time ? new Date(isEdit.time) : null,
          isCompleted: isEdit?.isCompleted ?? false,
        },
        ...subTasks,
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

    if (isEdit) {
      removedChildTaskIds.forEach((i) => removeChildTask(i))

      const parentId = isEdit.id
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
          if (isEdit.title !== task.title) isParentTaskEdited = true
          if (isEdit.details !== task.details) isParentTaskEdited = true
          if (isEdit.date !== task.date) isParentTaskEdited = true
          if (isEdit.time !== task.time) isParentTaskEdited = true
          if (isEdit.categoryId !== data.categoryId) isParentTaskEdited = true
          if (isEdit.isCompleted !== task.isCompleted) isParentTaskEdited = true
          if (isParentTaskEdited) {
            editParentTask({
              ...isEdit,
              ...task,
              categoryId: data.categoryId,
            })
          }
          return
        }

        if (!i.id) {
          addChildTask({
            ...task,
            parentId,
            orderId: index.toString(),
          })
          return
        }

        let isChildTaskEdited = false
        const originalChildTask = subTasks.find((j) => j.id === i.id)
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
            id: i.id,
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
      <Head title={isEdit ? `Edit ${isEdit?.title}` : 'Create Task'} />
      <div className="container-scroll max-h-[400px] space-y-6 overflow-y-scroll p-6">
        <span>
          <CategoryPicker watch={watch} setValue={setValue} />
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
                      watch={watch}
                      setValue={setValue}
                      index={index}
                      getValues={getValues}
                    />
                  </div>

                  <input
                    {...register(`tasks.${index}.title`)}
                    id="title"
                    placeholder="task"
                    className="m-0 w-full border-0 p-0 outline-none focus-visible:ring-0"
                    autoComplete="off"
                    autoFocus={index === 0}
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
                    watch={watch}
                    setValue={setValue}
                    index={index}
                  />

                  {index === 0 && isEdit && (
                    <InfoButton
                      onClick={() => {
                        removeParentTask(isEdit.id)
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
                          id: null,
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
                        const id = getValues(`tasks.${index}.id`)
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
  index,
  getValues,
  watch,
  setValue,
}: {
  index: number
  getValues: UseFormGetValues<FormValues>
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  return (
    <CheckboxRoot
      defaultChecked={getValues(`tasks.${index}.isCompleted`)}
      checked={watch(`tasks.${index}.isCompleted`)}
      onCheckedChange={(value) => {
        if (typeof value === 'boolean') {
          setValue(`tasks.${index}.isCompleted`, value)
        }
      }}
      className="h-4 w-4 rounded-full text-gray-600 outline-offset-4 hover:text-gray-950"
      name="task status"
    >
      {!watch(`tasks.${index}.isCompleted`) && <CircleIcon />}
      <CheckboxIndicator asChild>
        <CheckCircleIcon />
      </CheckboxIndicator>
    </CheckboxRoot>
  )
}

function CategoryPicker({
  watch,
  setValue,
}: {
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
}) {
  const getCategory = useCategoryStore((state) => state.getCategory)
  const [isOpen, setIsOpen] = React.useState(false)

  const categoryId = watch('categoryId')
  const currentCategory = getCategory(categoryId)

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
          setValue={(value) => {
            setValue('categoryId', value)
          }}
          setIsOpen={setIsOpen}
          currentCategory={currentCategory}
        />
      )}
    </Popover.Root>
  )
}

function DateAndTimePicker({
  watch,
  setValue,
  index,
}: {
  watch: UseFormWatch<FormValues>
  setValue: UseFormSetValue<FormValues>
  index: number
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const date = watch(`tasks.${index}.date`)
  const time = watch(`tasks.${index}.time`)

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
          setDate={(value) => {
            setValue(`tasks.${index}.date`, value)
          }}
          setTime={(value) => {
            setValue(`tasks.${index}.time`, value)
          }}
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
