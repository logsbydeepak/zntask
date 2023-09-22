import React from 'react'

import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Category } from '@/utils/category'
import { Button } from '@ui/button'
import * as Dialog from '@ui/dialog'

export function DeleteCategoryDialog() {
  const category = useAppStore((s) => s.dialog.deleteCategory)
  const setDialog = useAppStore((s) => s.setDialog)

  const isOpen = !!category
  const setIsOpen = React.useCallback(
    (isOpen: boolean) => setDialog('deleteCategory', isOpen),
    [setDialog]
  )

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!category) return null
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content className="space-y-4 text-center">
          <DeleteDialogContent handleClose={handleClose} category={category} />
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
  const deleteCategory = useCategoryStore((s) => s.deleteCategory)

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
