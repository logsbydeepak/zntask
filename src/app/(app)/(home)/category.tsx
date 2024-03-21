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
import { useDrag, useDrop } from '@/utils/category-dnd'
import { cn } from '@/utils/style'

export function DNDCategoryItem({
  category,
  href,
  topCategoryId,
  bottomCategoryId,
}: {
  category: Category
  href: string
  topCategoryId?: string
  bottomCategoryId?: string
}) {
  const {
    isDragging,
    ref: dragRef,
    position,
    bind,
  } = useDrag({ id: category.id })

  const { ref, place, isOver } = useDrop({
    id: category.id,
    data: {
      top: topCategoryId,
      id: category.id,
      bottom: bottomCategoryId,
    },
  })

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
            getCategoryColor(category.indicator, 'bg'),
            isDragging && 'z-50 block'
          )}
          style={style}
        >
          <p className="px-2 text-xs font-medium text-white">
            {category.title}
          </p>
        </div>
      )}

      {isOver && place === 'top' && (
        <div className="absolute inset-x-0 top-[-5px] flex w-full translate-y-[-2px] items-center px-3">
          <span className="size-1.5 rounded-full border-[1.5px] border-orange-9" />
          <span className="-ml-px h-[1.5px] w-full rounded-full bg-orange-9" />
        </div>
      )}

      <CategoryItem
        category={category}
        href={href}
        {...bind()}
        ref={ref as React.Ref<HTMLAnchorElement>}
      />

      {isOver && place === 'bottom' && (
        <div className="absolute inset-x-0 bottom-[-5px] flex w-full translate-y-[2px] items-center px-3">
          <span className="size-1.5 rounded-full border-[1.5px] border-orange-9" />
          <span className="-ml-px h-[1.5px] w-full rounded-full bg-orange-9" />
        </div>
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
    <div className="absolute inset-x-0 bottom-[-5px] flex w-full translate-y-[2px] items-center px-3">
      <span className="size-1.5 rounded-full border-[1.5px] border-orange-9" />
      <span className="-ml-px h-[1.5px] w-full rounded-full bg-orange-9" />
    </div>
  )
}

function TopIndicator() {
  return (
    <div className="absolute inset-x-0 top-[-5px] flex w-full translate-y-[-2px] items-center px-3">
      <span className="size-1.5 rounded-full border-[1.5px] border-orange-9" />
      <span className="-ml-px h-[1.5px] w-full rounded-full bg-orange-9" />
    </div>
  )
}
