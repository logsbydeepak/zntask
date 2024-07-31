"use client"

import React from "react"

import { AddGoogleDialog } from "./add-google"
import { CategoryDialog } from "./category"
import { CommandPaletteDialog } from "./command-palette"
import { DeleteCategoryDialog } from "./delete-category"
import { LogoutDialog } from "./logout"
import { RemoveGoogleDialog } from "./remove-google"
import { RemovePasswordDialog } from "./remove-password"
import { ResetPasswordDialog } from "./reset-password-auth"
import { TaskDialog } from "./task"
import { UpdateEmailDialog } from "./update-email"
import { UpdateNameDialog } from "./update-name"
import { UpdateProfilePictureDialog } from "./update-profile-picture"

export function Dialogs() {
  return (
    <>
      <UpdateProfilePictureDialog />
      <UpdateNameDialog />
      <ResetPasswordDialog />
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
