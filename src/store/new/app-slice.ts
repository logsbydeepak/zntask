import { StateCreator } from 'zustand'

import { AppStore } from './app'

interface State {
  isSidebarOpen: boolean
}

interface Actions {}

export type AppSlice = State & Actions
export const appSlice: StateCreator<AppStore, [], [], AppSlice> = (
  set,
  get
) => ({
  isSidebarOpen: false,
})
