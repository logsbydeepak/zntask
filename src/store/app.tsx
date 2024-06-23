'use client'

import React from 'react'
import { createStore, StateCreator, useStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

import { AppSlice, appSlice } from './app-slice'
import { CategorySlice, categorySlice } from './category-slice'
import { TaskSlice, taskSlice } from './task-slice'

export type AppStore = AppSlice & CategorySlice & TaskSlice

const appStore: StateCreator<AppStore> = (...args) => ({
  ...appSlice(...args),
  ...categorySlice(...args),
  ...taskSlice(...args),
})

const createAppStore = (initialProps?: Partial<AppStore>) => {
  return createStore<AppStore>()(
    persist(
      (...args) => ({
        ...appStore(...args),
        ...initialProps,
      }),
      {
        name: 'app-store',
        partialize: (s) => ({
          categories: s.categories,
          parentTasks: s.parentTasks,
          childTasks: s.childTasks,
        }),
      }
    )
  )
}

type CreateAppStoreType = ReturnType<typeof createAppStore>
const AppContext = React.createContext<CreateAppStoreType | null>(null)

export function AppProvider({
  children,
  initialProps,
}: {
  children: React.ReactNode
  initialProps?: Partial<AppStore>
}) {
  const store = React.useRef(
    createAppStore({
      ...initialProps,
      isSidebarOpen: typeof window !== 'undefined' && window.innerWidth >= 768,
      isScreenSM: typeof window !== 'undefined' && window.innerWidth <= 768,
    })
  )
  return (
    <AppContext.Provider value={store.current}>{children}</AppContext.Provider>
  )
}

export function useAppStore<T>(selector: (state: AppStore) => T): T {
  const store = React.use(AppContext)
  if (!store) throw new Error('Missing AppContext.Provider in the tree')
  return useStore(store, useShallow(selector))
}
