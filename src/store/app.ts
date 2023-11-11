import { atom } from 'jotai'
import { create, StateCreator } from 'zustand'

import type { RequireOnlyOne } from '@/types'
import { Category } from '@/utils/category'

export const isAppLoadingAtom = atom(true)
export const isSidebarOpenAtom = atom(false)
export const isAppSyncingAtom = atom(false)

export const isScreenSMAtom = atom(false)

const dialogState = {
  resetPassword: false,
  logout: false,
  commandPalette: false,

  createCategory: false,
  editCategory: null as null | Category,
  deleteCategory: null as null | Category,
  createTask: false,
  editTask: null as null | { parentTaskId: string } | { childTaskId: string },
}

const initialState = {
  dialog: dialogState,
  syncingList: [] as string[],
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
  resetAppState: () => void
}

const appStore: StateCreator<State & Actions> = (set) => ({
  ...initialState,
  setDialog(state) {
    set(() => ({
      dialog: {
        ...dialogState,
        ...state,
      },
    }))
  },
  resetAppState() {
    set(initialState)
  },
})

export const useAppStore = create(appStore)
