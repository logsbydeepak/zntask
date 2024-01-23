import React from 'react'

import { Button } from '@/components/ui/button'
import * as Dialog from '@/components/ui/dialog'
import { useAppStore } from '@/store/app'
import { Category } from '@/utils/category'

export function DeleteCategoryDialog() {
  const category = useAppStore((s) => s.dialog.deleteCategory)
  const setDialog = useAppStore((s) => s.setDialog)

  const isOpen = !!category
  const closeDialog = () => setDialog({ deleteCategory: null })

  if (!category) return null
  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Portal>
        <Dialog.Content className="space-y-4 text-center">
          <DeleteDialogContent handleClose={closeDialog} category={category} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function DeleteDialogContent({
  handleClose,
  category,
}: {
  handleClose: () => void
  category: Category
}) {
  const deleteCategory = useAppStore((s) => s.deleteCategory)

  const handleClick = () => {
    deleteCategory(category)
    handleClose()
  }

  return (
    <>
      <div>
        <Dialog.Title>Delete Category</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete{' '}
          <span className="font-medium italic">{category.title} </span>?
        </Dialog.Description>
      </div>

      <fieldset className="flex space-x-4">
        <Dialog.Close asChild>
          <Button intent="secondary" className="w-full">
            Cancel
          </Button>
        </Dialog.Close>
        <Button className="w-full" onClick={handleClick} intent="destructive">
          Delete
        </Button>
      </fieldset>
    </>
  )
}
