'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarRoot,
} from '@radix-ui/react-avatar'
import Avvvatars from 'avvvatars-react'
import { useAtomValue, useSetAtom } from 'jotai'
import {
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
import { isSidebarOpenAtom, useAppStore } from '@/store/app'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  MenuIcon,
} from '@ui/menu'

export function Navbar({
  firstName,
  lastName,
  profilePicture,
  email,
}: {
  firstName: string
  lastName: string | null
  profilePicture: string | null
  email: string
}) {
  const setDialog = useAppStore((s) => s.setDialog)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  const name = `${firstName} ${lastName}`
  return (
    <nav className="fixed z-40 w-full border-b border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4 md:px-5">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white">
            <LogoIcon className="h-3 w-3" />
          </span>
          <span className="text-sm font-medium">zntask</span>
        </Link>
        <div className="flex space-x-3 md:space-x-4">
          <div className="flex space-x-3">
            <Search />

            <Icon onClick={() => setIsSidebarOpen((open) => !open)}>
              {isSidebarOpen ? (
                <MenuSquareIcon className="h-full w-full" />
              ) : (
                <PanelLeftIcon className="h-full w-full" />
              )}
            </Icon>
          </div>
          <div className="my-1 w-[1px] bg-gray-200" />

          <div className="flex space-x-3">
            <Icon onClick={() => setDialog('createCategory', true)}>
              <FolderPlusIcon className="h-full w-full" />
            </Icon>

            <Icon>
              <PlusIcon className="h-full w-full" />
            </Icon>
          </div>

          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <ProfilePicture src={profilePicture} name={name} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8}>
              <UserMenu name={name} email={email} src={profilePicture} />
            </DropdownMenuContent>
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
        <ProfilePicture name={name} src={src} />
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
            <SunIcon className="h-full w-full" />
          </ThemeItem>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="dark" asChild>
          <ThemeItem>
            <MoonStarIcon className="h-full w-full" />
          </ThemeItem>
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="system" asChild>
          <ThemeItem>
            <MonitorIcon className="h-full w-full" />
          </ThemeItem>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuItem onSelect={() => setDialog('logout', true)}>
        <MenuIcon>
          <LogOutIcon className="h-full w-full" />
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

function ProfilePicture({ src, name }: { src: string | null; name: string }) {
  return (
    <AvatarRoot className="flex h-8 w-8 items-center justify-center rounded-full ">
      <AvatarImage src={src || ''} />
      <AvatarFallback>
        <Avvvatars value={name} shadow={true} size={32} />
      </AvatarFallback>
    </AvatarRoot>
  )
}

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
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-950"
    >
      <span className="inline-block h-4 w-4">{children}</span>
    </button>
  )
}

function Search() {
  return (
    <button className="group flex items-center rounded-lg border border-gray-200 bg-gray-50 px-[7px] hover:bg-gray-100 hover:text-gray-950 md:pl-3 md:pr-1.5">
      <span className="h-4 w-4 text-gray-500 group-hover:text-gray-950">
        <SearchIcon className="h-full w-full" />
      </span>
      <span className="hidden md:flex md:items-center">
        <span className="ml-2 mr-4 text-xs text-gray-500">Search</span>
        <span className="flex items-center space-x-1 rounded-md border border-gray-200 px-1.5 text-xs text-gray-500">
          <span className="inline-block h-2.5 w-2.5">
            <CommandIcon className="h-full w-full" />
          </span>
          <span className="font-mono text-[10px]">K</span>
        </span>
      </span>
    </button>
  )
}
