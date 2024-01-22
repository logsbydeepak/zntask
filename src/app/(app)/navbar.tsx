'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAtomValue, useSetAtom } from 'jotai'
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
} from 'lucide-react'
import { useTheme } from 'next-themes'

import { Avatar } from '@/components/avatar'
import { LogoIcon } from '@/components/icon/logo'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@/components/ui/menu'
import * as Tooltip from '@/components/ui/tooltip'
import { useAppStore, userAtom } from '@/store/app'
import { cn, tw } from '@/utils/style'

export function Navbar() {
  const setDialog = useAppStore((s) => s.setDialog)

  const isSidebarOpen = useAppStore((s) => s.isSidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  const isAppSyncing = useAppStore((s) => s.isAppSyncing)
  const { profilePicture, firstName, lastName } = useAtomValue(userAtom)

  return (
    <nav className="fixed z-20 w-full border-b border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-newOrange-9 text-white">
            <span className="h-3 w-3">
              <LogoIcon />
            </span>
          </span>
          <span className="hidden text-sm font-medium xs:block">zntask</span>
        </Link>
        <Tooltip.Provider>
          <div className="flex space-x-2.5">
            <span className="hidden sm:inline-block">
              <SearchXL />
            </span>

            <span className="inline-block sm:hidden">
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Icon onClick={() => setDialog({ commandPalette: true })}>
                    <SearchIcon />
                  </Icon>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={8}>search</Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </span>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icon onClick={() => toggleSidebar()}>
                  {isSidebarOpen ? (
                    <PanelLeftInactiveIcon />
                  ) : (
                    <PanelLeftIcon />
                  )}
                </Icon>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={8}>
                  {isSidebarOpen ? 'close sidebar' : 'open sidebar'}
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <span className="my-1.5 w-[1px] bg-gray-200" />

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icon onClick={() => setDialog({ createCategory: true })}>
                  <FolderPlusIcon />
                </Icon>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={8}>new category</Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icon onClick={() => setDialog({ createTask: true })}>
                  <CheckCircleIcon />
                </Icon>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content sideOffset={8}>new task</Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <DropdownMenuRoot>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <DropdownMenuTrigger className="relative size-8 rounded-full">
                    <Avatar
                      profilePicture={profilePicture}
                      firstName={firstName}
                      lastName={lastName}
                      size={32}
                      className="text-xs"
                    />
                    <span
                      data-active={isAppSyncing}
                      className="absolute bottom-0 right-[1px] hidden size-2 items-center justify-center rounded-full border-[1.5px] border-white bg-white data-[active=true]:flex"
                    >
                      <span className="size-full animate-pulse rounded-full bg-orange-500" />
                    </span>
                  </DropdownMenuTrigger>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={8}>user</Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>

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
        </Tooltip.Provider>
      </div>
    </nav>
  )
}

function UserMenu() {
  const { theme, setTheme } = useTheme()
  const setDialog = useAppStore((s) => s.setDialog)
  const user = useAtomValue(userAtom)
  const router = useRouter()

  const themeOptions = [
    {
      icon: <SunIcon />,
      label: 'light theme',
      value: 'light',
    },
    {
      icon: <MoonStarIcon />,
      label: 'dark theme',
      value: 'dark',
    },
    {
      icon: <MonitorIcon />,
      label: 'system theme',
      value: 'system',
    },
  ]

  const name = user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName

  return (
    <>
      <div className="px-2 py-2 text-xs font-medium">
        <p className="truncate text-sm">{name}</p>
        <p className="truncate text-xs font-normal text-gray-600">
          {user.email}
        </p>
      </div>

      <DropdownMenuItem onSelect={() => router.push('/user')}>
        <MenuIcon intent="destructive">
          <UserIcon />
        </MenuIcon>
        <span>User</span>
      </DropdownMenuItem>

      <DropdownMenuRadioGroup
        className="flex justify-between px-4 py-4"
        value={theme}
        onValueChange={(value) => {
          if (['light', 'dark', 'system'].includes(value)) {
            setTheme(value)
          }
        }}
      >
        {themeOptions.map((i) => (
          <Tooltip.Root key={i.value}>
            <Tooltip.Trigger asChild>
              <DropdownMenuRadioItem
                value={i.value}
                className={cn(
                  iconStyle,
                  'size-8 cursor-pointer outline-none',
                  'data-[highlighted]:text-gray-950 data-[state=checked]:text-white',
                  'data-[highlighted]:bg-gray-100 data-[state=checked]:bg-orange-600',
                  'data-[highlighted]:ring-2 data-[highlighted]:ring-gray-200',
                  'data-[state=checked]:border-orange-700 data-[state=checked]:ring-orange-200'
                )}
              >
                <span className="size-3.5">{i.icon}</span>
              </DropdownMenuRadioItem>
            </Tooltip.Trigger>
            <Tooltip.Content sideOffset={8}>{i.label}</Tooltip.Content>
          </Tooltip.Root>
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

const iconStyle = tw`flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-950`

const Icon = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => (
  <button {...props} ref={ref} className={cn(iconStyle, 'size-8')}>
    <span className="size-4">{children}</span>
  </button>
))
Icon.displayName = 'Icon'

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
      <span className="mr-10 text-xs text-gray-500">Search</span>
    </button>
  )
}
