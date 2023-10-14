import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useAtom } from 'jotai'
import { FolderIcon, SearchIcon } from 'lucide-react'

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
        <Command.List className="container-scroll ml-2 h-56 overflow-y-scroll py-2 pr-1">
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
              <Command.Group heading="Pages">
                <Command.Item>inbox</Command.Item>
                <Command.Item>today</Command.Item>
                <Command.Item>favorite</Command.Item>
                <Command.Item>category</Command.Item>
              </Command.Group>

              <Command.Group heading="Actions">
                <Command.Item>new task</Command.Item>
                <Command.Item>new category</Command.Item>
                <Command.Item>search category</Command.Item>
                <Command.Item>search favorite</Command.Item>
                <Command.Item>search task</Command.Item>
              </Command.Group>
            </>
          )}
        </Command.List>
      </Command>
    </>
  )
}
