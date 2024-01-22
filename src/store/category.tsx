'use client'

import React, { createContext } from 'react'
import { isValid, ulid } from 'ulidx'
import { createStore, StateCreator, useStore } from 'zustand'
import { persist } from 'zustand/middleware'

import { Category, categoryHelper } from '@/utils/category'

const initialState = {
  categories: [] as Category[],
}
type State = typeof initialState

interface Actions {
  addCategory: (
    category: Pick<Category, 'title' | 'indicator'>
  ) => Category | undefined
  getCategory: (id: string | null) => undefined | Category
  editCategory: (category: Category) => void
  deleteCategory: (category: Category) => void

  toggleArchive: (category: Category) => void
  toggleFavorite: (category: Category) => void

  setNewCategories: (categories: Category[]) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addCategory: (category) => {
    const id = ulid()

    const categories = categoryHelper.sortActiveCategories(
      categoryHelper.getActiveCategories(get().categories)
    )
    const lastOrderNumber = categories[categories.length - 1]?.orderNumber ?? 0

    const newCategory: Category = {
      id,
      title: category.title,
      indicator: category.indicator,
      orderNumber: lastOrderNumber + 1,
      favoriteOrderNumber: null,
      archivedAt: null,
    }

    set((state) => ({
      categories: [...state.categories, newCategory],
    }))
    return newCategory
  },

  editCategory: (category) => {
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) return category
        return item
      }),
    }))
  },
  deleteCategory: (category) => {
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== category.id),
    }))
  },

  getCategory: (id) => {
    if (!id) return
    if (!isValid(id)) return

    return get().categories.find((category) => category.id === id)
  },
  toggleArchive: (category) => {
    if (categoryHelper.isArchivedCategory(category)) {
      const categories = categoryHelper.sortActiveCategories(
        categoryHelper.getActiveCategories(get().categories)
      )
      const lastOrderNumber =
        categories[categories.length - 1]?.orderNumber ?? 0

      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              archivedAt: null,
              orderNumber: lastOrderNumber + 1,
            }
          return item
        }),
      }))
    } else {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              archivedAt: new Date().toISOString(),
              orderNumber: 0,
              favoriteOrderNumber: null,
            }
          return item
        }),
      }))
    }
  },

  toggleFavorite: (category) => {
    if (categoryHelper.isFavoriteCategory(category)) {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteOrderNumber: null,
            }
          return item
        }),
      }))
    } else {
      const categories = get().categories

      let lastOrderNumber = 0
      const lastFavorite = categoryHelper.sortFavoriteCategories(
        categoryHelper.getFavoriteCategories(categories)
      )[-1]
      if (lastFavorite) lastOrderNumber = lastFavorite.favoriteOrderNumber

      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteOrderNumber: lastOrderNumber + 1,
            }
          return item
        }),
      }))
    }
  },

  setNewCategories: (categories) => {
    set({ categories })
  },
})

const createCategoryStore = (initialProps?: Partial<State>) => {
  return createStore(
    persist<Actions & State>(
      (...args) => ({
        ...initialProps,
        ...categoryStore(...args),
      }),
      { name: 'categories' }
    )
  )
}

type CategoryStore = ReturnType<typeof createCategoryStore>
const CategoryContext = createContext<CategoryStore | null>(null)

export function CategoryProvider({
  children,
  initialProps,
}: {
  children: React.ReactNode
  initialProps?: Partial<State>
}) {
  const store = React.useRef(createCategoryStore(initialProps))

  return (
    <CategoryContext.Provider value={store.current}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategoryStore<T>(
  selector: (state: State & Actions) => T
): T {
  const store = React.useContext(CategoryContext)
  if (!store) throw new Error('Missing CategoryContext.Provider in the tree')
  return useStore(store, selector)
}
