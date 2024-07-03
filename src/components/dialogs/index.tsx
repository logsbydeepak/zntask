"use client"

import React from "react"

import { useAppStore } from "#/store/app"

import { AddGoogleDialog } from "./add-google"
import { CategoryDialog } from "./category"
import { CommandPaletteDialog } from "./command-palette"
import { DeleteCategoryDialog } from "./delete-category"
import { LogoutDialog } from "./logout"
import { RemoveGoogleDialog } from "./remove-google"
import { RemovePasswordDialog } from "./remove-password"
import { ResetPasswordDialog } from "./reset-password"
import { TaskDialog } from "./task"
import { UpdateEmailDialog } from "./update-email"
import { UpdateNameDialog } from "./update-name"
import { UpdateProfilePictureDialog } from "./update-profile-picture"

export function Dialogs() {
  const isResetPasswordOpen = useAppStore((state) => state.dialog.resetPassword)
  const setDialog = useAppStore((state) => state.setDialog)

  const setIsResetPasswordOpen = React.useCallback(
    (isOpen: boolean) => setDialog({ resetPassword: isOpen }),
    [setDialog]
  )

  return (
    <>
      <UpdateProfilePictureDialog />
      <UpdateNameDialog />
      <ResetPasswordDialog
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
      />
      <LogoutDialog />
      <CategoryDialog />
      <DeleteCategoryDialog />
      <TaskDialog />
      <CommandPaletteDialog />
      <AddGoogleDialog />
      <RemoveGoogleDialog />
      <UpdateEmailDialog />
      <RemovePasswordDialog />
    </>
  )
}
