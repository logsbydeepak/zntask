import { StateCreator } from "zustand"

import { genID, isValidID } from "#/shared/id"
import { Category, categoryHelper } from "#/utils/category"

import { AppStore } from "./app"

const initialState = {
  categories: [] as Category[],
}
type State = typeof initialState

interface Actions {
  addCategory: (
    category: Pick<Category, "title" | "indicator">
  ) => Category | undefined
  getCategory: (id: string | null) => undefined | Category
  editCategory: (category: Category) => void
  deleteCategory: (category: Category) => void

  toggleArchive: (category: Category) => void
  toggleFavorite: (category: Category) => void

  setNewCategories: (categories: Category[]) => void
}

export type CategorySlice = State & Actions

export const categorySlice: StateCreator<AppStore, [], [], CategorySlice> = (
  set,
  get
) => ({
  ...initialState,

  addCategory: (category) => {
    const id = genID()

    const newCategory: Category = {
      id,
      title: category.title,
      indicator: category.indicator,
      favoriteAt: null,
      archivedAt: null,
      createdAt: new Date().toString(),
    }

    set((state) => ({
      categories: [...state.categories, newCategory],
      sync: [
        ...state.sync,
        {
          id: genID(),
          syncId: id,
          type: "category",
          action: "create",
        },
      ],
    }))
    return newCategory
  },

  editCategory: (category) => {
    set((state) => ({
      categories: state.categories.map((item) => {
        if (item.id === category.id) return category
        return item
      }),
      sync: [
        ...state.sync,
        {
          id: genID(),
          syncId: category.id,
          type: "category",
          action: "edit",
        },
      ],
    }))
  },
  deleteCategory: (category) => {
    set((state) => ({
      categories: state.categories.filter((item) => item.id !== category.id),
      sync: [
        ...state.sync,
        {
          id: genID(),
          syncId: category.id,
          type: "category",
          action: "delete",
        },
      ],
    }))
  },

  getCategory: (id) => {
    if (!id) return
    if (!isValidID(id)) return

    return get().categories.find((category) => category.id === id)
  },
  toggleArchive: (category) => {
    if (categoryHelper.is.archived(category)) {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteAt: null,
              archivedAt: null,
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
              favoriteAt: null,
            }
          return item
        }),
      }))
    }
  },

  toggleFavorite: (category) => {
    if (categoryHelper.is.favorite(category)) {
      set((state) => ({
        categories: state.categories.map((item) => {
          if (item.id === category.id)
            return {
              ...item,
              favoriteAt: null,
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
              favoriteAt: new Date().toISOString(),
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
