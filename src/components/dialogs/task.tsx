import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Popover from '@radix-ui/react-popover'
import { Command } from 'cmdk'
import { FolderIcon, InboxIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { isValid } from 'ulidx'
import { z } from 'zod'

import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Task, useTaskStore } from '@/store/task'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import { zRequired } from '@/utils/zod'
import { Button } from '@ui/button'
import * as Dialog from '@ui/dialog'
import * as Form from '@ui/form'

import { Head } from '../head'

const schema = z.object({
  title: zRequired,
  categoryId: z.string().nullable(),
})

export function TaskDialog() {
  const isCreate = useAppStore((state) => state.dialog.createTask)
  const isEdit = useAppStore((state) => state.dialog.editTask)
  const setDialog = useAppStore((state) => state.setDialog)

  const isOpen = isCreate || !!isEdit
  const setIsOpen = React.useCallback(
    (isOpen: boolean) => {
      if (isCreate) return setDialog('createTask', isOpen)
      if (isEdit) return setDialog('editTask', null)
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
          <TaskDialogContent
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
function TaskDialogContent({
  handleClose,
  isEdit,
  isCreate,
}: {
  handleClose: () => void
  isCreate: boolean
  isEdit: null | Task
}) {
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = React.useState(false)
  const addTask = useTaskStore((state) => state.addTask)
  const editTask = useTaskStore((state) => state.editTask)
  const getCategory = useCategoryStore((state) => state.getCategory)
  const categories = useCategoryStore((state) => state.categories)
  const [commandValue, setCommandValue] = React.useState('')
  const [search, setSearch] = React.useState('')
  const addCategory = useCategoryStore((state) => state.addCategory)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: isEdit?.title ?? '',
      categoryId: isEdit?.categoryId ?? null,
    },
  })

  const onSubmit = (data: FormValues) => {
    if (isCreate) addTask({ ...data, categoryId: null })
    if (isEdit) editTask({ ...isEdit, ...data })
    handleClose()
  }
  const categoryId = watch('categoryId')
  const title = isEdit ? `Edit ${isEdit?.title}` : 'Create Task'
  const currentCategory = getCategory(categoryId)

  React.useEffect(() => {
    setSearch('')
  }, [isCategoryPickerOpen])

  return (
    <>
      <Head title={title} />
      <div>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>Add a new task.</Dialog.Description>
      </div>

      <Form.Root className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <div>
            <Form.Label htmlFor="title">Task</Form.Label>
            <Form.Input {...register('title')} id="title" />
            {errors.title && <Form.Error>{errors.title?.message}</Form.Error>}
          </div>
          <div>
            <Form.Label htmlFor="category">Category</Form.Label>
            <Popover.Root
              open={isCategoryPickerOpen}
              onOpenChange={setIsCategoryPickerOpen}
            >
              <Popover.Trigger asChild>
                <button
                  className={cn(
                    Form.formInputStyle(),
                    'flex items-center text-left'
                  )}
                  id="category"
                  type="button"
                >
                  <div className="mr-2 flex h-3.5 w-3.5 items-center justify-center">
                    {!currentCategory && (
                      <InboxIcon className="h-full w-full text-gray-600" />
                    )}
                    {currentCategory && (
                      <div
                        className={cn(
                          'h-3 w-3 rounded-[4.5px]',
                          `bg-${getCategoryColor(
                            currentCategory.indicator
                          )}-600`
                        )}
                      />
                    )}
                  </div>
                  <span>
                    {currentCategory ? currentCategory.title : 'Inbox'}
                  </span>
                </button>
              </Popover.Trigger>
              <Popover.Content
                className="category-popover w-96 rounded-lg border border-gray-200 bg-white shadow-sm"
                sideOffset={10}
              >
                <Command
                  className="w-full px-4 py-4"
                  value={
                    currentCategory
                      ? `${currentCategory.title} ${currentCategory.id}`
                      : 'inbox'
                  }
                  onValueChange={(v) => {
                    console.log(v)
                    setCommandValue(v)
                  }}
                >
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    className={cn(Form.formInputStyle(), 'mt-0')}
                  />

                  <Command.List className="container-scroll mt-3 h-48 overflow-y-scroll pr-1">
                    <Command.Empty className="flex h-48 items-center justify-center">
                      <div className="flex h-28 w-28 flex-col items-center justify-center space-y-1 rounded-md border shadow-sm">
                        <span className="inline-block h-5 w-5">
                          <FolderIcon className="h-full w-full" />
                        </span>
                        <p className="text-xs text-gray-600">No category</p>
                      </div>
                    </Command.Empty>

                    {currentCategory && (
                      <Command.Item
                        className="group/item"
                        value={`${currentCategory.title} ${currentCategory.id}`}
                        onSelect={() => {
                          setValue('categoryId', currentCategory.id)
                          setIsCategoryPickerOpen(false)
                        }}
                      >
                        <CategoryItem.Container>
                          <CategoryItem.Icon>
                            <div
                              className={cn(
                                'h-3 w-3 rounded-[4.5px]',
                                `bg-${getCategoryColor(
                                  currentCategory.indicator
                                )}-600`
                              )}
                            />
                          </CategoryItem.Icon>
                          <CategoryItem.Title>
                            {currentCategory.title}
                          </CategoryItem.Title>
                        </CategoryItem.Container>
                      </Command.Item>
                    )}

                    <Command.Item
                      className="group/item"
                      value="inbox"
                      onSelect={() => {
                        setValue('categoryId', '')
                        setIsCategoryPickerOpen(false)
                      }}
                    >
                      <CategoryItem.Container>
                        <CategoryItem.Icon>
                          <InboxIcon className="h-3.5 w-3.5 text-gray-600" />
                        </CategoryItem.Icon>
                        <CategoryItem.Title>Inbox</CategoryItem.Title>
                      </CategoryItem.Container>
                    </Command.Item>

                    <Command.Separator className="mx-2 my-2 border-t border-gray-200" />

                    {categories
                      .filter((i) => i.id !== categoryId)
                      .map((i) => (
                        <Command.Item
                          key={i.id}
                          value={`${i.title} ${i.id}`}
                          onSelect={() => {
                            setValue('categoryId', i.id)
                            setIsCategoryPickerOpen(false)
                          }}
                          className="group/item"
                        >
                          <CategoryItem.Container>
                            <CategoryItem.Icon>
                              <div
                                className={cn(
                                  'h-3 w-3 rounded-[4.5px]',
                                  `bg-${getCategoryColor(i.indicator)}-600`
                                )}
                              />
                            </CategoryItem.Icon>
                            <CategoryItem.Title>{i.title}</CategoryItem.Title>
                          </CategoryItem.Container>
                        </Command.Item>
                      ))}
                  </Command.List>
                </Command>
                <div className="border-t border-gray-200 px-4 py-2">
                  <div className="flex justify-between">
                    <Button
                      intent="secondary"
                      type="button"
                      onClick={() => {
                        if (!commandValue) return
                        console.log(commandValue)
                        if (commandValue === 'inbox') {
                          setValue('categoryId', '')
                          setIsCategoryPickerOpen(false)
                          return
                        }
                        const id = commandValue.split(' ')[1]
                        if (isValid(id.toUpperCase())) {
                          setValue('categoryId', id.toUpperCase())
                          setIsCategoryPickerOpen(false)
                        }
                      }}
                    >
                      Select
                    </Button>
                    <Button
                      intent="secondary"
                      type="button"
                      onClick={() => {
                        if (!search) return
                        const newCategory = addCategory({
                          title: search,
                          indicator: 'orange',
                        })
                        setValue('categoryId', newCategory.id)
                        setIsCategoryPickerOpen(false)
                      }}
                    >
                      Create new
                    </Button>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Root>
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

function CategoryItemContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex cursor-pointer items-center rounded-md border border-transparent px-3 py-1.5 group-data-[selected=true]/item:border-gray-200 group-data-[selected=true]/item:bg-gray-50">
      {children}
    </div>
  )
}

function CategoryItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-2 flex h-4 w-4 items-center justify-center">
      {children}
    </div>
  )
}

function CategoryItemTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-sm">{children}</p>
}

const CategoryItem = {
  Container: CategoryItemContainer,
  Icon: CategoryItemIcon,
  Title: CategoryItemTitle,
}
