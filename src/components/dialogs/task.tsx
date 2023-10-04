import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Popover from '@radix-ui/react-popover'
import { format, isThisYear, isToday, isTomorrow, isYesterday } from 'date-fns'
import { CalendarIcon, HourglassIcon, InboxIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { CategoryPopover } from '@/components/category-popover'
import { Head } from '@/components/head'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Task, useTaskStore } from '@/store/task'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import { Button } from '@ui/button'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { SchedulePopover } from '../schedule-popover'

const schema = z.object({
  title: zRequired,
  categoryId: z.string().nullable(),
  date: z.date().nullable(),
  time: z.date().nullable(),
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
        <Dialog.Content className="space-y-4 focus:outline-none">
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
  isEdit: null | Task
}) {
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = React.useState(false)
  const [isSchedulePickerOpen, setIsSchedulePickerOpen] = React.useState(false)
  const addTask = useTaskStore((state) => state.addTask)
  const editTask = useTaskStore((state) => state.editTask)
  const getCategory = useCategoryStore((state) => state.getCategory)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: isEdit?.title ?? '',
      categoryId: isEdit?.categoryId ?? null,
      date: isEdit?.date ? new Date(isEdit.date) : null,
      time: isEdit?.time ? new Date(isEdit.time) : null,
    },
  })

  const onSubmit = (data: FormValues) => {
    const date = data.date ? data.date.toISOString() : null
    const time = data.time ? data.time.toISOString() : null

    if (isCreate)
      addTask({
        ...data,
        categoryId: getValues('categoryId'),
        isCompleted: false,
        date,
        time,
      })
    if (isEdit) editTask({ ...isEdit, ...data, date, time })
    handleClose()
  }
  const categoryId = watch('categoryId')
  const title = isEdit ? `Edit ${isEdit?.title}` : 'Create Task'
  const currentCategory = getCategory(categoryId)
  const date = watch('date')
  const time = watch('time')

  return (
    <>
      <Head title={title} />
      <div>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>Add a new task.</Dialog.Description>
      </div>

      <div className="space-y-7">
        <div className="space-y-2">
          <Form.Root onSubmit={handleSubmit(onSubmit)} id="task">
            <Form.Label htmlFor="title">Task</Form.Label>
            <Form.Input {...register('title')} id="title" />
            {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
          </Form.Root>
          <div>
            <Form.Label htmlFor="category">Category</Form.Label>
            <Popover.Root
              open={isCategoryPickerOpen}
              onOpenChange={setIsCategoryPickerOpen}
            >
              <Popover.Trigger asChild>
                <button
                  className={cn(
                    Form.formInputStyle(),
                    'flex items-center text-left'
                  )}
                  id="category"
                  type="button"
                >
                  <div className="mr-2 flex h-3.5 w-3.5 items-center justify-center">
                    {!currentCategory && (
                      <InboxIcon className="h-full w-full text-gray-600" />
                    )}
                    {currentCategory && (
                      <div
                        className={cn(
                          'h-3 w-3 rounded-[4.5px]',
                          `bg-${getCategoryColor(
                            currentCategory.indicator
                          )}-600`
                        )}
                      />
                    )}
                  </div>
                  <span>
                    {currentCategory ? currentCategory.title : 'Inbox'}
                  </span>
                </button>
              </Popover.Trigger>
              <CategoryPopover
                setValue={(value) => {
                  setValue('categoryId', value)
                }}
                setIsOpen={setIsCategoryPickerOpen}
                currentCategory={currentCategory}
              />
            </Popover.Root>
          </div>
          <Form.Label htmlFor="schedule">Schedule</Form.Label>
          <Popover.Root
            open={isSchedulePickerOpen}
            onOpenChange={setIsSchedulePickerOpen}
          >
            <Popover.Trigger asChild>
              <button
                className={cn(
                  Form.formInputStyle(),
                  'flex items-center text-left'
                )}
                id="schedule"
                type="button"
              >
                <div className="flex w-1/2 items-center">
                  {!date && !time && <span>None</span>}
                  {date && (
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-600" />
                  )}
                  {date && showDate(date)}
                </div>

                {time && <div className="mx-4 h-3 border-l border-gray-200" />}

                <div className="flex w-1/2 items-center">
                  {time && (
                    <HourglassIcon className="mr-2 h-3.5 w-3.5 text-gray-600" />
                  )}
                  {time && showTime(time)}
                </div>
              </button>
            </Popover.Trigger>
            {date && (
              <HelperButton
                onClick={() => {
                  setValue('date', null)
                  setValue('time', null)
                }}
              >
                <HelperIcon>
                  <CalendarIcon strokeWidth={2.5} />
                </HelperIcon>
                <HelperText>clear date</HelperText>
              </HelperButton>
            )}

            {time && (
              <HelperButton
                onClick={() => {
                  setValue('time', null)
                }}
              >
                <HelperIcon>
                  <HourglassIcon strokeWidth={2.5} />
                </HelperIcon>
                <HelperText>clear time</HelperText>
              </HelperButton>
            )}

            <SchedulePopover
              setIsOpen={setIsSchedulePickerOpen}
              date={date}
              time={time}
              setDate={(value) => {
                setValue('date', value)
              }}
              setTime={(value) => {
                setValue('time', value)
              }}
            />
          </Popover.Root>
        </div>

        <fieldset className="flex space-x-4">
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" type="submit" form="task">
            Submit
          </Button>
        </fieldset>
      </div>
    </>
  )
}

const showDate = (date: Date) => {
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

const showTime = (time: Date) => {
  return format(time, 'h:mm a')
}

function HelperButton({
  onClick,
  children,
}: {
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="mr-2 inline-flex items-center rounded-full bg-orange-600 px-2 py-0.5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-1"
    >
      {children}
    </button>
  )
}

function HelperIcon({ children }: { children: React.ReactNode }) {
  return <span className="mr-1 inline-block h-2 w-2">{children}</span>
}

function HelperText({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium">{children}</span>
}
