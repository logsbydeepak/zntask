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
        <Dialog.Content className="fixed left-1/2 top-16 z-50 w-[400px] -translate-x-1/2 transform rounded-md border border-gray-200 bg-white p-0 shadow-sm drop-shadow-sm">
          <CommandPalletContent handleClose={handleClose} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function CommandPalletContent({ handleClose }: { handleClose: () => void }) {
  return (
    <>
      {/* <input type="text" /> */}
      <Command>
        <Command.Input />
        <Command.List>
          <Command.Empty>no found</Command.Empty>
          <Command.Item>new task</Command.Item>
          <Command.Item>new category</Command.Item>
        </Command.List>
      </Command>
    </>
  )
}
