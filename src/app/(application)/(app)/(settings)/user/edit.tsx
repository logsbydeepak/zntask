'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookUserIcon, LockIcon, UserCircle2Icon } from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
import * as Badge from '@/components/ui/badge'
import { addGoogleAuthProvider, redirectGoogleAddNew } from '@/data/auth'
import { useAppStore } from '@/store/app'

export function Update() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const requestRef = React.useRef(false)
  const [isGooglePending, startGoogleTransition] = React.useTransition()
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(
    !!searchParams.get('code')
  )

  const setDialog = useAppStore((state) => state.setDialog)

  const isLoading = isGooglePending || isGoogleLoading

  const handleAddGoogle = React.useCallback(() => {
    if (requestRef.current) return
    const code = searchParams.get('code')
    if (!code) return
    router.replace('/user')
    startGoogleTransition(async () => {
      try {
        requestRef.current = true
        await addGoogleAuthProvider({ code })
      } catch (error) {
      } finally {
        requestRef.current = false
      }
    })
  }, [searchParams, router])

  React.useEffect(() => {
    handleAddGoogle()
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
