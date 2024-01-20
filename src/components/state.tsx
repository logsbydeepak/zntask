'use client'

import React, { ReactNode } from 'react'
import { useSetAtom, WritableAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

import {
  isScreenSMAtom,
  isSidebarOpenAtom,
  useAppStore,
  userAtom,
} from '@/store/app'

export function GlobalShortcut() {
  const setDialog = useAppStore((s) => s.setDialog)

  React.useEffect(() => {
    function handleShortcuts(e: KeyboardEvent) {
      if (e.key === 'i' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setDialog({ createTask: true })
      }

      if (e.key === 'b' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setDialog({ createCategory: true })
      }

      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setDialog({ commandPalette: true })
      }
    }

    document.addEventListener('keydown', handleShortcuts)
    return () => document.removeEventListener('keydown', handleShortcuts)
  }, [setDialog])

  return null
}

export function State() {
  const setIsScreenSM = useSetAtom(isScreenSMAtom)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const [screenSize, setScreenSize] = React.useState(() => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth
  })
  const differScreenSize = React.useDeferredValue(screenSize)

  React.useEffect(() => {
    setIsScreenSM(differScreenSize <= 768)
    setIsSidebarOpen(differScreenSize >= 768)
  }, [differScreenSize, setIsSidebarOpen, setIsScreenSM])

  React.useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenSize])

  React.useEffect

  return null
}

export function AtomsHydrator({
  atomValues,
  children,
}: {
  atomValues: Iterable<
    readonly [WritableAtom<unknown, [any], unknown>, unknown]
  >
  children: ReactNode
}) {
  useHydrateAtoms(new Map(atomValues))
  return children
}

export function SyncAppState({
  user,
}: {
  user: {
    firstName: string
    lastName: string | null
    email: string
    profilePicture: string | null
  }
}) {
  const setUser = useSetAtom(userAtom)

  React.useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return null
}
