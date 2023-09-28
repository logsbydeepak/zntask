'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useActivityStore } from '@/store/activity'
import { isAppSyncingAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'

import { addCategory, deleteCategory, editCategory } from './category.h'

export function Sync() {
  const [isPending, startTransition] = React.useTransition()
  const setIsAppSyncing = useSetAtom(isAppSyncingAtom)

  const activities = useActivityStore((s) => s.activities)
  const removeActivity = useActivityStore((s) => s.removeActivity)
  const setActivitySynced = useActivityStore((s) => s.setActivitySynced)

  const getCategory = useCategoryStore((s) => s.getCategory)

  React.useEffect(() => {
    if (isPending) {
      setIsAppSyncing(true)
      return
    }
    setIsAppSyncing(false)
  }, [isPending, setIsAppSyncing])

  React.useEffect(() => {
    if (isPending) return
    if (activities.length === 0) return
    startTransition(async () => {
      const activity = activities[0]
      if (activity.type === 'category') {
        switch (activity.action) {
          case 'CREATE': {
            const category = getCategory(activity.categoryId)
            if (!category) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await addCategory(category)
            removeActivity(activity.id)
            break
          }

          case 'DELETE': {
            setActivitySynced(activity.categoryId)
            await deleteCategory({ id: activity.categoryId })
            removeActivity(activity.id)
            break
          }

          case 'EDIT': {
            const category = getCategory(activity.categoryId)
            if (!category) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await editCategory(category)
            removeActivity(activity.id)
            break
          }
        }
      }
    })
  }, [activities, getCategory, isPending, removeActivity, setActivitySynced])

  return null
}
