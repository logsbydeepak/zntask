import React from "react"

import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { getAppState, useAppStore } from "#/store/app"
import { Category } from "#/utils/category"

type InitialData = Category

export function DeleteCategoryDialog() {
  const initialData = React.useRef<InitialData>()

  const [isOpen, setIsOpen] = React.useState(false)
  const dialogOpen = useAppStore((state) => state.dialogOpen)
  const getState = getAppState()

  const categoryId = useAppStore((s) => s.dialog.deleteCategory)
  const setDialog = useAppStore((s) => s.setDialog)

  function handleClose() {
    setIsOpen(false)
  }

  React.useEffect(() => {
    if (categoryId) {
      const category = getState().categories.find(
        (each) => each.id === categoryId
      )
      if (!category) return

      initialData.current = category
      setDialog({ deleteCategory: null })
      setIsOpen(true)
    }
  }, [categoryId, setDialog, getState])

  React.useEffect(() => {
    if (dialogOpen !== "deleteCategory") {
      handleClose()
    }
  }, [dialogOpen, setIsOpen])

  if (!initialData.current) return null
  return (
    <DialogRoot open={isOpen} onOpenChange={() => handleClose()}>
      <DialogContent className="space-y-4 text-center">
        <DeleteDialogContent
          handleClose={handleClose}
          category={initialData.current}
        />
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
          Are you sure you want to delete{" "}
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
