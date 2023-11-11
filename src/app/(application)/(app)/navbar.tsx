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
            <DropdownMenuTrigger>
              <ProfilePicture src={user.profilePicture} name={name} />
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

function ProfilePicture({ src, name }: { src: string | null; name: string }) {
  const isAppSyncing = useAtomValue(isAppSyncingAtom)

  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAppSyncing) {
        e.preventDefault()
        return (e.returnValue = 'Your changes are not saved. Are you sure?')
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isAppSyncing])

  return (
    <AvatarRoot className="relative flex h-8 w-8 items-center justify-center rounded-full">
      <AvatarImage src={src || ''} />
      <AvatarFallback>
        <Avvvatars value={name} shadow={true} size={32} />
      </AvatarFallback>
      <span
        className="absolute bottom-0 right-0 mb-0.5 h-1.5 w-1.5 rounded-full border-white bg-orange-600 ring-2 ring-white transition-opacity data-[sync=false]:hidden data-[sync=true]:animate-pulse"
        data-sync={isAppSyncing}
      />
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
  const setDialog = useAppStore((s) => s.setDialog)

  return (
    <button
      className="group flex items-center rounded-lg border border-gray-200 bg-gray-50 px-[7px] hover:bg-gray-100 hover:text-gray-950 sm:pl-3 sm:pr-1.5"
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
