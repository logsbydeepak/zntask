'use client'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app'

export function ResetPassword() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <button onClick={() => setDialog({ resetPassword: true })}>
      Reset Password
    </button>
  )
}

export function Update() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <>
      <Button onClick={() => setDialog({ updateName: true })}>
        Update name
      </Button>
    </>
  )
}
