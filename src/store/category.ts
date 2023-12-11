import { isValid, ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { Category, sortCategories } from '@/utils/category'

import { useActivityStore } from './activity'

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
  reorderCategoryToTop: (id: string) => void
  reorderCategoryToBottomOf: (from: string, to: string) => void

  setNewCategories: (categories: Category[]) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addCategory: (category) => {
    const id = ulid()

    const lastOrderNumber = get().categories.reduce((acc, curr) => {
      if (curr.orderNumber > acc) return curr.orderNumber
      return acc
    }, 0)

    const newCategory: Category = {
      id,
      title: category.title,
      indicator: category.indicator,
      orderNumber: lastOrderNumber + 1,
      favoriteOrderNumber: 0,
      archivedAt: null,
    }

    set((state) => ({
      categories: [...state.categories, newCategory],
    }))

    useActivityStore.getState().addActivity({
      type: 'category',
      action: 'CREATE',
      categoryId: id,
    })

    return newCategory
  },

  editCategory(category) {
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) return category
        return item
      }),
    }))

    useActivityStore.getState().addActivity({
      type: 'category',
      action: 'EDIT',
      categoryId: category.id,
    })
  },
  deleteCategory(category) {
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== category.id),
    }))

    useActivityStore.getState().addActivity({
      type: 'category',
      action: 'DELETE',
      categoryId: category.id,
    })
  },

  getCategory(id) {
    if (!id) return
    if (!isValid(id)) return

    return get().categories.find((category) => category.id === id)
  },
  toggleArchive(category) {
    if (!!category.archivedAt) {
      const lastOrderNumber = get().categories.reduce((acc, curr) => {
        if (curr.orderNumber > acc) return curr.orderNumber
        return acc
      }, 0)

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
              favoriteOrderNumber: 0,
            }
          return item
        }),
      }))
    }
  },

  toggleFavorite(category) {
    if (!!category.archivedAt) return
    if (!!category.favoriteOrderNumber) {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteOrderNumber: 0,
            }
          return item
        }),
      }))
    } else {
      const lastFavoriteOrderNumber = get().categories.reduce((acc, curr) => {
        if (curr.favoriteOrderNumber > acc) return curr.favoriteOrderNumber
        return acc
      }, 0)

      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteOrderNumber: lastFavoriteOrderNumber + 1,
            }
          return item
        }),
      }))
    }
  },

  reorderCategoryToTop(id) {
    const category = get().categories.find((item) => item.id === id)
    if (!category) return

    const firstOrderNumber = sortCategories(get().categories)[0].orderNumber

    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id)
          return {
            ...item,
            orderNumber: firstOrderNumber - 1,
          }
        return item
      }),
    }))
  },

  reorderCategoryToBottomOf(from, to) {
    const fromCategory = get().categories.find((item) => item.id === from)
    if (!fromCategory) return

    const toCategory = get().categories.find((item) => item.id === to)
    if (!toCategory) return

    if (fromCategory.orderNumber > toCategory.orderNumber) {
      set((state) => ({
        categories: state.categories.map((i) => {
          if (
            i.orderNumber > toCategory.orderNumber &&
            i.orderNumber < fromCategory.orderNumber
          ) {
            return {
              ...i,
              orderNumber: i.orderNumber + 1,
            }
          }

          if (i.id === fromCategory.id) {
            return {
              ...i,
              orderNumber: toCategory.orderNumber + 1,
            }
          }

          return i
        }),
      }))
    } else {
      set((state) => ({
        categories: state.categories.map((i) => {
          if (
            i.orderNumber < toCategory.orderNumber &&
            i.orderNumber > fromCategory.orderNumber
          ) {
            return {
              ...i,
              orderNumber: i.orderNumber - 1,
            }
          }

          if (i.id === fromCategory.id) {
            return {
              ...i,
              orderNumber: toCategory.orderNumber + 1,
            }
          }

          return i
        }),
      }))
    }
  },

  setNewCategories(categories) {
    set(() => ({
      categories,
    }))
  },
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'categories', skipHydration: true })
)
