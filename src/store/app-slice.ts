import { StateCreator } from 'zustand'

import type { RequireOnlyOne } from '@/types'
import { Category } from '@/utils/category'

import { AppStore } from './app'

interface User {
  firstName: string
  lastName: string | null
  email: string
  profilePicture: string | null
}

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
  isAppSyncing: false,
  user: {} as User,
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
  setAppSyncing: (state: boolean) => void
  setUser: (state: User) => void
}

export type AppSlice = State & Actions

export const appSlice: StateCreator<AppStore, [], [], AppSlice> = (set) => ({
  ...initialState,
  setUser(state) {
    set(() => ({ user: state }))
  },

  setAppSyncing(state) {
    set(() => ({ isAppSyncing: state }))
  },

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
