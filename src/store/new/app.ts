import { create } from 'zustand'

import { AppSlice, appSlice } from './app-slice'
import { CategorySlice, categorySlice } from './category-slice'
import { TaskSlice, taskSlice } from './task-slice'

export type AppStore = AppSlice & CategorySlice & TaskSlice
export const useAppStore = create<AppStore>((...args) => ({
  ...appSlice(...args),
  ...categorySlice(...args),
  ...taskSlice(...args),
}))
