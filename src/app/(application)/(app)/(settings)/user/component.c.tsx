'use client'

import { useAppStore } from '@/store/app'

export function ResetPassword() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <button onClick={() => setDialog('resetPassword', true)}>
      Reset Password
    </button>
  )
}
