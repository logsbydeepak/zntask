import React from 'react'
import { PopoverContent } from '@radix-ui/react-popover'
import { Command } from 'cmdk'
import {
  ArrowBigUpIcon,
  CornerDownLeftIcon,
  FolderIcon,
  InboxIcon,
  SearchIcon,
} from 'lucide-react'
import { isValid } from 'ulidx'

import { useCategoryStore } from '@/store/category'
import { Category, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

export const CategoryPopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent> & {
    setValue: (value: string | null) => void
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    currentCategory: Category | undefined
  }
>(({ setIsOpen, setValue, currentCategory, ...props }, ref) => {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState('')
  const addCategory = useCategoryStore((state) => state.addCategory)
  const [commandValue, setCommandValue] = React.useState('')
  const categories = useCategoryStore((state) => state.categories)

  const handleClose = () => {
    setSearch('')
    setIsOpen(false)
  }

  return (
    <PopoverContent
      ref={ref}
      className="category-popover w-full rounded-lg border border-gray-200 bg-white shadow-sm sm:w-96"
      sideOffset={10}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault()

          if (!search) return
          const newCategory = addCategory({
            title: search,
            indicator: 'orange',
          })
          setValue(newCategory.id)
          handleClose()
        }
      }}
    >
      <Command
        className="w-full"
        value={
          currentCategory
            ? `${currentCategory.title} ${currentCategory.id}`
            : 'inbox'
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault()
          }
        }}
        onValueChange={(v) => setCommandValue(v)}
      >
        <div className="flex items-center border-b border-gray-200 px-4 py-2.5">
          <SearchIcon className="h-3 w-3 text-gray-400" />
          <Command.Input
            ref={searchInputRef}
            value={search}
            placeholder="search"
            onValueChange={setSearch}
            className="ml-2 h-5 w-full border-none p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>

        <Command.List className="container-scroll my-3 ml-4 mr-2 h-48 overflow-y-scroll pr-2">
          <Command.Empty className="flex h-48 items-center justify-center">
            <div className="flex h-28 w-28 flex-col items-center justify-center space-y-1 rounded-md border shadow-sm">
              <span className="inline-block h-5 w-5">
                <FolderIcon />
              </span>
              <p className="text-xs text-gray-600">No category</p>
            </div>
          </Command.Empty>

          {currentCategory && (
            <Command.Item
              className="group/item"
              value={`${currentCategory.title} ${currentCategory.id}`}
              onSelect={() => {
                setValue(currentCategory.id)
                handleClose()
              }}
            >
              <CategoryItem.Container>
                <CategoryItem.Icon>
                  <div
                    className={cn(
                      'h-3 w-3 rounded-[4.5px]',
                      `bg-${getCategoryColor(currentCategory.indicator)}-600`
                    )}
                  />
                </CategoryItem.Icon>
                <CategoryItem.Title>{currentCategory.title}</CategoryItem.Title>
              </CategoryItem.Container>
            </Command.Item>
          )}

          <Command.Item
            className="group/item"
            value="inbox"
            onSelect={() => {
              setValue(null)
              handleClose()
            }}
          >
            <CategoryItem.Container>
              <CategoryItem.Icon>
                <InboxIcon className="h-3.5 w-3.5 text-gray-600" />
              </CategoryItem.Icon>
              <CategoryItem.Title>Inbox</CategoryItem.Title>
            </CategoryItem.Container>
          </Command.Item>

          <Command.Separator className="mx-2 my-2 border-t border-gray-100" />

          {categories
            .filter((i) => i.id !== currentCategory?.id)
            .map((i) => (
              <Command.Item
                key={i.id}
                value={`${i.title} ${i.id}`}
                onSelect={() => {
                  setValue(i.id)
                  handleClose()
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

      <div
        className="border-t border-gray-200 px-4 py-1.5"
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
                handleClose()
                return
              }
              const id = commandValue.split(' ')[1]
              if (isValid(id.toUpperCase())) {
                setValue(id.toUpperCase())
                handleClose()
                return
              }
            }}
          >
            <span>Select</span>
            <ShortcutIcon>
              <CornerDownLeftIcon />
            </ShortcutIcon>
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => {
              if (!search) return
              const newCategory = addCategory({
                title: search,
                indicator: 'orange',
              })
              setValue(newCategory.id)
              handleClose()
            }}
          >
            <span>Create new</span>
            <div className="flex space-x-1">
              <ShortcutIcon>
                <ArrowBigUpIcon />
              </ShortcutIcon>
              <ShortcutIcon>
                <CornerDownLeftIcon />
              </ShortcutIcon>
            </div>
          </ActionButton>
        </div>
      </div>
    </PopoverContent>
  )
})
CategoryPopover.displayName = 'CategoryPopover'

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

function ShortcutIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-200 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-950">
      <span className="h-3 w-3">{children}</span>
    </span>
  )
}

function ActionButton({ children, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      {...props}
      className="group flex items-center space-x-2 rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-gray-950"
    >
      {children}
    </button>
  )
}
