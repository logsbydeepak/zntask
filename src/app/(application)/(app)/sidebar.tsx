'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  CalendarClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  GanttChartIcon,
  HeartIcon,
  HeartOffIcon,
  InboxIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

import {
  ContextMenuContent,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from '@/components/ui/menu'
import { isScreenSMAtom, isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Category, getCategoryColor } from '@/utils/category'
import { cn } from '@/utils/style'

import { CategoryMenuContent } from './(home)/category'

// export function SidebarState() {
//   const [isSidebarOpen, setIsSidebarOpen] = useAtom(isSidebarOpenAtom)
//   const isScreenSM = useAtomValue(isScreenSMAtom)

//   React.useEffect(() => {
//     setIsSidebarOpen(isScreenSM ? false : true)
//   }, [isSidebarOpen, isSmallScr, setIsSidebarOpen])

//   return null
// }

export function Sidebar() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  if (!isSidebarOpen) return null
  return (
    <aside className="fixed bottom-0 top-14 z-10 w-full overflow-y-scroll border-r-0 border-gray-200 bg-white pr-1 md:w-56 md:border-r">
      <div className="my-4 space-y-6 pr-1">
        <div className="space-y-2">
          <QuickSection />
        </div>
        <div className="space-y-2">
          <FavoriteSection />
        </div>
        <div className="space-y-2">
          <CategorySection />
        </div>
      </div>
    </aside>
  )
}

function QuickSection() {
  const pathname = usePathname()

  const item = [
    {
      icon: <CalendarClockIcon />,
      label: 'today',
      href: '/today',
      isActive: pathname.startsWith('/today') || pathname === '/',
    },
    {
      label: 'inbox',
      href: '/inbox',
      icon: <InboxIcon />,
      isActive: pathname.startsWith('/inbox'),
    },
    {
      label: 'upcoming',
      href: '/upcoming',
      icon: <GanttChartIcon />,
      isActive: pathname.startsWith('/upcoming'),
    },
    {
      label: 'favorite',
      href: '/favorite',
      icon: <HeartIcon />,
      isActive: pathname === '/favorite',
    },
    {
      label: 'category',
      href: '/category',
      icon: <FolderIcon />,
      isActive: pathname === '/category',
    },
  ]

  return (
    <ItemContainer>
      {item.map((i) => (
        <Item.Root key={i.label} isActive={i.isActive}>
          <Item.Content.Link href={i.href}>
            <LabelContainer>
              <Item.LabelIcon className="text-gray-600 group-data-[active=true]:text-orange-600">
                {i.icon}
              </Item.LabelIcon>
              <Item.Label>{i.label}</Item.Label>
            </LabelContainer>
          </Item.Content.Link>
        </Item.Root>
      ))}
    </ItemContainer>
  )
}

function FavoriteSection() {
  const pathname = usePathname()
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)

  const favorites = useCategoryStore(
    useShallow((s) => s.categories.filter((c) => c.isFavorite))
  )

  const favoritesToDisplay = favorites.slice(
    0,
    favorites.length >= 5 && !isCollapsibleOpen ? 4 : favorites.length
  )

  return (
    <>
      <div>
        <Title>Favorite</Title>
      </div>
      <ItemContainer>
        {favorites.length === 0 && <EmptyFavorite />}

        {favoritesToDisplay.map((i) => (
          <CategoryItem
            key={i.id}
            category={i}
            href={`/favorite/${i.id}`}
            isActive={pathname === `/favorite/${i.id}`}
          />
        ))}

        {favorites.length > 4 && (
          <ShowMore
            number={favorites.length - 4}
            isOpen={isCollapsibleOpen}
            onClick={() => {
              setIsCollapsibleOpen((open) => !open)
            }}
          />
        )}
      </ItemContainer>
    </>
  )
}

function CategorySection() {
  const pathname = usePathname()
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)
  const categories = useCategoryStore(
    useShallow((s) => s.categories.filter((c) => !c.isArchived))
  )

  const categoriesToDisplay = categories.slice(
    0,
    categories.length >= 5 && !isCollapsibleOpen ? 4 : categories.length
  )

  return (
    <>
      <div>
        <Title>Category</Title>
      </div>
      <ItemContainer>
        {categories.length === 0 && <EmptyCategory />}

        {categoriesToDisplay.map((i) => (
          <CategoryItem
            key={i.id}
            category={i}
            href={`/category/${i.id}`}
            isActive={pathname === `/category/${i.id}`}
          />
        ))}

        {categories.length > 4 && (
          <ShowMore
            number={categories.length - 4}
            isOpen={isCollapsibleOpen}
            onClick={() => {
              setIsCollapsibleOpen((open) => !open)
            }}
          />
        )}
      </ItemContainer>
    </>
  )
}

