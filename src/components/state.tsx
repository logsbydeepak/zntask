'use client'

import React, { ReactNode } from 'react'

import { useAppStore } from '@/store/app'

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
  const setSidebar = useAppStore((s) => s.setSidebar)
  const setIsScreenSM = useAppStore((s) => s.setScreenSM)

  const [screenSize, setScreenSize] = React.useState(() => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth
  })
  const differScreenSize = React.useDeferredValue(screenSize)

  React.useEffect(() => {
    setIsScreenSM(differScreenSize <= 768)
    setSidebar(differScreenSize >= 768)
  }, [differScreenSize, setIsScreenSM, setSidebar])

  React.useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setScreenSize])

  return null
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
  const setUser = useAppStore((s) => s.setUser)

  React.useEffect(() => {
    setUser(user)
  }, [user, setUser])

  return null
}

export const DelayRender = ({ children }: { children: ReactNode }) => {
  const [isRender, setIsRender] = React.useState(false)

  React.useEffect(() => {
    setIsRender(true)
  }, [])

  if (!isRender) return null

  return children
}
