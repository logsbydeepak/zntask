import { isValid, ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'

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

  setNewCategories: (categories: Category[]) => void
}

const categoryStore: StateCreator<State & Actions> = (set, get) => ({
  ...initialState,

  addCategory: (category) => {
    const id = ulid()

    const newCategory: Category = {
      id,
      title: category.title,
      indicator: category.indicator,
      isFavorite: false,
      isArchived: false,
      orderId: null,
      favoriteOrderId: null,
    }

    set((state) => ({
      categories: state.categories
        .map((item) => {
          if (item.orderId === null) return { ...item, orderId: id }
          return item
        })
        .concat(newCategory),
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
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.orderId === null && !item.isArchived)
            return { ...item, orderId: category.id }
          if (item.id === category.id) return { ...item, isArchived: false }
          return item
        }),
      }))
    } else {
      if (category.orderId === null) {
        set((state) => ({
          categories: state.categories.map((item) => {
            if (item.orderId === category.id) return { ...item, orderId: null }
            if (item.id === category.id)
              return {
                ...item,
                isArchived: true,
                isFavorite: false,
                orderId: null,
                favoriteOrderId: null,
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
                isFavorite: false,
                orderId: null,
                favoriteOrderId: null,
              }
            return item
          }),
        }))
      }
    }
  },

  toggleFavorite(category) {
    if (category.isArchived) return

    if (category.isFavorite) {
      if (category.favoriteOrderId === null) {
        set((state) => ({
          categories: state.categories.map((item) => {
            if (item.id === category.id)
              return { ...item, isFavorite: false, favoriteOrderId: null }

            if (item.favoriteOrderId === category.id)
              return { ...item, favoriteOrderId: null }

            return item
          }),
        }))
      } else {
        set((state) => ({
          categories: state.categories.map((item) => {
            if (item.id === category.id)
              return { ...item, isFavorite: false, favoriteOrderId: null }
            return item
          }),
        }))
      }
    } else {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.favoriteOrderId === null && item.isFavorite)
            return { ...item, favoriteOrderId: category.id }

          if (item.id === category.id)
            return {
              ...item,
              isFavorite: true,
              isArchived: false,
              favoriteOrderId: null,
            }
          return item
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

export const useCategoryStore = create(categoryStore)
