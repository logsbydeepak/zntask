import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  title: string
  id: string
  indicator: string
}

interface Action {
  type: 'ADD'
  id: string
}

const initialState = {
  category: [] as Category[],
  action: [] as Action[],
}
type State = typeof initialState

interface Actions {
  addCategory: (category: Omit<Category, 'id'>) => void
}

const categoryStore: StateCreator<State & Actions> = (set) => ({
  ...initialState,
  addCategory: (category) => {
    const id = ulid()
    const newCategory: Category = { ...category, id }

    set((state) => ({
      category: [...state.category, newCategory],
      action: [{ type: 'ADD', id }],
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
