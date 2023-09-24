'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
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

export function InitStore({ categories }: { categories: CategoryType[] }) {
  const init = React.useRef(false)
  const addCategories = useCategoryStore((s) => s.addCategories)

  if (!init.current) {
    addCategories(categories)
    init.current = true
  }

  return null
}
