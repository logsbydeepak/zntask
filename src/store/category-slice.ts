import { isValid, ulid } from 'ulidx'
import { StateCreator } from 'zustand'

import { Category, categoryHelper } from '@/utils/category'

import { AppStore } from './app'

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

  reorderCategories: (data: {
    position: 'top' | 'bottom'
    start: string
    over: string
    data: {
      bottom?: string
      top?: string
    }
  }) => void
}

export type CategorySlice = State & Actions

export const categorySlice: StateCreator<AppStore, [], [], CategorySlice> = (
  set,
  get
) => ({
  ...initialState,

  reorderCategories: (data) => {
    const startCategory = get().categories.find(
      (category) => category.id === data.start
    )
    if (!startCategory) return
    const overCategory = get().categories.find(
      (category) => category.id === data.over
    )
    if (!overCategory) return
    if (overCategory.orderNumber === null) return

    const topId = data?.data?.top
    const bottomId = data?.data?.bottom

    if (typeof topId === 'string' && typeof bottomId === 'string') {
      const topCategory = get().categories.find(
        (category) => category.id === data.data.top
      )

      const bottomCategory = get().categories.find(
        (category) => category.id === data.data.bottom
      )

      return
    }

    if (typeof topId === 'string' && typeof bottomId === 'undefined') {
      return
    }

    if (typeof topId === 'undefined' && typeof bottomId === 'string') {
      return
    }
  },

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
