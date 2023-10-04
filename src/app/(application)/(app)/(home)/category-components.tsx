import Link from 'next/link'
import {
  EditIcon,
  HeartIcon,
  HeartOffIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'

import { useAppStore } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Category, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@ui/menu'

export function CategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  const editCategory = useCategoryStore((s) => s.editCategory)
  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger className="group block">
          <Link
            href={href}
            className="flex items-center justify-between rounded-lg border border-transparent px-4 py-2 hover:border-gray-200 hover:bg-gray-50 group-data-[state=open]:border-gray-200 group-data-[state=open]:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'h-3 w-3 rounded-[4.5px]',
                  `bg-${getCategoryColor(category.indicator)}-600`
                )}
              />
              <p className="text-sm">{category.title}</p>
            </div>
            <div className="flex items-center space-x-1">
              {category.isFavorite && href.startsWith('/category') && (
                <button
                  className="group/favorite flex h-6 w-6 items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-700"
                  onClick={(e) => {
                    e.preventDefault()
                    editCategory({ ...category, isFavorite: false })
                  }}
                >
                  <span className="group-hover/favorite:hidden">
                    <HeartIcon className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="hidden group-hover/favorite:inline-block">
                    <HeartOffIcon className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                </button>
              )}

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

        <ContextMenuContent>
          <CategoryMenuContent category={category} type="context" />
        </ContextMenuContent>
        <DropdownMenuContent align="end">
          <CategoryMenuContent category={category} type="dropdown" />
        </DropdownMenuContent>
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
}: {
  category: Category
  type: 'context' | 'dropdown'
}) {
  const setDialog = useAppStore((s) => s.setDialog)
  const editCategory = useCategoryStore((s) => s.editCategory)

  const menuItem = [
    {
      label: 'Edit',
      onSelect: () => setDialog('editCategory', category),
      icon: <EditIcon />,
    },
    {
      label: category.isFavorite ? 'Unfavorite' : 'Favorite',
      onSelect: () =>
        editCategory({ ...category, isFavorite: !category.isFavorite }),
      icon: category.isFavorite ? <HeartOffIcon /> : <HeartIcon />,
    },
    {
      label: 'Delete',
      onSelect: () => setDialog('deleteCategory', category),
      icon: <Trash2Icon />,
      intent: 'destructive' as const,
    },
  ]

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
