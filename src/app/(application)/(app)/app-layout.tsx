'use client'

import React from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { ChildTask, ParentTask, useTaskStore } from '@/store/task'
import { CategoryType } from '@/utils/category'
import { cn } from '@/utils/style'

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="max-w-[90%] overflow-hidden overflow-ellipsis text-lg font-medium">
      {children}
    </h1>
  )
}

export function Root({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Header({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function Content({ children }: { children?: React.ReactNode }) {
  return <div className="pt-4">{children}</div>
}

export function NotFound() {
  return <h1>Not Found</h1>
}

function EmptyContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex h-[calc(100vh-200px)] flex-col items-center justify-center',
        className
      )}
    >
      <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
        <span className="flex flex-col items-center space-y-1 text-center text-gray-600">
          {children}
        </span>
      </div>
    </div>
  )
}

function EmptyIcon({ children }: { children: React.ReactNode }) {
  return <div className="h-5 w-5">{children}</div>
}

function EmptyLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>
}

export const Empty = {
  Container: EmptyContainer,
  Icon: EmptyIcon,
  Label: EmptyLabel,
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isSidebarOpen = useAtomValue(isSidebarOpenAtom)

  return (
    <main data-sidebar={isSidebarOpen} className="group/sidebar">
      <div className="pt-14 group-data-[sidebar=true]/sidebar:pl-56">
        <div className="mx-auto max-w-7xl px-4 py-2 md:py-4 group-data-[sidebar=false]/sidebar:md:px-5 group-data-[sidebar=true]/sidebar:md:px-8">
          {children}
        </div>
      </div>
    </main>
  )
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
