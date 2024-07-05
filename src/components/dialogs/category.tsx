import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as RadioGroup from "@radix-ui/react-radio-group"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "#/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { FormError, FormInput, FormLabel, FormRoot } from "#/components/ui/form"
import { useAppStore } from "#/store/app"
import {
  Category,
  categoryIndicatorOptions,
  getCategoryColor,
  zCategoryIndicator,
} from "#/utils/category"
import { cn } from "#/utils/style"
import { zRequired } from "#/utils/zSchema"

import { Head } from "../head"

const schema = z.object({
  title: zRequired,
  indicator: zCategoryIndicator,
})

export function CategoryDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const dialogOpen = useAppStore((state) => state.dialogOpen)

  const isCreate = useAppStore((state) => state.dialog.createCategory)
  const isEdit = useAppStore((state) => state.dialog.editCategory)
  const setDialog = useAppStore((state) => state.setDialog)

  const [editCategoryDefaultData, setEditCategoryDefaultData] =
    React.useState<null | Category>(null)
  const [createNewMode, setCreateNewMode] = React.useState(false)

  React.useEffect(() => {
    if (dialogOpen !== "createCategory") {
      setIsOpen(false)
    }
  }, [dialogOpen, setIsOpen])

  React.useEffect(() => {
    if (isCreate) {
      setCreateNewMode(true)
      setEditCategoryDefaultData(null)
      setIsOpen(true)
      setDialog({ createCategory: false })
      return
    }

    if (isEdit) {
      setEditCategoryDefaultData(isEdit)
      setCreateNewMode(false)
      setIsOpen(true)
      setDialog({ editCategory: null })
      return
    }
  }, [
    isCreate,
    isEdit,
    setIsOpen,
    setDialog,
    setCreateNewMode,
    setEditCategoryDefaultData,
  ])

  return (
    <DialogRoot open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="space-y-4">
        <CategoryDialogContent
          handleClose={() => setIsOpen(false)}
          isEdit={editCategoryDefaultData}
          isCreate={createNewMode}
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
      title: isEdit?.title ?? "",
      indicator: isEdit?.indicator ?? "orange",
    },
  })

  const onSubmit = (data: FormValues) => {
    if (isCreate) addCategory(data)
    if (isEdit) editCategory({ ...isEdit, ...data })

    handleClose()
  }

  const title = isEdit ? `Edit ${isEdit?.title}` : "Create Category"

  return (
    <>
      <Head title={title} />
      <div>
        <DialogTitle className="w-[95%] truncate">{title}</DialogTitle>
        <DialogDescription>Add a new category to your list.</DialogDescription>
      </div>

      <FormRoot className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormInput {...register("title")} id="title" autoFocus />
            <FormError>{errors.title?.message}</FormError>
          </div>

          <div className="space-y-2">
            <FormLabel htmlFor="indicator">Indicator</FormLabel>
            <RadioGroup.Root
              className="flex justify-between"
              defaultValue={getValues("indicator")}
              onValueChange={(value) => {
                const validatedValue = zCategoryIndicator.parse(value)
                setValue("indicator", validatedValue)
              }}
            >
              {categoryIndicatorOptions.map((option) => (
                <RadioGroup.Item
                  key={option.label}
                  value={option.label}
                  id={option.label}
                  className={cn(
                    "flex size-[18px] items-center justify-center rounded-full",
                    "cursor-pointer bg-gradient-to-b from-white/10 to-black/20 hover:ring-2 focus-visible:outline-offset-[3px]",
                    getCategoryColor(option.label, "bg hover:ring")
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
      </FormRoot>
    </>
  )
}
