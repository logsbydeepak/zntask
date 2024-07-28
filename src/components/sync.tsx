"use client"

import React from "react"
import to from "await-to-js"

import {
  createCategory,
  editCategory,
  deleteCategory as syncDeleteCategory,
} from "#/data/category"
import { getAppState, useAppStore } from "#/store/app"

export function Sync() {
  const [isPending, startTransition] = React.useTransition()
  const appState = getAppState()

  const setAppSyncing = useAppStore((s) => s.setAppSyncing)
  const sync = useAppStore((s) => s.sync)
  const removeSync = useAppStore((s) => s.removeSync)
  const deleteCategory = useAppStore((s) => s.deleteCategory)

  React.useEffect(() => {
    setAppSyncing(isPending)
  }, [isPending, setAppSyncing])

  React.useEffect(() => {
    startTransition(async () => {
      if (sync.length === 0) return
      const current = sync[0]
      try {
        if (current.type === "category") {
          if (current.action === "create") {
            const id = current.syncId
            const state = appState()
            const category = state.categories.find((each) => each.id == id)
            if (!category) return
            const [error, data] = await to(createCategory(category))

            if (error) {
              deleteCategory(category)
              removeSync(current.id)
            }
          }

          if (current.action === "edit") {
            const id = current.syncId
            const state = appState()
            const category = state.categories.find((each) => each.id == id)
            if (!category) return

            const [error, data] = await to(editCategory(category))

            if (error) {
              deleteCategory(category)
              removeSync(current.id)
            }
          }

          if (current.action === "delete") {
            const id = current.syncId
            const state = appState()
            const category = state.categories.find((each) => each.id == id)

            const [error, data] = await to(
              syncDeleteCategory({ id: current.syncId })
            )

            if (error && category) {
              deleteCategory(category)
              removeSync(current.id)
            }
          }

          return
        }
      } catch (error) {
        removeSync(current.id)
      }
    })
  }, [sync, appState, removeSync, deleteCategory])

  return null
}
