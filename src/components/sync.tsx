"use client"

import React from "react"

import { useAppStore } from "#/store/app"

export function Sync() {
  const setAppSyncing = useAppStore((s) => s.setAppSyncing)
  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    if (isPending) {
      setAppSyncing(isPending)
    }
  }, [isPending, setAppSyncing])

  return null
}
