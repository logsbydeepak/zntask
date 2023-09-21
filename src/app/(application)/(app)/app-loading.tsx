'use client'

import React from 'react'
import bcrypt from 'bcryptjs'
import { useAtomValue, useSetAtom } from 'jotai'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { isAppLoadingAtom, isSidebarOpenAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'

import { getInitCategories } from './actions'
import { SplashScreen } from './splash-screen'

export function AppLoading({ children }: { children: React.ReactNode }) {
  const isAppLoading = useAtomValue(isAppLoadingAtom)
  const [isAppReady, setIsAppReady] = React.useState(false)

  React.useEffect(() => {
    setIsAppReady(true)
  }, [setIsAppReady])

  return (
    <>
      {!isAppReady && (
        <>
          <SplashScreen />
        </>
      )}

      {isAppLoading && (
        <>
          <SplashScreen />
          <InitCategories />
        </>
      )}

      {!isAppLoading && isAppReady && <>{children}</>}
      <SidebarState />
    </>
  )
}

function InitCategories() {
  const renderCount = React.useRef(0)
  const [isPending, startTransaction] = React.useTransition()

  const setIsAppLoading = useSetAtom(isAppLoadingAtom)

  const categories = useCategoryStore((s) => s.categories)
  const addCategories = useCategoryStore((s) => s.addCategories)

  React.useEffect(() => {
    if (renderCount.current) return
    const hash = bcrypt.hashSync(JSON.stringify(categories), 10)

    startTransaction(async () => {
      const res = await getInitCategories({ hash })
      if (res.code === 'OK') {
        addCategories(res.categories)
      }
    })

    setIsAppLoading(false)

    renderCount.current++
  }, [categories, addCategories, setIsAppLoading])

  return null
}

function SidebarState() {
  const setIsSidebarOpen = useSetAtom(isSidebarOpenAtom)
  const { isSmallScreen } = useMediaQuery()

  React.useEffect(() => {
    if (!isSmallScreen) {
      setIsSidebarOpen(true)
      return
    }
    setIsSidebarOpen(false)
  }, [isSmallScreen, setIsSidebarOpen])

  return null
}
