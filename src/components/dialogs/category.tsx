import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import {
  Category,
  categoryIndicatorOptions,
  zCategoryIndicator,
} from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zSchema'

import { Head } from '../head'

const schema = z.object({
  title: zRequired,
  indicator: zCategoryIndicator,
})

export function CategoryDialog() {
  const isCreate = useAppStore((state) => state.dialog.createCategory)
  const isEdit = useAppStore((state) => state.dialog.editCategory)
  const setDialog = useAppStore((state) => state.setDialog)

  const isOpen = isCreate || !!isEdit
  const setIsOpen = React.useCallback(
    (isOpen: boolean) => {
      if (isCreate) return setDialog({ createCategory: isOpen })
      if (isEdit) return setDialog({ editCategory: null })
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
          <CategoryDialogContent
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
function CategoryDialogContent({
  handleClose,
  isEdit,
  isCreate,
}: {
  handleClose: () => void
  isCreate: boolean
  isEdit: Category | null
}) {
  const addCategory = useCategoryStore((s) => s.addCategory)
  const editCategory = useCategoryStore((s) => s.editCategory)

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
      indicator: isEdit?.indicator ?? 'orange',
    },
  })

  const onSubmit = (data: FormValues) => {
    if (isCreate) addCategory(data)
    if (isEdit) editCategory({ ...isEdit, ...data })

    handleClose()
  }

  const title = isEdit ? `Edit ${isEdit?.title}` : 'Create Category'

  return (
    <>
      <Head title={title} />
      <div>
        <Dialog.Title className="w-[95%] overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </Dialog.Title>
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
              defaultValue={getValues('indicator')}
              onValueChange={(value) => {
                const validatedValue = zCategoryIndicator.parse(value)
                setValue('indicator', validatedValue)
              }}
            >
              {categoryIndicatorOptions.map((option) => (
                <RadioGroup.Item
                  key={option.label}
                  value={option.label}
                  className="flex items-center justify-center"
                  asChild
                >
                  <div
                    className={cn(
                      'h-5 w-5 cursor-pointer rounded-[8px] hover:ring-2',
                      `bg-${option.color}-600 hover:ring-${option.color}-300 `,
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
                    )}
                  >
                    <RadioGroup.Indicator asChild>
                      <div className="h-2.5 w-2.5 rounded-[4px] bg-white"></div>
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
            Save
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}
