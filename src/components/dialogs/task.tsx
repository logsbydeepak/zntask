import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import { format, isThisYear, isToday, isTomorrow, isYesterday } from 'date-fns'
import {
  CalendarIcon,
  CheckCircleIcon,
  CircleIcon,
  HourglassIcon,
  InboxIcon,
} from 'lucide-react'
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
  details: z.string().optional(),
  isCompleted: z.boolean(),
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
    control,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: isEdit?.title ?? '',
      categoryId: isEdit?.categoryId ?? null,
      date: isEdit?.date ? new Date(isEdit.date) : null,
      time: isEdit?.time ? new Date(isEdit.time) : null,
      isCompleted: isEdit?.isCompleted ?? false,
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    const date = data.date ? data.date.toISOString() : null
    const time = data.time ? data.time.toISOString() : null

    if (isCreate)
      addTask({
        ...data,
        categoryId: getValues('categoryId'),
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

  const isChecked = watch('isCompleted')

  return (
    <>
      <Head title={title} />
      <div>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>Add a new task.</Dialog.Description>
      </div>

      <div className="space-y-7">
        <div className="space-y-4">
          <Form.Root
            onSubmit={handleSubmit(onSubmit)}
            id="task"
            className="space-y-2"
          >
            <div>
              <div className="flex items-center space-x-4">
                <Checkbox.Root
                  defaultChecked={getValues('isCompleted')}
                  checked={isChecked}
                  onCheckedChange={(value) => {
                    if (typeof value === 'boolean') {
                      setValue('isCompleted', value)
                    }
                  }}
                  className="h-4 w-4 rounded-full text-gray-600 outline-offset-4 outline-gray-950"
                >
                  {!isChecked && <CircleIcon />}
                  <Checkbox.Indicator asChild>
                    <CheckCircleIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                <div className="w-full">
                  <input
                    {...register('title')}
                    id="title"
                    placeholder="task"
                    className="m-0 w-full border-0 p-0 outline-none focus-visible:ring-0"
                  />
                </div>
              </div>
              {errors.title && (
                <span className="ml-6 mt-2 inline-block">
                  <Form.Error>{errors.title?.message}</Form.Error>
                </span>
              )}
            </div>
            <div>
              <textarea
                {...register('details')}
                placeholder="details"
                className="container-scroll w-full resize-none border-0 p-0 pl-7 text-xs font-medium outline-none focus-visible:ring-0"
              />
            </div>
          </Form.Root>
          <div>
            <Popover.Root
              open={isCategoryPickerOpen}
              onOpenChange={setIsCategoryPickerOpen}
            >
              <Popover.Trigger asChild>
                <InfoButton>
                  <InfoIcon>
                    {!currentCategory && (
                      <InboxIcon className="h-full w-full text-gray-600" />
                    )}
                    {currentCategory && (
                      <div
                        className={cn(
                          'h-2.5 w-2.5 rounded-[4.5px]',
                          `bg-${getCategoryColor(
                            currentCategory.indicator
                          )}-600`
                        )}
                      />
                    )}
                  </InfoIcon>
                  <InfoText>
                    {currentCategory ? currentCategory.title : 'Inbox'}
                  </InfoText>
                </InfoButton>
              </Popover.Trigger>
              <CategoryPopover
                setValue={(value) => {
                  setValue('categoryId', value)
                }}
                setIsOpen={setIsCategoryPickerOpen}
                currentCategory={currentCategory}
              />
            </Popover.Root>

            <Popover.Root
              open={isSchedulePickerOpen}
              onOpenChange={setIsSchedulePickerOpen}
            >
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

const InfoButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className="mr-2 inline-flex items-center space-x-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 focus-visible:outline-gray-950"
    />
  )
})
InfoButton.displayName = 'InfoButton'

function InfoIcon({ children }: { children: React.ReactNode }) {
  return <span className="grid h-3 w-3 place-content-center">{children}</span>
}

function InfoText({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium">{children}</span>
}
