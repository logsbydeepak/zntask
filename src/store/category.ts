import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  title: string
  id: string
  indicator: string
}

const initialState = {
  syncedCategories: [] as Category[],
  localCategories: [] as Category[],
}
type State = typeof initialState

interface Actions {
  addCategory: (category: Omit<Category, 'id'>) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  syncedCategories: [],
  localCategories: [],
  addCategory(category) {
    set((state) => ({
      localCategories: [...state.localCategories, { ...category, id: ulid() }],
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
