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
    category: Omit<Omit<Omit<Category, 'id'>, 'isFavorite'>, 'orderId'>
  ) => Category
  getCategory: (id: string | null) => undefined | Category
  editCategory: (category: Category) => void
  deleteCategory: (category: Category) => void
  setNewCategories: (categories: Category[]) => void
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

  setNewCategories(categories) {
    set(() => ({
      categories,
    }))
  },
})

export const useCategoryStore = create(categoryStore)
