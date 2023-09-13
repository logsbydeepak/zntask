import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAppStore } from '@/store/app'
import { zRequired } from '@/utils/zod'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { Button } from '../ui/button'

const schema = z.object({
  title: zRequired,
})

export function CategoryDialog() {
  const isOpen = useAppStore((state) => state.dialog.createCategory)
  const setDialog = useAppStore((state) => state.setDialog)

  const setIsOpen = React.useCallback(
    (isOpen: boolean) => setDialog('createCategory', isOpen),
    [setDialog]
  )

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content className="space-y-4">
          <CategoryDialogContent handleClose={handleClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type FormValues = z.infer<typeof schema>
function CategoryDialogContent({ handleClose }: { handleClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  return (
    <>
      <div>
        <Dialog.Title>Create Category</Dialog.Title>
        <Dialog.Description>
          Add a new category to your list.
        </Dialog.Description>
      </div>

      <Form.Root className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Form.Label>Title</Form.Label>
          <Form.Input {...register('title')} />
          {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
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
