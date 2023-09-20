import { atom } from 'jotai'
import { create, StateCreator } from 'zustand'

import { Category } from './category'

export const isAppLoadingAtom = atom(true)
export const isSidebarOpenAtom = atom(false)

const dialogState = {
  resetPassword: false,
  logout: false,
  createCategory: false,
  editCategory: null as null | Category,
  deleteCategory: null as null | Category,
}

const initialState = {
  dialog: dialogState,
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
  dialog: dialogState,
  setDialog(key, value) {
    set((state) => ({
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
