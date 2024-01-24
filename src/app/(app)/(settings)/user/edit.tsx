'use client'

import React from 'react'
import { KeyIcon } from 'lucide-react'

import * as Badge from '@/components/ui/badge'
import { useAppStore } from '@/store/app'

export function EditName() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateName: true })}>
      Edit
    </Badge.Button>
  )
}

export function EditEmail() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateEmail: true })}>
      Edit
    </Badge.Button>
  )
}

export function EditPicture() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateProfilePicture: true })}>
      Edit
    </Badge.Button>
  )
}

export function AddGoogleAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ addGoogleAuth: true })}>
      Add
    </Badge.Button>
  )
}

export function RemoveGoogleAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ removeGoogleAuth: true })}>
      Remove
    </Badge.Button>
  )
}

export function ResetPassword() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ resetPassword: true })}>
      <Badge.Icon>
        <KeyIcon />
      </Badge.Icon>
      <span>Reset Password</span>
    </Badge.Button>
  )
}

export function RemovePasswordAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ removePasswordAuth: true })}>
      <span>Remove</span>
    </Badge.Button>
  )
}
