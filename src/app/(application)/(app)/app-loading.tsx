'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'

export function SidebarState() {
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const { isSmallScreen } = useMediaQuery()

  React.useLayoutEffect(() => {
    if (!isSmallScreen) {
      setIsSidebarOpen(true)
      return
    }
    setIsSidebarOpen(false)
  }, [isSmallScreen, setIsSidebarOpen])

  return null
}

export function InitStore({
  categories,
  parentTask,
  childTask,
}: {
  categories: CategoryType[]
  parentTask: ParentTask[]
  childTask: ChildTask[]
}) {
  const init = React.useRef(false)
  const setNewCategories = useCategoryStore((s) => s.setNewCategories)
  const setNewParentTask = useTaskStore((s) => s.setNewParentTask)
  const setNewChildTask = useTaskStore((s) => s.setNewChildTask)

  React.useEffect(() => {
    if (init.current) return
    init.current = true
    setNewCategories(categories)
    setNewParentTask(parentTask)
    setNewChildTask(childTask)
  }, [
    categories,
    parentTask,
    childTask,
    setNewCategories,
    setNewParentTask,
    setNewChildTask,
  ])

  return null
}
