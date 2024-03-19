import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import * as Form from '@/components/ui/form'
import { useAppStore } from '@/store/app'
import {
  Category,
  categoryIndicatorOptions,
  getCategoryColor,
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
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="space-y-4">
        <CategoryDialogContent
          handleClose={handleClose}
          isEdit={isEdit}
          isCreate={isCreate}
        />
      </DialogContent>
    </DialogRoot>
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
  const addCategory = useAppStore((s) => s.addCategory)
  const editCategory = useAppStore((s) => s.editCategory)

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
        <DialogTitle className="w-[95%] truncate">{title}</DialogTitle>
        <DialogDescription>Add a new category to your list.</DialogDescription>
      </div>

      <Form.Root className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Input {...register('title')} id="title" autoFocus />
            <Form.Error>{errors.title?.message}</Form.Error>
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
                  id={option.label}
                  className={cn(
                    'flex size-[18px] items-center justify-center rounded-full',
                    'cursor-pointer bg-gradient-to-b from-white/10 to-black/20 hover:ring-2 focus-visible:outline-offset-[3px]',
                    getCategoryColor(option.label, 'bg hover:ring')
                  )}
                >
                  <RadioGroup.Indicator className="size-2 rounded-full bg-white animate-in zoom-in" />
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </div>
        </div>

        <fieldset className="flex space-x-4">
          <DialogClose asChild>
            <Button intent="secondary" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button className="w-full" type="submit">
            Save
          </Button>
        </fieldset>
      </Form.Root>
    </>
  )
}
