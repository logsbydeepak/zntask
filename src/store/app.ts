import { atom } from 'jotai'
import { create, StateCreator } from 'zustand'

import { Category } from '@/utils/category'

import { ParentTask } from './task'

export const isAppLoadingAtom = atom(true)
export const isSidebarOpenAtom = atom(false)
export const isAppSyncingAtom = atom(false)
export const isCommandPaletteOpenAtom = atom(false)

const dialogState = {
  resetPassword: false,
  logout: false,
  createCategory: false,
  editCategory: null as null | Category,
  deleteCategory: null as null | Category,

  createTask: false,
  editTask: null as null | ParentTask,
}

const initialState = {
  dialog: dialogState,
  syncingList: [] as string[],
}

type State = typeof initialState

type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

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
