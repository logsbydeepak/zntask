'use client'

import React from 'react'
import Image from 'next/image'
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

import { genInitials } from '@/components/avatar'
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
import {
  isAppSyncingAtom,
  isSidebarOpenAtom,
  useAppStore,
  userAtom,
} from '@/store/app'
import { cn } from '@/utils/style'

export function Navbar() {
  const setDialog = useAppStore((s) => s.setDialog)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)
  const isAppSyncing = useAtomValue(isAppSyncingAtom)

  return (
    <nav className="fixed z-20 w-full border-b border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-orange-600 text-white">
            <span className="h-3 w-3">
              <LogoIcon />
            </span>
          </span>
          <span className="hidden text-sm font-medium xs:block">zntask</span>
        </Link>
        <div className="flex space-x-2 md:space-x-4">
          <div className="flex space-x-1.5 sm:space-x-2">
            <Search />

            <Icon onClick={() => setIsSidebarOpen((open) => !open)}>
              {isSidebarOpen ? <PanelLeftInactiveIcon /> : <PanelLeftIcon />}
            </Icon>
          </div>
          <div className="my-1 w-[1px] bg-gray-200" />

          <div className="flex space-x-1.5 sm:space-x-2">
            <Icon onClick={() => setDialog({ createCategory: true })}>
              <FolderPlusIcon />
            </Icon>

            <Icon onClick={() => setDialog({ createTask: true })}>
              <CheckCircleIcon />
            </Icon>
          </div>

          <DropdownMenuRoot>
            <DropdownMenuTrigger className="relative size-8 rounded-full">
              <Avatar />
              <span
                data-active={isAppSyncing}
                className="absolute bottom-0 right-[1px] hidden size-2 items-center justify-center rounded-full border border-white bg-white data-[active=true]:flex"
              >
                <span className="size-full animate-pulse rounded-full bg-orange-500" />
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent align="end" sideOffset={8} className="w-44">
                <UserMenu />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </div>
    </nav>
  )
}

function UserMenu() {
  const { theme, setTheme } = useTheme()
  const setDialog = useAppStore((s) => s.setDialog)
  const { email, firstName, lastName } = useAtomValue(userAtom)
  const router = useRouter()

  return (
    <>
      <div className="px-2 py-2 text-xs font-medium">
        <p className="overflow-hidden text-ellipsis text-sm">{`${firstName} ${lastName}`}</p>
        <p className="overflow-hidden text-ellipsis text-xs font-normal text-gray-600">
          {email}
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
        <DropdownMenuRadioItem value="light" asChild>
          <ThemeItem>
            <SunIcon />
          </ThemeItem>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark" asChild>
          <ThemeItem>
            <MoonStarIcon />
          </ThemeItem>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system" asChild>
          <ThemeItem>
            <MonitorIcon />
          </ThemeItem>
        </DropdownMenuRadioItem>
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

const iconStyle = cn(
  'flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-950'
)

const ThemeItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className={cn(
      iconStyle,
      'size-8 outline-none data-[state=checked]:border-orange-700 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-orange-600 data-[highlighted]:text-gray-950 data-[state=checked]:text-white data-[highlighted]:ring-2 data-[highlighted]:ring-gray-200 data-[state=checked]:ring-orange-200'
    )}
  >
    <span className="size-4">{children}</span>
  </button>
))
ThemeItem.displayName = 'ThemeItem'

function Icon({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className={cn(iconStyle, 'size-8')}>
      <span className="size-4">{children}</span>
    </button>
  )
}

function Search() {
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <button
      className={cn(iconStyle)}
      onClick={() => setDialog({ commandPalette: true })}
    >
      <span className="flex size-8 items-center justify-center">
        <SearchIcon className="size-3.5" />
      </span>
      <span className="hidden sm:inline-block">
        <span className="mr-10 text-xs text-gray-500">Search</span>
      </span>
    </button>
  )
}

function Avatar() {
  const { profilePicture, firstName, lastName } = useAtomValue(userAtom)
  const initials = genInitials(firstName, lastName)

  return (
    <div className="flex size-full items-center justify-center rounded-full border border-gray-100 bg-gray-50">
      {profilePicture && (
        <Image
          src={profilePicture}
          alt="avatar"
          width={32}
          height={32}
          quality={100}
          className="size-full rounded-full object-cover"
        />
      )}

      {!profilePicture && (
        <p className="text-xs font-medium tracking-wider text-gray-600">
          {initials}
        </p>
      )}
    </div>
  )
}
