import Link from 'next/link'
import { EditIcon, HeartIcon, HeartOffIcon, Trash2Icon } from 'lucide-react'

import {
  ContextMenuItem,
  DropdownMenuItem,
  MenuIcon,
} from '@/components/ui/menu'
import { useAppStore } from '@/store/app'
import { Category, useCategoryStore } from '@/store/category'
import { getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

export function CategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 rounded-lg border border-transparent px-4 py-2 hover:border-gray-200 hover:bg-gray-50"
    >
      <div
        className={cn(
          'h-3 w-3 rounded-sm',
          `bg-${getCategoryColor(category.indicator)}-600`
        )}
      />
      <p className="text-sm">{category.title}</p>
    </Link>
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
      icon: <EditIcon className="h-full w-full" />,
    },
    {
      label: 'Delete',
      onSelect: () => setDialog('deleteCategory', category),
      icon: <Trash2Icon className="h-full w-full" />,
    },
    {
      label: category.isFavorite ? 'Unfavorite' : 'Favorite',
      onSelect: () =>
        editCategory({ ...category, isFavorite: !category.isFavorite }),
      icon: category.isFavorite ? (
        <HeartOffIcon className="h-full w-full" />
      ) : (
        <HeartIcon className="h-full w-full" />
      ),
    },
  ]

  if (type === 'context') {
    return menuItem.map((i) => (
      <ContextMenuItem key={i.label} onSelect={i.onSelect}>
        <MenuIcon>{i.icon}</MenuIcon>
        <span>{i.label}</span>
      </ContextMenuItem>
    ))
  }

  return menuItem.map((i) => (
    <DropdownMenuItem key={i.label} onSelect={i.onSelect}>
      <MenuIcon>{i.icon}</MenuIcon>
      <span>{i.label}</span>
    </DropdownMenuItem>
  ))
}
