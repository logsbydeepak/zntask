import React from 'react'
import { Command } from 'cmdk'
import { FolderIcon, InboxIcon, SearchIcon } from 'lucide-react'

import * as Popover from '@/components/ui/popover'
import { useAppStore } from '@/store/app'
import { Category, categoryHelper, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

export const CategoryPopover = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentProps<typeof Popover.Content> & {
    setValue: (value: string | null) => void
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    currentCategory: Category | undefined
  }
>(({ setIsOpen, setValue: setParentValue, currentCategory, ...props }, ref) => {
  const categories = useAppStore((s) =>
    categoryHelper
      .getActiveCategories(s.categories)
      .filter((i) => i.id !== currentCategory?.id)
  )

  const setValue = (value: string | null) => {
    setParentValue(value)
    setIsOpen(false)
  }

  return (
    <Popover.Content
      {...props}
      ref={ref}
      className="w-60 p-0"
      sideOffset={5}
      align="center"
      collisionPadding={10}
    >
      <Command>
        <div className="flex items-center space-x-2 border-b border-gray-200 py-2.5 pl-3.5 pr-2.5">
          <SearchIcon className="size-3 text-gray-500" />
          <Command.Input
            placeholder="search"
            className="border-none p-0 outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>

        <Command.List className="[&>[cmdk-list-sizer]]:ml-2 [&>[cmdk-list-sizer]]:h-44 [&>[cmdk-list-sizer]]:space-y-0.5 [&>[cmdk-list-sizer]]:overflow-y-scroll [&>[cmdk-list-sizer]]:py-2 [&>[cmdk-list-sizer]]:pr-1">
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
                <CategoryItem.Indicator indicator={currentCategory.indicator} />
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
            <Command.Separator className="mx-2 my-1.5 border-t border-gray-100" />
          </span>

          {categories.map((i) => (
            <CategoryItem.Container
              key={i.id}
              value={`${i.title} ${i.id}`}
              onSelect={() => {
                setValue(i.id)
              }}
            >
              <CategoryItem.Icon>
                <CategoryItem.Indicator indicator={i.indicator} />
              </CategoryItem.Icon>
              <CategoryItem.Title>{i.title}</CategoryItem.Title>
            </CategoryItem.Container>
          ))}
        </Command.List>
      </Command>
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
      className="group/item my-0.5 flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-1.5 data-[selected=true]:border-gray-950/5 data-[selected=true]:bg-gray-100/50"
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
    <p className="truncate text-sm text-gray-600 group-data-[selected=true]/item:text-gray-950">
      {children}
    </p>
  )
}

function CategoryItemIndicator({
  indicator,
}: {
  indicator: Category['indicator']
}) {
  return (
    <div
      className={cn(
        'size-2.5 rounded-full',
        `bg-${getCategoryColor(indicator)}-600`
      )}
    />
  )
}

const CategoryItem = {
  Container: CategoryItemContainer,
  Icon: CategoryItemIcon,
  Title: CategoryItemTitle,
  Indicator: CategoryItemIndicator,
}
