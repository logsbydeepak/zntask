import React from "react"

import { DialogContent, DialogRoot } from "#/components/ui/dialog"
import { useAppStore } from "#/store/app"

import { ResetPasswordDialogContent } from "./reset-password-content"

export function ResetPasswordDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  const [isPending, startTransition] = React.useTransition()

  const isResetPassword = useAppStore((state) => state.dialog.resetPassword)
  const dialogOpen = useAppStore((state) => state.dialogOpen)
  const setDialog = useAppStore((state) => state.setDialog)

  const handleClose = React.useCallback(() => {
    if (isPending) return
    setIsOpen(false)
  }, [isPending])

  React.useEffect(() => {
    if (isResetPassword) {
      setDialog({ resetPassword: false })
      setIsOpen(true)
    }
  }, [isResetPassword, setIsOpen, setDialog])

  React.useEffect(() => {
    if (dialogOpen !== "resetPassword") {
      handleClose()
    }
  }, [dialogOpen, handleClose])

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
