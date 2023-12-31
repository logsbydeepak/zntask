'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  GanttChartIcon,
  HeartIcon,
  InboxIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import { useShallow } from 'zustand/react/shallow'

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
import { isScreenSMAtom, isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { Category, categoryHelper, getCategoryColor } from '@/utils/category'
import { cn, tw } from '@/utils/style'

import { CategoryMenuContent } from './(home)/category'

export function Sidebar() {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  return (
    <aside
      data-sidebar={isSidebarOpen}
      className={cn(
        'invisible fixed bottom-0 top-14 z-10 w-full -translate-x-full overflow-y-scroll bg-white pr-1 data-[sidebar=true]:visible data-[sidebar=true]:translate-x-0 md:w-56',
        'transition-all duration-150 ease-in-out'
      )}
    >
      <div className="my-4 space-y-6 pr-1 ">
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
      icon: <CalendarIcon />,
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
    useShallow((s) =>
      categoryHelper.sortFavoriteCategories(
        categoryHelper.getFavoriteCategories(s.categories)
      )
    )
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
    useShallow((s) =>
      categoryHelper.sortActiveCategories(
        categoryHelper.getActiveCategories(s.categories)
      )
    )
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
  const isScreenSM = useAtomValue(isScreenSMAtom)
  const [preventFocus, setPreventFocus] = React.useState(false)

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
                      'size-2.5 rounded-full',
                      `bg-${getCategoryColor(category.indicator)}-600`
                    )}
                  />
                </Item.LabelIcon>
                <Item.Label>{category.title}</Item.Label>
              </Item.LabelContainer>
              <span className="flex items-center space-x-0.5">
                <DropdownMenuTrigger asChild>
                  <button className="flex size-6 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800">
                    <span className="inline-block h-4 w-4">
                      <MoreVerticalIcon />
                    </span>
                  </button>
                </DropdownMenuTrigger>
              </span>
            </Item.Content.Link>
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
              align={isScreenSM ? 'end' : 'start'}
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
  return <div className="size-4 text-gray-600">{children}</div>
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
              <ChevronUpIcon className="size-4" />
            ) : (
              <ChevronDownIcon className="size-4" />
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

const itemContentStyle = tw`flex h-9 w-full items-center rounded-lg border border-transparent px-2 hover:border-gray-200 hover:bg-gray-50 group-data-[active=true]:border-gray-200 group-data-[active=true]:bg-gray-50`

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
    <span className={cn('flex size-4 items-center justify-center', className)}>
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
