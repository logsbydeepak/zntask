'use client'

import React from 'react'

export function useMediaQuery() {
  const [isSmallScreen, setIsSmallScreen] = React.useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

  React.useLayoutEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setIsSmallScreen(false)
        return
      }
      setIsSmallScreen(true)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsSmallScreen])

  return { isSmallScreen }
}
