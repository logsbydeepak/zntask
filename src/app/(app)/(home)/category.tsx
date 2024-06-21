import React from 'react'
import Link from 'next/link'
import { MoreVerticalIcon } from 'lucide-react'

import { CategoryMenuContent } from '@/components/category-menu-content'
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { Category, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

export const CategoryItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    category: Category
    href: string
  }
>(({ category, href, className, ...props }, ref) => {
  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <Link
            {...props}
            ref={ref}
            href={href}
            className={cn(
              'relative flex touch-none items-center justify-between rounded-lg border border-transparent px-4 py-2 hover:border-gray-3 hover:bg-gray-2 data-[state=open]:border-gray-3 data-[state=open]:bg-gray-2',
              className
            )}
          >
            <div className="mr-2 flex items-center space-x-3 overflow-hidden">
              <div>
                <div
                  className={cn(
                    'size-2.5 rounded-full',
                    getCategoryColor(category.indicator, 'bg')
                  )}
                />
              </div>
              <p className="truncate text-sm">{category.title}</p>
            </div>
            <div className="flex items-center space-x-1">
              <DropdownMenuTrigger asChild>
                <button
                  className="flex size-6 items-center justify-center text-gray-10 hover:text-gray-11 data-[state=open]:text-gray-11"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="inline-block size-4">
                    <MoreVerticalIcon />
                  </span>
                </button>
              </DropdownMenuTrigger>
            </div>
          </Link>
        </ContextMenuTrigger>

        <ContextMenuPortal>
          <ContextMenuContent>
            <CategoryMenuContent category={category} type="context" />
          </ContextMenuContent>
        </ContextMenuPortal>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end">
            <CategoryMenuContent category={category} type="dropdown" />
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
