import React from "react"
import { Command } from "cmdk"
import { FolderIcon, InboxIcon, SearchIcon } from "lucide-react"

import { useAppStore } from "#/store/app"
import { Category, categoryHelper, getCategoryColor } from "#/utils/category"
import { cn } from "#/utils/style"

import { PopoverContent } from "./ui/popover"

export const CategoryPopover = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentProps<typeof PopoverContent> & {
    setValue: (value: string | null) => void
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    currentCategory: Category | undefined
  }
>(({ setIsOpen, setValue: setParentValue, currentCategory, ...props }, ref) => {
  const categories = useAppStore((s) =>
    categoryHelper.get
      .active(s.categories)
      .filter((i) => i.id !== currentCategory?.id)
  )

  const setValue = (value: string | null) => {
    setParentValue(value)
    setIsOpen(false)
  }

  return (
    <PopoverContent
      {...props}
      ref={ref}
      className="w-60 p-0"
      sideOffset={5}
      align="center"
      collisionPadding={10}
    >
      <Command>
        <div className="flex items-center space-x-2 border-b border-gray-3 py-2.5 pl-3.5 pr-2.5">
          <SearchIcon className="size-3 text-gray-10" />
          <Command.Input
            placeholder="search"
            className="border-none p-0 outline-none placeholder:text-gray-10 focus:ring-0"
          />
        </div>

        <Command.List className="[&>[cmdk-list-sizer]]:ml-2 [&>[cmdk-list-sizer]]:h-44 [&>[cmdk-list-sizer]]:space-y-0.5 [&>[cmdk-list-sizer]]:overflow-y-scroll [&>[cmdk-list-sizer]]:py-2 [&>[cmdk-list-sizer]]:pr-1">
          <Command.Empty className="flex h-36 items-center justify-center text-gray-11">
            <div className="flex flex-col items-center justify-center space-y-1 rounded-md border border-gray-3 p-4 shadow-sm">
              <span className="inline-block size-5">
                <FolderIcon />
              </span>
              <p className="text-xs text-gray-11">not found</p>
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
              <InboxIcon className="size-3.5 text-gray-11" />
            </CategoryItem.Icon>
            <CategoryItem.Title>Inbox</CategoryItem.Title>
          </CategoryItem.Container>

          <span>
            <Command.Separator className="mx-2 my-1.5 border-t border-gray-2" />
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
    </PopoverContent>
  )
})
CategoryPopover.displayName = "CategoryPopover"

const CategoryItemContainer = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item>
>(({ ...props }, ref) => {
  return (
    <Command.Item
      ref={ref}
      {...props}
      className="group/item my-0.5 flex cursor-pointer items-center rounded-lg border border-transparent px-3 py-1.5 data-[selected=true]:border-gray-12/5 data-[selected=true]:bg-gray-3/50"
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
    <p className="truncate text-sm text-gray-11 group-data-[selected=true]/item:text-gray-12">
      {children}
    </p>
  )
}

function CategoryItemIndicator({
  indicator,
}: {
  indicator: Category["indicator"]
}) {
  return (
    <div
      className={cn("size-2.5 rounded-full", getCategoryColor(indicator, "bg"))}
    />
  )
}

const CategoryItem = {
  Container: CategoryItemContainer,
  Icon: CategoryItemIcon,
  Title: CategoryItemTitle,
  Indicator: CategoryItemIndicator,
}
