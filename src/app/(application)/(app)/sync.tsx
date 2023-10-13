'use client'

import React from 'react'
import { useAtom, useSetAtom } from 'jotai'

import { useActivityStore } from '@/store/activity'
import { isAppSyncingAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'

import { addCategory, deleteCategory, editCategory } from './category.h'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Sync() {
  const startTransition = React.useTransition()[1]
  const [isAppSyncing, setIsAppSyncing] = useAtom(isAppSyncingAtom)

  const activities = useActivityStore((s) => s.activities)
  const removeActivity = useActivityStore((s) => s.removeActivity)
  const setActivitySynced = useActivityStore((s) => s.setActivitySynced)

  const getCategory = useCategoryStore((s) => s.getCategory)

  React.useEffect(() => {
    if (isAppSyncing) return
    if (activities.length === 0) return
    setIsAppSyncing(true)
    startTransition(async () => {
      try {
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
      } catch (error) {
        await sleep(5000)
        console.log(error)
      } finally {
        setIsAppSyncing(false)
      }
    })
  }, [
    activities,
    getCategory,
    removeActivity,
    setActivitySynced,
    isAppSyncing,
    setIsAppSyncing,
    startTransition,
  ])

  return null
}
