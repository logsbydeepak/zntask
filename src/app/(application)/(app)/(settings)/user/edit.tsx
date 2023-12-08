'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { BookUserIcon, LockIcon, UserCircle2Icon } from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
import * as Badge from '@/components/ui/badge'
import { redirectGoogleAddNew } from '@/data/auth'
import { useAppStore } from '@/store/app'

export function Update() {
  const searchParams = useSearchParams()

  const setDialog = useAppStore((state) => state.setDialog)

  const [isGooglePending, startGoogleTransition] = React.useTransition()
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(
    !!searchParams.get('code')
  )

  const isLoading = isGooglePending || isGoogleLoading

  const handleAddGoogle = React.useCallback(() => {
    const code = searchParams.get('code')
    if (!code) return
    window.history.replaceState({}, '', '/user')
    startGoogleTransition(async () => {})
  }, [searchParams])

  React.useEffect(() => {
    return () => handleAddGoogle()
  }, [handleAddGoogle])

  React.useEffect(() => {
    setIsGoogleLoading(isGooglePending)
  }, [isGooglePending])

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Badge.Button onClick={() => setDialog({ resetPassword: true })}>
        <Badge.Icon>
          <LockIcon />
        </Badge.Icon>
        <Badge.Label>Reset Password</Badge.Label>
      </Badge.Button>

      <Badge.Button onClick={() => setDialog({ updateName: true })}>
        <Badge.Icon>
          <BookUserIcon />
        </Badge.Icon>
        <Badge.Label>Update Name</Badge.Label>
      </Badge.Button>

      <Badge.Button onClick={() => setDialog({ updateProfilePicture: true })}>
        <Badge.Icon>
          <UserCircle2Icon />
        </Badge.Icon>
        <Badge.Label>Update profile picture</Badge.Label>
      </Badge.Button>

      <Badge.Button
        isLoading={isGoogleLoading || isGooglePending}
        onClick={() =>
          startGoogleTransition(async () => {
            await redirectGoogleAddNew()
          })
        }
      >
        <Badge.Icon>
          <GoogleIcon />
        </Badge.Icon>
        <Badge.Label>Add google</Badge.Label>
      </Badge.Button>
    </div>
  )
}
