import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { useAtom } from 'jotai'

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
  const [search, setSearch] = React.useState('')
  const [pages, setPages] = React.useState([])
  const page = pages[pages.length - 1]

  return (
    <>
      <Command>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          className="w-full"
        />
        <Command.List>
          <Command.Empty>no found</Command.Empty>
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
