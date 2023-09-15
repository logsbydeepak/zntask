import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  id: string
  title: string
  indicator: string
}

export interface Action {
  type: 'ADD'
  id: string
}

const initialState = {
  categories: [] as Category[],
  action: [] as Action[],
}
type State = typeof initialState

interface Actions {
  addCategory: (category: Omit<Category, 'id'>) => void
  getCategory: (id: string) => undefined | Category
  removeAction: (id: string) => void
  addCategories: (categories: Category[]) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  addCategory: (category) => {
    const id = ulid()
    const newCategory: Category = {
      id: id,
      title: category.title,
      indicator: category.indicator,
    }

    set((state) => ({
      categories: [...state.categories, newCategory],
      action: [...state.action, { type: 'ADD', id }],
    }))
  },
  getCategory(id) {
    return get().categories.find((category) => category.id === id)
  },
  removeAction(id) {
    set((state) => ({
      action: state.action.filter((action) => action.id !== id),
    }))
  },
  addCategories(categories) {
    set((state) => ({
      categories: [...categories],
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
