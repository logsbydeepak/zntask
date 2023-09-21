'use client'

import React from 'react'

export function useMediaQuery() {
  const [isSmallScreen, setIsSmallScreen] = React.useState(false)

  React.useEffect(() => {
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
