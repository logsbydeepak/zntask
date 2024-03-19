import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/app'
import { Category } from '@/utils/category'

export function DeleteCategoryDialog() {
  const category = useAppStore((s) => s.dialog.deleteCategory)
  const setDialog = useAppStore((s) => s.setDialog)

  const isOpen = !!category
  const closeDialog = () => setDialog({ deleteCategory: null })

  if (!category) return null
  return (
    <DialogRoot open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="space-y-4 text-center">
        <DeleteDialogContent handleClose={closeDialog} category={category} />
      </DialogContent>
    </DialogRoot>
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
        <DialogTitle>Delete Category</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete{' '}
          <span className="font-medium italic">{category.title} </span>?
        </DialogDescription>
      </div>

      <fieldset className="flex space-x-4">
        <DialogClose asChild>
          <Button intent="secondary" className="w-full">
            Cancel
          </Button>
        </DialogClose>
        <Button className="w-full" onClick={handleClick} intent="destructive">
          Delete
        </Button>
      </fieldset>
    </>
  )
}
