import React from 'react'

import * as Dialog from '@/components/ui/dialog'
import { logout } from '@/data/user'
import { useAppStore } from '@/store/app'
import { toast } from '@/store/toast'

import { Button } from '../ui/button'

export function LogoutDialog() {
  const isOpen = useAppStore((s) => s.dialog.logout)
  const setDialog = useAppStore((s) => s.setDialog)
  const [isPending, startTransition] = React.useTransition()

  const closeDialog = () => {
    if (isPending) return
    setDialog({ logout: false })
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDialog}>
      <Dialog.Portal>
        <Dialog.Content className="space-y-4 text-center">
          <LogoutDialogContent
            handleClose={closeDialog}
            isPending={isPending}
            startTransition={startTransition}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function LogoutDialogContent({
  isPending,
  startTransition,
}: {
  handleClose: () => void
  isPending: boolean
  startTransition: React.TransitionStartFunction
}) {
  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logout()
      } catch (error) {
        toast.error('Something went wrong')
      }
    })
  }

  return (
    <>
      <div>
        <Dialog.Title>Logout</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to logout?
        </Dialog.Description>
      </div>

      <fieldset className="flex space-x-4" disabled={isPending}>
        <Dialog.Close asChild>
          <Button intent="secondary" className="w-full">
            Cancel
          </Button>
        </Dialog.Close>
        <Button className="w-full" isLoading={isPending} onClick={handleLogout}>
          Submit
        </Button>
      </fieldset>
    </>
  )
}
