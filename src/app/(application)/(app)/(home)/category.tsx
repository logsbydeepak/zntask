import React, { useEffect } from 'react'
import Link from 'next/link'
import { useDrag } from '@use-gesture/react'
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  ArchiveRestoreIcon,
  CircleIcon,
  EditIcon,
  HeartIcon,
  HeartOffIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from 'lucide-react'

import { JotaiProvider } from '@/components/client-providers'
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

const allDroppableContainerAtom = atom<(DOMRect & { id: string })[]>([])
const draggingContainerAtom = atom<{
  id: string
  x: number
  y: number
  rect: DOMRect
} | null>(null)

export function CategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  const id = category.id
  const [preventFocus, setPreventFocus] = React.useState(false)
  const [isHovering, setIsHovering] = React.useState(false)
  const ref = React.useRef<HTMLAnchorElement>(null)
  const setAllDroppableContainer = useSetAtom(allDroppableContainerAtom)
  const setDraggingContainer = useSetAtom(draggingContainerAtom)
  const dragglingContainer = useAtomValue(draggingContainerAtom)
  const [isDragging, setIsDragging] = React.useState(false)

  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      setDraggingContainer(() => {
        setIsDragging(down)
        if (!down) {
          return null
        }

        const el = ref.current?.getBoundingClientRect()
        if (!el) return null
        return {
          id,
          x: mx,
          y: my,
          rect: el,
        }
      })
    },
    { preventDefault: true, filterTaps: true }
  )

  useEffect(() => {
    const el = ref.current?.getBoundingClientRect()
    if (!el) return
    setAllDroppableContainer((prev) => [...prev, { ...el, id }])
  }, [setAllDroppableContainer])

  const style = isDragging && {
    transform: `translate3d(${dragglingContainer?.x}px, ${dragglingContainer?.y}px, 0)`,
  }

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <Link
            {...bind()}
            ref={ref}
            href={href}
            style={{ ...style }}
            // style={{
            //   transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            // }}
            className={cn(
              'relative flex touch-none items-center justify-between rounded-lg border border-transparent px-4 py-2 hover:border-gray-200 hover:bg-gray-50 group-data-[state=open]:border-gray-200 group-data-[state=open]:bg-gray-50',
              isDragging && 'z-50'
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
              <p className="select-none overflow-hidden text-ellipsis text-sm">
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
            {isHovering && <Indicator />}
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

function Indicator() {
  return (
    <div className="absolute -bottom-1 left-0 right-0 flex w-full items-center">
      <CircleIcon className="h-2 w-2 text-orange-600" strokeWidth={4} />
      <span className="-ml-[1px] h-[1.5px] w-full rounded-full bg-orange-600" />
    </div>
  )
}

export function CategoryContainer({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <div className="space-y-2">{children}</div>
    </JotaiProvider>
  )
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
  const toggleArchive = useCategoryStore((s) => s.toggleArchive)
  const toggleFavorite = useCategoryStore((s) => s.toggleFavorite)

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
      onSelect: () => toggleFavorite(category),
      icon: category.isFavorite ? <HeartOffIcon /> : <HeartIcon />,
    },

    {
      label: category.isArchived ? 'Unarchive' : 'Archive',
      onSelect: () => toggleArchive(category),
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
