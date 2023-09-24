import { atom } from 'jotai'
import { create, StateCreator } from 'zustand'

import { Category } from '@/utils/category'

export const isAppLoadingAtom = atom(true)
export const isSidebarOpenAtom = atom(false)
export const isAppSyncingAtom = atom(false)

const dialogState = {
  resetPassword: false,
  logout: false,
  createCategory: false,
  editCategory: null as null | Category,
  deleteCategory: null as null | Category,
}

const initialState = {
  dialog: dialogState,
  syncingList: [] as string[],
}

type State = typeof initialState

interface Actions {
  setDialog: <KEY extends keyof typeof dialogState>(
    key: keyof typeof dialogState,
    value: (typeof dialogState)[KEY]
  ) => void
  resetAppState: () => void
}

const appStore: StateCreator<State & Actions> = (set) => ({
  ...initialState,
  setDialog(key, value) {
    set(() => ({
      dialog: {
        ...dialogState,
        [key]: value,
      },
    }))
  },
  resetAppState() {
    set(initialState)
  },
})

export const useAppStore = create(appStore)
