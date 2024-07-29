import { z } from "zod"

import { isValidID } from "../shared/id"
import { zRequired } from "./zSchema"

export const categoryDefaultIndicatorOption = {
  label: "orange",
  color: "orange",
} as const

export const categoryIndicatorOptions = [
  categoryDefaultIndicatorOption,
  { label: "red", color: "red" },
  { label: "blue", color: "blue" },
  { label: "green", color: "green" },
  { label: "amber", color: "amber" },
  { label: "pink", color: "pink" },
  { label: "lime", color: "lime" },
  { label: "cyan", color: "cyan" },
  { label: "violet", color: "violet" },
  { label: "indigo", color: "indigo" },
] as const

type CategoryIndicatorLabelType =
  (typeof categoryIndicatorOptions)[number]["label"]

export const categoryIndicatorLabel = categoryIndicatorOptions.map(
  (option) => option.label
) as [(typeof categoryIndicatorOptions)[number]["label"]]

export const zCategoryIndicator = z.enum(categoryIndicatorLabel)

const zCategory = z.object({
  id: zRequired.refine(isValidID, { message: "Invalid genID" }),
  title: zRequired,
  indicator: z.enum(categoryIndicatorLabel),
  favoriteAt: z.string().nullable(),
  archivedAt: z.string().nullable(),
})

export const getCategoryColor = (
  indicator: CategoryIndicatorLabelType,
  type: "bg" | "hover:ring" | "bg hover:ring"
) => {
  const color = categoryIndicatorOptions.find(
    (option) => option.label === indicator
  )?.color
  if (!color) throw new Error("Invalid category indicator")

  if (type === "bg") return `bg-${color}-9`
  if (type === "hover:ring") return `hover:ring-${color}-6`
  return `bg-${color}-9 hover:ring-${color}-6`
}

export type Category = z.infer<typeof zCategory>

interface FavoriteCategory extends Category {
  favoriteOrderNumber: number
  orderNumber: number
  archivedAt: null
}

interface ActiveCategory extends Category {
  archivedAt: null
  orderNumber: number
}

interface ArchivedCategory extends Category {
  archivedAt: string
  orderNumber: null
  favoriteOrderNumber: null
}

const getFavoriteCategories = (categories: Category[]) => {
  const favoriteCategories: FavoriteCategory[] = []

  categories.forEach((c) => {
    if (typeof c.favoriteAt === "string") {
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

const isFavorite = (category: Category) => {
  return typeof category.favoriteAt === "string"
}

const isArchived = (category: Category) => {
  return typeof category.archivedAt === "string"
}

export const categoryHelper = {
  get: {
    favorite: getFavoriteCategories,
    active: getActiveCategories,
    archived: getArchivedCategories,
  },

  sort: {
    favorite: sortFavoriteCategories,
    active: sortActiveCategories,
    archived: sortArchivedCategories,
  },

  is: {
    favorite: isFavorite,
    archived: isArchived,
  },

  getCategoryColor,
}
