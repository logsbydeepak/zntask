'use client'

import React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import {
  isScreenSMAtom,
  isSidebarOpenAtom,
  useAppStore,
  userAtom,
} from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'

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

export function InitAppState({
  categories,
  parentTask,
  childTask,
  children,
  user,
}: {
  categories: CategoryType[]
  parentTask: ParentTask[]
  childTask: ChildTask[]
  children: React.ReactNode
  user: {
    firstName: string
    lastName: string | null
    email: string
    profilePicture: string | null
  }
}) {
  const [isAppReady, setIsAppReady] = React.useState(false)

  const isScreenSM = useAtomValue(isScreenSMAtom)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)

  const setNewCategories = useCategoryStore((s) => s.setNewCategories)
  const setNewParentTask = useTaskStore((s) => s.setNewParentTask)
  const setNewChildTask = useTaskStore((s) => s.setNewChildTask)

  const setUser = useSetAtom(userAtom)
  const resetAppStore = useAppStore((s) => s.reset)

  React.useLayoutEffect(() => {
    setUser(user)

    if (isAppReady) return

    resetAppStore()
    useTaskStore.persist.rehydrate()

    // setNewCategories(categories)
    // setNewParentTask(parentTask)
    // setNewChildTask(childTask)

    setIsSidebarOpen(window.innerWidth >= 768)
    setIsAppReady(true)
  }, [
    categories,
    parentTask,
    childTask,
    setNewCategories,
    setNewParentTask,
    setNewChildTask,
    resetAppStore,
    isAppReady,
    isScreenSM,
    setIsSidebarOpen,
    user,
    setUser,
  ])

  if (!isAppReady) return null
  return children
}