function CategoryItem({
  category,
  href,
  isActive,
}: {
  category: Category
  href: string
  isActive: boolean
}) {
  const editCategory = useCategoryStore((s) => s.editCategory)
  const isScreenSM = useAtomValue(isScreenSMAtom)

  return (
    <Item.Root isActive={isActive}>
      <ContextMenuRoot>
        <DropdownMenuRoot>
          <ContextMenuTrigger className="group">
            <Item.Content.Link
              href={href}
              className="justify-between group-data-[state=open]:border-gray-200 group-data-[state=open]:bg-gray-50"
            >
              <Item.LabelContainer>
                <Item.LabelIcon>
                  <div
                    className={cn(
                      'h-3 w-3 rounded-[4.5px]',
                      `bg-${getCategoryColor(category.indicator)}-600`
                    )}
                  />
                </Item.LabelIcon>
                <Item.Label>{category.title}</Item.Label>
              </Item.LabelContainer>
              <span className="flex items-center space-x-0.5">
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
              </span>
            </Item.Content.Link>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <CategoryMenuContent category={category} type="context" />
          </ContextMenuContent>
          <DropdownMenuContent align={isScreenSM ? 'end' : 'start'}>
            <CategoryMenuContent category={category} type="dropdown" />
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </ContextMenuRoot>
    </Item.Root>
  )
}

function EmptyFavorite() {
  return (
    <EmptyContainer>
      <EmptyIcon>
        <HeartIcon />
      </EmptyIcon>
      <EmptyLabel>no favorite</EmptyLabel>
    </EmptyContainer>
  )
}

function EmptyCategory() {
  return (
    <EmptyContainer>
      <EmptyIcon>
        <FolderIcon />
      </EmptyIcon>
      <EmptyLabel>no category</EmptyLabel>
    </EmptyContainer>
  )
}

function EmptyContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="pl-3">
      <div className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-200 bg-gray-50 py-10 md:py-5">
        {children}
      </div>
    </div>
  )
}

function EmptyLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-600">{children}</p>
}

function EmptyIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-4 w-4 text-gray-600">{children}</div>
}

function ShowMore({
  number,
  isOpen,
  onClick,
}: {
  number: number
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <Item.Root>
      <Item.Content.Button onClick={onClick}>
        <Item.LabelContainer>
          <Item.LabelIcon>
            {isOpen ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Item.LabelIcon>
          <Item.Label>
            {isOpen ? 'Show less' : `Show ${number} more`}
          </Item.Label>
        </Item.LabelContainer>
      </Item.Content.Button>
    </Item.Root>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h4 className="pl-3 text-xs font-medium text-gray-600">{children}</h4>
}

function ItemContainer({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>
}

function ItemIndicator() {
  return (
    <span className="mr-1 h-5 w-1 rounded-br-md rounded-tr-md bg-white group-data-[active=true]:bg-orange-600" />
  )
}

function ItemRoot({
  children,
  isActive = false,
}: {
  children: React.ReactNode
  isActive?: boolean
}) {
  return (
    <div className="group flex items-center" data-active={isActive}>
      <ItemIndicator />
      <div className="group w-full">{children}</div>
    </div>
  )
}

const itemContentStyle =
  'flex items-center h-9 px-2 w-full hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 group-data-[active=true]:bg-gray-50 group-data-[active=true]:border-gray-200'
function ItemContentLink({
  children,
  href,
  className,
}: React.ComponentProps<typeof Link>) {
  const isScreenSM = useAtomValue(isScreenSMAtom)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)

  return (
    <Link
      href={href}
      className={cn(itemContentStyle, className)}
      onClick={() => {
        if (isScreenSM) return setIsSidebarOpen(false)
      }}
    >
      {children}
    </Link>
  )
}

function ItemContentButton({
  children,
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button {...props} className={cn(itemContentStyle, className)}>
      {children}
    </button>
  )
}

function ItemLabel({ children }: React.ComponentProps<'span'>) {
  return (
    <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600 data-[active=true]:font-medium group-data-[active=true]:text-gray-900">
      {children}
    </span>
  )
}

function ItemLabelIcon({ className, children }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('flex h-4 w-4 items-center justify-center', className)}>
      {children}
    </span>
  )
}

function LabelContainer({ children }: React.ComponentProps<'span'>) {
  return (
    <span className="flex items-center space-x-3 overflow-hidden pr-3">
      {children}
    </span>
  )
}

const Item = {
  Root: ItemRoot,
  Content: {
    Link: ItemContentLink,
    Button: ItemContentButton,
  },
  Label: ItemLabel,
  LabelIcon: ItemLabelIcon,
  LabelContainer: LabelContainer,
}
