'use client'

import React from 'react'
import Link from 'next/link'
import {
  CalendarClockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  GanttChartIcon,
  HeadingIcon,
  HeartIcon,
  InboxIcon,
} from 'lucide-react'

import { Category, getIndicatorColor, useCategoryStore } from '@/store/category'
import { cn } from '@/utils/style'

export function Sidebar() {
  const categories = useCategoryStore((state) => state.categories)

  return (
    <aside className="fixed bottom-0 top-14 w-56 overflow-y-scroll border-r border-gray-200 bg-white">
      <div className="my-4 space-y-6 px-2">
        <div className="space-y-1">
          <QuickSection />
        </div>
        <div className="space-y-1">
          <FavoriteSection />
        </div>
        <div className="space-y-1">
          <CategorySection />
        </div>
      </div>
    </aside>
  )
}

function QuickSection() {
  const item = [
    {
      icon: <CalendarClockIcon className="h-full w-full" />,
      label: 'today',
      href: '/today',
    },
    {
      label: 'inbox',
      href: '/inbox',
      icon: <InboxIcon className="h-full w-full" />,
    },
    {
      label: 'upcoming',
      href: '/upcoming',
      icon: <GanttChartIcon className="h-full w-full" />,
    },
    {
      label: 'favorite',
      href: '/favorite',
      icon: <HeartIcon className="h-full w-full" />,
    },
    {
      label: 'category',
      href: '/category',
      icon: <FolderIcon className="h-full w-full" />,
    },
  ]

  return (
    <>
      {item.map((i) => (
        <Item.Root key={i.label}>
          <Item.Content.Link href={i.href}>
            <LabelContainer>
              <Item.LabelIcon>{i.icon}</Item.LabelIcon>
              <Item.Label>{i.label}</Item.Label>
            </LabelContainer>
          </Item.Content.Link>
        </Item.Root>
      ))}
    </>
  )
}

function FavoriteSection() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)
  const favorites = useCategoryStore((s) =>
    s.categories.filter((c) => c.isFavorite)
  )

  const favoritesToDisplay = favorites.slice(
    0,
    favorites.length >= 5 && !isCollapsibleOpen ? 4 : favorites.length
  )

  return (
    <>
      <Title>Favorite</Title>
      {favoritesToDisplay.map((i) => (
        <CategoryItem key={i.id} category={i} href={`/favorite/${i.id}`} />
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
    </>
  )
}

function CategorySection() {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = React.useState(false)
  const categories = useCategoryStore((s) => s.categories)

  const categoriesToDisplay = categories.slice(
    0,
    categories.length >= 5 && !isCollapsibleOpen ? 4 : categories.length
  )

  return (
    <>
      <Title>Category</Title>
      {categoriesToDisplay.map((i) => (
        <CategoryItem key={i.id} category={i} href={`/category/${i.id}`} />
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
    </>
  )
}

function CategoryItem({
  category,
  href,
}: {
  category: Category
  href: string
}) {
  return (
    <Item.Root>
      <Item.Content.Link href={href}>
        <Item.LabelContainer>
          <Item.LabelIcon>
            <div
              className={cn(
                'h-3 w-3 rounded-sm',
                `bg-${getIndicatorColor(category.indicator)}-600`
              )}
            />
          </Item.LabelIcon>
          <Item.Label>{category.title}</Item.Label>
        </Item.LabelContainer>
      </Item.Content.Link>
    </Item.Root>
  )
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
  return <h4 className="text-xs font-medium text-gray-600">{children}</h4>
}

function ItemRoot({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

const itemContentStyle =
  'flex items-center h-9 px-2 hover:bg-gray-50 rounded-md border border-transparent hover:border-gray-200 w-full'
function ItemContentLink({
  children,
  href,
  className,
}: React.ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(itemContentStyle, className)}>
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

function ItemLabel({ className, children }: React.ComponentProps<'span'>) {
  return <span className="text-sm text-gray-600">{children}</span>
}

function ItemLabelIcon({ className, children }: React.ComponentProps<'span'>) {
  return (
    <span className="flex h-4 w-4 items-center justify-center">{children}</span>
  )
}

function LabelContainer({ children }: React.ComponentProps<'span'>) {
  return <span className="flex items-center space-x-3">{children}</span>
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
