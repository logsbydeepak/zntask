'use client'

import Link from 'next/link'
import Avvvatars from 'avvvatars-react'
import {
  CommandIcon,
  FolderPlus,
  FolderPlusIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'

import { LogoIcon } from '@/components/icon/logo'
import { buttonStyle } from '@/components/ui/button'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

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
  const name = `${firstName} ${lastName}`
  return (
    <nav className="flex h-14 items-center justify-between border-b border-gray-200 px-5">
      <Link href="/" className="flex items-center space-x-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-600 text-white">
          <LogoIcon className="h-3 w-3" />
        </span>
        <span className="text-sm font-medium">zntask</span>
      </Link>
      <div className="flex space-x-4">
        <Search />

        <Icon>
          <FolderPlusIcon className="h-full w-full" />
        </Icon>

        <Icon>
          <PlusIcon className="h-full w-full" />
        </Icon>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <ProfilePicture src={profilePicture} name={name} />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <UserMenu name={name} email={email} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </nav>
  )
}

function UserMenu({ name, email }: { name: string; email: string }) {
  return (
    <>
      <DropdownMenu.Item>
        {name}
        <br />
        {email}
      </DropdownMenu.Item>
    </>
  )
}

function ProfilePicture({ src, name }: { src: string | null; name: string }) {
  return (
    <Avatar.Root>
      <Avatar.Image src={src || ''}>1</Avatar.Image>
      <Avatar.Fallback>
        <Avvvatars value={name} shadow={true} size={28} />
      </Avatar.Fallback>
    </Avatar.Root>
  )
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-950">
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
        <span className="text-[10px]">K</span>
      </span>
    </button>
  )
}
