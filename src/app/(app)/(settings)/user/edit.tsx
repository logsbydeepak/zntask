'use client'

import React from 'react'
import {
  BookUserIcon,
  KeyIcon,
  LockIcon,
  MailIcon,
  UserCircle2Icon,
} from 'lucide-react'

import { GoogleIcon } from '@/components/icon/google'
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

      <Badge.Button onClick={() => setDialog({ addGoogleAuth: true })}>
        <Badge.Icon>
          <GoogleIcon />
        </Badge.Icon>
        <Badge.Label>Add google</Badge.Label>
      </Badge.Button>

      <Badge.Button onClick={() => setDialog({ removeGoogleAuth: true })}>
        <Badge.Icon>
          <GoogleIcon />
        </Badge.Icon>
        <Badge.Label>Remove google</Badge.Label>
      </Badge.Button>

      <Badge.Button onClick={() => setDialog({ updateEmail: true })}>
        <Badge.Icon>
          <MailIcon />
        </Badge.Icon>
        <Badge.Label>Update email</Badge.Label>
      </Badge.Button>

      <Badge.Button onClick={() => setDialog({ removePasswordAuth: true })}>
        <Badge.Icon>
          <LockIcon />
        </Badge.Icon>
        <Badge.Label>Remove password</Badge.Label>
      </Badge.Button>
    </div>
  )
}
