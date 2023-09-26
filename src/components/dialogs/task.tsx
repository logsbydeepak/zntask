import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAppStore } from '@/store/app'
import { Task, useTaskStore } from '@/store/task'
import { zRequired } from '@/utils/zod'
import { Button } from '@ui/button'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { Head } from '../head'

const schema = z.object({
  title: zRequired,
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
        <Dialog.Content className="space-y-4">
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
  const addTask = useTaskStore((state) => state.addTask)
  const editTask = useTaskStore((state) => state.editTask)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: isEdit?.title ?? '',
    },
  })

  const onSubmit = (data: FormValues) => {
    if (isCreate) addTask({ ...data, categoryId: null })
    if (isEdit) editTask({ ...isEdit, ...data })
    handleClose()
  }

  const title = isEdit ? `Edit ${isEdit?.title}` : 'Create Task'

  return (
    <>
      <Head title={title} />
      <div>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>Add a new task.</Dialog.Description>
      </div>

      <Form.Root className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Form.Label htmlFor="title">Task</Form.Label>
            <Form.Input {...register('title')} id="title" />
            {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
          </div>
        </div>

        <fieldset className="flex space-x-4">
          <Dialog.Close asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </Dialog.Close>
          <Button className="w-full" type="submit">
            Submit
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}
