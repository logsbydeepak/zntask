import React, { useEffect } from 'react'
import Link from 'next/link'
import { useDrag } from '@use-gesture/react'
import { atom, useAtom } from 'jotai'
import {
  ArchiveRestoreIcon,
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

interface Rec {
  left: number
  top: number
  width: number
  height: number
}

function centerOfRectangle(rect: Rec) {
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
  }
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

const allDroppableContainerAtom = atom<
  {
    ref: React.RefObject<HTMLAnchorElement>
    id: string
  }[]
>([])
const currentDroppableContainerHoverAtom = atom<string | null>(null)
const currentDraggablePositionAtom = atom<{ x: number; y: number }>({
  x: 0,
  y: 0,
})

export function CategoryItem({
  category,
  href,
  isFavorite = false,
}: {
  category: Category
  href: string
  isFavorite?: boolean
}) {
  const id = category.id

  const ref = React.useRef<HTMLAnchorElement>(null)
  const emptyShellRef = React.useRef<HTMLDivElement>(null)

  const [allDroppableContainer, setAllDroppableContainer] = useAtom(
    allDroppableContainerAtom
  )
  const [currentDroppableContainerHover, setCurrentDroppableContainerHover] =
    useAtom(currentDroppableContainerHoverAtom)
  const [currentDraggablePosition, setCurrentDraggablePosition] = useAtom(
    currentDraggablePositionAtom
  )

  const [isDragging, setIsDragging] = React.useState(false)
  const [preventFocus, setPreventFocus] = React.useState(false)
  const debouncedPosition = React.useDeferredValue(currentDraggablePosition)

  const reorderCategories = useCategoryStore((s) => s.reorderCategories)
  const reorderFavoriteCategories = useCategoryStore((s) => s.reorderFavorites)

  const isHovering = currentDroppableContainerHover === id

  const bind = useDrag(
    ({ down, movement: [mx, my] }) => {
      setIsDragging(down)
      if (down) {
        setCurrentDraggablePosition({ x: mx, y: my })
      } else {
        setCurrentDraggablePosition({ x: 0, y: 0 })
        if (!currentDroppableContainerHover) return

        if (isFavorite && currentDroppableContainerHover !== id) {
          reorderFavoriteCategories(id, currentDroppableContainerHover)
        }

        if (!isFavorite && currentDroppableContainerHover !== id) {
          reorderCategories(id, currentDroppableContainerHover)
        }

        setCurrentDroppableContainerHover(null)
      }
    },
    { preventDefault: true, filterTaps: true }
  )

  useEffect(() => {
    if (allDroppableContainer.length === 0) return

    const el = ref.current?.getBoundingClientRect()
    if (!el) return
    if (!isDragging) return

    const centerOfCurrentDragging = centerOfRectangle({
      left: el.left,
      top: el.top,
      width: el.width,
      height: el.height,
    })

    const centerOfDroppableContainer: {
      center: { x: number; y: number }
      id: string
    }[] = []

    allDroppableContainer.forEach((i) => {
      const current = i.ref.current?.getBoundingClientRect()
      if (!current) return

      if (id === i.id) {
        const emptyShell = emptyShellRef.current?.getBoundingClientRect()
        if (!emptyShell) return
        const center = centerOfRectangle({
          left: emptyShell.left,
          top: emptyShell.top,
          width: emptyShell.width,
          height: emptyShell.height,
        })

        centerOfDroppableContainer.push({ center, id: i.id })

        return
      }

      const center = centerOfRectangle({
        left: current.left,
        top: current.top,
        width: current.width,
        height: current.height,
      })

      centerOfDroppableContainer.push({ center, id: i.id })
    })

    const distanceBetween = centerOfDroppableContainer.map((i) => ({
      distance: distance(i.center, {
        x: centerOfCurrentDragging.x,
        y: centerOfCurrentDragging.y,
      }),
      id: i.id,
    }))

    const closest = distanceBetween.reduce((prev, curr) =>
      prev.distance < curr.distance ? prev : curr
    )

    setCurrentDroppableContainerHover(closest.id)
  }, [
    debouncedPosition,
    allDroppableContainer,
    currentDroppableContainerHover,
    isDragging,
    id,
    setCurrentDroppableContainerHover,
  ])

  useEffect(() => {
    const el = ref.current?.getBoundingClientRect()
    if (!el) return

    setAllDroppableContainer((prev) => [
      ...prev,
      {
        id,
        ref,
      },
    ])

    return () => {
      setAllDroppableContainer((prev) => prev.filter((i) => i.id !== id))
    }
  }, [setAllDroppableContainer, id])

  const style: React.CSSProperties = isDragging
    ? {
        transform: `translate3d(${currentDraggablePosition.x}px, ${currentDraggablePosition.y}px, 0)`,
      }
    : {}

  return (
    <ContextMenuRoot>
      <DropdownMenuRoot>
        <ContextMenuTrigger asChild>
          <div className="group relative">
            <Link
              {...bind()}
              ref={ref}
              href={href}
              style={style}
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
                <p className=" overflow-hidden text-ellipsis text-sm">
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
            {isDragging && <EmptyShell ref={emptyShellRef} />}
            {isHovering && currentDraggablePosition.y > 0 && (
              <BottomIndicator />
            )}
            {isHovering && currentDraggablePosition.y < 0 && <TopIndicator />}
          </div>
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
  const toggleArchive = useCategoryStore((s) => s.toggleArchive)
  const toggleFavorite = useCategoryStore((s) => s.toggleFavorite)

  const isFavorite = !!category.favoriteOrderNumber

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
