'use client'

import React from 'react'

import { useCategoryStore } from '@/store/category'

import { addCategory } from './actions'

export function CategorySync() {
  const [isPending, startTransition] = React.useTransition()

  const action = useCategoryStore((state) => state.action)
  const getCategory = useCategoryStore((state) => state.getCategory)
  const removeAction = useCategoryStore((state) => state.removeAction)

  React.useEffect(() => {
    if (isPending) return

    startTransition(async () => {
      if (action.length === 0) return
      const currentAction = action[0]
      if (currentAction.type === 'ADD') {
        const currentCategory = getCategory(currentAction.id)
        if (!currentCategory) return
        const res = await addCategory(currentCategory)

        if (res.code === 'OK') {
          removeAction(currentAction.id)
        }
      }
    })
  }, [action, isPending, getCategory, removeAction])

  return null
}
