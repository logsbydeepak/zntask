import React, { useEffect } from 'react'
import Link from 'next/link'
import {
  ArchiveRestoreIcon,
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
import { useDNDState, useDrag, useDrop } from '@/utils/dnd'
import { cn } from '@/utils/style'

export function DNDCategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  const drag = useDrag({ id: category.id })
  const drop = useDrop({ id: category.id })
  const dnd = useDNDState()
  const ref = React.useRef<HTMLDivElement>(null)

  const style = React.useMemo(() => {
    if (!drag.position) return {}
    return {
      transform: `translate(${drag.position.x + 5}px, ${
        drag.position.y + 5
      }px)`,
    }
  }, [drag.position])

  useEffect(() => {
    drag.ref.current = ref.current
  }, [drag])

  return (
    <div className="relative">
      {drag.isDragging && (
        <div
          className={cn(
            `fixed left-0 top-0 z-50 hidden rounded-full shadow-sm drop-shadow-sm  bg-${getCategoryColor(
              category.indicator
            )}-600`,
            drag.isDragging && 'z-50 block'
          )}
          style={style}
          ref={ref}
        >
          <p className="px-2 text-xs font-medium text-white">
            {category.title}
          </p>
        </div>
      )}
      <CategoryItem
        category={category}
        href={href}
        {...drag.bind()}
        ref={drop.ref as any}
      />
      {drop.isOver && dnd.dragPosition && dnd.dragPosition.y < 0 && (
        <TopIndicator />
      )}

      {drop.isOver && dnd.dragPosition && dnd.dragPosition.y > 0 && (
        <BottomIndicator />
      )}
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
                    'h-3 w-3 rounded-[4.5px]',
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
                <button className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800">
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

const EmptyShell = React.forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 rounded-lg border border-gray-200 bg-gray-50"
    />
  )
})
EmptyShell.displayName = 'EmptyShell'

function BottomIndicator() {
  return (
    <div className="absolute -bottom-[5px] left-0 right-0 flex w-full translate-y-[2px] items-center px-3">
      <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

function TopIndicator() {
  return (
    <div className="absolute -top-[5px] left-0 right-0 flex w-full translate-y-[-2px] items-center px-3">
      <span className="h-1.5 w-1.5 rounded-full border-[1.5px] border-orange-600" />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

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
