import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useAtom } from 'jotai'
import {
  CalendarClockIcon,
  FolderIcon,
  FolderPlusIcon,
  FolderSearch2Icon,
  FolderSearchIcon,
  HeartIcon,
  InboxIcon,
  PlusIcon,
  ScanSearchIcon,
  SearchIcon,
} from 'lucide-react'

import { isCommandPaletteOpenAtom } from '@/store/app'

export function CommandPalletDialog() {
  const [isOpen, setIsOpen] = useAtom(isCommandPaletteOpenAtom)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content className="fixed left-1/2 top-16 z-40 w-[400px] -translate-x-1/2 transform rounded-md border border-gray-200 bg-white p-0 shadow-sm drop-shadow-sm">
          <CommandPalletContent handleClose={handleClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CommandPalletContent({ handleClose }: { handleClose: () => void }) {
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState('')
  const [pages, setPages] = React.useState([])
  const page = pages[pages.length - 1]

  const pagesGroups = [
    {
      label: 'today',
      icon: <CalendarClockIcon />,
      onSelect: () => {},
    },
    {
      label: 'inbox',
      icon: <InboxIcon />,
      onSelect: () => {},
    },
    {
      label: 'favorite',
      icon: <HeartIcon />,
      onSelect: () => {},
    },
    {
      label: 'category',
      icon: <FolderIcon />,
      onSelect: () => {},
    },
  ]

  const actionsGroup = [
    {
      label: 'new task',
      icon: <PlusIcon />,
      onSelect: () => {},
    },
    {
      label: 'new category',
      icon: <FolderPlusIcon />,
      onSelect: () => {},
    },
    {
      label: 'search category',
      icon: <FolderSearchIcon />,
      onSelect: () => {},
    },
    {
      label: 'search favorite',
      icon: <FolderSearch2Icon />,
      onSelect: () => {},
    },
    {
      label: 'search task',
      icon: <ScanSearchIcon />,
      onSelect: () => {},
    },
  ]

  return (
    <>
      <Command>
        <div className="flex items-center border-b border-gray-200 py-2.5 pl-3.5 pr-2.5">
          <SearchIcon className="h-3 w-3 text-gray-400" />
          <Command.Input
            ref={searchInputRef}
            value={search}
            placeholder="search"
            onValueChange={setSearch}
            className="ml-2 h-5 w-full border-none p-0 text-sm outline-none placeholder:text-gray-400 focus:ring-0"
          />
        </div>
        <Command.List className="container-scroll ml-2 h-40 overflow-y-scroll py-2 pb-5 pr-1 [&>[cmdk-list-sizer]]:space-y-3">
          <Command.Empty className="flex h-[calc(100%-5%)] items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-1 rounded-md border px-4 py-4 shadow-sm">
              <span className="inline-block h-5 w-5">
                <SearchIcon />
              </span>
              <p className="text-xs text-gray-600">not result</p>
            </div>
          </Command.Empty>
          {!page && (
            <>
              <CommandItem.Group heading="Pages">
                {pagesGroups.map((i) => (
                  <CommandItem.Container key={i.label} onSelect={() => {}}>
                    <CommandItem.Icon>{i.icon}</CommandItem.Icon>
                    <CommandItem.Title>{i.label}</CommandItem.Title>
                  </CommandItem.Container>
                ))}
              </CommandItem.Group>

              <CommandItem.Group heading="Actions">
                {actionsGroup.map((i) => (
                  <CommandItem.Container key={i.label} onSelect={() => {}}>
                    <CommandItem.Icon>{i.icon}</CommandItem.Icon>
                    <CommandItem.Title>{i.label}</CommandItem.Title>
                  </CommandItem.Container>
                ))}
              </CommandItem.Group>
            </>
          )}
        </Command.List>
      </Command>
    </>
  )
}

const CommandItemContainer = React.forwardRef<
  React.ElementRef<typeof Command.Item>,
  React.ComponentPropsWithoutRef<typeof Command.Item>
>(({ ...props }, ref) => {
  return (
    <Command.Item
      ref={ref}
      {...props}
      className="group/item my-0.5 flex cursor-pointer items-center rounded-md border border-transparent px-2 py-1.5 data-[selected=true]:border-gray-200 data-[selected=true]:bg-gray-50"
    />
  )
})
CommandItemContainer.displayName = Command.Item.displayName

const CommandItemGroup = React.forwardRef<
  React.ElementRef<typeof Command.Group>,
  React.ComponentPropsWithoutRef<typeof Command.Group>
>(({ ...props }, ref) => {
  return (
    <Command.Group
      ref={ref}
      {...props}
      className="space-y-1 text-xs font-medium text-gray-400 last:pb-2"
    />
  )
})
CommandItemGroup.displayName = Command.Group.displayName

function CommandItemIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="mr-2 flex h-4 w-4 items-center justify-center text-gray-600 group-data-[selected=true]/item:text-gray-950">
      {children}
    </div>
  )
}

function CommandItemTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="overflow-hidden overflow-ellipsis text-xs text-gray-600 group-data-[selected=true]/item:text-gray-950">
      {children}
    </p>
  )
}

const CommandItem = {
  Container: CommandItemContainer,
  Icon: CommandItemIcon,
  Title: CommandItemTitle,
  Group: CommandItemGroup,
}
