import React from 'react'
import { Command } from 'cmdk'
import { FolderIcon, InboxIcon, SearchIcon } from 'lucide-react'
import { isValid } from 'ulidx'

import { ActionButton } from '@/components/ui/button'
import * as Popover from '@/components/ui/popover'
import { useCategoryStore } from '@/store/category'
import { Category, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

export const CategoryPopover = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentProps<typeof Popover.Content> & {
    setValue: (value: string | null) => void
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    currentCategory: Category | undefined
  }
>(({ setIsOpen, setValue: setParentValue, currentCategory, ...props }, ref) => {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState('')
  const addCategory = useCategoryStore((state) => state.addCategory)
  const [commandValue, setCommandValue] = React.useState('')
  const categories = useCategoryStore((state) => state.categories)

  const setValue = (value: string | null) => {
    setParentValue(value)
    setIsOpen(false)
  }

  React.useEffect(() => {
    const el = document.querySelector('[cmdk-list-sizer]')
    el?.scrollTo({ top: 0 })
  }, [search])

  return (
    <Popover.Content
      {...props}
      ref={ref}
      className="w-60 p-0"
      sideOffset={5}
      align="center"
      collisionPadding={10}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault()

          if (!search) return
          const newCategory = addCategory({
            title: search,
            indicator: 'orange',
          })
          if (!newCategory) return
          setValue(newCategory.id)
        }
      }}
    >
      <Command
        className="w-full"
        value={commandValue}
        onValueChange={(v) => setCommandValue(v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
          }
        }}
      >
        <div className="flex items-center border-b border-gray-200 py-2.5 pl-3.5 pr-2.5">
          <SearchIcon className="size-3 text-gray-400" />
          <Command.Input
            ref={searchInputRef}
            value={search}
            placeholder="search"
            onValueChange={setSearch}
            className="ml-2 h-5 w-full border-none p-0 outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>

        <Command.List className="[&>[cmdk-list-sizer]]:ml-2 [&>[cmdk-list-sizer]]:h-40 [&>[cmdk-list-sizer]]:space-y-1 [&>[cmdk-list-sizer]]:overflow-y-scroll [&>[cmdk-list-sizer]]:py-2 [&>[cmdk-list-sizer]]:pr-1">
          <Command.Empty className="flex h-36 items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-1 rounded-md border px-4 py-4 shadow-sm">
              <span className="inline-block h-5 w-5">
                <FolderIcon />
              </span>
              <p className="text-xs text-gray-600">not found</p>
            </div>
          </Command.Empty>

          {currentCategory && (
            <CategoryItem.Container
              value={`${currentCategory.title} ${currentCategory.id}`}
              onSelect={() => {
                setValue(currentCategory.id)
              }}
            >
              <CategoryItem.Icon>
                <div
                  className={cn(
                    'size-2.5 rounded-[4px]',
                    `bg-${getCategoryColor(currentCategory.indicator)}-600`
                  )}
                />
              </CategoryItem.Icon>
              <CategoryItem.Title>{currentCategory.title}</CategoryItem.Title>
            </CategoryItem.Container>
          )}

          <CategoryItem.Container
            className="group/item"
            value="inbox"
            onSelect={() => {
              setValue(null)
            }}
          >
            <CategoryItem.Icon>
              <InboxIcon className="size-3.5 text-gray-600" />
            </CategoryItem.Icon>
            <CategoryItem.Title>Inbox</CategoryItem.Title>
          </CategoryItem.Container>

          <span>
            <Command.Separator className="mx-2 my-2 border-t border-gray-100" />
          </span>

          {categories
            .filter((i) => i.id !== currentCategory?.id)
            .map((i) => (
              <CategoryItem.Container
                key={i.id}
                value={`${i.title} ${i.id}`}
                onSelect={() => {
                  setValue(i.id)
                }}
              >
                <CategoryItem.Icon>
                  <div
                    className={cn(
                      'size-2.5 rounded-[4px]',
                      `bg-${getCategoryColor(i.indicator)}-600`
                    )}
                  />
                </CategoryItem.Icon>
                <CategoryItem.Title>{i.title}</CategoryItem.Title>
              </CategoryItem.Container>
            ))}
        </Command.List>
      </Command>

      <div
        className="border-t border-gray-200 px-2.5 py-1.5"
        onKeyDown={(e) => {
          if (e.key === '/') {
            e.preventDefault()
            searchInputRef.current?.focus()
          }
        }}
      >
        <div className="flex justify-between">
          <ActionButton
            type="button"
            onClick={() => {
              if (!commandValue) return
              if (commandValue === 'inbox') {
                setValue(null)
                return
              }
              const id = commandValue.split(' ')[1]
              if (isValid(id.toUpperCase())) {
                setValue(id.toUpperCase())
                return
              }
            }}
          >
            Select
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => {
              if (!search) return
              const newCategory = addCategory({
                title: search,
                indicator: 'orange',
              })
              if (!newCategory) return
              setValue(newCategory.id)
            }}
          >
            Create new
          </ActionButton>
        </div>
      </div>
    </Popover.Content>
  )
})
CategoryPopover.displayName = 'CategoryPopover'

const CategoryItemContainer = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item>
>(({ ...props }, ref) => {
  return (
    <Command.Item
      ref={ref}
      {...props}
      className="group/item my-0.5 flex cursor-pointer items-center rounded-md border border-transparent px-2 py-1.5 data-[selected=true]:border-gray-200 data-[selected=true]:bg-gray-50"
    />
  )
})
CategoryItemContainer.displayName = Command.Item.displayName

function CategoryItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-2 flex size-4 items-center justify-center">
      {children}
    </div>
  )
}

function CategoryItemTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="overflow-hidden overflow-ellipsis text-xs text-gray-600 group-data-[selected=true]/item:text-gray-950">
      {children}
    </p>
  )
}

const CategoryItem = {
  Container: CategoryItemContainer,
  Icon: CategoryItemIcon,
  Title: CategoryItemTitle,
}
