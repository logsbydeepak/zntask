import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAppStore } from '@/store/app'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { Button } from '../ui/button'

const schema = z.object({
  title: zRequired,
  indicator: zRequired,
})

export const indicatorOptions = [
  { name: 'orange', color: 'orange' },
  { name: 'red', color: 'red' },
  { name: 'blue', color: 'blue' },
  { name: 'green', color: 'green' },
  { name: 'yellow', color: 'yellow' },
  { name: 'pink', color: 'pink' },
  { name: 'lime', color: 'lime' },
  { name: 'cyan', color: 'cyan' },
  { name: 'violet', color: 'violet' },
  { name: 'indigo', color: 'indigo' },
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
    setValue,
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

      <Form.Root className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Input {...register('title')} id="title" />
            {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
          </div>

          <div className="space-y-2">
            <Form.Label htmlFor="indicator">Indicator</Form.Label>
            <RadioGroup.Root
              className="flex justify-between"
              defaultValue="orange"
              onValueChange={(value) => {
                const validValue = indicatorOptions.find(
                  (option) => option.name === value
                )
                if (!validValue) return
                setValue('indicator', value)
              }}
            >
              {indicatorOptions.map((option) => (
                <RadioGroup.Item
                  key={option.name}
                  value={option.name}
                  className="flex items-center justify-center"
                  asChild
                >
                  <div
                    className={cn(
                      'h-5 w-5 cursor-pointer rounded-full hover:ring-2 focus:outline-none',
                      `bg-${option.color}-600 hover:ring-${option.color}-300 focus:ring-${option.color}-300`,
                      'focus:ring-2 focus:ring-offset-white'
                    )}
                  >
                    <RadioGroup.Indicator asChild>
                      <div className="h-2.5 w-2.5 rounded-full bg-white"></div>
                    </RadioGroup.Indicator>
                  </div>
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
