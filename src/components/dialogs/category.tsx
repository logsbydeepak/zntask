import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
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

export const indicatorOptions = [
  { name: 'orange', color: 'orange-600' },
  { name: 'red', color: 'red-600' },
  { name: 'blue', color: 'blue-600' },
  { name: 'green', color: 'green-600' },
  { name: 'yellow', color: 'yellow-600' },
  { name: 'pink', color: 'pink-600' },
]

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
        <div className="space-y-2">
          <div>
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Input {...register('title')} id="title" />
            {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
          </div>

          <div>
            <Form.Label>Indicator</Form.Label>
            <RadioGroup.Root>
              {indicatorOptions.map((option) => (
                <RadioGroup.Item
                  key={option.name}
                  value={option.name}
                  className="flex items-center space-x-2"
                >
                  <RadioGroup.Indicator
                    className={`h-4 w-4 rounded-full bg-${option.color}`}
                  />
                  {option.name}
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
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
