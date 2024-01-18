import { StateCreator } from 'zustand'

import { AppStore } from './app'

interface State {
  category: string
}

interface Actions {}

export type CategorySlice = State & Actions
export const categorySlice: StateCreator<AppStore, [], [], CategorySlice> = (
  set
) => ({
  category: 'category',
})
