import { isValid, ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

import { Category } from '@/utils/category'

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
  reorderCategories: (currentId: string, bottomOfId: string) => void

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
      isArchived: false,
      orderNumber: lastOrderNumber + 1,
      favoriteOrderNumber: 0,
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
    if (category.isArchived) {
      const lastOrderNumber = get().categories.reduce((acc, curr) => {
        if (curr.orderNumber > acc) return curr.orderNumber
        return acc
      }, 0)

      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              isArchived: false,
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
              isArchived: true,
              orderNumber: 0,
              favoriteOrderNumber: 0,
            }
          return item
        }),
      }))
    }
  },

  toggleFavorite(category) {
    if (category.isArchived) return
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

  reorderCategories(currentId, bottomOfId) {
    const categories = get().categories

    const from = categories.find((category) => category.id === currentId)
    const to = categories.find((category) => category.id === bottomOfId)
    if (!from || !to) return

    if (from.orderNumber < to.orderNumber) {
      const newCategories = categories
        .map((i) => {
          if (
            i.orderNumber >= from.orderNumber &&
            i.orderNumber <= to.orderNumber
          ) {
            return {
              ...i,
              orderNumber: i.orderNumber - 1,
            }
          }
          return i
        })
        .map((i) => {
          if (i.id === from.id) {
            return {
              ...i,
              orderNumber: to.orderNumber,
            }
          }
          return i
        })

      set(() => ({
        categories: newCategories,
      }))
    } else {
      const newCategories = categories
        .map((i) => {
          if (
            i.orderNumber <= from.orderNumber &&
            i.orderNumber >= to.orderNumber
          ) {
            return {
              ...i,
              orderNumber: i.orderNumber + 1,
            }
          }
          return i
        })
        .map((i) => {
          if (i.id === from.id) {
            return {
              ...i,
              orderNumber: to.orderNumber,
            }
          }
          return i
        })

      set(() => ({
        categories: newCategories,
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
