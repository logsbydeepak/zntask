import { isValid } from 'ulidx'
import { z } from 'zod'

import { zRequired } from './zSchema'

export const categoryDefaultIndicatorOption = {
  label: 'orange',
  color: 'orange',
} as const

export const categoryIndicatorOptions = [
  categoryDefaultIndicatorOption,
  { label: 'red', color: 'red' },
  { label: 'blue', color: 'blue' },
  { label: 'green', color: 'green' },
  { label: 'amber', color: 'amber' },
  { label: 'pink', color: 'pink' },
  { label: 'lime', color: 'lime' },
  { label: 'cyan', color: 'cyan' },
  { label: 'violet', color: 'violet' },
  { label: 'indigo', color: 'indigo' },
] as const

export type CategoryIndicatorLabelType =
  (typeof categoryIndicatorOptions)[number]['label']

export const categoryIndicatorLabel = categoryIndicatorOptions.map(
  (option) => option.label
) as [(typeof categoryIndicatorOptions)[number]['label']]

export const zCategoryIndicator = z.enum(categoryIndicatorLabel)

export const zCategory = z.object({
  id: zRequired.refine(isValid, { message: 'Invalid ulid' }),
  title: zRequired,
  indicator: z.enum(categoryIndicatorLabel),
  orderNumber: z.number().nullable(),
  favoriteOrderNumber: z.number().nullable(),
  archivedAt: z.string().nullable(),
})

export type CategoryType = z.infer<typeof zCategory>

export const getCategoryColor = (
  indicator: CategoryIndicatorLabelType,
  type: 'bg' | 'hover:ring' | 'bg hover:ring'
) => {
  const color = categoryIndicatorOptions.find(
    (option) => option.label === indicator
  )?.color
  if (!color) throw new Error('Invalid category indicator')
  const newColor = `new${color.charAt(0).toUpperCase()}${color.slice(1)}`

  if (type === 'bg') return `bg-${newColor}-9`
  if (type === 'hover:ring') return `hover:ring-${newColor}-6`
  return `bg-${newColor}-9 hover:ring-${newColor}-6`
}

export type Category = z.infer<typeof zCategory>

export interface FavoriteCategory extends Category {
  favoriteOrderNumber: number
  orderNumber: number
  archivedAt: null
}

export interface ActiveCategory extends Category {
  archivedAt: null
  orderNumber: number
}

export interface ArchivedCategory extends Category {
  archivedAt: string
  orderNumber: null
  favoriteOrderNumber: null
}

const getFavoriteCategories = (categories: Category[]) => {
  const favoriteCategories: FavoriteCategory[] = []

  categories.forEach((c) => {
    if (typeof c.favoriteOrderNumber === 'number') {
      favoriteCategories.push(c as FavoriteCategory)
    }
  })

  return favoriteCategories
}

const getActiveCategories = (categories: Category[]) => {
  const activeCategories: ActiveCategory[] = []

  categories.forEach((i) => {
    if (i.archivedAt === null) activeCategories.push(i as ActiveCategory)
  })

  return activeCategories
}

const getArchivedCategories = (categories: Category[]) => {
  const archivedCategories: ArchivedCategory[] = []

  categories.forEach((i) => {
    if (i.archivedAt) archivedCategories.push(i as ArchivedCategory)
  })

  return archivedCategories
}

const sortFavoriteCategories = (categories: FavoriteCategory[]) => {
  return categories.sort(
    (a, b) => a.favoriteOrderNumber - b.favoriteOrderNumber
  )
}

const sortActiveCategories = (categories: ActiveCategory[]) => {
  return categories.sort((a, b) => a.orderNumber - b.orderNumber)
}

const sortArchivedCategories = (categories: ArchivedCategory[]) => {
  return categories.sort((a, b) => {
    if (a.archivedAt < b.archivedAt) return -1
    if (a.archivedAt > b.archivedAt) return 1
    return 0
  })
}

const isFavoriteCategory = (category: Category) => {
  return typeof category.favoriteOrderNumber === 'number'
}

const isArchivedCategory = (category: Category) => {
  return typeof category.archivedAt === 'string'
}

const makeCategoryArchived = (
  category: ActiveCategory,
  archivedAt: string
): ArchivedCategory => {
  return {
    ...category,
    archivedAt,
    orderNumber: null,
    favoriteOrderNumber: null,
  }
}

const makeCategoryUnarchive = (
  category: ArchivedCategory,
  orderNumber: number
): ActiveCategory => {
  return {
    ...category,
    archivedAt: null,
    orderNumber,
  }
}

const makeCategoryFavorite = (
  category: ActiveCategory,
  favoriteOrderNumber: number
): FavoriteCategory => {
  return {
    ...category,
    favoriteOrderNumber,
    orderNumber: favoriteOrderNumber,
  }
}

const makeCategoryUnfavorite = (category: FavoriteCategory): ActiveCategory => {
  return {
    ...category,
    favoriteOrderNumber: null,
  }
}

export const categoryHelper = {
  getFavoriteCategories,
  getActiveCategories,
  getArchivedCategories,

  sortFavoriteCategories,
  sortActiveCategories,
  sortArchivedCategories,

  getCategoryColor,
  isFavoriteCategory,
  isArchivedCategory,

  makeCategoryArchived,
  makeCategoryUnarchive,
  makeCategoryFavorite,
  makeCategoryUnfavorite,
}
