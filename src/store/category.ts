import { ulid } from 'ulidx'
import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Category {
  id: string
  title: string
  indicator: string
  isFavorite: boolean
}

export const indicatorOptions = [
  { name: 'orange', color: 'orange' },
  { name: 'red', color: 'red' },
  { name: 'blue', color: 'blue' },
  { name: 'green', color: 'green' },
  { name: 'yellow', color: 'yellow' },
  { name: 'pink', color: 'pink' },
  { name: 'lime', color: 'lime' },
  { name: 'cyan', color: 'cyan' },
  { name: 'violet', color: 'violet' },
  { name: 'indigo', color: 'indigo' },
]

export interface Action {
  type: 'ADD'
  id: string
}

export const getIndicatorColor = (indicator: string) => {
  return indicatorOptions.find((option) => option.name === indicator)?.color
}

const initialState = {
  categories: [] as Category[],
  action: [] as Action[],
}
type State = typeof initialState

interface Actions {
  addCategory: (category: Omit<Omit<Category, 'id'>, 'isFavorite'>) => void
  getCategory: (id: string) => undefined | Category
  removeAction: (id: string) => void
  addCategories: (categories: Category[]) => void
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
    }

    set((state) => ({
      categories: [...state.categories, newCategory],
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
})

export const useCategoryStore = create(
  persist(categoryStore, { name: 'category' })
)
