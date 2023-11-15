import React from 'react'
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
import { cn } from '@/utils/style'

export function CategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  const [preventFocus, setPreventFocus] = React.useState(false)

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger className="group block">
          <Link
            href={href}
            className="flex items-center justify-between rounded-lg border border-transparent px-4 py-2 hover:border-gray-200 hover:bg-gray-50 group-data-[state=open]:border-gray-200 group-data-[state=open]:bg-gray-50"
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
  const editCategory = useCategoryStore((s) => s.editCategory)

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
      label: category.isFavorite ? 'Unfavorite' : 'Favorite',
      onSelect: () =>
        editCategory({
          ...category,
          isFavorite: !category.isFavorite,
          isArchived: false,
        }),
      icon: category.isFavorite ? <HeartOffIcon /> : <HeartIcon />,
    },

    {
      label: category.isArchived ? 'Unarchive' : 'Archive',
      onSelect: () =>
        editCategory({
          ...category,
          isArchived: !category.isArchived,
          isFavorite: false,
        }),
      icon: category.isArchived ? (
        <ArchiveRestoreIcon />
      ) : (
        <ArchiveRestoreIcon />
      ),
    },
    {
      label: 'Delete',
      onSelect: () => setDialog({ deleteCategory: category }),
      icon: <Trash2Icon />,
      intent: 'destructive' as const,
    },
  ]

  if (category.isArchived) {
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
