'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Avvvatars from 'avvvatars-react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  CheckCircleIcon,
  CommandIcon,
  FolderPlusIcon,
  LogOutIcon,
  MenuSquareIcon,
  MonitorIcon,
  MoonStarIcon,
  PanelLeftIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'

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

export function Navbar() {
  const setDialog = useAppStore((s) => s.setDialog)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)
  const user = useAtomValue(userAtom)
  const isAppSyncing = useAtomValue(isAppSyncingAtom)

  const name = `${user.firstName} ${user.lastName}`
  return (
    <nav className="fixed z-20 w-full border-b border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white">
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
              {isSidebarOpen ? <MenuSquareIcon /> : <PanelLeftIcon />}
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
            <DropdownMenuTrigger asChild>
              <button className="relative">
                <Avatar src={user.profilePicture} name={name} />
                <span
                  data-active={isAppSyncing}
                  className="absolute bottom-0 right-[1px] hidden h-2 w-2 items-center justify-center rounded-full border border-white bg-white data-[active=true]:flex"
                >
                  <span className="h-full w-full animate-pulse rounded-full bg-orange-500" />
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
              <DropdownMenuContent align="end" sideOffset={8}>
                <UserMenu
                  name={name}
                  email={user.email}
                  src={user.profilePicture}
                />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenuRoot>
        </div>
      </div>
    </nav>
  )
}

function UserMenu({
  name,
  email,
  src,
}: {
  name: string
  email: string
  src: string | null
}) {
  const { theme, setTheme } = useTheme()
  const setDialog = useAppStore((s) => s.setDialog)
  const router = useRouter()

  return (
    <>
      <DropdownMenuItem onSelect={() => router.push('/user')} className="">
        <Avatar src={src} name={name} />
        <span>
          <p className="w-24 overflow-hidden text-ellipsis">{name}</p>
          <p className="w-24 overflow-hidden text-ellipsis text-[10px] font-normal">
            {email}
          </p>
        </span>
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

const ThemeItem = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>(({ children, ...props }, ref) => (
  <button
    {...props}
    ref={ref}
    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none data-[state=checked]:border-orange-700 data-[highlighted]:bg-gray-100 data-[state=checked]:bg-orange-600 data-[highlighted]:text-gray-950 data-[state=checked]:text-white data-[highlighted]:ring-2 data-[highlighted]:ring-gray-950 data-[highlighted]:ring-offset-2"
  >
    <span className="inline-block h-4 w-4">{children}</span>
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
    <button
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
    >
      <span className="inline-block h-4 w-4">{children}</span>
    </button>
  )
}

function Search() {
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <button
      className="group flex items-center rounded-lg border border-gray-100 bg-gray-50 px-[7px] hover:bg-gray-100 hover:text-gray-950 sm:pl-3 sm:pr-1.5"
      onClick={() => setDialog({ commandPalette: true })}
    >
      <span className="h-4 w-4 text-gray-500 group-hover:text-gray-950">
        <SearchIcon />
      </span>
      <span className="hidden sm:inline-block">
        <span className="ml-2 mr-8 text-xs text-gray-500">Search</span>
      </span>
    </button>
  )
}

function Avatar({ src, name }: { src: string | null; name: string }) {
  if (src) {
    return (
      <div className="relative h-8 w-8">
        <Image
          src={src || ''}
          alt="avatar"
          fill
          className="h-full  w-full rounded-full object-cover"
        />
      </div>
    )
  }

  return <Avvvatars value={name} />
}
