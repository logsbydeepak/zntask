'use client'

import React from 'react'

export function IsReady({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    setIsReady(true)
  }, [])

  if (!isReady) return null

  return children
}
