import Link from 'next/link'

import { Category } from '@/store/category'
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
