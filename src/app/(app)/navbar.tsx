"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckCircleIcon,
  FolderPlusIcon,
  LogOutIcon,
  MonitorIcon,
  MoonStarIcon,
  PanelLeftIcon,
  PanelLeftInactiveIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar } from "#/components/avatar"
import { LogoIcon } from "#/components/icon/logo"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from "#/components/ui/menu"
import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { useAppStore } from "#/store/app"
import { cn, tw } from "#/utils/style"

export function Navbar() {
  const setDialog = useAppStore((s) => s.setDialog)

  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const isAppSyncing = useAppStore((s) => s.isAppSyncing)
  const user = useAppStore((s) => s.user)

  return (
    <nav className="fixed z-20 w-full border-b border-gray-3 bg-gray-1 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-orange-9 bg-gradient-to-b from-white/5 to-black/10 text-white">
            <span className="size-3">
              <LogoIcon />
            </span>
          </span>
          <span className="hidden text-sm font-medium xs:block">zntask</span>
        </Link>
        <TooltipProvider>
          <div className="flex space-x-2.5">
            <span className="hidden sm:inline-block">
              <SearchXL />
            </span>

            <span className="inline-block sm:hidden">
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Icon onClick={() => setDialog({ commandPalette: true })}>
                    <SearchIcon />
                  </Icon>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>search</TooltipContent>
              </TooltipRoot>
            </span>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Icon onClick={() => toggleSidebar()}>
                  {isSidebarOpen ? (
                    <PanelLeftInactiveIcon />
                  ) : (
                    <PanelLeftIcon />
                  )}
                </Icon>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>
                {isSidebarOpen ? "close sidebar" : "open sidebar"}
              </TooltipContent>
            </TooltipRoot>

            <span className="my-1.5 w-px bg-gray-3" />

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Icon onClick={() => setDialog({ createCategory: true })}>
                  <FolderPlusIcon />
                </Icon>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>new category</TooltipContent>
            </TooltipRoot>

            <TooltipRoot>
              <TooltipTrigger asChild>
                <Icon onClick={() => setDialog({ createTask: true })}>
                  <CheckCircleIcon />
                </Icon>
              </TooltipTrigger>
              <TooltipContent sideOffset={8}>new task</TooltipContent>
            </TooltipRoot>

            <DropdownMenuRoot>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger className="relative size-8 rounded-full">
                    <Avatar
                      profilePicture={user.profilePicture}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size={32}
                      className="text-xs"
                    />
                    <span
                      data-active={isAppSyncing}
                      className="absolute bottom-0 right-px hidden size-2 items-center justify-center rounded-full border-[1.5px] border-gray-1 bg-gray-1 data-[active=true]:flex"
                    >
                      <span className="size-full animate-pulse rounded-full bg-orange-9" />
                    </span>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent sideOffset={8}>user</TooltipContent>
              </TooltipRoot>

              <DropdownMenuPortal>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-44"
                >
                  <UserMenu />
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenuRoot>
          </div>
        </TooltipProvider>
      </div>
    </nav>
  )
}

function UserMenu() {
  const { theme, setTheme } = useTheme()
  const setDialog = useAppStore((s) => s.setDialog)
  const user = useAppStore((s) => s.user)
  const router = useRouter()

  const themeOptions = [
    {
      Icon: SunIcon,
      label: "light theme",
      value: "light",
    },
    {
      Icon: MoonStarIcon,
      label: "dark theme",
      value: "dark",
    },
    {
      Icon: MonitorIcon,
      label: "system theme",
      value: "system",
    },
  ]

  const name = user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName

  return (
    <>
      <div className="p-2 text-xs font-medium">
        <p className="truncate text-sm">{name}</p>
        <p className="truncate text-xs font-normal text-gray-11">
          {user.email}
        </p>
      </div>

      <DropdownMenuItem onSelect={() => router.push("/user")}>
        <MenuIcon intent="destructive">
          <UserIcon />
        </MenuIcon>
        <span>User</span>
      </DropdownMenuItem>

      <DropdownMenuRadioGroup
        className="flex justify-between p-4"
        value={theme}
        onValueChange={(value) => {
          if (["light", "dark", "system"].includes(value)) {
            setTheme(value)
          }
        }}
      >
        {themeOptions.map(({ Icon, ...i }) => (
          <TooltipRoot key={i.value}>
            <TooltipTrigger asChild>
              <DropdownMenuRadioItem
                value={i.value}
                className={cn(
                  iconStyle,
                  "size-8 cursor-pointer outline-none",
                  "data-[highlighted]:text-gray-12 data-[state=checked]:text-gray-1",
                  "data-[highlighted]:bg-gray-3 data-[state=checked]:bg-orange-10",
                  "data-[highlighted]:ring-2 data-[highlighted]:ring-gray-3",
                  "data-[state=checked]:border-orange-8 data-[state=checked]:ring-orange-3"
                )}
              >
                <Icon className="size-3.5" />
              </DropdownMenuRadioItem>
            </TooltipTrigger>
            <TooltipContent sideOffset={8}>{i.label}</TooltipContent>
          </TooltipRoot>
        ))}
      </DropdownMenuRadioGroup>

      <DropdownMenuItem
        onSelect={() => setDialog({ logout: true })}
        intent="destructive"
      >
        <MenuIcon intent="destructive">
          <LogOutIcon />
        </MenuIcon>
        <span>Logout</span>
      </DropdownMenuItem>
    </>
  )
}

const iconStyle = tw(
  "flex items-center justify-center rounded-lg border border-gray-5 bg-gray-2 text-gray-11 hover:border-gray-6 hover:bg-gray-3 hover:text-gray-12 active:border-gray-7 active:bg-gray-4"
)

const Icon = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button">
>(({ children, ...props }, ref) => (
  <button {...props} ref={ref} className={cn(iconStyle, "size-8")}>
    <span className="size-4">{children}</span>
  </button>
))
Icon.displayName = "Icon"

function SearchXL() {
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <button
      className={cn(iconStyle)}
      onClick={() => setDialog({ commandPalette: true })}
    >
      <span className="flex size-8 items-center justify-center">
        <SearchIcon className="size-3.5" />
      </span>
      <span className="mr-10 text-xs text-gray-11">Search</span>
    </button>
  )
}
