'use client'

import React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { isScreenSMAtom, isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'

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
}: {
  categories: CategoryType[]
  parentTask: ParentTask[]
  childTask: ChildTask[]
  children: React.ReactNode
}) {
  const [isAppReady, setIsAppReady] = React.useState(false)

  const isScreenSM = useAtomValue(isScreenSMAtom)
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)

  const setNewCategories = useCategoryStore((s) => s.setNewCategories)
  const setNewParentTask = useTaskStore((s) => s.setNewParentTask)
  const setNewChildTask = useTaskStore((s) => s.setNewChildTask)

  React.useLayoutEffect(() => {
    if (isAppReady) return
    setNewCategories(categories)
    setNewParentTask(parentTask)
    setNewChildTask(childTask)

    setIsSidebarOpen(window.innerWidth >= 768)
    setIsAppReady(true)
  }, [
    categories,
    parentTask,
    childTask,
    setNewCategories,
    setNewParentTask,
    setNewChildTask,
    isAppReady,
    isScreenSM,
    setIsSidebarOpen,
  ])

  if (!isAppReady) return null
  return children
}
