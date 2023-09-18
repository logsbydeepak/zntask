'use client'

import React from 'react'

import { useCategoryStore } from '@/store/category'

import { addCategory, editCategory } from './actions'

export function Sync() {
  const startTransition = React.useTransition()[1]
  const [isSyncing, setIsSyncing] = React.useState(false)

  const action = useCategoryStore((state) => state.action)
  const getCategory = useCategoryStore((state) => state.getCategory)
  const removeAction = useCategoryStore((state) => state.removeAction)

  React.useEffect(() => {
    if (isSyncing) return
    setIsSyncing(true)
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

      if (currentAction.type === 'EDIT') {
        const currentCategory = getCategory(currentAction.id)
        if (!currentCategory) return
        const res = await editCategory(currentCategory)
        if (res.code === 'OK') {
          removeAction(currentAction.id)
        }
      }
    })
    setIsSyncing(false)
  }, [action, getCategory, removeAction, startTransition, isSyncing])

  return null
}
