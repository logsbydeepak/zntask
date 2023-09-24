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
  const setNewCategories = useCategoryStore((s) => s.setNewCategories)

  React.useEffect(() => {
    if (init.current) return
    init.current = true
    setNewCategories(categories)
  }, [categories, setNewCategories])

  return null
}
