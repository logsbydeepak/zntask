import React from 'react'

import { useAppStore } from '@/store/app'
import * as Dialog from '@ui/dialog'

import { Button } from '../ui/button'

export function LogoutDialog() {
  const isOpen = useAppStore((s) => s.dialog.logout)
  const setDialog = useAppStore((s) => s.setDialog)
  const [isPending, startTransition] = React.useTransition()

  const setIsOpen = React.useCallback(
    (isOpen: boolean) => setDialog('logout', isOpen),
    [setDialog]
  )

  const handleClose = () => {
    if (isPending) return
    setIsOpen(false)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Content className="space-y-4 text-center">
          <LogoutDialogContent
            handleClose={handleClose}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function LogoutDialogContent({
  handleClose,
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  return (
    <>
      <div>
        <Dialog.Title>Logout</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to logout?
        </Dialog.Description>
      </div>

      <div className="flex space-x-4">
        <Dialog.Close asChild>
          <Button intent="secondary" className="w-full">
            Cancel
          </Button>
        </Dialog.Close>
        <Button className="w-full" isLoading={isPending}>
          Submit
        </Button>
      </div>
    </>
  )
}
