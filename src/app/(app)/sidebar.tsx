"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cva } from "cva"
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  GanttChartIcon,
  HeartIcon,
  InboxIcon,
  MoreVerticalIcon,
} from "lucide-react"

import { CategoryMenuContent } from "#/components/category-menu-content"
import {
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuRoot,
  ContextMenuTrigger,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "#/components/ui/menu"
import { useAppStore } from "#/store/app"
import { Category, categoryHelper, getCategoryColor } from "#/utils/category"
import { cn, tw } from "#/utils/style"

export function Sidebar() {
  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen)

  return (
    <aside
      data-sidebar={isSidebarOpen}
      className={cn(
        "fixed bottom-0 top-14 z-10 w-full overflow-y-scroll bg-gray-1 pr-1 md:w-56",
        "invisible -translate-x-full data-[sidebar=true]:visible data-[sidebar=true]:translate-x-0 ",
        "transition-transform duration-150 ease-in-out"
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
      Icon: CalendarIcon,
      label: "today",
      href: "/today",
      isActive: pathname.startsWith("/today") || pathname === "/",
    },
    {
      label: "inbox",
      href: "/inbox",
      Icon: InboxIcon,
      isActive: pathname.startsWith("/inbox"),
    },
    {
      label: "upcoming",
      href: "/upcoming",
      Icon: GanttChartIcon,
      isActive: pathname.startsWith("/upcoming"),
    },
    {
      label: "favorite",
      href: "/favorite",
      Icon: HeartIcon,
      isActive: pathname === "/favorite",
    },
    {
      label: "category",
      href: "/category",
      Icon: FolderIcon,
      isActive: pathname === "/category",
    },
  ]

  return (
    <ItemContainer>
      {item.map(({ Icon, ...i }) => (
        <Item.Root key={i.label} isActive={i.isActive}>
          <Item.Content.Link href={i.href}>
            <Item.Label.Icon>
              <Icon className="text-gray-11 group-data-[active=true]:text-orange-9" />
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

  return (
    <Item.Root isActive={isActive}>
      <ContextMenuRoot>
        <DropdownMenuRoot>
          <ContextMenuTrigger asChild>
            <Item.Content.Link
              href={href}
              className="data-[state=open]:border-gray-4 data-[state=open]:bg-gray-2"
            >
              <Item.Label.Icon>
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    getCategoryColor(category.indicator, "bg")
                  )}
                />
              </Item.Label.Icon>
              <Item.Label.Content>{category.title}</Item.Label.Content>
              <DropdownMenuTrigger className="ml-auto flex size-6 shrink-0 items-center justify-center text-gray-7 hover:text-gray-9 data-[state=open]:text-gray-10">
                <MoreVerticalIcon className="size-4" />
              </DropdownMenuTrigger>
            </Item.Content.Link>
          </ContextMenuTrigger>
          <ContextMenuPortal>
            <ContextMenuContent>
              <CategoryMenuContent category={category} type="context" />
            </ContextMenuContent>
          </ContextMenuPortal>
          <DropdownMenuPortal>
            <DropdownMenuContent align={isScreenSM ? "end" : "start"}>
              <CategoryMenuContent category={category} type="dropdown" />
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
      <div className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-5 bg-gray-2 py-10 md:py-5">
        {children}
      </div>
    </div>
  )
}

function EmptyLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-gray-11">{children}</p>
}

function EmptyIcon({ children }: { children: React.ReactNode }) {
  return <div className="size-4 text-gray-11">{children}</div>
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
          {isOpen ? "Show less" : `Show ${number} more`}
        </Item.Label.Content>
      </Item.Content.Button>
    </Item.Root>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <h4 className="pl-3 text-xs font-medium text-gray-10">{children}</h4>
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
      <span className="mr-1 h-5 w-1 rounded-r-md bg-gray-1 group-data-[active=true]:bg-orange-9" />
      {children}
    </div>
  )
}

const itemContentStyle = tw(
  "flex size-full items-center gap-3 overflow-hidden rounded-lg border border-transparent px-2 hover:border-gray-5 hover:bg-gray-2 group-data-[active=true]:border-gray-4 group-data-[active=true]:bg-gray-2"
)

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
ItemContentLink.displayName = "ItemContainerLink"

function ItemContentButton({
  children,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button {...props} className={cn(itemContentStyle, className)}>
      {children}
    </button>
  )
}

function LabelContent({ children }: React.ComponentProps<"span">) {
  return (
    <span className="truncate text-sm text-gray-11 data-[active=true]:font-medium group-data-[active=true]:text-gray-12">
      {children}
    </span>
  )
}

function LabelIcon({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={cn(
        "flex size-4 shrink-0 items-center justify-center",
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
