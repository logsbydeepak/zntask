import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

import {
  addCategory,
  deleteCategory,
  editCategory,
} from '@/app/(application)/(app)/actions'
import { Category } from '@/utils/category'

import { useAppStore } from './app'

const initialState = {
  categories: [] as Category[],
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
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addCategory: async (category) => {
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
    }))

    useAppStore.getState().addToSyncingList(id)
    addCategory(newCategory).finally(() =>
      useAppStore.getState().removeFromSyncingList(id)
    )
  },

  editCategory(category) {
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) return category
        return item
      }),
    }))

    useAppStore.getState().addToSyncingList(category.id)
    editCategory(category).finally(() =>
      useAppStore.getState().removeFromSyncingList(category.id)
    )
  },
  deleteCategory(category) {
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== category.id),
      deleteCategories: [...state.deleteCategories, category],
    }))

    useAppStore.getState().addToSyncingList(category.id)
    deleteCategory(category).finally(() =>
      useAppStore.getState().removeFromSyncingList(category.id)
    )
  },

  getCategory(id) {
    return get().categories.find((category) => category.id === id)
  },

  addCategories(categories) {
    set((state) => ({
      categories: [...categories],
    }))
  },
})

export const useCategoryStore = create(categoryStore)
