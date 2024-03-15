'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
import { useAppStore } from '@/store/app'
import { Category, categoryHelper, getCategoryColor } from '@/utils/category'
import { cn, tw } from '@/utils/style'

import { CategoryMenuContent } from './(home)/category'

export function Sidebar() {
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen)

  return (
    <aside
      data-sidebar={isSidebarOpen}
      className={cn(
        'invisible fixed bottom-0 top-14 z-10 w-full -translate-x-full overflow-y-scroll bg-newGray-1 pr-1 data-[sidebar=true]:visible data-[sidebar=true]:translate-x-0 md:w-56',
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
            <Item.Label.Icon className="text-gray-600 group-data-[active=true]:text-orange-600">
              {i.icon}
            </Item.Label.Icon>
            <Item.Label.Content>{i.label}</Item.Label.Content>
          </Item.Content.Link>
        </Item.Root>
      ))}
    </ItemContainer>
  )
}

function FavoriteSection() {
  const pathname = usePathname()
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)

  const favorites = useAppStore((s) =>
    categoryHelper.sortFavoriteCategories(
      categoryHelper.getFavoriteCategories(s.categories)
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
  const categories = useAppStore((s) =>
    categoryHelper.sortActiveCategories(
      categoryHelper.getActiveCategories(s.categories)
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
  const isScreenSM = useAppStore((s) => s.isScreenSM)
  const [preventFocus, setPreventFocus] = React.useState(false)

  return (
    <Item.Root isActive={isActive}>
      <ContextMenuRoot>
        <DropdownMenuRoot>
          <ContextMenuTrigger asChild>
            <Item.Content.Link
              href={href}
              className="data-[state=open]:border-gray-200 data-[state=open]:bg-gray-50"
            >
              <Item.Label.Icon>
                <span
                  className={cn(
                    'size-2.5 rounded-full',
                    `bg-${getCategoryColor(category.indicator)}-600`
                  )}
                />
              </Item.Label.Icon>
              <Item.Label.Content>{category.title}</Item.Label.Content>
              <DropdownMenuTrigger className="ml-auto flex size-6 shrink-0 items-center justify-center text-gray-400 hover:text-gray-800 data-[state=open]:text-gray-800">
                <MoreVerticalIcon className="size-4" />
              </DropdownMenuTrigger>
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
        <Item.Label.Icon>
          {isOpen ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </Item.Label.Icon>
        <Item.Label.Content>
          {isOpen ? 'Show less' : `Show ${number} more`}
        </Item.Label.Content>
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

function ItemRoot({
  children,
  isActive = false,
}: {
  children: React.ReactNode
  isActive?: boolean
}) {
  return (
    <div className="group flex h-9 items-center" data-active={isActive}>
      <span className="mr-1 h-5 w-1 rounded-r-md bg-newGray-1 group-data-[active=true]:bg-orange-600" />
      {children}
    </div>
  )
}

const itemContentStyle = tw`flex size-full items-center gap-3 overflow-hidden rounded-lg border border-transparent px-2 hover:border-gray-200 hover:bg-gray-50 group-data-[active=true]:border-gray-200 group-data-[active=true]:bg-gray-50`

const ItemContentLink = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithRef<typeof Link>
>(({ children, className, ...props }, ref) => {
  const isScreenSM = useAppStore((s) => s.isScreenSM)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <Link
      {...props}
      ref={ref}
      className={cn(itemContentStyle, className)}
      onClick={() => {
        if (isScreenSM) return toggleSidebar()
      }}
    >
      {children}
    </Link>
  )
})
ItemContentLink.displayName = 'ItemContainerLink'

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

function LabelContent({ children }: React.ComponentProps<'span'>) {
  return (
    <span className="truncate text-sm text-gray-600 data-[active=true]:font-medium group-data-[active=true]:text-gray-900">
      {children}
    </span>
  )
}

function LabelIcon({
  children,
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      {...props}
      className={cn(
        'flex size-4 flex-shrink-0 items-center justify-center',
        className
      )}
    >
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
  Label: {
    Content: LabelContent,
    Icon: LabelIcon,
  },
}
