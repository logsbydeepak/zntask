'use client'

import Link from 'next/link'
import * as Avatar from '@radix-ui/react-avatar'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import Avvvatars from 'avvvatars-react'
import { CommandIcon, FolderPlusIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { LogoIcon } from '@/components/icon/logo'

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
    <nav className="fixed z-40 flex h-14 w-full items-center justify-between border-b border-gray-200 bg-white bg-opacity-50 px-5 backdrop-blur-sm">
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
  const { theme, setTheme } = useTheme()

  return (
    <>
      <DropdownMenu.Item>
        {name}
        <br />
        {email}
      </DropdownMenu.Item>
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger asChild>
          <DropdownMenu.Item>Theme</DropdownMenu.Item>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup
              value={theme}
              onValueChange={(value) => {
                if (['light', 'dark', 'system'].includes(value)) {
                  setTheme(value)
                }
              }}
            >
              <DropdownMenu.RadioItem value="light">
                Light
              </DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="system">
                System
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      </DropdownMenu.Sub>
      <DropdownMenu.Item>Logout</DropdownMenu.Item>
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
