import React from 'react'
import Link from 'next/link'
import {
  ArchiveRestoreIcon,
  CircleIcon,
  EditIcon,
  HeartIcon,
  HeartOffIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'

import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@/components/ui/menu'
import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Category, getCategoryColor } from '@/utils/category'
import { useDrag, useDrop } from '@/utils/dnd'
import { cn } from '@/utils/style'

export function DNDCategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  const {
    isDragging,
    ref: dragRef,
    position,
    bind,
  } = useDrag({ id: category.id })

  const { ref } = useDrop({ id: category.id })

  const style = React.useMemo(() => {
    if (!position) return {}
    return {
      top: position.y,
      left: position.x,
    }
  }, [position])

  return (
    <div className="relative">
      {isDragging && (
        <div
          ref={dragRef as any}
          className={cn(
            'fixed left-0 top-0 z-50 hidden -translate-x-1/2 -translate-y-full rounded-full shadow-sm drop-shadow-sm',
            `bg-${getCategoryColor(category.indicator)}-600`,
            isDragging && 'z-50 block'
          )}
          style={style}
        >
          <p className="px-2 text-xs font-medium text-white">
            {category.title}
          </p>
        </div>
      )}

      <div
        data-active={true}
        className="absolute -bottom-[5px] left-0 right-0 hidden w-full translate-y-[2px] items-center px-3 data-[active=true]:flex"
      >
        <span className="size-1.5 rounded-full border-[1.5px] border-orange-600" />
        <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
      </div>

      <CategoryItem
        category={category}
        href={href}
        {...bind()}
        ref={ref as React.Ref<HTMLAnchorElement>}
      />

      <div
        className="absolute -top-[5px] left-0 right-0 hidden w-full translate-y-[-2px] items-center px-3 data-[active=true]:flex"
        data-active={true}
      >
        <span className="size-1.5 rounded-full border-[1.5px] border-orange-600" />
        <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
      </div>
    </div>
  )
}

export const CategoryItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    category: Category
    href: string
  }
>(({ category, href, className, ...props }, ref) => {
  const [preventFocus, setPreventFocus] = React.useState(false)
  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <Link
            {...props}
            ref={ref}
            href={href}
            className={cn(
              'relative flex touch-none items-center justify-between rounded-lg border border-transparent px-4 py-2 hover:border-gray-200 hover:bg-gray-50 data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50',
              className
            )}
          >
            <div className="mr-2 flex items-center space-x-3 overflow-hidden">
              <div>
                <div
                  className={cn(
                    'size-2.5 rounded-full',
                    `bg-${getCategoryColor(category.indicator)}-600`
                  )}
                />
              </div>
              <p className="overflow-hidden text-ellipsis text-sm">
                {category.title}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <DropdownMenuTrigger asChild>
                <button
                  className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="inline-block h-4 w-4">
                    <MoreVerticalIcon />
                  </span>
                </button>
              </DropdownMenuTrigger>
            </div>
          </Link>
        </ContextMenuTrigger>

        <ContextMenuPortal>
          <ContextMenuContent
            onCloseAutoFocus={(e) => preventFocus && e.preventDefault()}
          >
            <CategoryMenuContent
              category={category}
              type="context"
              setPreventFocus={setPreventFocus}
            />
          </ContextMenuContent>
        </ContextMenuPortal>
        <DropdownMenuPortal>
          <DropdownMenuContent
            align="end"
            onCloseAutoFocus={(e) => preventFocus && e.preventDefault()}
          >
            <CategoryMenuContent
              category={category}
              type="dropdown"
              setPreventFocus={setPreventFocus}
            />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </ContextMenuRoot>
  )
})
CategoryItem.displayName = 'CategoryItem'

export function CategoryContainer({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function CategoryMenuContent({
  category,
  type,
  setPreventFocus,
}: {
  category: Category
  type: 'context' | 'dropdown'
  setPreventFocus: (value: boolean) => void
}) {
  const setDialog = useAppStore((s) => s.setDialog)
  const toggleArchive = useCategoryStore((s) => s.toggleArchive)
  const toggleFavorite = useCategoryStore((s) => s.toggleFavorite)

  const isFavorite = !!category.favoriteOrderNumber
  const isArchived = !!category.archivedAt

  const menuItem = [
    {
      label: 'Edit',
      onSelect: () => {
        setPreventFocus(true)
        setDialog({ editCategory: category })
      },
      icon: <EditIcon />,
    },

    {
      label: !!isFavorite ? 'Unfavorite' : 'Favorite',
      onSelect: () => toggleFavorite(category),
      icon: !!isFavorite ? <HeartOffIcon /> : <HeartIcon />,
    },

    {
      label: isArchived ? 'Unarchive' : 'Archive',
      onSelect: () => toggleArchive(category),
      icon: isArchived ? <ArchiveRestoreIcon /> : <ArchiveRestoreIcon />,
    },
    {
      label: 'Delete',
      onSelect: () => setDialog({ deleteCategory: category }),
      icon: <Trash2Icon />,
      intent: 'destructive' as const,
    },
  ]

  if (isArchived) {
    menuItem.splice(1, 1)
  }

  if (type === 'context') {
    return menuItem.map((i) => (
      <ContextMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
        <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
        <span>{i.label}</span>
      </ContextMenuItem>
    ))
  }

  return menuItem.map((i) => (
    <DropdownMenuItem key={i.label} onSelect={i.onSelect} intent={i.intent}>
      <MenuIcon intent={i.intent}>{i.icon}</MenuIcon>
      <span>{i.label}</span>
    </DropdownMenuItem>
  ))
}

export function BottomDrop({ id }: { id: string }) {
  const { ref, isOver } = useDrop({ id })

  return (
    <>
      <div className="absolute h-2 w-full" ref={ref as any} />
      {isOver && <BottomIndicator />}
    </>
  )
}

export function TopDrop({ id }: { id: string }) {
  const { ref, isOver } = useDrop({ id })

  return (
    <>
      <div className="absolute h-2 w-full" ref={ref as any} />
      {isOver && <TopIndicator />}
    </>
  )
}

function BottomIndicator() {
  return (
    <div className="absolute -bottom-[5px] left-0 right-0 flex w-full translate-y-[2px] items-center px-3">
      <span className="size-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

function TopIndicator() {
  return (
    <div className="absolute -top-[5px] left-0 right-0 flex w-full translate-y-[-2px] items-center px-3">
      <span className="size-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}
