'use client'

import React, { createContext } from 'react'
import { atom } from 'jotai'
import { createStore, StateCreator, useStore } from 'zustand'

import type { RequireOnlyOne } from '@/types'
import { Category } from '@/utils/category'

interface User {
  firstName: string
  lastName: string | null
  email: string
  profilePicture: string | null
}

export const isAppSyncingAtom = atom(false)
export const userAtom = atom<User>({} as User)

const dialogState = {
  resetPassword: false,
  logout: false,
  commandPalette: false,

  updateName: false,
  updateProfilePicture: false,
  updateEmail: false,

  createCategory: false,
  editCategory: null as null | Category,
  deleteCategory: null as null | Category,
  createTask: false,
  editTask: null as null | { parentTaskId: string } | { childTaskId: string },

  addGoogleAuth: false,
  removeGoogleAuth: false,
  removePasswordAuth: false,
}

const initialState = {
  dialog: dialogState,
  isSidebarOpen: false,
  isScreenSM: false,
}

type State = typeof initialState

interface Actions {
  setDialog: <
    T extends RequireOnlyOne<{
      [key in keyof typeof dialogState]: (typeof dialogState)[key]
    }>,
  >(
    state: T
  ) => void
  toggleSidebar: () => void
  setSidebar: (state: boolean) => void
  setScreenSM: (state: boolean) => void
}

const appStore: StateCreator<State & Actions> = (set) => ({
  ...initialState,
  toggleSidebar() {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
  },
  setDialog(state) {
    set(() => ({
      dialog: {
        ...dialogState,
        ...state,
      },
    }))
  },
  setSidebar(state) {
    set(() => ({ isSidebarOpen: state }))
  },
  setScreenSM(state) {
    set(() => ({ isScreenSM: state }))
  },
})

const createAppStore = () => {
  return createStore(appStore)
}

type AppStore = ReturnType<typeof createAppStore>
const AppContext = createContext<AppStore | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const store = React.useRef(createAppStore()).current
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>
}

export function useAppStore<T>(selector: (state: State & Actions) => T): T {
  const store = React.useContext(AppContext)
  if (!store) throw new Error('Missing AppContext.Provider in the tree')
  return useStore(store, selector)
}
