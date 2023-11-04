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

  React.useEffect(() => {
    function handleResize() {
      setIsScreenSM(window.innerWidth < 768)
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsSidebarOpen, setIsScreenSM])

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
