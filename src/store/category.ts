import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { Category } from '@/utils/category'

export interface Action {
  type: 'ADD' | 'EDIT' | 'DELETE'
  id: string
}

const initialState = {
  categories: [] as Category[],
  action: [] as Action[],
  deleteCategories: [] as Category[],
}
type State = typeof initialState

interface Actions {
  addCategory: (
    category: Omit<Omit<Omit<Category, 'id'>, 'isFavorite'>, 'orderId'>
  ) => void
  getCategory: (id: string) => undefined | Category
  addCategories: (categories: Category[]) => void
  editCategory: (category: Category) => void
  deleteCategory: (category: Category) => void

  getDeleteCategory: (id: string) => Category | undefined
  removeDeleteCategory: (id: string) => void

  removeAction: (id: string) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,
  addCategory: (category) => {
    const id = ulid()
    const newCategory: Category = {
      id: id,
      title: category.title,
      indicator: category.indicator,
      isFavorite: false,
      orderId: ulid(),
    }

    set((state) => ({
      categories: [newCategory, ...state.categories],
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
  editCategory(category) {
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) return category
        return item
      }),
      action: [...state.action, { type: 'EDIT', id: category.id }],
    }))
  },
  deleteCategory(category) {
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== category.id),
      deleteCategories: [...state.deleteCategories, category],
      action: [...state.action, { type: 'DELETE', id: category.id }],
    }))
  },

  getDeleteCategory(id) {
    return get().deleteCategories.find((category) => category.id === id)
  },

  removeDeleteCategory(id) {
    set((state) => ({
      deleteCategories: state.deleteCategories.filter(
        (category) => category.id !== id
      ),
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
