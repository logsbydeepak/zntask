import React from "react"

import { DialogContent, DialogRoot } from "#/components/ui/dialog"

import { ResetPasswordDialogContent } from "./reset-password-content"

export function ResetPasswordDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const [isPending, startTransition] = React.useTransition()

  const handleClose = () => {
    if (isPending) return
    setIsOpen(false)
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <ResetPasswordDialogContent
          handleClose={handleClose}
          isPending={isPending}
          startTransition={startTransition}
        />
      </DialogContent>
    </DialogRoot>
  )
}
