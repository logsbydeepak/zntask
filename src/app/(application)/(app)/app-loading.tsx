'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'

import { Navbar } from './navbar'
import { SplashScreen } from './splash-screen'

export function InitAppState({
  categories,
  parentTask,
  childTask,
  user,
  children,
}: {
  categories: CategoryType[]
  parentTask: ParentTask[]
  childTask: ChildTask[]
  user: {
    firstName: string
    lastName: string | null
    profilePicture: string | null
    email: string
  }
  children: React.ReactNode
}) {
  const init = React.useRef(false)
  const [isAppReady, setIsAppReady] = React.useState(false)
  const [isStoreReady, setIsStoreReady] = React.useState(false)

  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const { isSmallScreen } = useMediaQuery()

  const setNewCategories = useCategoryStore((s) => s.setNewCategories)
  const setNewParentTask = useTaskStore((s) => s.setNewParentTask)
  const setNewChildTask = useTaskStore((s) => s.setNewChildTask)

  React.useEffect(() => {
    if (init.current) return
    init.current = true

    setNewCategories(categories)
    setNewParentTask(parentTask)
    setNewChildTask(childTask)

    setIsStoreReady(true)
  }, [
    categories,
    parentTask,
    childTask,
    setNewCategories,
    setNewParentTask,
    setNewChildTask,
  ])

  React.useEffect(() => {
    if (!isSmallScreen) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }

    if (!isStoreReady) return
    if (isAppReady) return
    setIsAppReady(true)
  }, [isSmallScreen, setIsSidebarOpen, isStoreReady, isAppReady])

  if (!isAppReady) {
    return <SplashScreen />
  }

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        profilePicture={user.profilePicture}
        email={user.email}
      />
      {children}
    </>
  )
}
