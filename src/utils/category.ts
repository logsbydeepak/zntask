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
  { label: 'yellow', color: 'yellow' },
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
  orderNumber: z.number(),
  favoriteOrderNumber: z.number().nullable(),
  archivedAt: z.string().nullable(),
})

export type CategoryType = z.infer<typeof zCategory>

export const getCategoryColor = (indicator: CategoryIndicatorLabelType) => {
  const color = categoryIndicatorOptions.find(
    (option) => option.label === indicator
  )?.color
  if (!color) throw new Error('Invalid category indicator')
  return color
}

export type Category = z.infer<typeof zCategory>

interface FavoriteCategory extends Category {
  favoriteOrderNumber: number
}

interface ActiveCategory extends Category {
  archivedAt: null
}

interface ArchivedCategory extends Category {
  archivedAt: string
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
  return categories.sort((a, b) => a.orderNumber - b.orderNumber)
}

const isFavoriteCategory = (category: Category) => {
  return typeof category.favoriteOrderNumber === 'number'
}

const workWithFavoriteCategories = (
  categories: Category[],
  callback: (categories: FavoriteCategory[]) => void
) => {
  const favoriteCategories = getFavoriteCategories(categories)
  const returnValue = callback(favoriteCategories)
  return returnValue
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
  workWithFavoriteCategories,
}
