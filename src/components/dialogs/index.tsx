'use client'

import React from 'react'

import { useAppStore } from '@/store/app'

import { CategoryDialog } from './category'
import { DeleteCategoryDialog } from './delete-category'
import { LogoutDialog } from './logout'
import { ResetPasswordDialog } from './reset-password'
import { TaskDialog } from './task'

export function Dialogs() {
  const isResetPasswordOpen = useAppStore((state) => state.dialog.resetPassword)
  const setDialog = useAppStore((state) => state.setDialog)

  const setIsResetPasswordOpen = React.useCallback(
    (isOpen: boolean) => setDialog('resetPassword', isOpen),
    [setDialog]
  )

  return (
    <>
      <ResetPasswordDialog
        isOpen={isResetPasswordOpen}
        setIsOpen={setIsResetPasswordOpen}
      />
      <LogoutDialog />
      <CategoryDialog />
      <DeleteCategoryDialog />
      <TaskDialog />
    </>
  )
}
