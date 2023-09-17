'use client'

import Link from 'next/link'
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarRoot,
} from '@radix-ui/react-avatar'
import Avvvatars from 'avvvatars-react'
import { CommandIcon, FolderPlusIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { LogoIcon } from '@/components/icon/logo'
import { useAppStore } from '@/store/app'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
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

  const name = `${firstName} ${lastName}`
  return (
    <nav className="fixed z-40 w-full border-b border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-5 ">
        <Link href="/" className="flex items-center space-x-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white">
            <LogoIcon className="h-3 w-3" />
          </span>
          <span className="text-sm font-medium">zntask</span>
        </Link>
        <div className="flex space-x-4">
          <Search />

          <Icon onClick={() => setDialog('createCategory', true)}>
            <FolderPlusIcon className="h-full w-full" />
          </Icon>

          <Icon>
            <PlusIcon className="h-full w-full" />
          </Icon>

          <DropdownMenuRoot>
            <DropdownMenuTrigger>
              <ProfilePicture src={profilePicture} name={name} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <UserMenu name={name} email={email} />
            </DropdownMenuContent>
          </DropdownMenuRoot>
        </div>
      </div>
    </nav>
  )
}

function UserMenu({ name, email }: { name: string; email: string }) {
  const { theme, setTheme } = useTheme()
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <>
      <DropdownMenuItem>
        {name}
        <br />
        {email}
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger asChild>
          <DropdownMenuItem>Theme</DropdownMenuItem>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={theme}
              onValueChange={(value) => {
                if (['light', 'dark', 'system'].includes(value)) {
                  setTheme(value)
                }
              }}
            >
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuItem onSelect={() => setDialog('logout', true)}>
        Logout
      </DropdownMenuItem>
    </>
  )
}

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
    <button className="group flex items-center rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-1.5 hover:bg-gray-100 hover:text-gray-950">
      <span className="h-4 w-4 text-gray-500 group-hover:text-gray-950">
        <SearchIcon className="h-full w-full" />
      </span>
      <span className="ml-2 mr-4 text-xs text-gray-500">Search</span>
      <span className="flex items-center space-x-1 rounded-md border border-gray-200 px-1.5 text-xs text-gray-500">
        <span className="inline-block h-2.5 w-2.5">
          <CommandIcon className="h-full w-full" />
        </span>
        <span className="font-mono text-[10px]">K</span>
      </span>
    </button>
  )
}
