'use client'

import React from 'react'
import { useSetAtom } from 'jotai'

import { useActivityStore } from '@/store/activity'
import { isAppSyncingAtom } from '@/store/app'
import { useCategoryStore } from '@/store/category'
import { useTaskStore } from '@/store/task'

import { addCategory, deleteCategory, editCategory } from './category.h'
import {
  createChildTask,
  createParentTask,
  deleteChildTask,
  deleteParentTask,
  editChildTask,
  editParentTask,
} from './task.h'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function Sync() {
  const [isPending, startTransition] = React.useTransition()
  const setIsAppSyncing = useSetAtom(isAppSyncingAtom)

  const activities = useActivityStore((s) => s.activities)
  const removeActivity = useActivityStore((s) => s.removeActivity)
  const setActivitySyncing = useActivityStore((s) => s.setActivitySyncing)

  const getCategory = useCategoryStore((s) => s.getCategory)
  const getParentTask = useTaskStore((s) => s.getParentTask)
  const getChildTask = useTaskStore((s) => s.getChildTask)

  React.useEffect(() => {
    setIsAppSyncing(isPending)
  }, [isPending, setIsAppSyncing])

  React.useEffect(() => {
    if (isPending) return
    if (activities.length === 0) return

    const activity = activities[0]
    startTransition(async () => {
      try {
        if (activity.type === 'category') {
          switch (activity.action) {
            case 'CREATE': {
              const category = getCategory(activity.categoryId)
              if (!category) {
                removeActivity(activity.id)
                return
              }

              setActivitySyncing(activity.id, true)
              await addCategory(category)
              removeActivity(activity.id)
              break
            }

            case 'DELETE': {
              setActivitySyncing(activity.id, true)
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

              setActivitySyncing(activity.id, true)
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

            setActivitySyncing(activity.id, true)
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

            setActivitySyncing(activity.id, true)
            await editParentTask(parentTask)
            removeActivity(activity.id)
            return
          }

          if (action === 'DELETE') {
            setActivitySyncing(activity.id, true)
            await deleteParentTask({ id: activity.taskId })
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

            setActivitySyncing(activity.id, true)
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

            setActivitySyncing(activity.id, true)
            await editChildTask(childTask)
            removeActivity(activity.id)
            return
          }

          if (action === 'DELETE') {
            setActivitySyncing(activity.id, true)
            await deleteChildTask({ id: activity.taskId })
            removeActivity(activity.id)
            return
          }
        }
        return
      } catch (error) {
        console.log({ error })
        await sleep(5000)
        setActivitySyncing(activity.id, false)
      }
    })
  }, [
    activities,
    getCategory,
    getChildTask,
    getParentTask,
    removeActivity,
    setActivitySyncing,
    isPending,
  ])

  return null
}
