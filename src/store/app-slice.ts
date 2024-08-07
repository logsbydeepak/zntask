import { Key } from "lucide-react"
import { StateCreator } from "zustand"

import type { RequireOnlyOne } from "#/types"

import { AppStore } from "./app"

interface User {
  firstName: string
  lastName: string | null
  email: string
  profilePicture: string | null
}

type SyncCategory = {
  id: string
  type: "category"
  action: "create" | "edit" | "delete"
  syncId: string
}

type ParentSyncTask = {
  id: string
  type: "parent-task"
  action: "create" | "edit" | "delete"
  syncId: string
}

type ChildSyncTask = {
  id: string
  type: "child-task"
  action: "create" | "edit" | "delete"
  syncId: string
}

type Sync = SyncCategory | ParentSyncTask | ChildSyncTask

const dialogState = {
  resetPassword: false,
  logout: false,
  commandPalette: false,

  updateName: false,
  updateProfilePicture: false,
  updateEmail: false,

  createCategory: false,
  editCategory: null as null | string,
  deleteCategory: null as null | string,
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
  sync: [] as Sync[],
}

type Key = keyof typeof dialogState

type State = typeof initialState & {
  dialogOpen: Key | null
}

interface Actions {
  removeSync: (id: string) => void
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
  setAppState: (args: (state: AppStore) => AppStore) => void
}

export type AppSlice = State & Actions

export const appSlice: StateCreator<AppStore, [], [], AppSlice> = (set) => ({
  ...initialState,
  dialogOpen: null,

  setAppState(func) {
    set((s) => func(s))
  },

  removeSync(id: string) {
    set((state) => ({ sync: state.sync.filter((each) => each.id !== id) }))
  },

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
    const key = Object.keys(state)[0] as Key
    set(({ dialog }) => ({
      dialogOpen: key,
      dialog: {
        ...dialog,
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
