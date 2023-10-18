'use client'

import React from 'react'
import { useAtom, useSetAtom } from 'jotai'

import { useActivityStore } from '@/store/activity'
import { isAppSyncingAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { useTaskStore } from '@/store/task'

import { Action } from '../(auth)/add-password/form'
import { addCategory, deleteCategory, editCategory } from './category.h'
import {
  createChildTask,
  createParentTask,
  editChildTask,
  editParentTask,
} from './task.h'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Sync() {
  const startTransition = React.useTransition()[1]
  const [isAppSyncing, setIsAppSyncing] = useAtom(isAppSyncingAtom)

  const activities = useActivityStore((s) => s.activities)
  const removeActivity = useActivityStore((s) => s.removeActivity)
  const setActivitySynced = useActivityStore((s) => s.setActivitySynced)

  const getCategory = useCategoryStore((s) => s.getCategory)
  const getParentTask = useTaskStore((s) => s.getParentTask)
  const getChildTask = useTaskStore((s) => s.getChildTask)

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

        if (activity.type === 'parentTask') {
          const action = activity.action
          const id = activity.taskId

          if (action === 'CREATE') {
            const parentTask = getParentTask(id)
            if (!parentTask) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await createParentTask(parentTask)
            removeActivity(activity.id)
            return
          }

          if (action === 'EDIT') {
            const parentTask = getParentTask(id)
            if (!parentTask) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await editParentTask(parentTask)
            removeActivity(activity.id)
            return
          }
        }

        if (activity.type === 'childTask') {
          const action = activity.action
          const id = activity.taskId

          if (action === 'CREATE') {
            const childTask = getChildTask(id)
            if (!childTask) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await createChildTask(childTask)
            removeActivity(activity.id)
            return
          }

          if (action === 'EDIT') {
            const childTask = getChildTask(id)
            if (!childTask) {
              removeActivity(activity.id)
              return
            }

            setActivitySynced(activity.id)
            await editChildTask(childTask)
            removeActivity(activity.id)
            return
          }
        }
        return
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
    getChildTask,
    getParentTask,
    removeActivity,
    setActivitySynced,
    isAppSyncing,
    setIsAppSyncing,
    startTransition,
  ])

  return null
}
