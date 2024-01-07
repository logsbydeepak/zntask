'use client'

import React from 'react'
import { KeyIcon } from 'lucide-react'

import * as Badge from '@/components/ui/badge'
import { useAppStore } from '@/store/app'

export function EditName() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateName: true })}>
      <Badge.Label>Edit</Badge.Label>
    </Badge.Button>
  )
}

export function EditEmail() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateEmail: true })}>
      <Badge.Label>Edit</Badge.Label>
    </Badge.Button>
  )
}

export function EditPicture() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ updateProfilePicture: true })}>
      <Badge.Label>Edit</Badge.Label>
    </Badge.Button>
  )
}

export function AddGoogleAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ addGoogleAuth: true })}>
      <Badge.Label>Add</Badge.Label>
    </Badge.Button>
  )
}

export function RemoveGoogleAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ removeGoogleAuth: true })}>
      <Badge.Label>Remove</Badge.Label>
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
      <Badge.Label>Reset Password</Badge.Label>
    </Badge.Button>
  )
}

export function RemovePasswordAuth() {
  const setDialog = useAppStore((state) => state.setDialog)

  return (
    <Badge.Button onClick={() => setDialog({ removePasswordAuth: true })}>
      <Badge.Label>Remove</Badge.Label>
    </Badge.Button>
  )
}
