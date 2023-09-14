import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  title: string
  id: string
  indicator: string
}

export interface Action {
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
  getCategory: (id: string) => undefined | Category
  removeAction: (id: string) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  addCategory: (category) => {
    const id = ulid()
    const newCategory: Category = { ...category, id }

    set((state) => ({
      category: [...state.category, newCategory],
      action: [...state.action, { type: 'ADD', id }],
    }))
  },
  getCategory(id) {
    return get().category.find((category) => category.id === id)
  },
  removeAction(id) {
    set((state) => ({
      action: state.action.filter((action) => action.id !== id),
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
