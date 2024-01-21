import { StateCreator } from 'zustand'

import {
  ActiveCategory,
  ArchivedCategory,
  Category,
  FavoriteCategory,
} from '@/utils/category'

import { AppStore } from './app'

interface State {
  categories: Category[]
  archivedCategories: ArchivedCategory[]
  activeCategories: ActiveCategory[]
  favoriteCategories: FavoriteCategory[]
}

interface Actions {
  newCategory: (category: Category) => void
  editCategory: (category: Category) => void
  deleteCategory: (category: Category) => void
}

export type CategorySlice = State & Actions
export const categorySlice: StateCreator<AppStore, [], [], CategorySlice> = (
  set
) => ({
  categories: [],
  archivedCategories: [],
  activeCategories: [],
  favoriteCategories: [],

  newCategory: (category) => {
    set((state) => ({
      categories: [...state.categories, category],
      sync: [
        ...state.sync,
        {
          type: 'category',
          operation: 'create',
          id: category.id,
        },
      ],
    }))
  },
  editCategory: (category) => {
    set((state) => ({
      categories: state.categories.map((c) => {
        if (c.id === category.id) {
          return category
        }
        return c
      }),
      sync: [
        ...state.sync,
        {
          type: 'category',
          operation: 'update',
          id: category.id,
        },
      ],
    }))
  },
  deleteCategory: (category) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== category.id),
      sync: [
        ...state.sync,
        {
          type: 'category',
          operation: 'delete',
          id: category.id,
        },
      ],
    }))
  },
})
