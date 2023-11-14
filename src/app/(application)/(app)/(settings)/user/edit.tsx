'use client'

import { BookUserIcon, LockIcon, UserCircle2Icon } from 'lucide-react'

import * as Badge from '@/components/ui/badge'
import { useAppStore } from '@/store/app'

export function Update() {
  const setDialog = useAppStore((state) => state.setDialog)

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
    </div>
  )
}
