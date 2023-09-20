import { isValid } from 'ulidx'
import { z } from 'zod'

import { zRequired } from './zod'

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
  isFavorite: z.boolean(),
})

export const getCategoryColor = (indicator: CategoryIndicatorLabelType) => {
  const color = categoryIndicatorOptions.find(
    (option) => option.label === indicator
  )?.color
  if (!color) throw new Error('Invalid category indicator')
  return color
}