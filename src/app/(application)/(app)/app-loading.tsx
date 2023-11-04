'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'

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

  const { isSmallScreen } = useMediaQuery()
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)

  const setNewCategories = useCategoryStore((s) => s.setNewCategories)
  const setNewParentTask = useTaskStore((s) => s.setNewParentTask)
  const setNewChildTask = useTaskStore((s) => s.setNewChildTask)

  React.useLayoutEffect(() => {
    if (isAppReady) return
    setNewCategories(categories)
    setNewParentTask(parentTask)
    setNewChildTask(childTask)

    setIsSidebarOpen(isSmallScreen ? false : true)

    setIsAppReady(true)
  }, [
    categories,
    parentTask,
    childTask,
    setNewCategories,
    setNewParentTask,
    setNewChildTask,
    isAppReady,
    isSmallScreen,
    setIsSidebarOpen,
  ])

  if (!isAppReady) return null
  return children
}
