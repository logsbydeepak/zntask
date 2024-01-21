import { StateCreator } from 'zustand'

import { AppStore } from './app'

interface Sync {
  type: 'category' | 'task'
  operation: 'create' | 'update' | 'delete'
  id: string
}

interface State {
  sync: Sync[]
}

interface Actions {}

export type AppSlice = State & Actions
export const appSlice: StateCreator<AppStore, [], [], AppSlice> = (
  set,
  get
) => ({
  sync: [],
})
