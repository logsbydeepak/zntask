import React from "react"

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
} from "#/components/ui/dialog"
import { logout } from "#/data/user"
import { useAppStore } from "#/store/app"
import { toast } from "#/store/toast"

import { Button } from "../ui/button"

export function LogoutDialog() {
  const [isOpen, setIsOpen] = React.useState(false)
  const dialogOpen = useAppStore((state) => state.dialogOpen)

  const isLogout = useAppStore((s) => s.dialog.logout)
  const setDialog = useAppStore((s) => s.setDialog)
  const [isPending, startTransition] = React.useTransition()

  const handleClose = React.useCallback(() => {
    if (isPending) return
    setIsOpen(false)
  }, [isPending])

  React.useEffect(() => {
    if (isLogout) {
      setDialog({ logout: false })
      setIsOpen(true)
    }
  }, [isLogout, setIsOpen, setDialog])

  React.useEffect(() => {
    if (dialogOpen !== "logout") {
      handleClose()
    }
  }, [dialogOpen, handleClose])

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="space-y-4 text-center">
        <LogoutDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
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
        toast.error()
      }
    })
  }

  return (
    <>
      <div>
        <DialogTitle>Logout</DialogTitle>
        <DialogDescription>Are you sure you want to logout?</DialogDescription>
      </div>

      <fieldset className="flex space-x-4" disabled={isPending}>
        <DialogClose asChild>
          <Button intent="secondary" className="w-full">
            Cancel
          </Button>
        </DialogClose>
        <Button className="w-full" isLoading={isPending} onClick={handleLogout}>
          Submit
        </Button>
      </fieldset>
    </>
  )
}
